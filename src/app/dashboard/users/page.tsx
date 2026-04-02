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
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2>User Management</h2>
            <p className="card-subtitle">Manage system users and their roles</p>
          </div>
          <button className="btn-primary">Add User</button>
        </div>
      </div>

      <div
        className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm"
        style={{ marginTop: "2rem" }}
      >
        <div className="overflow-x-auto mt-4 border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white text-left text-sm">
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
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize bg-slate-100">
                      {user.role}
                    </span>
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
