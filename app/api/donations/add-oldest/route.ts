// app/api/donations/add-oldest/route.ts
import { NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import {
    collection,
    doc,
    query,
    orderBy,
    limit,
    getDocs,
    Timestamp,
    writeBatch,
} from "firebase/firestore";

export async function POST() {
    try {
        const donationsRef = collection(db, "donations");

        // Try to find the current oldest donation
        const q = query(donationsRef, orderBy("createdAt", "asc"), limit(1));
        const snapshot = await getDocs(q);

        let oldestTime: Timestamp;

        if (snapshot.empty) {
            // If no donations, default far back
            oldestTime = Timestamp.fromDate(new Date("2000-01-01"));
        } else {
            const data = snapshot.docs[0].data();

            // If createdAt is missing or invalid, just bypass with a fallback
            if (!data.createdAt || !(data.createdAt instanceof Timestamp)) {
                oldestTime = Timestamp.fromDate(new Date("2000-01-01"));
            } else {
                oldestTime = data.createdAt;
            }
        }

        // Create a batch for all writes
        const batch = writeBatch(db);

        for (let i = 0; i < 50; i++) {
            const createdAt = Timestamp.fromDate(
                new Date(oldestTime.toDate().getTime() - (i + 1) * 1000) // push backwards in time
            );

            const newDocRef = doc(donationsRef); // pre-generate doc ref
            batch.set(newDocRef, {
                name: `Old Donation ${i + 1}`,
                amount: Math.floor(Math.random() * 100) + 1,
                createdAt,
            });
        }

        // Commit all writes in one atomic operation
        await batch.commit();

        return NextResponse.json({
            message: "Added 50 donations dated as oldest (bypassing invalid records if needed).",
        });
    } catch (error: any) {
        console.error("Error adding oldest donations:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
