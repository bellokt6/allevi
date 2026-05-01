import React from "react";

export const metadata = {
  title: "Developer & Maintenance Disclaimer",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Developer &amp; Maintenance Disclaimer
        </h1>

        <p className="mb-4">
          The developer of this website has been engaged <strong>solely as an independent technical contractor</strong> to provide design, development, and technical framework services. The developer <strong>has no ownership interest</strong>, no operational control, and <strong>absolutely no knowledge or oversight</strong> regarding the day-to-day use, content management, or business logic applied by the website owner.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">Zero-Knowledge & Operational Autonomy</h2>
        <p className="mb-4">
          The developer <strong>does not monitor, review, or authorize</strong> any content, transactions, or activities conducted through this platform. The delivery of technical services constitutes a one-time or recurring technical implementation and does not imply an ongoing relationship with the operational intent of the site. The developer is <strong>strictly a service provider</strong> and is not an officer, partner, or agent of the website's operating entity.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">Financial & Transactional Non-Affiliation</h2>
        <p className="mb-4">
          The developer is <strong>not a party to any financial transactions</strong>, donations, or payment processing occurring on this site. All funds, data, and recipient information are managed exclusively by the website owner. The developer has <strong>no access to, control over, or benefit from</strong> any funds processed through the platform and disclaims all liability for financial mismanagement or fraudulent activities.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">Liability Exclusion for Unlawful Use</h2>
        <p className="mb-4">
          Under no circumstances shall the developer be liable for any <strong>direct, indirect, or criminal activity</strong> arising from the misuse of this platform. This includes, but is not limited to:
        </p>

        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Fraudulent solicitations or deceptive practices by the client/owner.</li>
          <li>Regulatory or legal violations of any jurisdiction.</li>
          <li>Misappropriation of funds or data by third parties or the operating entity.</li>
          <li>Any unlawful, unethical, or unauthorized use of the technical infrastructure.</li>
        </ul>

        <p className="mt-8 p-4 bg-red-50 border-l-4 border-red-500 text-sm font-medium">
          By using this site, users acknowledge that the technical developer is a neutral party providing infrastructure only and agree to release and hold the developer harmless from all claims related to the site's operations or any potential fraudulent activity.
        </p>
      </div>
    </main>
  );
}
