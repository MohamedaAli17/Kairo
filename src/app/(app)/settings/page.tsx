import { currentUser } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your simulation preferences</p>
      </header>

      <div className="max-w-xl space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Profile</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-500">Display name</span>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-500">Email</span>
              <input
                type="email"
                defaultValue="alex@example.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Simulation</h2>
          <label className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-700">Difficulty</span>
            <select className="rounded-lg border border-slate-200 px-3 py-1.5">
              <option>Internship prep</option>
              <option>Junior SWE prep</option>
            </select>
          </label>
          <label className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-700">Email notifications</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
          </label>
        </section>

        <button type="button" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
          Save changes
        </button>
      </div>
    </div>
  );
}
