"use client";

import React, { useState, useEffect } from "react";
import { db, doc, getDoc } from "@/firebaseConfig";

const DonationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
      databaseLocked: false,
      databaseLockMessage: "The platform is currently down for maintenance.",
      stripeLink: "https://buy.stripe.com/cNieVf4AxfzEeIEaVF7Re01"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (systemSettings.databaseLocked) {
        alert(systemSettings.databaseLockMessage || "Donations are temporarily out of service.");
        return;
    }

    // Enhanced validation
    if (!name || name.trim() === "") {
      alert("Please enter your name.");
      return;
    }

    if (!amount || Number(amount) <= 0 || isNaN(Number(amount))) {
      alert("Please enter a valid donation amount greater than $0.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save donation data to localStorage
      localStorage.setItem(
        "donationData",
        JSON.stringify({
          name: name.trim(),
          amount: Number(amount),
          message: message.trim(),
          createdAt: Date.now(), // store as timestamp
        })
      );

      // Redirect to Stripe payment
      window.location.href = systemSettings.stripeLink || "https://buy.stripe.com/cNieVf4AxfzEeIEaVF7Re01";
    } catch (error) {
      console.error("Failed to save donation:", error);
      alert("Something went wrong while saving your donation. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Make a Donation</h1>
          <p className="text-lg text-slate-600">Your contribution directly supports families in Gaza</p>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <span className="trust-badge">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure Payment
          </span>
          <span className="trust-badge">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified Organization
          </span>
          <span className="trust-badge">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            100% Transparent
          </span>
        </div>

        {/* Donation Form */}
        <div className="professional-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name *
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                  Donation Amount (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                  <input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    className="w-full p-4 pl-8 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <p className="text-sm text-slate-500 mt-1">Minimum donation: $1.00</p>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message of Support (Optional)
                </label>
                <textarea
                  id="message"
                  placeholder="Share a message of hope and support..."
                  className="w-full p-4 border border-slate-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-orange-900">Secure & Protected</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Your donation is processed securely through Stripe. All transactions are encrypted and protected.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !amount || Number(amount) <= 0}
              className="w-full professional-button text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  <span>Donate Now</span>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Additional Trust Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            100% of your donation goes directly to families in need. No administrative fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
