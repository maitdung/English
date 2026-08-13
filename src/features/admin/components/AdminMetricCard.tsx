import type { AdminMetricTone } from "../types/admin";

type AdminMetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: AdminMetricTone;
};

const toneClasses: Record<
  AdminMetricTone,
  {
    accent: string;
    icon: string;
    glow: string;
  }
> = {
  cyan: {
    accent: "text-cyan-300",
    icon: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    glow: "bg-cyan-400/10",
  },
  emerald: {
    accent: "text-emerald-300",
    icon: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    glow: "bg-emerald-400/10",
  },
  violet: {
    accent: "text-violet-300",
    icon: "border-violet-400/20 bg-violet-400/10 text-violet-200",
    glow: "bg-violet-400/10",
  },
  amber: {
    accent: "text-amber-300",
    icon: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    glow: "bg-amber-400/10",
  },
};

function AdminMetricCard({
  label,
  value,
  detail,
  icon,
  tone,
}: AdminMetricCardProps) {
  const classes = toneClasses[tone];

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/65 p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 sm:p-6">
      <div
        aria-hidden="true"
        className={`absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition group-hover:scale-125 ${classes.glow}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-white">
            {value}
          </p>
        </div>

        <span
          aria-hidden="true"
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-xl ${classes.icon}`}
        >
          {icon}
        </span>
      </div>

      <p
        className={`relative mt-5 text-xs font-bold leading-5 ${classes.accent}`}
      >
        {detail}
      </p>
    </article>
  );
}

export default AdminMetricCard;
