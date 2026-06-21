import React from 'react';
import { Users, Flame, AlertCircle, Snowflake } from 'lucide-react';

export default function DashboardStats({ leads }) {
  const total = leads.length;
  const hot = leads.filter(l => l.aiCategory === 'Hot').length;
  const warm = leads.filter(l => l.aiCategory === 'Warm').length;
  const cold = leads.filter(l => l.aiCategory === 'Cold').length;
  const unscored = leads.filter(l => !l.aiCategory).length;

  const cards = [
    {
      title: 'Total Leads',
      value: total,
      subText: `${unscored} pending AI score`,
      icon: Users,
      colorClass: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
      gradientClass: 'from-violet-500/5 to-indigo-500/5'
    },
    {
      title: 'Hot Leads',
      value: hot,
      subText: total > 0 ? `${Math.round((hot / total) * 100)}% of pipeline` : '0%',
      icon: Flame,
      colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      gradientClass: 'from-rose-500/5 to-orange-500/5'
    },
    {
      title: 'Warm Leads',
      value: warm,
      subText: total > 0 ? `${Math.round((warm / total) * 100)}% of pipeline` : '0%',
      icon: AlertCircle,
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      gradientClass: 'from-amber-500/5 to-yellow-500/5'
    },
    {
      title: 'Cold Leads',
      value: cold,
      subText: total > 0 ? `${Math.round((cold / total) * 100)}% of pipeline` : '0%',
      icon: Snowflake,
      colorClass: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      gradientClass: 'from-sky-500/5 to-blue-500/5'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className={`relative overflow-hidden p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg dark:hover:shadow-violet-950/10 hover:border-violet-500/25 group`}
          >
            {/* Background Accent Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientClass} opacity-60 pointer-events-none`} />

            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans">
                  {card.title}
                </p>
                <h3 className="text-3xl font-bold font-sans tracking-tight text-slate-800 dark:text-white mt-2 group-hover:scale-105 transition-transform duration-300">
                  {card.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl border ${card.colorClass} shadow-sm`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="relative mt-4 flex items-center space-x-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.subText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
