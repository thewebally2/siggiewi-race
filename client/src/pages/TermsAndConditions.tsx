import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Registration</h2>
              <p>
                By registering for the Is-Siggiewi End of Year Race, you agree to these terms and conditions. 
                Registration is only confirmed upon successful payment (where applicable) and receipt of confirmation email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Age Requirements</h2>
              <p>
                Participants must be at least 16 years old on race day (28th December 2025) to register for the 5KM Adult Race. 
                The 1.5KM Kids Race is open to children aged 8-15 years. The 500M Family Fun Run is open to all ages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Health and Fitness</h2>
              <p>
                Participants must be in good health and physically fit to complete the race distance they have registered for. 
                It is the participant's responsibility to ensure they are medically fit to participate. We recommend consulting 
                with a healthcare professional before participating if you have any health concerns.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Race Day Conduct</h2>
              <p>
                All participants must follow the instructions of race officials and marshals at all times. Unsporting behavior, 
                including but not limited to cheating, abusive language, or dangerous conduct, may result in disqualification 
                without refund.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Liability Waiver</h2>
              <p>
                Participants acknowledge that running in a race involves inherent risks. By registering, you agree to participate 
                at your own risk and release the organizers, sponsors, volunteers, and the Local Council of Is-Siggiewi from any 
                liability for injury, loss, or damage that may occur during the event.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Medical Emergency</h2>
              <p>
                In case of medical emergency, race officials are authorized to arrange for medical treatment on your behalf. 
                Emergency contact information provided during registration will be used if necessary.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Cancellation and Refunds</h2>
              <p>
                Registration fees are non-refundable except in the event of race cancellation by the organizers. 
                If the race is cancelled, participants will be offered the option of a full refund or transfer to the following year's event.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Race Changes</h2>
              <p>
                The organizers reserve the right to modify the race route, start time, or other race details if necessary due to 
                weather conditions, safety concerns, or other unforeseen circumstances. Participants will be notified of any 
                significant changes via email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Photography and Media</h2>
              <p>
                By participating, you grant permission for the use of photographs, video recordings, and other media taken during 
                the event for promotional purposes by the organizers and sponsors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Timing and Results</h2>
              <p>
                Official race timing will be provided. Results will be published on the race website after the event. 
                Any disputes regarding results must be submitted in writing within 48 hours of the race.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Personal Data</h2>
              <p>
                Personal information collected during registration will be used solely for race administration purposes and 
                will not be shared with third parties without your consent, except as required for race operations 
                (e.g., timing services, emergency services).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Race Numbers and Timing Chips</h2>
              <p>
                Race numbers and timing chips (if applicable) must be worn as instructed. Numbers may not be transferred to 
                another participant. Running without a visible race number may result in disqualification.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Course Rules</h2>
              <p>
                Participants must follow the designated race route at all times. Cutting the course or taking shortcuts will 
                result in disqualification. Headphones are permitted but participants must remain aware of their surroundings 
                and follow marshal instructions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Weather Conditions</h2>
              <p>
                The race will proceed in most weather conditions. In case of extreme weather that poses a safety risk, 
                the organizers reserve the right to delay, modify, or cancel the event. Check the race website and your 
                email for updates on race day.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">15. Charity Donations</h2>
              <p>
                This race is held in aid of Dar tal-Providenza. Registration fees contribute to this charitable cause. 
                Participants are encouraged to make additional donations if they wish.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">16. Acceptance of Terms</h2>
              <p>
                By completing the registration process, you acknowledge that you have read, understood, and agree to be 
                bound by these terms and conditions.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Contact Information:</strong><br />
                Kunsill Lokali Is-Siggiewi<br />
                Città Ferdinanda<br />
                Email: info@siggiewi.com
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Last updated: October 2025
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/register">
              <Button size="lg">
                Back to Registration
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

