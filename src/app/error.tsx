"use client";

import { useEffect } from "react";
import styles from "./status.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime Application Error:", error);
  }, [error]);

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.errorIcon}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1 className={styles.title}>Operation Failed</h1>
        <p className={styles.description}>
          {error.message || "An unexpected error occurred while rendering this page subsystem."}
        </p>
        <button className={styles.primaryBtn} type="button" onClick={() => reset()}>
          Try Again
        </button>
      </section>
    </main>
  );
}
