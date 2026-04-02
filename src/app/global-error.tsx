"use client";

import styles from "./status.module.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className={styles.container}>
          <section className={styles.card}>
            <div className={`${styles.iconWrapper} ${styles.errorIcon}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
            <h1 className={styles.title}>Critical Application Error</h1>
            <p className={styles.description}>
              {error.message || "A fatal error forced the application to stop. Don't worry, your data is safe."}
            </p>
            <button className={styles.primaryBtn} type="button" onClick={() => reset()}>
              Restart Application
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
