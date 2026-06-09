import { currentUser } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your simulation preferences</p>
      </header>

      <div className="max-w-xl space-y-4">
        <section className="q-card p-6">
          <h2 className="font-semibold text-ink">Profile</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted">Display name</span>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="q-input"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted">Email</span>
              <input
                type="email"
                defaultValue="alex@example.com"
                className="q-input"
              />
            </label>
          </div>
        </section>

        <section className="q-card p-6">
          <h2 className="font-semibold text-ink">Simulation</h2>
          <label className="mt-4 flex items-center justify-between text-sm">
            <span className="text-ink">Difficulty</span>
            <select className="rounded-full border border-black/10 px-4 py-1.5">
              <option>Internship prep</option>
              <option>Junior SWE prep</option>
            </select>
          </label>
          <label className="mt-4 flex items-center justify-between text-sm">
            <span className="text-ink">Email notifications</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-accent" />
          </label>
        </section>

        <button type="button" className="q-btn">
          Save changes
        </button>
      </div>
    </div>
  );
}
