import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const RACE_DATE = new Date('2025-12-28');

export default function Register() {
  const [_, setLocation] = useLocation();
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [ageError, setAgeError] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    editionId: 1,
    categoryId: 0,
    firstName: "",
    surname: "",
    club: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "" as "male" | "female" | "",
    emergencyContact: "",
    emergencyPhone: "",
    tshirtSize: "",
    medicalConditions: "",
  });

  const { data: editions } = trpc.races.getPublishedEditions.useQuery();
  const currentEdition = editions?.find(e => e.status === "published");
  
  const { data: categories } = trpc.races.getCategoriesByEdition.useQuery(
    { editionId: currentEdition?.id || 0 },
    { enabled: !!currentEdition }
  );

  const createRegistration = trpc.registration.create.useMutation();
  const createCheckoutSession = trpc.registration.createCheckoutSession.useMutation();

  useEffect(() => {
    if (currentEdition) {
      setFormData(prev => ({ ...prev, editionId: currentEdition.id }));
    }
  }, [currentEdition]);

  // Validate age (must be 16+ on race day)
  const validateAge = (dob: string): boolean => {
    if (!dob) {
      setAgeError("");
      return true;
    }

    const birthDate = new Date(dob);
    const age = Math.floor((RACE_DATE.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (age < 16) {
      setAgeError(`You must be at least 16 years old on race day (28th December 2025). You will be ${age} years old.`);
      return false;
    }
    
    setAgeError("");
    return true;
  };

  const handleDateOfBirthChange = (value: string) => {
    setFormData({ ...formData, dateOfBirth: value });
    validateAge(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate age
    if (!validateAge(formData.dateOfBirth)) {
      return;
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      alert("Please accept the terms and conditions to continue.");
      return;
    }
    
    try {
      const fullName = `${formData.firstName} ${formData.surname}`;
      
      // Create registration
      const result = await createRegistration.mutateAsync({
        ...formData,
        firstName: formData.firstName,
        surname: formData.surname,
        fullName: fullName,
        club: formData.club || undefined,
        gender: formData.gender || undefined,
      });
      
      setRegistrationId(result.id);

      // Create Stripe checkout session
      const category = categories?.find(c => c.id === formData.categoryId);
      
      if (!category) {
        throw new Error("Category not found");
      }

      // If free registration, skip payment
      if (!category.priceInCents || category.priceInCents === 0) {
        setStep("success");
        return;
      }

      const session = await createCheckoutSession.mutateAsync({
        registrationId: result.id,
        categoryId: formData.categoryId,
        successUrl: `${window.location.origin}/register?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/register?canceled=true`,
      });

      if ('free' in session && session.free) {
        setStep("success");
      } else if ('url' in session && session.url) {
        // Redirect to Stripe Checkout
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  // Handle return from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const success = params.get("success");

    if (success === "true" && sessionId) {
      setStep("success");
      // Clean up URL
      window.history.replaceState({}, '', '/register');
    }
  }, []);

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 container py-12">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Registration Successful!</CardTitle>
              <CardDescription>
                Thank you for registering. You will receive a confirmation email shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button className="mt-4">Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Race Registration</CardTitle>
            <CardDescription>
              Fill in your details to register for the race
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Race Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Race Category *</Label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: Number(value) })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a race category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name} - {cat.priceInCents ? `€${(cat.priceInCents / 100).toFixed(2)}` : 'FREE'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname">Surname *</Label>
                    <Input
                      id="surname"
                      value={formData.surname}
                      onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="club">Club</Label>
                  <Input
                    id="club"
                    placeholder="Running club or team (optional)"
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleDateOfBirthChange(e.target.value)}
                      required
                    />
                    {ageError && (
                      <div className="flex items-start gap-2 text-sm text-red-600 mt-1">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{ageError}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      You must be at least 16 years old on 28th December 2025
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value: "male" | "female") => setFormData({ ...formData, gender: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tshirtSize">T-Shirt Size</Label>
                  <Select
                    value={formData.tshirtSize}
                    onValueChange={(value) => setFormData({ ...formData, tshirtSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XS">XS</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                      <SelectItem value="XXL">XXL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold">Emergency Contact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions (Optional)</Label>
                <Input
                  id="medicalConditions"
                  placeholder="Any medical conditions we should know about"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 border-t pt-4">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  required
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{" "}
                    <Link href="/terms-and-conditions">
                      <span className="text-orange-600 hover:text-orange-700 underline cursor-pointer">
                        terms and conditions
                      </span>
                    </Link>{" "}
                    *
                  </label>
                  <p className="text-xs text-gray-500">
                    You must accept the terms and conditions to register
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={createRegistration.isPending || createCheckoutSession.isPending || !!ageError || !termsAccepted}
              >
                {(createRegistration.isPending || createCheckoutSession.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

