"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          <section className="card error-card">
            <p className="eyebrow">Critical Error</p>
            <h1>Application failed to render</h1>
            <p>{error.message || "Unexpected fatal error."}</p>
            <button className="btn primary" type="button" onClick={reset}>
              Retry
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
