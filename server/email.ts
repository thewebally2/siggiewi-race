export function getFormspreeFormId(): string | null {
  if (!process.env.FORMSPREE_FORM_ID) {
    console.warn('[Formspree] FORMSPREE_FORM_ID not configured');
    return null;
  }
  return process.env.FORMSPREE_FORM_ID;
}

export async function sendRegistrationEmail(params: {
  fullName: string;
  email: string;
  phone?: string;
  categoryName: string;
  editionTitle: string;
  registrationId: number;
  paymentStatus: string;
}): Promise<boolean> {
  const formId = getFormspreeFormId();

  if (!formId) {
    console.warn('[Formspree] Email notification skipped - not configured');
    return false;
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: `New Race Registration: ${params.fullName}`,
        message: `
New race registration received!

Registration Details:
- Name: ${params.fullName}
- Email: ${params.email}
- Phone: ${params.phone || 'Not provided'}
- Race: ${params.editionTitle}
- Category: ${params.categoryName}
- Registration ID: ${params.registrationId}
- Payment Status: ${params.paymentStatus}

View all registrations in the admin panel.
        `.trim(),
        _replyto: params.email,
        name: params.fullName,
        email: params.email,
        phone: params.phone || '',
        category: params.categoryName,
        edition: params.editionTitle,
        registrationId: params.registrationId.toString(),
        paymentStatus: params.paymentStatus,
      }),
    });

    if (response.ok) {
      console.log('[Formspree] Registration email sent successfully');
      return true;
    } else {
      const errorText = await response.text();
      console.error('[Formspree] Failed to send email:', errorText);
      return false;
    }
  } catch (error) {
    console.error('[Formspree] Error sending email:', error);
    return false;
  }
}

export async function sendPaymentConfirmationEmail(params: {
  fullName: string;
  email: string;
  categoryName: string;
  editionTitle: string;
  amountPaid: number;
}): Promise<boolean> {
  const formId = getFormspreeFormId();

  if (!formId) {
    console.warn('[Formspree] Email notification skipped - not configured');
    return false;
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: `Payment Confirmed: ${params.fullName}`,
        message: `
Payment confirmation received!

Payment Details:
- Name: ${params.fullName}
- Email: ${params.email}
- Race: ${params.editionTitle}
- Category: ${params.categoryName}
- Amount Paid: €${(params.amountPaid / 100).toFixed(2)}

The participant will receive their confirmation email shortly.
        `.trim(),
        _replyto: params.email,
        name: params.fullName,
        email: params.email,
        category: params.categoryName,
        edition: params.editionTitle,
        amount: `€${(params.amountPaid / 100).toFixed(2)}`,
      }),
    });

    if (response.ok) {
      console.log('[Formspree] Payment confirmation email sent successfully');
      return true;
    } else {
      const errorText = await response.text();
      console.error('[Formspree] Failed to send email:', errorText);
      return false;
    }
  } catch (error) {
    console.error('[Formspree] Error sending email:', error);
    return false;
  }
}

