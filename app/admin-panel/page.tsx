"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { db, collection, getDocs, doc, setDoc } from "@/firebaseConfig";
import {
    Users,
    Shield,
    Settings,
    Ban,
    CheckCircle,
    AlertTriangle,
    EyeOff,
    UserPlus,
    UserMinus,
    User
} from "lucide-react";

interface User {
    id: string;
    username: string;
    email: string;
    role: "admin" | "superadmin" | "user";
    status: "active" | "blocked" | "limited";
    lastLogin: Date;
    permissions: {
        canViewDonations: boolean;
        canEditDonations: boolean;
        canDeleteDonations: boolean;
        canAddDonations: boolean;
        canManageUsers: boolean;
        canViewReports: boolean;
    };
}

const AdminPanel: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const { showToast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "user" as "admin" | "user"
    });
    const [isAddingUser, setIsAddingUser] = useState(false);
    const router = useRouter();

    // Mock users data - in real app, this would come from database
    const mockUsers: User[] = [
        {
            id: "1",
            username: "admin",
            email: "admin@elivra.com",
            role: "admin",
            status: "active",
            lastLogin: new Date(),
            permissions: {
                canViewDonations: true,
                canEditDonations: true,
                canDeleteDonations: true,
                canAddDonations: true,
                canManageUsers: false,
                canViewReports: true
            }
        },
        {
            id: "2",
            username: "moderator1",
            email: "moderator1@elivra.com",
            role: "user",
            status: "limited",
            lastLogin: new Date(Date.now() - 86400000),
            permissions: {
                canViewDonations: true,
                canEditDonations: false,
                canDeleteDonations: false,
                canAddDonations: true,
                canManageUsers: false,
                canViewReports: false
            }
        },
        {
            id: "3",
            username: "user1",
            email: "user1@elivra.com",
            role: "user",
            status: "blocked",
            lastLogin: new Date(Date.now() - 172800000),
            permissions: {
                canViewDonations: false,
                canEditDonations: false,
                canDeleteDonations: false,
                canAddDonations: false,
                canManageUsers: false,
                canViewReports: false
            }
        }
    ];

    const loadUsers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const usersList: User[] = [];

            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                usersList.push({
                    id: userData.id || doc.id,
                    username: userData.username || 'Unknown User',
                    email: userData.email || 'No Email',
                    role: userData.role || 'user',
                    status: userData.status || 'active',
                    lastLogin: userData.lastLogin?.toDate() || new Date(),
                    permissions: userData.permissions || {
                        canViewDonations: false,
                        canEditDonations: false,
                        canDeleteDonations: false,
                        canAddDonations: true,
                        canManageUsers: false,
                        canViewReports: false
                    }
                });
            });

            setUsers(usersList);
        } catch (error) {
            console.error("Error loading users:", error);
            // Fallback to mock data if Firestore fails
            setUsers(mockUsers);
        }
    };

    useEffect(() => {
        if (!currentUser) {
            router.push("/login");
            return;
        }

        // Check if user is super admin
        const userRole = localStorage.getItem("userRole");
        if (userRole !== "superadmin") {
            showToast({
                type: "error",
                title: "Access Denied",
                message: "You don't have permission to access this page."
            });
            router.push("/dashboard");
            return;
        }

        // Load users from Firestore
        loadUsers();
        setLoading(false);
    }, [currentUser, router, showToast, loadUsers]);

    const handleUserStatusChange = async (userId: string, newStatus: "active" | "blocked" | "limited") => {
        try {
            // Update in Firestore
            await setDoc(doc(db, "users", userId), {
                status: newStatus
            }, { merge: true });

            // Update local state
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ));

            showToast({
                type: "success",
                title: "User Status Updated",
                message: `User status changed to ${newStatus}`
            });
        } catch (error) {
            console.error("Error updating user status:", error);
            showToast({
                type: "error",
                title: "Update Failed",
                message: "Failed to update user status. Please try again."
            });
        }
    };

    const handlePermissionChange = async (userId: string, permission: keyof User['permissions'], value: boolean) => {
        try {
            // Get current user data
            const currentUserData = users.find(user => user.id === userId);
            if (!currentUserData) return;

            const updatedPermissions = { ...currentUserData.permissions, [permission]: value };

            // Update in Firestore
            await setDoc(doc(db, "users", userId), {
                permissions: updatedPermissions
            }, { merge: true });

            // Update local state
            setUsers(prev => prev.map(user =>
                user.id === userId
                    ? { ...user, permissions: updatedPermissions }
                    : user
            ));

            showToast({
                type: "success",
                title: "Permission Updated",
                message: `${permission} permission ${value ? 'granted' : 'revoked'}`
            });
        } catch (error) {
            console.error("Error updating permissions:", error);
            showToast({
                type: "error",
                title: "Update Failed",
                message: "Failed to update permissions. Please try again."
            });
        }
    };

    const handleAddUser = async () => {
        if (!newUser.username || !newUser.email || !newUser.password) {
            showToast({
                type: "warning",
                title: "Validation Error",
                message: "Please fill in all required fields"
            });
            return;
        }

        // Check if username already exists
        if (users.some(user => user.username === newUser.username)) {
            showToast({
                type: "error",
                title: "User Exists",
                message: "A user with this username already exists"
            });
            return;
        }

        // Check if email already exists
        if (users.some(user => user.email === newUser.email)) {
            showToast({
                type: "error",
                title: "Email Exists",
                message: "A user with this email already exists"
            });
            return;
        }

        setIsAddingUser(true);
        try {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newUser.email)) {
                throw new Error("Please enter a valid email address");
            }

            // Validate password strength
            if (newUser.password.length < 6) {
                throw new Error("Password must be at least 6 characters long");
            }

            // Generate a simple user ID
            const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Create user data
            const userData = {
                id: userId,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password, // In a real app, this should be hashed
                role: newUser.role,
                status: "active",
                lastLogin: new Date(),
                permissions: {
                    canViewDonations: newUser.role === "admin",
                    canEditDonations: newUser.role === "admin",
                    canDeleteDonations: newUser.role === "admin",
                    canAddDonations: true,
                    canManageUsers: false,
                    canViewReports: newUser.role === "admin"
                },
                createdAt: new Date(),
                createdBy: currentUser?.uid || "superadmin"
            };

            // Store user data in Firestore
            console.log("Storing user data:", userData);
            await setDoc(doc(db, "users", userId), userData);
            console.log("User stored successfully with ID:", userId);

            // Update local state
            const newUserObj: User = {
                id: userId,
                username: newUser.username || 'Unknown User',
                email: newUser.email || 'No Email',
                role: newUser.role || 'user',
                status: "active",
                lastLogin: new Date(),
                permissions: {
                    canViewDonations: newUser.role === "admin",
                    canEditDonations: newUser.role === "admin",
                    canDeleteDonations: newUser.role === "admin",
                    canAddDonations: true,
                    canManageUsers: false,
                    canViewReports: newUser.role === "admin"
                }
            };

            setUsers(prev => [...prev, newUserObj]);
            setNewUser({ username: "", email: "", password: "", role: "user" });
            setShowAddUserModal(false);

            showToast({
                type: "success",
                title: "User Added",
                message: `New ${newUser.role} has been created successfully. You can now login with username: ${newUser.username} or email: ${newUser.email}`
            });
        } catch (error: unknown) {
            console.error("Error adding user:", error);

            let errorMessage = "Failed to add user. Please try again.";
            let errorTitle = "Add Failed";

            if (error instanceof Error) {
                if (error.message?.includes("Please enter a valid email address")) {
                    errorMessage = "Please enter a valid email address";
                    errorTitle = "Invalid Email";
                } else if (error.message?.includes("Password must be at least 6 characters")) {
                    errorMessage = "Password must be at least 6 characters long";
                    errorTitle = "Weak Password";
                } else if (error.message?.includes("Firebase")) {
                    errorMessage = `Firebase error: ${error.message}`;
                    errorTitle = "Firebase Error";
                }
            }

            // Check for Firestore errors
            if (error && typeof error === 'object' && 'code' in error) {
                const firestoreError = error as { code: string };
                if (firestoreError.code === "firestore/permission-denied") {
                    errorMessage = "Permission denied. Check Firestore security rules or contact the administrator.";
                    errorTitle = "Permission Denied";
                }
            }

            showToast({
                type: "error",
                title: errorTitle,
                message: errorMessage
            });
        } finally {
            setIsAddingUser(false);
        }
    };

    const handleDeleteUser = (userId: string) => {
        const userToDelete = users.find(user => user.id === userId);

        if (!userToDelete) {
            showToast({
                type: "error",
                title: "User Not Found",
                message: "The user you're trying to delete doesn't exist"
            });
            return;
        }

        // Prevent super admin from deleting themselves
        if (userToDelete.role === "superadmin" && userToDelete.id === currentUser?.uid) {
            showToast({
                type: "error",
                title: "Cannot Delete Self",
                message: "You cannot delete your own super admin account"
            });
            return;
        }

        // Special confirmation for admin accounts
        const isAdmin = userToDelete.role === "admin";
        const confirmMessage = isAdmin
            ? `Are you sure you want to delete the admin account "${userToDelete.username}"? This will remove all their admin privileges.`
            : `Are you sure you want to delete the user "${userToDelete.username}"?`;

        if (window.confirm(confirmMessage)) {
            setUsers(prev => prev.filter(user => user.id !== userId));
            showToast({
                type: "success",
                title: isAdmin ? "Admin Deleted" : "User Deleted",
                message: `${userToDelete.username} has been removed from the system`
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "text-green-600 bg-green-100";
            case "blocked": return "text-red-600 bg-red-100";
            case "limited": return "text-yellow-600 bg-yellow-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "superadmin": return "text-purple-600 bg-purple-100";
            case "admin": return "text-blue-600 bg-blue-100";
            case "user": return "text-gray-600 bg-gray-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Super Admin Panel</h1>
                            <p className="text-slate-600">Manage users and system permissions</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-slate-600">
                                Welcome, {currentUser?.displayName || "Super Admin"}
                            </span>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => logout()}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Total Users</p>
                                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Active Users</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {users.filter(u => u.status === "active").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Ban className="w-5 h-5 text-red-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Blocked Users</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {users.filter(u => u.status === "blocked").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Limited Users</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {users.filter(u => u.status === "limited").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Management */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-slate-900">User Management</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setNewUser({ username: "", email: "", password: "", role: "admin" });
                                        setShowAddUserModal(true);
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <Shield className="w-4 h-4" />
                                    <span>Add Admin</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setNewUser({ username: "", email: "", password: "", role: "user" });
                                        setShowAddUserModal(true);
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Add User</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Last Login
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.role === "superadmin" ? "bg-purple-100" :
                                                    user.role === "admin" ? "bg-blue-100" : "bg-slate-100"
                                                    }`}>
                                                    {user.role === "admin" || user.role === "superadmin" ? (
                                                        <Shield className={`w-4 h-4 ${user.role === "superadmin" ? "text-purple-600" : "text-blue-600"
                                                            }`} />
                                                    ) : (
                                                        <span className="text-slate-600 font-semibold text-sm">
                                                            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-slate-900">{user.username || 'Unknown User'}</span>
                                                        {user.role === "admin" && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                Admin
                                                            </span>
                                                        )}
                                                        {user.role === "superadmin" && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                                Super Admin
                                                            </span>
                                                        )}
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-800" :
                                                            user.status === "limited" ? "bg-yellow-100 text-yellow-800" :
                                                                "bg-red-100 text-red-800"
                                                            }`}>
                                                            {user.status || 'unknown'}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {user.lastLogin.toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {user.status !== "active" && (
                                                    <button
                                                        onClick={() => handleUserStatusChange(user.id, "active")}
                                                        className="text-green-600 hover:text-green-900 p-1"
                                                        title="Activate user"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowUserModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Manage permissions"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Delete user"
                                                >
                                                    <UserMinus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Permissions Modal */}
                {showUserModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Manage User: {selectedUser.username}</h3>
                                <button
                                    onClick={() => setShowUserModal(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                    title="Close modal"
                                    aria-label="Close modal"
                                >
                                    <EyeOff className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Status Management */}
                                <div>
                                    <h4 className="text-md font-medium text-slate-900 mb-3">User Status</h4>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleUserStatusChange(selectedUser.id, "active")}
                                            className={`px-3 py-1 rounded text-sm ${selectedUser.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-slate-100 text-slate-600 hover:bg-green-50"
                                                }`}
                                        >
                                            Active
                                        </button>
                                        <button
                                            onClick={() => handleUserStatusChange(selectedUser.id, "limited")}
                                            className={`px-3 py-1 rounded text-sm ${selectedUser.status === "limited"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-slate-100 text-slate-600 hover:bg-yellow-50"
                                                }`}
                                        >
                                            Limited
                                        </button>
                                        <button
                                            onClick={() => handleUserStatusChange(selectedUser.id, "blocked")}
                                            className={`px-3 py-1 rounded text-sm ${selectedUser.status === "blocked"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-slate-100 text-slate-600 hover:bg-red-50"
                                                }`}
                                        >
                                            Blocked
                                        </button>
                                    </div>
                                </div>

                                {/* Permissions Management */}
                                <div>
                                    <h4 className="text-md font-medium text-slate-900 mb-3">Permissions</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(selectedUser.permissions).map(([permission, value]) => (
                                            <label key={permission} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={(e) => handlePermissionChange(selectedUser.id, permission as keyof User['permissions'], e.target.checked)}
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-slate-700 capitalize">
                                                    {permission.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setShowUserModal(false)}
                                    className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add User Modal */}
                {showAddUserModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">
                                    Add New {newUser.role === "admin" ? "Admin" : "User"}
                                </h3>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${newUser.role === "admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                    }`}>
                                    {newUser.role === "admin" ? "Admin Account" : "User Account"}
                                </div>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleAddUser();
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="new-username" className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
                                        <input
                                            id="new-username"
                                            type="text"
                                            value={newUser.username}
                                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="new-email" className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                                        <input
                                            id="new-email"
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                                        <input
                                            id="new-password"
                                            type="password"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            minLength={6}
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            Password must be at least 6 characters long
                                        </p>
                                    </div>
                                    <div>
                                        <label htmlFor="new-role" className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setNewUser({ ...newUser, role: "user" })}
                                                className={`px-4 py-2 rounded-lg border-2 transition-colors ${newUser.role === "user"
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-slate-300 bg-white text-slate-600 hover:border-blue-300"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center space-x-2">
                                                    <User className="w-4 h-4" />
                                                    <span>User</span>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewUser({ ...newUser, role: "admin" })}
                                                className={`px-4 py-2 rounded-lg border-2 transition-colors ${newUser.role === "admin"
                                                    ? "border-purple-500 bg-purple-50 text-purple-700"
                                                    : "border-slate-300 bg-white text-slate-600 hover:border-purple-300"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Shield className="w-4 h-4" />
                                                    <span>Admin</span>
                                                </div>
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {newUser.role === "admin"
                                                ? "Admin accounts have full access to donation management"
                                                : "User accounts have limited access based on permissions"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddUserModal(false)}
                                        className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isAddingUser}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        {isAddingUser ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Adding User...</span>
                                            </>
                                        ) : (
                                            <span>Add User</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
