import type { Metadata } from "next";
import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";
import ReduxStoreProvider from "@/redux/ReduxStoreProvider";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Inventory & Order Management",
  description:
    "Frontend for managing products, stock, orders, and fulfillment workflows with validation and conflict handling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body suppressHydrationWarning>
        <ReduxStoreProvider>
        <NextTopLoader color="#2dd4bf" showSpinner={false} />
        {children}
        </ReduxStoreProvider>
      </body>
    </html>
  );
}
