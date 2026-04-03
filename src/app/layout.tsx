import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "antd/dist/reset.css";
import "./globals.css";
import ReduxStoreProvider from "@/redux/ReduxStoreProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Inventory & Order Management",
  description:
    "A modern, glassmorphic SaaS platform for managing products, stock, orders, and fulfillment workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body suppressHydrationWarning>
        <div className="mesh-bg"></div>
        <ReduxStoreProvider>
          <NextTopLoader color="#1B475D" showSpinner={false} />
          {children}
        </ReduxStoreProvider>
      </body>
    </html>
  );
}
