import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-10 px-6 text-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo and brief text */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900">elivra</h1>
          <p className="text-sm text-gray-500 mt-2">
            Supporting Gaza and Palestine refugees through trusted donations.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Contact us at:{" "}
            <a
              href="mailto:support@elivra.live"
              className="hover:underline text-blue-600"
            >
              support@elivra.live
            </a>
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">

          <Link href="/terms" className="hover:text-black transition">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-black transition">
            Privacy Policy
          </Link>
          <Link href="/refund" className="hover:text-black transition">
            Refund Policy
          </Link>
          <Link href="/disclaimer" className="hover:text-black transition">
            Developer Disclaimer
          </Link>
          <Link href="/shipping" className="hover:text-black transition">
            Shipping Policy
          </Link>
          <Link href="/cookies" className="hover:text-black transition">
            Cookie Policy
          </Link>
          <Link href="/contact" className="hover:text-black transition">
            Contact Us
          </Link>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
        &copy; {new Date().getFullYear()} elivra. All rights reserved.{" "}
        <span className="block md:inline text-gray-200">
          This website was developed and is technically maintained by an
          independent contractor, who has no ownership interest and is not
          responsible for donations, transactions, or operational decisions.
        </span>
      </div>
    </footer>
  );
}
