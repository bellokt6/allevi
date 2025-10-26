"use client";

import React, { useState } from "react";
import { db, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "@/firebaseConfig";

const FirebaseTest: React.FC = () => {
    const [testResults, setTestResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const addTestResult = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testFirebaseOperations = async () => {
        setLoading(true);
        setTestResults([]);

        try {
            // Test 1: Read operations
            addTestResult("Testing READ operations...");
            const querySnapshot = await getDocs(collection(db, "donations"));
            addTestResult(`✅ READ successful - Found ${querySnapshot.docs.length} documents`);

            // Test 2: Create operation
            addTestResult("Testing CREATE operation...");
            const testDoc = await addDoc(collection(db, "donations"), {
                name: "Test Donation",
                amount: 100,
                message: "This is a test donation",
                createdAt: new Date(),
            });
            addTestResult(`✅ CREATE successful - Document ID: ${testDoc.id}`);

            // Test 3: Update operation
            addTestResult("Testing UPDATE operation...");
            await updateDoc(doc(db, "donations", testDoc.id), {
                name: "Updated Test Donation",
                amount: 200,
            });
            addTestResult("✅ UPDATE successful");

            // Test 4: Delete operation
            addTestResult("Testing DELETE operation...");
            await deleteDoc(doc(db, "donations", testDoc.id));
            addTestResult("✅ DELETE successful");

            addTestResult("🎉 All Firebase operations successful!");

        } catch (error) {
            addTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            console.error("Firebase test error:", error);
        } finally {
            setLoading(false);
        }
    };

    const testFirebaseConfig = () => {
        addTestResult("Testing Firebase configuration...");
        addTestResult(`Database object: ${db ? '✅ Present' : '❌ Missing'}`);
        addTestResult(`Collection function: ${collection ? '✅ Present' : '❌ Missing'}`);
        addTestResult(`AddDoc function: ${addDoc ? '✅ Present' : '❌ Missing'}`);
        addTestResult(`UpdateDoc function: ${updateDoc ? '✅ Present' : '❌ Missing'}`);
        addTestResult(`DeleteDoc function: ${deleteDoc ? '✅ Present' : '❌ Missing'}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Firebase Connection Test</h1>

                    <div className="space-y-4 mb-6">
                        <button
                            onClick={testFirebaseConfig}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Test Firebase Configuration
                        </button>

                        <button
                            onClick={testFirebaseOperations}
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Testing..." : "Test All Firebase Operations"}
                        </button>
                    </div>

                    <div className="bg-slate-100 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
                        <div className="space-y-1 max-h-96 overflow-y-auto">
                            {testResults.length === 0 ? (
                                <p className="text-slate-500">No tests run yet. Click a button above to start testing.</p>
                            ) : (
                                testResults.map((result, index) => (
                                    <div key={index} className="text-sm font-mono">
                                        {result}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Common Issues:</h3>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• <strong>Firebase Rules:</strong> Make sure your Firestore rules allow read/write operations</li>
                            <li>• <strong>Environment Variables:</strong> Check that all Firebase config variables are set</li>
                            <li>• <strong>Network Issues:</strong> Ensure you have internet connection</li>
                            <li>• <strong>Project ID:</strong> Verify the Firebase project ID is correct</li>
                        </ul>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Firebase Rules Example:</h3>
                        <pre className="text-sm text-blue-700 bg-blue-100 p-3 rounded overflow-x-auto">
                            {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /donations/{document} {
      allow read, write: if true; // Allow all operations (for testing)
      // For production, use proper authentication rules:
      // allow read, write: if request.auth != null;
    }
  }
}`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FirebaseTest;
