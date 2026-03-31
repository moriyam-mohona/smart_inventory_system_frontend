export const revalidate = 60;

export default function ActivityLogPage() {
  const mockActivities = [
    {
      id: "1",
      action: "Order #1023 created by user",
      timestamp: new Date(Date.now() - 30 * 60000),
    },
    {
      id: "2",
      action: "Stock updated for iPhone 13",
      timestamp: new Date(Date.now() - 45 * 60000),
    },
    {
      id: "3",
      action: "Product Headphone added to Restock Queue",
      timestamp: new Date(Date.now() - 60 * 60000),
    },
    {
      id: "4",
      action: "Order #1023 marked as Shipped",
      timestamp: new Date(Date.now() - 90 * 60000),
    },
    {
      id: "5",
      action: "New category Electronics created",
      timestamp: new Date(Date.now() - 2 * 3600000),
    },
  ];

  return (
    <div>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2>Activity Log</h2>
        <p className="card-subtitle">
          Track recent system activities and changes
        </p>
      </div>

      <div className="card">
        <ul className="activity-log-list">
          {mockActivities.map((activity) => (
            <li key={activity.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{activity.action}</strong>
                <span
                  style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}
                >
                  {activity.timestamp.toLocaleTimeString()} —{" "}
                  {activity.timestamp.toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
