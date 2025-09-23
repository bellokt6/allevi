import React from "react";

// /app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        aidley respects your privacy. This policy explains how we collect, use,
        and protect the information you provide.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
      <p className="mb-4">
        We collect personal information such as name, email address, and payment
        details when you make a donation.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
      <p className="mb-4">
        Information is used to process donations via Stripe, send donation
        receipts, and communicate updates about our work.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Sharing Information</h2>
      <p className="mb-4">
        We only share necessary information with our payment processor, Stripe.
        We never sell or rent your information.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Security</h2>
      <p className="mb-4">
        We implement strong security measures to protect your personal
        information. However, no method of transmission or storage is
        completely secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
      <p className="mb-4">
        You can request access, correction, or deletion of your information at
        any time by emailing <a href="mailto:support@aidley.org" className="underline">support@aidley.org</a>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Developer & Maintenance Disclaimer</h2>
      <p className="mb-4">
        This website was built and is maintained by an independent contractor
        solely to provide technical services. The developer has no ownership
        interest and does not control, manage, or endorse any business
        operations, financial transactions, or user interactions conducted
        through this site. By using this website, you acknowledge that the
        developer is not responsible or liable for any data practices, losses,
        damages, or legal consequences arising from the website owner’s
        activities or third-party actions.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
      <p className="mb-4">
        Questions about this Privacy Policy? Contact us at{" "}
        <a href="mailto:support@aidley.live" className="underline">support@aidley.live</a>.
      </p>
    </main>
  );
}
