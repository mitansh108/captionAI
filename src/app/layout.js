import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link"; // Import Link from Next.js for navigation

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuickCaption.AI",
  description: "Transcription made easy with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#0f1117] text-black dark:text-white min-h-screen transition-colors duration-300`}
      >
        {/* Navbar */}
        <header className="flex justify-between items-center px-8 py-6 bg-gray-100 dark:bg-[#1a1d24] shadow-md">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              QuickCaption.AI
            </Link>
          </h1>
          <nav className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
            <Link href="/" className="hover:text-black dark:hover:text-white">
              Home
            </Link>

            <Link href="/pricing" className="hover:text-black dark:hover:text-white">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-black dark:hover:text-white">
              Contact
            </Link>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 ml-2">
              Start FREE Trial
            </button>
          </nav>
        </header>

        {/* Main content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
