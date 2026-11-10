// KPICards.jsx
import React from 'react';
import { Users, IndianRupee, ArrowUpRight, Award } from 'lucide-react';

export default function KPICards({ data }) {
  // Destructure metrics with defaults to ensure it renders before API connection
  const {
    totalEmployees = 1470,
    avgSalary = 6502.93,
    highestSalary = 19999,
    lowestSalary = 1009,
  } = data || {};

  const kpis = [
    {
      title: 'Total Employees',
      value: totalEmployees.toLocaleString(),
      icon: <Users size={22} />,
      colorClass: 'blue',
      trend: '+4.2% from last quarter',
      trendType: 'positive',
    },
    {
      title: 'Average Salary',
      value: `₹${avgSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <IndianRupee size={22} />,
      colorClass: 'green',
      trend: '+1.5% salary increase',
      trendType: 'positive',
    },
    {
      title: 'Highest Salary',
      value: `₹${highestSalary.toLocaleString()}`,
      icon: <ArrowUpRight size={22} />,
      colorClass: 'purple',
      trend: 'Job Level 5 Peak',
      trendType: 'neutral',
    },
    {
      title: 'Lowest Salary',
      value: `₹${lowestSalary.toLocaleString()}`,
      icon: <Award size={22} />,
      colorClass: 'orange',
      trend: 'Minimum wage check OK',
      trendType: 'positive',
    },
  ];

  return (
    <div className="grid-4 animate-fade-in">
      {kpis.map((kpi, idx) => (
        <div key={idx} className={`card kpi-card ${kpi.colorClass}`}>
          <div className="kpi-details">
            <span className="kpi-title">{kpi.title}</span>
            <span className="kpi-value">{kpi.value}</span>
            <div className={`kpi-trend ${kpi.trendType}`}>
              <span>{kpi.trend}</span>
            </div>
          </div>
          <div className="kpi-icon-wrapper">
            {kpi.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
