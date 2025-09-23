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
          The developer of this website has been engaged{" "}
          <strong>solely as an independent contractor</strong> to provide
          design, development, and technical maintenance services. The developer{" "}
          <strong>has no ownership interest</strong> in the website and does{" "}
          <strong>not control, manage, supervise, or endorse</strong> any
          business operations, content, financial transactions, or user
          interactions conducted through it.
        </p>

        <p className="mb-4">
          The developer <strong>expressly disclaims all warranties</strong>—
          whether express, implied, or statutory—including but not limited to
          warranties of merchantability, fitness for a particular purpose, and
          non-infringement. <strong>No fiduciary, agency, partnership, or
          joint-venture relationship</strong> exists between the developer, the
          website owner, or its users beyond the limited scope of contracted
          technical services.
        </p>

        <p className="mb-4">
          Under no circumstances shall the developer be liable for any{" "}
          <strong>
            direct, indirect, incidental, consequential, special, exemplary, or
            punitive damages
          </strong>{" "}
          arising from or related to:
        </p>

        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>use of or reliance on the website or its content,</li>
          <li>financial transactions or user interactions,</li>
          <li>
            legal disputes, fraudulent activities, or regulatory violations by
            the website owner or third parties,
          </li>
          <li>
            any unlawful, unethical, or unauthorized use of the website.
          </li>
        </ul>

        <p className="mb-4">
          Technical maintenance or updates by the developer are provided{" "}
          <strong>only to preserve functionality, stability, and security</strong>{" "}
          and do not constitute approval, endorsement, or oversight of any
          business, operational, or financial activity of the website or its
          owner.
        </p>

        <p className="mb-4">
          Users are solely responsible for conducting their own{" "}
          <strong>research, verification, and due diligence</strong> before
          engaging with the website or any related services. By accessing or
          using the website, <strong>
            all users agree to release, indemnify, and hold harmless the
            developer
          </strong>{" "}
          from any and all claims, losses, liabilities, damages, or legal
          consequences arising out of or related to the website, whether or not
          such activities are lawful.
        </p>
      </div>
    </main>
  );
}
