import { teamMembers } from "@/lib/mock-data";

export default function TeamPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Team</h1>
        <p className="mt-1 text-sm text-slate-500">Your AI teammates in this simulation</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <div key={member.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{member.name}</p>
                <p className="text-xs text-slate-500">{member.role}</p>
              </div>
            </div>
            <span
              className={`mt-4 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                member.status === "You"
                  ? "bg-indigo-100 text-indigo-700"
                  : member.status === "Online"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
