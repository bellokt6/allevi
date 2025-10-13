import React from "react";
import Link from "next/link";
import { Heart, Shield, Lock, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-bold">Elivra</h3>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              Supporting Gaza and Palestine refugees through trusted, transparent donations.
              Every contribution makes a direct impact on families in need.
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:support@elivra.life" className="hover:text-blue-400 transition-colors">
                  support@elivra.life
                </a>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Verified & Secure</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              <Link href="/donationform" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Make a Donation
              </Link>
              <Link href="/contact" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Contact Us
              </Link>
              <Link href="/privacy" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal & Support</h4>
            <div className="space-y-3">
              <Link href="/refund" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Refund Policy
              </Link>
              <Link href="/disclaimer" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Developer Disclaimer
              </Link>
              <Link href="/cookies" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/shipping" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2 text-slate-400">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-sm">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Verified Organization</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-sm">100% Transparent</span>
              </div>
            </div>

            <div className="text-sm text-slate-400">
              <p>© {new Date().getFullYear()} Elivra. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="bg-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            This website was developed and is technically maintained by an independent contractor,
            who has no ownership interest and is not responsible for donations, transactions,
            or operational decisions. All donations are processed securely and transparently.
          </p>
        </div>
      </div>
    </footer>
  );
}
