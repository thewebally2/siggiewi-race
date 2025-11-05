import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Public race information
  races: router({
    getPublishedEditions: publicProcedure.query(async () => {
      return await db.getPublishedRaceEditions();
    }),

    getEditionById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getRaceEditionById(input.id);
      }),

    getCategoriesByEdition: publicProcedure
      .input(z.object({ editionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCategoriesByEdition(input.editionId);
      }),

    getRouteByCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getRouteByCategory(input.categoryId);
      }),

    getResultsByEdition: publicProcedure
      .input(z.object({ editionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getResultsByEdition(input.editionId);
      }),

    getResultsByCategory: publicProcedure
      .input(z.object({ editionId: z.number(), categoryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getResultsByCategory(input.editionId, input.categoryId);
      }),

    getGalleryImages: publicProcedure
      .input(z.object({ editionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getGalleryImagesByEdition(input.editionId);
      }),
  }),

  // Registration
  registration: router({
    create: publicProcedure
      .input(z.object({
        editionId: z.number(),
        categoryId: z.number(),
        firstName: z.string().min(1),
        surname: z.string().min(1),
        fullName: z.string().min(1),
        club: z.string().optional(),
        email: z.string().email(),
        phone: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.enum(["male", "female"]).optional(),
        emergencyContact: z.string().optional(),
        emergencyPhone: z.string().optional(),
        tshirtSize: z.string().optional(),
        medicalConditions: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { dateOfBirth, ...rest } = input;
        const id = await db.createRegistration({
          ...rest,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          paymentStatus: "pending",
          registrationDate: new Date(),
        });

        // Send email notification
        try {
          const { sendRegistrationEmail } = await import('./email');
          const category = await db.getRaceCategoryById(input.categoryId);
          const edition = await db.getRaceEditionById(input.editionId);
          
          if (category && edition) {
            await sendRegistrationEmail({
              fullName: input.fullName,
              email: input.email,
              phone: input.phone,
              categoryName: category.name,
              editionTitle: edition.title,
              registrationId: id,
              paymentStatus: 'pending',
            });
          }
        } catch (error) {
          console.error('Failed to send registration email:', error);
          // Don't fail the registration if email fails
        }

        return { id };
      }),

    createCheckoutSession: publicProcedure
      .input(z.object({
        registrationId: z.number(),
        categoryId: z.number(),
        successUrl: z.string(),
        cancelUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { createCheckoutSession } = await import('./stripe');
        
        // Get category details for pricing
        const category = await db.getRaceCategoryById(input.categoryId);
        if (!category) {
          throw new Error('Category not found');
        }

        if (!category.priceInCents || category.priceInCents === 0) {
          // Free registration, mark as completed
          await db.updateRegistration(input.registrationId, {
            paymentStatus: 'completed',
          });
          return { free: true };
        }

        const session = await createCheckoutSession({
          categoryName: category.name,
          priceInCents: category.priceInCents,
          registrationId: input.registrationId,
          successUrl: input.successUrl,
          cancelUrl: input.cancelUrl,
        });

        if (!session) {
          throw new Error('Failed to create checkout session');
        }

        // Store session ID in registration
        await db.updateRegistration(input.registrationId, {
          stripeSessionId: session.sessionId,
        });

        return { sessionId: session.sessionId, url: session.url };
      }),

    verifyPayment: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ input }) => {
        const { verifyPayment } = await import('./stripe');
        const result = await verifyPayment(input.sessionId);
        
        if (result.paid && result.registrationId) {
          await db.updateRegistration(result.registrationId, {
            paymentStatus: 'completed',
          });

          // Send payment confirmation email
          try {
            const { sendPaymentConfirmationEmail } = await import('./email');
            const registration = await db.getRegistrationById(result.registrationId);
            
            if (registration) {
              const category = await db.getRaceCategoryById(registration.categoryId);
              const edition = await db.getRaceEditionById(registration.editionId);
              
              if (category && edition) {
                await sendPaymentConfirmationEmail({
                  fullName: registration.fullName,
                  email: registration.email,
                  categoryName: category.name,
                  editionTitle: edition.title,
                  amountPaid: registration.amountPaidInCents || 0,
                });
              }
            }
          } catch (error) {
            console.error('Failed to send payment confirmation email:', error);
          }
        }
        
        return result;
      }),
  }),

  // Content pages (CMS)
  content: router({
    getPageBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getContentPageBySlug(input.slug);
      }),
  }),

  // Admin routes
  admin: router({
    // Race Editions Management
    editions: router({
      getAll: adminProcedure.query(async () => {
        return await db.getAllRaceEditions();
      }),

      create: adminProcedure
        .input(z.object({
          year: z.number(),
          title: z.string(),
          date: z.date(),
          description: z.string().optional(),
          location: z.string().optional(),
          status: z.enum(["draft", "published", "completed", "archived"]).default("draft"),
          heroImage: z.string().optional(),
          charityName: z.string().optional(),
          charityDescription: z.string().optional(),
          registrationOpen: z.boolean().default(true),
        }))
        .mutation(async ({ input }) => {
          const id = await db.createRaceEdition(input);
          return { id };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          year: z.number().optional(),
          title: z.string().optional(),
          date: z.date().optional(),
          description: z.string().optional(),
          location: z.string().optional(),
          status: z.enum(["draft", "published", "completed", "archived"]).optional(),
          heroImage: z.string().optional(),
          charityName: z.string().optional(),
          charityDescription: z.string().optional(),
          registrationOpen: z.boolean().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...updates } = input;
          await db.updateRaceEdition(id, updates);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteRaceEdition(input.id);
          return { success: true };
        }),
    }),

    // Categories Management
    categories: router({
      getByEdition: adminProcedure
        .input(z.object({ editionId: z.number() }))
        .query(async ({ input }) => {
          return await db.getCategoriesByEdition(input.editionId);
        }),

      create: adminProcedure
        .input(z.object({
          editionId: z.number(),
          name: z.string(),
          distance: z.string(),
          description: z.string().optional(),
          priceInCents: z.number().default(0),
          ageGroup: z.string().optional(),
          maxParticipants: z.number().optional(),
          startTime: z.string().optional(),
          sortOrder: z.number().default(0),
        }))
        .mutation(async ({ input }) => {
          const id = await db.createRaceCategory(input);
          return { id };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          distance: z.string().optional(),
          description: z.string().optional(),
          priceInCents: z.number().optional(),
          ageGroup: z.string().optional(),
          maxParticipants: z.number().optional(),
          startTime: z.string().optional(),
          sortOrder: z.number().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...updates } = input;
          await db.updateRaceCategory(id, updates);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteRaceCategory(input.id);
          return { success: true };
        }),
    }),

    // Routes Management
    routes: router({
      createOrUpdate: adminProcedure
        .input(z.object({
          id: z.number().optional(),
          categoryId: z.number(),
          name: z.string(),
          distance: z.string().optional(),
          gpxFileUrl: z.string().optional(),
          mapImageUrl: z.string().optional(),
          elevationGain: z.number().optional(),
          description: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          if (id) {
            await db.updateRaceRoute(id, data);
            return { id };
          } else {
            const newId = await db.createRaceRoute(data);
            return { id: newId };
          }
        }),
    }),

    // Registrations Management
    registrations: router({
      getByEdition: adminProcedure
        .input(z.object({ editionId: z.number() }))
        .query(async ({ input }) => {
          return await db.getRegistrationsByEdition(input.editionId);
        }),

      getStats: adminProcedure
        .input(z.object({ editionId: z.number() }))
        .query(async ({ input }) => {
          return await db.getRegistrationStats(input.editionId);
        }),

      updateBibNumber: adminProcedure
        .input(z.object({
          registrationId: z.number(),
          bibNumber: z.number(),
        }))
        .mutation(async ({ input }) => {
          await db.updateRegistration(input.registrationId, {
            bibNumber: input.bibNumber,
          });
          return { success: true };
        }),
    }),

    // Results Management
    results: router({
      create: adminProcedure
        .input(z.object({
          editionId: z.number(),
          categoryId: z.number(),
          registrationId: z.number().optional(),
          participantName: z.string(),
          bibNumber: z.number().optional(),
          finishTime: z.string().optional(),
          position: z.number().optional(),
          gender: z.enum(["male", "female", "other"]).optional(),
          ageCategory: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const id = await db.createRaceResult(input);
          return { id };
        }),

      bulkCreate: adminProcedure
        .input(z.object({
          results: z.array(z.object({
            editionId: z.number(),
            categoryId: z.number(),
            participantName: z.string(),
            bibNumber: z.number().optional(),
            finishTime: z.string().optional(),
            position: z.number().optional(),
            gender: z.enum(["male", "female", "other"]).optional(),
            ageCategory: z.string().optional(),
          })),
        }))
        .mutation(async ({ input }) => {
          const ids = await Promise.all(
            input.results.map(result => db.createRaceResult(result))
          );
          return { ids };
        }),

      uploadResults: adminProcedure
        .input(z.object({
          results: z.array(z.object({
            editionId: z.number(),
            categoryId: z.number(),
            participantName: z.string(),
            bibNumber: z.number().optional(),
            finishTime: z.string().optional(),
            position: z.number().optional(),
            gender: z.enum(["male", "female", "other"]).optional(),
            ageCategory: z.string().optional(),
          })),
        }))
        .mutation(async ({ input }) => {
          const ids = await Promise.all(
            input.results.map(result => db.createRaceResult(result))
          );
          return { success: true, count: ids.length };
        }),

      deleteResult: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteRaceResult(input.id);
          return { success: true };
        }),
    }),

    // Content Pages Management
    content: router({
      getAll: adminProcedure.query(async () => {
        return await db.getAllContentPages();
      }),

      create: adminProcedure
        .input(z.object({
          slug: z.string(),
          title: z.string(),
          content: z.string().optional(),
          status: z.enum(["draft", "published"]).default("draft"),
        }))
        .mutation(async ({ input }) => {
          const id = await db.createContentPage(input);
          return { id };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          slug: z.string().optional(),
          title: z.string().optional(),
          content: z.string().optional(),
          status: z.enum(["draft", "published"]).optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...updates } = input;
          await db.updateContentPage(id, updates);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteContentPage(input.id);
          return { success: true };
        }),
    }),

    // Gallery Management
    gallery: router({
      addImage: adminProcedure
        .input(z.object({
          editionId: z.number(),
          imageUrl: z.string(),
          caption: z.string().optional(),
          sortOrder: z.number().default(0),
        }))
        .mutation(async ({ input }) => {
          const id = await db.createGalleryImage(input);
          return { id };
        }),

      deleteImage: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteGalleryImage(input.id);
          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;

