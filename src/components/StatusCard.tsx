import type { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  variant: 'success' | 'warning' | 'danger';
}

export function StatusCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant,
}: StatusCardProps) {
  const colors = {
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    danger: 'text-red-500',
  };

  const borders = {
    success: 'border-emerald-500/20',
    warning: 'border-amber-500/20',
    danger: 'border-red-500/20',
  };

  return (
    <div
      className={`
        bg-noc-card
        p-6
        rounded-2xl
        border
        ${borders[variant]}
        shadow-lg
      `}
    >
      <div className="flex justify-between items-start">
        <Icon
          className={colors[variant]}
          size={24}
        />
      </div>

      <p className="text-slate-400 text-xs uppercase mt-4 tracking-wider">
        {label}
      </p>

      <h3 className="text-3xl font-bold text-white mt-1">
        {value}
      </h3>

      <p className="text-[10px] text-slate-500 mt-1">
        {subtext}
      </p>
    </div>
  );
}