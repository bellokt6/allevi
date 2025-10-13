// app/api/donations/clear-oldest/route.ts
import { NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  writeBatch,
} from "firebase/firestore";

export async function DELETE() {
  try {
    const donationsRef = collection(db, "donations");

    // Get oldest 500 donations
    const q = query(donationsRef, orderBy("createdAt", "asc"), limit(30));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { message: "No donations found to delete" },
        { status: 404 }
      );
    }

    // Batch delete
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return NextResponse.json({
      message: `Deleted ${snapshot.size} oldest donations successfully`,
      deletedCount: snapshot.size,
    });
  } catch (error) {
    console.error("Error deleting oldest donations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
