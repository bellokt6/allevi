"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db, collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "@/firebaseConfig";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface DonationData {
    id: string;
    name: string;
    amount: number;
    message: string;
    createdAt: Date;
}

const Dashboard: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const { showToast } = useToast();
    const [donations, setDonations] = useState<DonationData[]>([]);
    const [filteredDonations, setFilteredDonations] = useState<DonationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "amount" | "name">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [editingDonation, setEditingDonation] = useState<DonationData | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [donationToDelete, setDonationToDelete] = useState<string | null>(null);
    const [newDonation, setNewDonation] = useState({
        name: "",
        amount: "",
        message: ""
    });
    const [stats, setStats] = useState({
        totalDonations: 0,
        totalAmount: 0,
        averageAmount: 0,
        recentDonations: 0
    });
    const router = useRouter();

    // Permission checking functions
    const getUserStatus = () => {
        return localStorage.getItem("userStatus") || "active";
    };

    const getUserRole = () => {
        return localStorage.getItem("userRole") || "user";
    };

    const canDelete = () => {
        const status = getUserStatus();
        return status === "limited" || status === "active";
    };

    const canEdit = () => {
        const status = getUserStatus();
        return status === "active";
    };

    const canAdd = () => {
        const status = getUserStatus();
        return status === "active";
    };

    const canView = () => {
        const status = getUserStatus();
        return status === "active" || status === "limited";
    };

    useEffect(() => {
        // Check if user is logged in
        if (!currentUser) {
            router.push("/login");
            return;
        }

        // Check user permissions
        const userRole = getUserRole();
        const userStatus = getUserStatus();

        if (userStatus === "blocked") {
            showToast({
                type: "error",
                title: "Access Denied",
                message: "Your account has been blocked. Contact administrator."
            });
            logout();
            return;
        }

        // Show permission info
        if (userStatus === "limited") {
            showToast({
                type: "info",
                title: "Limited Access",
                message: "You have limited access. You can only delete donations."
            });
        }

        // Test Firebase connection
        const testFirebaseConnection = async () => {
            try {
                console.log("Testing Firebase connection...");
                console.log("Firebase db object:", db);
                console.log("Firebase collection:", collection(db, "donations"));
                await getDocs(collection(db, "donations"));
                console.log("Firebase connection successful!");
            } catch (error) {
                console.error("Firebase connection failed:", error);
                showToast({
                    type: "error",
                    title: "Connection Error",
                    message: `Firebase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                });
            }
        };

        testFirebaseConnection();
        fetchDonations();
    }, [currentUser, router, showToast, logout]);

    useEffect(() => {
        // Filter and sort donations
        let filtered = donations;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(donation =>
                donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "amount":
                    comparison = a.amount - b.amount;
                    break;
                case "date":
                    comparison = a.createdAt.getTime() - b.createdAt.getTime();
                    break;
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

        setFilteredDonations(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [donations, searchTerm, sortBy, sortOrder]);

    const fetchDonations = async () => {
        try {
            console.log("Fetching donations from Firebase...");
            const querySnapshot = await getDocs(collection(db, "donations"));
            console.log("Firebase query successful, found", querySnapshot.docs.length, "donations");

            const donationList: DonationData[] = querySnapshot.docs.map(doc => {
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
                    id: doc.id,
                    name: data.name || "Anonymous",
                    amount: typeof data.amount === 'number' && !isNaN(data.amount) ? data.amount : 0,
                    message: data.message || "",
                    createdAt,
                };
            });

            // Filter out invalid donations
            const validDonations = donationList.filter(donation =>
                donation.name &&
                donation.name.trim() !== "" &&
                donation.amount > 0
            );

            setDonations(validDonations);

            // Calculate stats
            const totalAmount = validDonations.reduce((sum, donation) => sum + donation.amount, 0);
            const averageAmount = validDonations.length > 0 ? totalAmount / validDonations.length : 0;
            const recentDonations = validDonations.filter(donation => {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return donation.createdAt >= oneWeekAgo;
            }).length;

            setStats({
                totalDonations: validDonations.length,
                totalAmount,
                averageAmount,
                recentDonations
            });
        } catch (error) {
            console.error("Failed to fetch donations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    // CRUD Functions
    const handleEdit = (donation: DonationData) => {
        setEditingDonation(donation);
    };

    const handleUpdate = async (updatedDonation: DonationData) => {
        try {
            const donationRef = doc(db, "donations", updatedDonation.id);
            await updateDoc(donationRef, {
                name: updatedDonation.name,
                amount: updatedDonation.amount,
                message: updatedDonation.message,
            });

            setDonations(prev => prev.map(d => d.id === updatedDonation.id ? updatedDonation : d));
            setEditingDonation(null);
            showToast({
                type: "success",
                title: "Donation Updated",
                message: "The donation has been updated successfully."
            });
        } catch (error) {
            console.error("Error updating donation:", error);
            showToast({
                type: "error",
                title: "Update Failed",
                message: `Failed to update donation: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
    };

    const handleDelete = (donationId: string) => {
        setDonationToDelete(donationId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!donationToDelete) return;

        try {
            await deleteDoc(doc(db, "donations", donationToDelete));
            setDonations(prev => prev.filter(d => d.id !== donationToDelete));
            showToast({
                type: "success",
                title: "Donation Deleted",
                message: "The donation has been deleted successfully."
            });
        } catch (error) {
            console.error("Error deleting donation:", error);
            showToast({
                type: "error",
                title: "Delete Failed",
                message: `Failed to delete donation: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        } finally {
            setShowDeleteModal(false);
            setDonationToDelete(null);
        }
    };

    const handleAdd = async () => {
        if (!newDonation.name || !newDonation.amount || Number(newDonation.amount) <= 0) {
            showToast({
                type: "warning",
                title: "Validation Error",
                message: "Please fill in all required fields with valid data"
            });
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "donations"), {
                name: newDonation.name,
                amount: Number(newDonation.amount),
                message: newDonation.message,
                createdAt: new Date(),
            });

            const newDonationData: DonationData = {
                id: docRef.id,
                name: newDonation.name,
                amount: Number(newDonation.amount),
                message: newDonation.message,
                createdAt: new Date(),
            };

            setDonations(prev => [newDonationData, ...prev]);
            setNewDonation({ name: "", amount: "", message: "" });
            setShowAddModal(false);
            showToast({
                type: "success",
                title: "Donation Added",
                message: "The donation has been added successfully."
            });
        } catch (error) {
            console.error("Error adding donation:", error);
            showToast({
                type: "error",
                title: "Add Failed",
                message: `Failed to add donation: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
    };

    // Pagination
    const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDonations = filteredDonations.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading dashboard...</p>
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
                            <h1 className="text-2xl font-bold text-slate-900">Donation Dashboard</h1>
                            <p className="text-slate-600">Manage and monitor donations</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-slate-600">
                                Welcome, {currentUser?.displayName || "Admin"}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserStatus() === "active" ? "bg-green-100 text-green-800" :
                                    getUserStatus() === "limited" ? "bg-yellow-100 text-yellow-800" :
                                        "bg-red-100 text-red-800"
                                }`}>
                                {getUserStatus().toUpperCase()}
                            </span>
                            <button
                                onClick={handleLogout}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Total Donations</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalDonations}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Total Amount</p>
                                <p className="text-2xl font-bold text-slate-900">${stats.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Average Amount</p>
                                <p className="text-2xl font-bold text-slate-900">${stats.averageAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">This Week</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.recentDonations}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donations Management */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-slate-900">All Donations</h3>
                            {canAdd() && (
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Donation</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search donations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "name")}
                                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Sort donations by"
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="amount">Sort by Amount</option>
                                    <option value="name">Sort by Name</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                    className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    {sortOrder === "asc" ? "↑" : "↓"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Donor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {currentDonations.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-sm">
                                                        {donation.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-slate-900">{donation.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-green-600">${donation.amount}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900 max-w-xs truncate">
                                                {donation.message || "No message"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {donation.createdAt.toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {canEdit() && (
                                                    <button
                                                        onClick={() => handleEdit(donation)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Edit donation"
                                                        aria-label="Edit donation"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {canDelete() && (
                                                    <button
                                                        onClick={() => handleDelete(donation.id)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Delete donation"
                                                        aria-label="Delete donation"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-700">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredDonations.length)} of {filteredDonations.length} donations
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-slate-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-sm text-slate-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-slate-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {filteredDonations.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">No donations found</p>
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {editingDonation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Edit Donation</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate(editingDonation);
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                        <input
                                            id="edit-name"
                                            type="text"
                                            value={editingDonation.name}
                                            onChange={(e) => setEditingDonation({ ...editingDonation, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-amount" className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                        <input
                                            id="edit-amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={editingDonation.amount}
                                            onChange={(e) => setEditingDonation({ ...editingDonation, amount: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                        <textarea
                                            id="edit-message"
                                            value={editingDonation.message}
                                            onChange={(e) => setEditingDonation({ ...editingDonation, message: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setEditingDonation(null)}
                                        className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Add New Donation</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleAdd();
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="add-name" className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                                        <input
                                            id="add-name"
                                            type="text"
                                            value={newDonation.name}
                                            onChange={(e) => setNewDonation({ ...newDonation, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="add-amount" className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
                                        <input
                                            id="add-amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newDonation.amount}
                                            onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="add-message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                        <textarea
                                            id="add-message"
                                            value={newDonation.message}
                                            onChange={(e) => setNewDonation({ ...newDonation, message: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Add Donation
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Delete Donation</h3>
                            </div>
                            <p className="text-slate-600 mb-6">
                                Are you sure you want to delete this donation? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDonationToDelete(null);
                                    }}
                                    className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
