import Link from "next/link";
import styles from "./status.module.css";

export default function NotFound() {
  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.warningIcon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        </div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          We couldn't find the page or resource you were looking for. It might have been moved or deleted.
        </p>
        <Link className={styles.primaryBtn} href="/">
          Return to Dashboard
        </Link>
      </section>
    </main>
  );
}
