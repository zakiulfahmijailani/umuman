export default function OwnerUsersPage() {
  const dummyUsers = [
    { id: 'USR-001', name: 'Andi Kusuma', email: 'andi@example.com', plan: 'Premium', joined: '1 Jan 2026', status: 'Aktif' },
    { id: 'USR-002', name: 'Siti Aminah', email: 'siti@example.com', plan: 'Eksklusif', joined: '15 Jan 2026', status: 'Aktif' },
    { id: 'USR-003', name: 'Budi Santoso', email: 'budi@example.com', plan: 'Free', joined: '10 Mar 2026', status: 'Aktif' },
    { id: 'USR-004', name: 'Ratna Sari', email: 'ratna@example.com', plan: 'Eksklusif', joined: '12 Mar 2026', status: 'Aktif' },
    { id: 'USR-005', name: 'Deni Setiawan', email: 'deni@spam.com', plan: 'Free', joined: '13 Mar 2026', status: 'Suspended' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
        <p className="text-muted-foreground mt-1">
          Daftar seluruh pengguna platform umuman.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="font-medium p-4">ID</th>
                <th className="font-medium p-4">Nama</th>
                <th className="font-medium p-4">Email</th>
                <th className="font-medium p-4">Paket</th>
                <th className="font-medium p-4">Bergabung</th>
                <th className="font-medium p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {dummyUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground text-xs">{user.id}</td>
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.plan}</td>
                  <td className="p-4 text-muted-foreground">{user.joined}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
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
