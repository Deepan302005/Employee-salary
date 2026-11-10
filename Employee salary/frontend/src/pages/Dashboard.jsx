// Dashboard.jsx - Executive Dashboard with Visual Hero & System Highlights
import React, { useState, useEffect, useMemo } from 'react';
import KPICards from '../components/KPICards';
import { fetchEmployees } from '../api';
import heroImg from '../assets/analytics_hero.jpg';
import { 
  Building2, 
  BarChart2, 
  TrendingUp, 
  PieChart, 
  Users, 
  AlertCircle, 
  RotateCcw, 
  BadgeInfo,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  Activity,
  DollarSign
} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("API error loading dashboard:", err);
      setError("Could not establish a connection to the backend server. Please make sure R Plumber is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const kpiData = useMemo(() => {
    if (employees.length === 0) {
      return { totalEmployees: 0, avgSalary: 0, highestSalary: 0, lowestSalary: 0 };
    }
    const salaries = employees.map(e => e.MonthlyIncome);
    return {
      totalEmployees: employees.length,
      avgSalary: salaries.reduce((sum, s) => sum + s, 0) / employees.length,
      highestSalary: Math.max(...salaries),
      lowestSalary: Math.min(...salaries)
    };
  }, [employees]);

  // Department Distribution Breakdown
  const deptStats = useMemo(() => {
    if (employees.length === 0) return [];
    const depts = ['Research & Development', 'Sales', 'Human Resources'];
    return depts.map(dept => {
      const emps = employees.filter(e => e.Department === dept);
      const avg = emps.length > 0 ? emps.reduce((s, e) => s + e.MonthlyIncome, 0) / emps.length : 0;
      const pct = ((emps.length / employees.length) * 100).toFixed(1);
      return {
        name: dept,
        count: emps.length,
        avg: Math.round(avg),
        pct
      };
    });
  }, [employees]);

  // Top Earning Job Roles
  const topRoles = useMemo(() => {
    if (employees.length === 0) return [];
    const rolesMap = {};
    employees.forEach(emp => {
      if (!rolesMap[emp.JobRole]) {
        rolesMap[emp.JobRole] = { count: 0, totalSalary: 0, dept: emp.Department };
      }
      rolesMap[emp.JobRole].count += 1;
      rolesMap[emp.JobRole].totalSalary += emp.MonthlyIncome;
    });

    return Object.keys(rolesMap)
      .map(role => ({
        role,
        count: rolesMap[role].count,
        dept: rolesMap[role].dept,
        avgSalary: Math.round(rolesMap[role].totalSalary / rolesMap[role].count)
      }))
      .sort((a, b) => b.avgSalary - a.avgSalary)
      .slice(0, 4);
  }, [employees]);

  // Salary Tier Progress Percentages
  const salaryTiers = useMemo(() => {
    if (employees.length === 0) return [];
    const total = employees.length;
    const under5 = employees.filter(e => e.MonthlyIncome < 5000).length;
    const five10 = employees.filter(e => e.MonthlyIncome >= 5000 && e.MonthlyIncome < 10000).length;
    const ten15 = employees.filter(e => e.MonthlyIncome >= 10000 && e.MonthlyIncome < 15000).length;
    const over15 = employees.filter(e => e.MonthlyIncome >= 15000).length;

    return [
      { range: '< ₹5,000', count: under5, pct: ((under5/total)*100).toFixed(1), color: '#10b981' },
      { range: '₹5,000 - ₹10,000', count: five10, pct: ((five10/total)*100).toFixed(1), color: '#6366f1' },
      { range: '₹10,000 - ₹15,000', count: ten15, pct: ((ten15/total)*100).toFixed(1), color: '#8b5cf6' },
      { range: '> ₹15,000', count: over15, pct: ((over15/total)*100).toFixed(1), color: '#ec4899' }
    ];
  }, [employees]);

  if (loading) {
    return (
      <div className="loader-container animate-fade-in">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Executive Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-banner animate-fade-in">
        <div className="error-title"><AlertCircle size={22} /><span>API Connection Error</span></div>
        <p>{error}</p>
        <button className="retry-btn" onClick={loadData}><RotateCcw size={14} /> Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Visual Welcome Hero Banner with Picture */}
      <div 
        className="card" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px', 
          padding: '24px',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 41, 59, 0.95))',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Compensation Intelligence Platform
            </span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)', margin: 0, lineHeight: '1.2' }}>
            Employee Salary & Payroll Analytics Dashboard
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
            Real-time statistical evaluation of employee compensation metrics, department payroll distributions, experience scaling trajectories, and gender pay equity across 1,470+ workforce records.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px' }}>
            <div className="badge info" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} /> 1,470 Verified Records
            </div>
            <div className="badge success" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} /> 3 Business Divisions
            </div>
            <div className="badge neutral" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} /> Real-Time Analytics
            </div>
          </div>
        </div>

        {/* Hero Illustration Image */}
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.5)', height: '200px' }}>
          <img 
            src={heroImg} 
            alt="Analytics Dashboard Banner" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(17, 24, 39, 0.4), transparent)' }}></div>
        </div>
      </div>

      {/* Top High-level KPIs */}
      <KPICards data={kpiData} />

      {/* Executive Highlights Grid */}
      <div className="grid-2">
        {/* Department Payroll Snapshot */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} style={{ color: '#6366f1' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>
                Department Payroll Summary
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>3 Divisions</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {deptStats.map((dept, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: '600', color: '#fff' }}>{dept.name}</span>
                  <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>₹{dept.avg.toLocaleString()} / mo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{dept.count} active staff ({dept.pct}% of workforce)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${dept.pct}%`, height: '100%', background: idx === 0 ? '#6366f1' : idx === 1 ? '#10b981' : '#ec4899', borderRadius: '3px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Earning Roles Showcase */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: '#f59e0b' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>
                Top Compensation Job Roles
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>By Average Monthly Salary</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topRoles.map((roleItem, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justify: 'space-between', 
                  padding: '10px 12px', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                    #{idx + 1}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{roleItem.role}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{roleItem.dept} • {roleItem.count} staff</span>
                  </div>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent-success)' }}>
                  ₹{roleItem.avgSalary.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Bracket Distribution Concentration Progress Bars */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} style={{ color: 'var(--accent-success)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>
              Workforce Compensation Concentration Brackets
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Salary Range Segmentation</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {salaryTiers.map((tier, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>{tier.range}</span>
                <span style={{ color: tier.color, fontWeight: 'bold' }}>{tier.pct}%</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>
                {tier.count.toLocaleString()} <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>staff</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${tier.pct}%`, height: '100%', background: tier.color, borderRadius: '3px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Insights & Guidance Note */}
      <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <BadgeInfo size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>
            Executive Compensation Insights
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', fontSize: '13px', lineHeight: '1.6' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Department Dynamics</span>
            <p style={{ color: '#fff', margin: '4px 0 0 0' }}>Research & Development maintains the largest workforce volume, while Sales leads in variable commission incentives.</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Salary Progression</span>
            <p style={{ color: '#fff', margin: '4px 0 0 0' }}>Tenure scaling shows steady growth with noticeable salary jumps at 5-year and 10-year experience milestones.</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Gender Parity</span>
            <p style={{ color: '#fff', margin: '4px 0 0 0' }}>Female staff constitute 40.0% of total headcount with compensation aligned closely across job tiers.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
