import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function AnalyticsCharts({ leads }) {
  // 1. Lead Status Donut Data
  const statusCounts = leads.reduce((acc, lead) => {
    const status = lead.status || 'New';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const STATUS_COLORS = {
    'New': '#94a3b8',       // Slate 400
    'Contacted': '#38bdf8', // Sky 400
    'Nurturing': '#a78bfa', // Violet 400
    'Qualified': '#818cf8', // Indigo 400
    'Closed-Won': '#34d399', // Emerald 400
    'Closed-Lost': '#f87171' // Red 400
  };

  // 2. Industry Avg AI Score Data
  const industryStats = leads.reduce((acc, lead) => {
    const ind = lead.industry || 'Unknown';
    const score = lead.aiScore || 0;
    if (!acc[ind]) {
      acc[ind] = { totalScore: 0, count: 0 };
    }
    // Only count if scored
    if (lead.aiScore !== null) {
      acc[ind].totalScore += score;
      acc[ind].count += 1;
    }
    return acc;
  }, {});

  const industryData = Object.keys(industryStats)
    .map(ind => ({
      industry: ind,
      avgScore: industryStats[ind].count > 0 
        ? Math.round(industryStats[ind].totalScore / industryStats[ind].count) 
        : 0,
      count: industryStats[ind].count
    }))
    .filter(item => item.avgScore > 0)
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5); // top 5 industries

  // Custom tooltips to match glassmorphic dashboard
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-xl shadow-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {payload[0].name || payload[0].payload.industry || 'Lead Count'}
          </p>
          <p className="text-sm font-bold text-white mt-1">
            {payload[0].value} {payload[0].name ? 'Leads' : 'Avg AI Score'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Lead Status Distribution Donut */}
      <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md">
        <h3 className="title-font text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
          <span>Lead Status Distribution</span>
          <span className="text-xs font-normal text-slate-400 dark:text-slate-500">Pipeline Stages</span>
        </h3>
        <div className="h-64 flex items-center justify-center">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.name] || '#8b5cf6'} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-slate-400">No status metrics available</div>
          )}
        </div>
      </div>

      {/* Average AI Score by Industry Bar Chart */}
      <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md">
        <h3 className="title-font text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
          <span>Lead Scoring Analytics</span>
          <span className="text-xs font-normal text-slate-400 dark:text-slate-500">Avg AI Score by Vertical</span>
        </h3>
        <div className="h-64">
          {industryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={industryData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  dataKey="industry" 
                  type="category" 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="avgScore" 
                  radius={[0, 6, 6, 0]} 
                  barSize={12}
                >
                  {industryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="url(#barGradient)" 
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.95} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Run AI Score on leads to populate industry vertical analytics
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
