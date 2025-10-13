"use client";

import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "@/firebaseConfig";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Donor {
  name: string;
  message: string;
  amount: number;
  createdAt: Date;
}

const GOAL = 100000;
const DONORS_PER_PAGE = 5;

const DonationProgress: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setTimeUpdateTick] = useState(0);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "donations"));
        const donorList: Donor[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          let createdAt: Date;

          if (data.createdAt && data.createdAt.toDate) {
            createdAt = data.createdAt.toDate();
          } else if (typeof data.createdAt === "number") {
            createdAt = new Date(data.createdAt);
          } else {
            createdAt = new Date();
          }

          return {
            name: data.name,
            message: data.message || "",
            amount: data.amount,
            createdAt,
          };
        });

        donorList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setDonors(donorList);
      } catch (err) {
        console.error("Failed to fetch donors:", err);
        setError("Failed to load donor data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();

    const interval = setInterval(() => {
      setTimeUpdateTick(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const totalRaised = donors.reduce((sum, donor) => sum + donor.amount, 0);
  const percentage = Math.min((totalRaised / GOAL) * 100, 100);
  const totalDonations = donors.length;
  const totalComments = donors.filter(donor => donor.message?.trim() !== "").length;

  const indexOfLastDonor = currentPage * DONORS_PER_PAGE;
  const indexOfFirstDonor = indexOfLastDonor - DONORS_PER_PAGE;
  const currentDonors = donors.slice(indexOfFirstDonor, indexOfLastDonor);
  const totalPages = Math.ceil(donors.length / DONORS_PER_PAGE);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) {
    return <div className="text-center py-10">Loading donations...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Progress Section */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Campaign Progress</h2>
            <p className="text-lg text-slate-600">Help us reach our goal to support families in Gaza</p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-700 h-full text-white text-sm font-semibold flex items-center justify-center transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              >
                {Math.floor(percentage)}%
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-900">${totalRaised.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Raised</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">${GOAL.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Goal</p>
              </div>
            </div>
          </div>

          {/* Metrics Cards - Subtle Design */}
          <div className="flex justify-center items-center space-x-8 text-slate-600">
            <div className="text-center">
              <p className="text-lg font-medium text-slate-700">{totalDonations}</p>
              <p className="text-xs text-slate-500">Donations</p>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className="text-center">
              <p className="text-lg font-medium text-slate-700">{totalComments}</p>
              <p className="text-xs text-slate-500">Messages</p>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className="text-center">
              <p className="text-lg font-medium text-slate-700">100%</p>
              <p className="text-xs text-slate-500">Transparent</p>
            </div>
          </div>
        </div>

        {/* Recent Donors Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Recent Donors</h3>
            <p className="text-slate-600">Thank you to our generous supporters</p>
          </div>

          {donors.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-50 rounded-lg p-8 max-w-md mx-auto">
                <p className="text-slate-600 mb-4">No donations yet. Be the first to make a difference!</p>
                <Link href="/donationform" className="professional-button">
                  Make First Donation
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {currentDonors.map((donor, index) => (
                  <div key={index} className="professional-card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {donor.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{donor.name}</p>
                            <p className="text-sm text-slate-500">
                              {formatDistanceToNow(donor.createdAt, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        {donor.message && (
                          <p className="text-slate-700 italic mt-2">&ldquo;{donor.message}&rdquo;</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">${donor.amount}</p>
                        <p className="text-xs text-slate-500">donated</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DonationProgress;
