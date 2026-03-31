export default function OrdersLoading() {
  return (
    <main className="container">
      <section className="card loading-card">
        <div className="skeleton title" />
        <div className="skeleton line" />
        <div className="skeleton line" />
        <div className="skeleton line short" />
      </section>
    </main>
  );
}
