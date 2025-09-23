import React from "react";

// /app/shipping/page.tsx
export default function ShippingPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

      <p className="mb-4">
        elivra facilitates digital donations and does not ship physical goods.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Acknowledgment Receipts</h2>
      <p className="mb-4">
        Upon successful donation, an email receipt will be sent to the address
        provided during checkout.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Developer & Maintenance Disclaimer</h2>
      <p className="mb-4">
        This website was created and is maintained by an independent contractor
        solely to provide technical services. The developer has no ownership
        interest and does not control, manage, or endorse any business
        operations, donation processing, or communication conducted through
        this site. By using this website, you acknowledge that the developer is
        not responsible or liable for any donations, receipts, delays, or legal
        consequences arising from the website owner’s activities or third-party
        actions.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
      <p className="mb-4">
        Questions? Email us at{" "}
        <a href="mailto:support@elivra.life" className="underline">support@elivra.life</a>.
      </p>
    </main>
  );
}
