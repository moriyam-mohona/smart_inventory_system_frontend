"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container">
      <section className="card error-card">
        <p className="eyebrow">Error</p>
        <h1>Something went wrong while loading this section</h1>
        <p>{error.message || "Unexpected application error."}</p>
        <button className="btn primary" type="button" onClick={reset}>
          Retry
        </button>
      </section>
    </main>
  );
}
