// import { NextResponse } from "next/server";
// import { db } from "@/firebaseConfig";
// import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

// export async function GET() {
//   const donationsRef = collection(db, "donations");
//   const q = query(donationsRef, orderBy("createdAt", "asc"), limit(500));
//   const snapshot = await getDocs(q);

//   return NextResponse.json(
//     snapshot.docs.map(doc => ({
//       id: doc.id,
//       createdAt: doc.data().createdAt,
//     }))
//   );
// }
