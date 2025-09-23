import React from "react";

// /app/terms/page.tsx
export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        Welcome to elivra. By using our platform to support humanitarian aid for
        Gaza and Palestine refugees, you agree to these Terms of Service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Purpose</h2>
      <p className="mb-4">
        elivra exists to facilitate donations that directly support displaced
        and affected communities in Gaza and Palestine.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Donations</h2>
      <p className="mb-4">
        Donations made through elivra are processed securely via Stripe and are
        non-refundable except under specific circumstances outlined in our
        Refund Policy.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Conduct</h2>
      <p className="mb-4">
        Users agree not to misuse the platform or engage in fraudulent activity.
        All activities must comply with applicable laws and regulations.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
      <p className="mb-4">
        All content on elivra is the property of elivra unless otherwise stated.
        Unauthorized use is prohibited.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes</h2>
      <p className="mb-4">
        We reserve the right to update these Terms at any time. Continued use
        after changes constitutes acceptance.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Developer & Maintenance Disclaimer</h2>
      <p className="mb-4">
        This website was developed and is maintained by an independent
        contractor solely to provide technical services. The developer has no
        ownership interest and does not control, manage, supervise, or endorse
        any business operations, donation processing, or user activities
        conducted through this site. By using this website, you acknowledge that
        the developer is not responsible or liable for any donations, user
        actions, operational decisions, or legal consequences arising from the
        website owner’s activities or third-party actions. The provision of
        technical services does not create any fiduciary, agency, or partnership
        relationship beyond the contracted scope of work.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
      <p className="mb-4">
        Questions? Email us at{" "}
        <a href="mailto:support@elivra.live" className="underline">support@elivra.live</a>.
      </p>
    </main>
  );
}
