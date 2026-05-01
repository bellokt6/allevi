"use client";

import Link from "next/link";
import { Shield, Heart, Lock, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              prefetch={true}
              className="text-2xl font-bold text-slate-800 transition duration-300 hover:text-orange-600 flex items-center space-x-2"
            >
              <Heart className="w-6 h-6 text-orange-600" />
              <span>allevi</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="security-indicator">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-xs">Secure</span>
            </div>
            <div className="security-indicator">
              <Shield className="w-4 h-4 text-orange-600" />
              <span className="text-xs">Verified</span>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {(() => {
                  const userRole = localStorage.getItem("userRole");
                  return (
                    <>
                      {userRole === "superadmin" && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-purple-600 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-orange-600 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  );
                })()}
              </>
            ) : (
              <>
                <Link
                  href="/donationform"
                  prefetch={true}
                  className="professional-button flex items-center space-x-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Donate Now</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
