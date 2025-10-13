"use client";

import Link from "next/link";
import { Shield, Heart, Lock } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              prefetch={true}
              className="text-2xl font-bold text-slate-800 transition duration-300 hover:text-blue-600 flex items-center space-x-2"
            >
              <Heart className="w-6 h-6 text-blue-600" />
              <span>givev</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="security-indicator">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-xs">Secure</span>
            </div>
            <div className="security-indicator">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-xs">Verified</span>
            </div>
          </div>

          {/* Donation Button */}
          <div className="flex items-center">
            <Link
              href="/donationform"
              prefetch={true}
              className="professional-button flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Donate Now</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
