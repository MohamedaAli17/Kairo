import { teamMembers } from "@/lib/mock-data";

export default function TeamPage() {
  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Team</h1>
        <p className="mt-1 text-sm text-muted">Your AI teammates in this simulation</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <div key={member.name} className="q-card">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-sm font-bold text-accent-dark">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-ink">{member.name}</p>
                <p className="text-xs text-muted">{member.role}</p>
              </div>
            </div>
            <span
              className={`q-chip mt-4 ${
                member.status === "You"
                  ? "bg-accent-soft text-accent-dark"
                  : member.status === "Online"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-black/[0.05] text-muted"
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
