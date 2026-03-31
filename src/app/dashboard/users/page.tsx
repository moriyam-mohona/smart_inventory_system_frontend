export default function UsersPage() {
  const mockUsers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "MANAGER",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "ADMIN",
      createdAt: "2024-01-10",
    },
  ];

  return (
    <div>
      <div className="card">
        <div className="row spread center wrap">
          <div>
            <h2>User Management</h2>
            <p className="card-subtitle">Manage system users and their roles</p>
          </div>
          <button className="btn primary">Add User</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="pill">{user.role}</span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="text-btn">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
