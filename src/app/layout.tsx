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
  title: "Stock Control System | Intelligent Inventory & Order Management",
  description:
    "Stock Control System is a premium, glassmorphic SaaS platform designed for high-precision inventory tracking, automated order fulfillment, and real-time operational workflows.",
  keywords: "stock control system, inventory management software, order fulfillment, precise inventory, SaaS inventory",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Stock Control System",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Stock Control System is an intelligent, real-time inventory and order management platform built for modern business operations."
            })
          }}
        />
        <div className="mesh-bg"></div>
        <ReduxStoreProvider>
          <NextTopLoader color="#1B475D" showSpinner={false} />
          {children}
        </ReduxStoreProvider>
      </body>
    </html>
  );
}
