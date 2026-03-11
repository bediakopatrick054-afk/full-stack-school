import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flood of Life Embassy Church Management System",
  description: "Comprehensive Church Management System for Flood of Life Embassy",
  keywords: ["church management", "flood of life", "embassy church", "member tracking", "contributions"],
  authors: [{ name: "Flood of Life Embassy" }],
  openGraph: {
    title: "Flood of Life Embassy Church Management",
    description: "Manage your church members, contributions, events, and ministries",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="theme-color" content="#7C3AED" /> {/* Purple theme color */}
        </head>
        <body className={`${inter.className} bg-gray-50`}>
          {children}
          <ToastContainer 
            position="bottom-right"
            theme="colored"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 9999 }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
