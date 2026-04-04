import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "antd/dist/reset.css";
import "./globals.css";
import ReduxStoreProvider from "@/redux/ReduxStoreProvider";

const outfit = Outfit({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
      className={`${outfit.variable}`}
    >
      <body suppressHydrationWarning className="font-main">
        <div className="mesh-bg"></div>
        <ReduxStoreProvider>
          <NextTopLoader color="#1B475D" showSpinner={false} />
          {children}
        </ReduxStoreProvider>
      </body>
    </html>
  );
}
