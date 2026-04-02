"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./home.module.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has session, redirect to dashboard
    const userSession =
      typeof window !== "undefined"
        ? localStorage.getItem("user_session")
        : null;
    if (userSession) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className={styles.main}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
          SmartInventory
        </div>
        <div className={styles.navLinks}>
          <Link href="/auth/login" className={styles.loginBtn}>Sign In</Link>
          <Link href="/auth/signup" className={styles.signupBtn}>Get Started</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.badge}>Next-Gen Platform</div>
        <h1 className={styles.title}>
          Operations made seamless, stock kept precise.
        </h1>
        <p className={styles.description}>
          The ultimate Smart Inventory & Order Management System. Build your operations entirely on fully validated fulfillment workflows with intelligent conflict handling out-of-the-box.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/auth/signup" className={styles.primaryCta}>
            Start for free
          </Link>
          <Link href="/auth/login" className={styles.secondaryCta}>
            View Live Demo
          </Link>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.glowBlob}></div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Intelligent Inventory</h3>
            <p className={styles.featureDesc}>
              Track multiple product variations and manage stock levels in absolute real-time. Define low-stock thresholds to automate reordering.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Fulfillment Workflows</h3>
            <p className={styles.featureDesc}>
              Streamline customer order progression from preparation to shipping. Our engine ensures 100% operational fidelity during peak sales.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Conflict Validation</h3>
            <p className={styles.featureDesc}>
              Advanced monitoring instantly flags stock irregularities and prevents overselling, keeping concurrency and multi-user environments pristine.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
