"use client";

import { useEffect, useState } from "react";
import { db, collection, addDoc, Timestamp } from "@/firebaseConfig"; // Ensure Timestamp is imported from Firebase
import Link from "next/link";

// Adjusted type to reflect timestamp format
interface DonationData {
  name: string;
  amount: number;
  message?: string;
  createdAt: number; // timestamp
}

export default function SuccessPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donationData, setDonationData] = useState<DonationData | null>(null);

  useEffect(() => {
    const savedDonationData = localStorage.getItem("donationData");
    if (savedDonationData) {
      const parsedData: DonationData = JSON.parse(savedDonationData);
      setDonationData(parsedData);
    } else {
      setError("No donation data found.");
    }
  }, []);

  useEffect(() => {
    if (donationData) {
      const saveToFirebase = async () => {
        try {
          setIsSaving(true);
          // Use Firebase Timestamp for createdAt
          await addDoc(collection(db, "donations"), {
            name: donationData.name,
            amount: donationData.amount,
            message: donationData.message || "",
            createdAt: Timestamp.fromMillis(donationData.createdAt), // Convert to Firebase Timestamp
          });
          localStorage.removeItem("donationData");
        } catch (error) {
          console.error("Error saving donation:", error);
          setError("Failed to save donation data.");
        } finally {
          setIsSaving(false);
        }
      };

      saveToFirebase();
    }
  }, [donationData]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Thank You!</h1>
          <p className="text-xl text-slate-600">
            Your donation has been successfully processed
          </p>
          <p className="text-slate-600 max-w-lg mx-auto">
            Your generous contribution will directly support families in Gaza.
            We deeply appreciate your compassion and humanity.
          </p>
        </div>

        {/* Donation Details */}
        {donationData && (
          <div className="professional-card mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Donation Summary</h3>
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Donor Name:</span>
                <span className="font-semibold text-slate-900">{donationData.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Amount:</span>
                <span className="font-bold text-orange-600 text-lg">${donationData.amount}</span>
              </div>
              {donationData.message && (
                <div className="py-2">
                  <span className="text-slate-600 block mb-2">Message:</span>
                  <p className="text-slate-700 italic bg-slate-50 p-3 rounded-lg">
                    &ldquo;{donationData.message}&rdquo;
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Date:</span>
                <span className="text-slate-700">{new Date(donationData.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {isSaving && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-orange-700">Saving your donation...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Impact Message */}
        <div className="bg-gradient-to-r from-orange-50 to-indigo-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Your Impact</h3>
          <p className="text-slate-600">
            Your donation will help provide essential supplies, food, and medical aid
            to families in Nuseirat Camp, Gaza. Every contribution makes a difference.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="professional-button px-8 py-3"
          >
            Return to Home
          </Link>
          <Link
            href="/donationform"
            className="border border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
          >
            Make Another Donation
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure Transaction</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>100% Transparent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
