import type { Metadata } from "next";
import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <header className="topbar">
          <div className="container row spread center">
            <div className="brand">
              <span className="brand-accent" />
              <div>
                <p className="brand-title">Smart Inventory System</p>
                <p className="brand-subtitle">Operations Console</p>
              </div>
            </div>

            <nav className="row nav-links">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/categories">Categories</Link>
              <Link href="/products">Products</Link>
              <Link href="/products/new">Add Product</Link>
              <Link href="/orders">Orders</Link>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/signup">Signup</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
