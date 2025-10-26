// context/AuthProvider.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import Firebase's user-related types
import { auth } from '../firebaseConfig'; // Adjust the path if needed
import AuthContext from './AuthContext'; // Import the AuthContext

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Loading state to avoid flickers

  useEffect(() => {
    // Check for admin login first
    const adminUser = localStorage.getItem("adminUser");
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");

    if (isAdminLoggedIn === "true" && adminUser) {
      try {
        const parsedUser = JSON.parse(adminUser);
        setCurrentUser(parsedUser);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing admin user:", error);
        localStorage.removeItem("adminUser");
        localStorage.removeItem("isAdminLoggedIn");
      }
    }

    // If no admin login, check Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user); // Log user info
      setCurrentUser(user); // Set user directly, as it will be null if not authenticated
      setLoading(false); // Stop loading once auth state is confirmed
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const login = async (user: any) => {
    setCurrentUser(user);
  };

  const logout = async () => {
    // Clear admin login
    localStorage.removeItem("adminUser");
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userStatus");

    // Clear Firebase auth
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }

    setCurrentUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Render a loader until auth state is confirmed
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
