"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DonationProgress from "@/components/Home/DonationProgress";
import { db, doc, getDoc } from "@/firebaseConfig";
import { MapPinIcon, ShieldCheckIcon, LockClosedIcon, HeartIcon } from '@heroicons/react/24/outline';

const DonationHome: React.FC = () => {
  const [systemSettings, setSystemSettings] = useState({
      databaseLocked: false,
      databaseLockMessage: "The platform is currently down for maintenance.",
      databaseLockedAt: null as number | null,
      maintenanceMode: false,
      maintenanceMessage: "The site is currently down for scheduled maintenance.",
      stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK || ""
  });

  useEffect(() => {
      const loadSettings = async () => {
          try {
              const settingsDoc = await getDoc(doc(db, "settings", "global"));
              if (settingsDoc.exists()) {
                  setSystemSettings(prev => ({ ...prev, ...settingsDoc.data() }));
              }
          } catch (error) {
              console.error("Failed to load settings:", error);
          }
      };
      
      loadSettings();
  }, []);

  if (systemSettings.maintenanceMode) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
              <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
                  <LockClosedIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Maintenance Mode</h1>
                  <p className="text-slate-600">{systemSettings.maintenanceMessage}</p>
              </div>
          </div>
      );
  }

  if (systemSettings.databaseLocked && systemSettings.databaseLockedAt) {
      const lockDuration = Date.now() - systemSettings.databaseLockedAt;
      const oneDay = 24 * 60 * 60 * 1000;
      if (lockDuration >= oneDay) {
          return (
              <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                  <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
                      <LockClosedIcon className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">Platform Unavailable</h1>
                      <p className="text-slate-600">{systemSettings.databaseLockMessage}</p>
                  </div>
              </div>
          );
      }
  }

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center lg:justify-start overflow-hidden bg-stone-50 pb-20 lg:pb-0">
        {/* Right/Background Image Layer */}
        <div className="absolute inset-0 lg:left-[40%] w-full lg:w-[60%] h-full z-0">
          {/* Gradients for smooth blending into background */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/80 lg:via-stone-50/20 to-transparent z-10 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/60 lg:via-transparent to-transparent z-10" />
          
          <Image
            src="/images/ycl.jpg"
            alt="Families in need of support"
            fill
            className="object-cover object-center lg:object-right"
            priority
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-24 lg:pt-0 lg:px-12 flex flex-col items-start text-left">
          {/* Headline Area */}
          <div className="max-w-2xl relative z-20">
            {/* Urgency Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/80 border border-orange-200 backdrop-blur-md text-sm font-bold text-orange-700 mb-8 shadow-sm hover:bg-orange-50 transition-colors cursor-default">
              <span className="relative flex h-2.5 w-2.5 mr-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600"></span>
              </span>
              Urgent Need
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 tracking-tight leading-[1.05] drop-shadow-sm">
              Emergency Relief for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 block sm:inline mt-2 lg:mt-0">Gaza Families</span>
            </h1>
            
            <p className="mt-6 text-xl sm:text-2xl text-stone-700 font-medium leading-relaxed max-w-xl">
              Every second counts. Your donations provide immediate, direct aid to displaced families in Nuseirat Camp.
            </p>
          </div>

          {/* CTA Glass Card */}
          <div className="mt-12 backdrop-blur-xl bg-white/70 border border-white/60 shadow-2xl shadow-orange-900/5 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative overflow-hidden group">
            {/* Decorative background glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-400/20 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-700" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl hidden sm:block" />
            
            <div className="relative z-10">
               {/* Progress UI */}
              {/* <div className="mb-8 flex flex-col gap-2.5">
                <div className="flex justify-between items-end text-sm font-bold text-stone-600">
                  <span className="text-stone-800">Goal: $500,000</span>
                  <span className="text-orange-600 font-extrabold text-base">75% Raised</span>
                </div>
                <div className="w-full h-3 bg-white/50 backdrop-blur-sm border border-stone-200/50 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-sm" style={{ width: '75%' }}></div>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link href="/donationform" className="w-full sm:w-auto flex-1">
                  <button className="w-full professional-button text-lg px-8 py-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/25 transition-all hover:scale-[1.02]">
                    <HeartIcon className="w-6 h-6 flex-shrink-0" />
                    <span>Help Now</span>
                  </button>
                </Link>
                <Link href="/DonationProgress">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-stone-700 bg-white/80 border border-stone-200 shadow-sm hover:bg-stone-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-200">
                  See Impact
                </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-500 bg-white/40 p-3 rounded-xl border border-white/40">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-orange-500" />
                  <span>Verified Partner</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <LockClosedIcon className="w-4 h-4 text-emerald-600" />
                  <span>256-bit Secure</span>
                </div>
                <div className="hidden sm:flex items-center space-x-1.5 border-l border-stone-300 pl-4">
                  <span className="text-stone-400 font-medium">100% direct impact</span>
                </div>
              </div>
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
