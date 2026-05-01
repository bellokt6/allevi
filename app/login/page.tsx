"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db, collection, getDocs } from "@/firebaseConfig";

const SUPER_ADMIN_CREDENTIALS = {
    username: process.env.NEXT_PUBLIC_SUPER_ADMIN_USERNAME || "superadmin",
    password: process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD || "",
    email: process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || "superadmin@elivra.com",
    role: "superadmin"
};

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Check super admin credentials first (hardcoded fallback)
            if (username === SUPER_ADMIN_CREDENTIALS.username && password === SUPER_ADMIN_CREDENTIALS.password) {
                const mockUser = {
                    uid: "superadmin-user",
                    email: SUPER_ADMIN_CREDENTIALS.email,
                    displayName: "Super Admin",
                    emailVerified: true,
                    role: "superadmin"
                };

                localStorage.setItem("adminUser", JSON.stringify(mockUser));
                localStorage.setItem("isAdminLoggedIn", "true");
                localStorage.setItem("userRole", "superadmin");

                await login(mockUser);
                router.push("/admin");
                return;
            }

            // For all other users (Admins, Custom Users), check database
            try {
                console.log("Checking database for user:", username);
                const usersSnapshot = await getDocs(collection(db, "users"));
                
                const foundUser = usersSnapshot.docs.find(doc => {
                    const userData = doc.data();
                    const usernameMatch = userData.username === username || userData.email === username;
                    const passwordMatch = userData.password === password;
                    const statusMatch = userData.status === "active" || userData.status === "limited";

                    return usernameMatch && passwordMatch && statusMatch;
                });

                if (foundUser) {
                    const userData = foundUser.data();
                    const mockUser = {
                        uid: userData.id,
                        email: userData.email,
                        displayName: userData.username,
                        emailVerified: true,
                        role: userData.role
                    };

                    localStorage.setItem("adminUser", JSON.stringify(mockUser));
                    localStorage.setItem("isAdminLoggedIn", "true");
                    localStorage.setItem("userRole", userData.role);
                    localStorage.setItem("userStatus", userData.status);

                    await login(mockUser);

                    if (userData.role === "superadmin") {
                        router.push("/admin");
                    } else {
                        router.push("/dashboard");
                    }
                } else {
                    setError("Invalid username or password");
                }
            } catch (dbError) {
                console.error("Database error:", dbError);
                setError("Login failed. Please try again.");
            }
        } catch {
            setError("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-6 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Admin Portal
                        </h2>
                        <p className="text-orange-100 text-sm mt-2">
                            Secure access to donation management
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-slate-900 placeholder-slate-500"
                                            placeholder="Enter your username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-slate-900 placeholder-slate-500"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Sign In
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Help Section */}
                    <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
                        <div className="text-center">
                            <p className="text-sm text-slate-600">
                                Need access? Contact your administrator for login credentials.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
