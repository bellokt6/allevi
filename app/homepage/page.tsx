"use client";
import Link from "next/link";
import Image from "next/image";
import DonationProgress from "@/components/Home/DonationProgress";
import { MapPinIcon, ShieldCheckIcon, LockClosedIcon, HeartIcon } from '@heroicons/react/24/outline';

const DonationHome: React.FC = () => {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left - Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 lg:px-16 space-y-8">
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="trust-badge">
              <ShieldCheckIcon className="w-3 h-3 mr-1" />
              Verified Organization
            </span>
            <span className="trust-badge">
              <LockClosedIcon className="w-3 h-3 mr-1" />
              Secure Donations
            </span>
            <span className="trust-badge">
              <HeartIcon className="w-3 h-3 mr-1" />
              100% Transparent
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Emergency Relief for
              <span className="text-blue-600 block">Gaza Families</span>
            </h1>

            <div className="flex items-center space-x-4 text-slate-600">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Nuseirat Camp, Gaza</h2>
                <p className="text-sm">Direct aid to displaced families</p>
              </div>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Your donations provide immediate relief to families in Nuseirat Camp, Gaza.
              We work directly with trusted local partners to deliver food, medicine,
              and essential supplies to those who need it most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/donationform">
                <button className="professional-button text-lg px-8 py-4 flex items-center space-x-2">
                  <HeartIcon className="w-5 h-5" />
                  <span>Donate Now</span>
                </button>
              </Link>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-6 rounded-lg transition-all duration-200">
                Learn More
              </button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <LockClosedIcon className="w-4 h-4 text-green-600" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                <span>Verified Partner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Image */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative">
          <Image
            src="/images/ycl.jpg"
            alt="Families in need of support"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

          {/* Overlay Content */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Your Impact</h3>
              <p className="text-sm opacity-90">
                Every donation directly supports families facing unimaginable hardship
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Progress Section */}
      <DonationProgress />
    </div>
  );
};

export default DonationHome;
