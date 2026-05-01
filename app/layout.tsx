import { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { ToastProvider } from "@/components/ui/toast";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
export const metadata: Metadata = {
  title: "Lets Help",
  description: "Helping Palestine and Gaza refugees",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  referrer: 'no-referrer',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <AuthProvider>
          <ToastProvider>
            <div className="relative z-[1000]">
              <Navbar />
            </div>
            {children}
            <Footer />
          </ToastProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
