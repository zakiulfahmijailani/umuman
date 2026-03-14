export default function OwnerSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Platform</h1>
        <p className="text-muted-foreground mt-1">
          Konfigurasi global untuk aplikasi umuman.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 pb-4 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Informasi Dasar</h3>
            <p className="text-sm text-muted-foreground mt-1.5">Nama dan kontak platform.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nama Platform</label>
              <input type="text" readOnly defaultValue="umuman" className="flex h-10 w-full md:max-w-md rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email Kontak Resmi</label>
              <input type="text" readOnly defaultValue="admin@umuman.com" className="flex h-10 w-full md:max-w-md rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Wa Customer Service</label>
              <input type="text" readOnly defaultValue="+62 8211 9955 112" className="flex h-10 w-full md:max-w-md rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 pb-4 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Feature Toggles</h3>
            <p className="text-sm text-muted-foreground mt-1.5">Aktifkan atau matikan fitur tertentu secara global.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm">Mode Maintenance</p>
                <p className="text-sm text-muted-foreground">Tampilkan halaman maintenance untuk semua user non-admin.</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-slate-200 relative cursor-not-allowed opacity-50">
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm">Pendaftaran Baru</p>
                <p className="text-sm text-muted-foreground">Izinkan user baru untuk register.</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-primary relative cursor-not-allowed opacity-50">
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm">Payment Gateway (Midtrans)</p>
                <p className="text-sm text-muted-foreground">Terima pembayaran otomatis.</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-primary relative cursor-not-allowed opacity-50">
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
