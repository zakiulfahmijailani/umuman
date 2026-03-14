export default function OwnerTransactionsPage() {
  const dummyTransactions = [
    { id: 'TRX-101', user: 'Andi Kusuma', plan: 'Premium', amount: 'Rp 149.000', date: '14 Mar 2026', status: 'Berhasil' },
    { id: 'TRX-102', user: 'Siti Aminah', plan: 'Eksklusif', amount: 'Rp 299.000', date: '13 Mar 2026', status: 'Berhasil' },
    { id: 'TRX-103', user: 'Budi Santoso', plan: 'Premium', amount: 'Rp 149.000', date: '12 Mar 2026', status: 'Pending' },
    { id: 'TRX-104', user: 'Ratna Sari', plan: 'Eksklusif', amount: 'Rp 299.000', date: '12 Mar 2026', status: 'Berhasil' },
    { id: 'TRX-105', user: 'Deni Setiawan', plan: 'Premium', amount: 'Rp 149.000', date: '10 Mar 2026', status: 'Gagal' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transaksi & Revenue</h1>
        <p className="text-muted-foreground mt-1">
          Pantau semua transaksi pembelian paket dari pengguna.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="font-medium p-4">ID Transaksi</th>
                <th className="font-medium p-4">Nama Pengguna</th>
                <th className="font-medium p-4">Paket</th>
                <th className="font-medium p-4">Jumlah</th>
                <th className="font-medium p-4">Tanggal</th>
                <th className="font-medium p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {dummyTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{trx.id}</td>
                  <td className="p-4">{trx.user}</td>
                  <td className="p-4">{trx.plan}</td>
                  <td className="p-4 font-medium">{trx.amount}</td>
                  <td className="p-4 text-muted-foreground">{trx.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      trx.status === 'Berhasil' ? 'bg-green-100 text-green-800' :
                      trx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {trx.status}
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
