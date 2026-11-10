// ExperienceAnalytics.jsx - Experience Scaling Page
import React, { useState, useEffect, useMemo } from 'react';
import ChartContainer from '../components/ChartContainer';
import DataTable from '../components/DataTable';
import { fetchEmployees } from '../api';
import { TrendingUp, AlertCircle, RotateCcw, Filter, Star, Clock, Circle, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function ExperienceAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedExpTier, setSelectedExpTier] = useState('All');
  const [selectedDeptScatter, setSelectedDeptScatter] = useState('All');
  const [selectedDot, setSelectedDot] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Error loading experience analytics:", err);
      setError("Could not connect to server to load experience dataset.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter employees base dataset according to selected Experience Tier
  const expFilteredEmployees = useMemo(() => {
    if (selectedExpTier === 'entry') return employees.filter(e => e.TotalWorkingYears <= 2);
    if (selectedExpTier === 'mid') return employees.filter(e => e.TotalWorkingYears >= 3 && e.TotalWorkingYears <= 5);
    if (selectedExpTier === 'senior') return employees.filter(e => e.TotalWorkingYears >= 6 && e.TotalWorkingYears <= 10);
    if (selectedExpTier === 'exec') return employees.filter(e => e.TotalWorkingYears >= 11);
    return employees;
  }, [employees, selectedExpTier]);

  // Compute Multi-Line Experience Scaling dataset dynamically filtered by Experience Tier
  const deptExperienceData = useMemo(() => {
    const targetSource = expFilteredEmployees;
    const years = Array.from(new Set(targetSource.map(e => e.TotalWorkingYears))).sort((a, b) => a - b);

    return years.map(yr => {
      const rndEmps = targetSource.filter(e => e.TotalWorkingYears === yr && e.Department === 'Research & Development');
      const salesEmps = targetSource.filter(e => e.TotalWorkingYears === yr && e.Department === 'Sales');
      const hrEmps = targetSource.filter(e => e.TotalWorkingYears === yr && e.Department === 'Human Resources');

      const rndAvg = rndEmps.length > 0 ? rndEmps.reduce((s, e) => s + e.MonthlyIncome, 0) / rndEmps.length : null;
      const salesAvg = salesEmps.length > 0 ? salesEmps.reduce((s, e) => s + e.MonthlyIncome, 0) / salesEmps.length : null;
      const hrAvg = hrEmps.length > 0 ? hrEmps.reduce((s, e) => s + e.MonthlyIncome, 0) / hrEmps.length : null;

      return {
        TotalWorkingYears: yr,
        'Research & Development': rndAvg ? Math.round(rndAvg) : undefined,
        'Sales': salesAvg ? Math.round(salesAvg) : undefined,
        'Human Resources': hrAvg ? Math.round(hrAvg) : undefined
      };
    });
  }, [expFilteredEmployees]);

  // Compute Experience Tier Metrics
  const tierMetrics = useMemo(() => {
    const getTierAvg = (minY, maxY) => {
      const emps = employees.filter(e => e.TotalWorkingYears >= minY && e.TotalWorkingYears <= maxY);
      if (emps.length === 0) return { avg: 0, count: 0 };
      const avg = emps.reduce((sum, e) => sum + e.MonthlyIncome, 0) / emps.length;
      return { avg: Math.round(avg), count: emps.length };
    };

    const entry = getTierAvg(0, 2);
    const mid = getTierAvg(3, 5);
    const senior = getTierAvg(6, 10);
    const exec = getTierAvg(11, 40);

    return [
      { name: 'Entry-Level (0-2 Yrs)', key: 'entry', avg: entry.avg, count: entry.count },
      { name: 'Mid-Level (3-5 Yrs)', key: 'mid', avg: mid.avg, count: mid.count },
      { name: 'Senior (6-10 Yrs)', key: 'senior', avg: senior.avg, count: senior.count },
      { name: 'Executive (10+ Yrs)', key: 'exec', avg: exec.avg, count: exec.count }
    ];
  }, [employees]);

  // Scatter dots dataset dynamically filtered by Experience Tier and Department
  const scatterEmployees = useMemo(() => {
    let source = expFilteredEmployees;
    if (selectedDeptScatter !== 'All') {
      source = source.filter(e => e.Department === selectedDeptScatter);
    }
    return source.slice(0, 350);
  }, [expFilteredEmployees, selectedDeptScatter]);

  const getDeptColor = (dept) => {
    if (dept === 'Research & Development') return '#6366f1';
    if (dept === 'Sales') return '#10b981';
    if (dept === 'Human Resources') return '#ec4899';
    return '#8b5cf6';
  };

  const tableColumns = [
    { header: 'Employee ID', accessor: 'EmployeeNumber', sortable: true },
    { header: 'Age', accessor: 'Age', sortable: true },
    { header: 'Department', accessor: 'Department', sortable: true },
    { header: 'Job Role', accessor: 'JobRole', sortable: true },
    { header: 'Working Experience', accessor: 'TotalWorkingYears', sortable: true, render: (row) => `${row.TotalWorkingYears} Years` },
    { header: 'Years at Company', accessor: 'YearsAtCompany', sortable: true, render: (row) => `${row.YearsAtCompany} Years` },
    { header: 'Monthly Salary', accessor: 'MonthlyIncome', sortable: true, render: (row) => `₹${row.MonthlyIncome.toLocaleString()}` }
  ];

  if (loading) {
    return (
      <div className="loader-container animate-fade-in">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Experience Analytics...</p>
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-secondary)' }}>
              <TrendingUp size={24} />
            </div>
            <h1 className="page-title" style={{ margin: 0 }}>Experience Scaling</h1>
          </div>
          <p className="page-subtitle" style={{ marginTop: '4px' }}>
            Department-wise salary scaling variations by tenure, career progression metrics, and scatter plot inspection.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Clock size={16} style={{ color: 'var(--accent-secondary)' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Experience Tier:</span>
          <select 
            className="filter-select" 
            value={selectedExpTier} 
            onChange={(e) => setSelectedExpTier(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '13px', width: 'auto' }}
          >
            <option value="All">All Experience Levels</option>
            <option value="entry">Entry-Level (0-2 Yrs)</option>
            <option value="mid">Mid-Level (3-5 Yrs)</option>
            <option value="senior">Senior (6-10 Yrs)</option>
            <option value="exec">Executive (10+ Yrs)</option>
          </select>
        </div>
      </div>

      {/* Experience Tier Interactive KPI Cards */}
      <div className="grid-4">
        {tierMetrics.map((tier, idx) => {
          const isSelected = selectedExpTier === tier.key;
          return (
            <div 
              key={idx} 
              className={`card ${isSelected ? 'active-card' : ''}`}
              onClick={() => setSelectedExpTier(isSelected ? 'All' : tier.key)}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                border: isSelected ? '2px solid var(--accent-secondary)' : '1px solid var(--border-color)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>{tier.name}</span>
                <CheckCircle2 size={16} style={{ color: isSelected ? 'var(--accent-secondary)' : 'transparent' }} />
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                ₹{tier.avg.toLocaleString()}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--accent-secondary)' }}>{tier.count} staff records</span>
            </div>
          );
        })}
      </div>

      {/* Experience Line Chart & Scatter Plot */}
      <div className="grid-2">
        {/* Multi-Line Experience Scaling by Department */}
        <ChartContainer title={`Salary Scaling by Experience (${selectedExpTier === 'All' ? 'All Tiers' : selectedExpTier.toUpperCase()})`}>
          <div style={{ width: '100%' }}>
            <ResponsiveContainer width="100%" height={270}>
              <LineChart data={deptExperienceData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="TotalWorkingYears" stroke="var(--text-secondary)" fontSize={11} tickLine={false} tickFormatter={(v) => `${v} Yrs`} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(val, name) => [`₹${val ? val.toLocaleString() : 'N/A'}`, name]} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" connectNulls dataKey="Research & Development" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" connectNulls dataKey="Sales" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" connectNulls dataKey="Human Resources" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Color-Coded Scatter Plot by Department */}
        <ChartContainer title={`Compensation Scatter Plot (${scatterEmployees.length} dots)`}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                *Click any dot to inspect employee details
              </span>

              {/* Department Color Legend & Filter */}
              <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                <span 
                  onClick={() => setSelectedDeptScatter('All')}
                  style={{ cursor: 'pointer', color: selectedDeptScatter === 'All' ? '#fff' : 'var(--text-muted)', fontWeight: selectedDeptScatter === 'All' ? 'bold' : 'normal' }}
                >
                  All
                </span>
                <span 
                  onClick={() => setSelectedDeptScatter('Research & Development')}
                  style={{ cursor: 'pointer', color: '#6366f1', fontWeight: selectedDeptScatter === 'Research & Development' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Circle size={8} fill="#6366f1" /> R&D
                </span>
                <span 
                  onClick={() => setSelectedDeptScatter('Sales')}
                  style={{ cursor: 'pointer', color: '#10b981', fontWeight: selectedDeptScatter === 'Sales' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Circle size={8} fill="#10b981" /> Sales
                </span>
                <span 
                  onClick={() => setSelectedDeptScatter('Human Resources')}
                  style={{ cursor: 'pointer', color: '#ec4899', fontWeight: selectedDeptScatter === 'Human Resources' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Circle size={8} fill="#ec4899" /> HR
                </span>
              </div>
            </div>

            <div className="scatter-plot-container">
              {scatterEmployees.length === 0 ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No records match selected filter.
                </div>
              ) : (
                scatterEmployees.map((emp, idx) => {
                  const minY = selectedExpTier === 'entry' ? 0 : selectedExpTier === 'mid' ? 3 : selectedExpTier === 'senior' ? 6 : selectedExpTier === 'exec' ? 11 : 0;
                  const maxY = selectedExpTier === 'entry' ? 2 : selectedExpTier === 'mid' ? 5 : selectedExpTier === 'senior' ? 10 : selectedExpTier === 'exec' ? 30 : 30;

                  const rangeY = maxY - minY || 1;
                  const xPct = Math.min(((emp.TotalWorkingYears - minY) / rangeY) * 88 + 6, 95);
                  const yPct = Math.min(((emp.MonthlyIncome - 1000) / (20000 - 1000)) * 85 + 5, 95);
                  const color = getDeptColor(emp.Department);
                  return (
                    <div
                      key={idx}
                      className="scatter-dot"
                      style={{
                        left: `${xPct}%`,
                        bottom: `${yPct}%`,
                        backgroundColor: color
                      }}
                      onClick={() => setSelectedDot(emp)}
                      title={`Dept: ${emp.Department}, Exp: ${emp.TotalWorkingYears} Yrs, Salary: ₹${emp.MonthlyIncome}`}
                    />
                  );
                })
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Min Exp in Tier</span>
              <span>Mid Exp</span>
              <span>Max Exp in Tier</span>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Inspector Card */}
      {selectedDot && (
        <div className="card animate-fade-in" style={{ borderColor: getDeptColor(selectedDot.Department) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '16px', margin: 0 }}>
              <Star size={18} style={{ color: 'var(--accent-warning)' }} />
              Inspected Employee Profile: ID #{selectedDot.EmployeeNumber}
            </h4>
            <button onClick={() => setSelectedDot(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}>
              Clear Inspection
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Job Title:</strong> <span style={{ color: '#fff' }}>{selectedDot.JobRole}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Department:</strong> <span style={{ color: getDeptColor(selectedDot.Department), fontWeight: 'bold' }}>{selectedDot.Department}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Monthly Income:</strong> <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>₹{selectedDot.MonthlyIncome.toLocaleString()}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Experience:</strong> <span style={{ color: '#fff' }}>{selectedDot.TotalWorkingYears} Years</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Tenure at Company:</strong> <span style={{ color: '#fff' }}>{selectedDot.YearsAtCompany} Years</span></div>
          </div>
        </div>
      )}

      {/* Roster Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#fff' }}>
          Staff Records in Selected Experience Tier ({expFilteredEmployees.length} staff)
        </h3>
        <DataTable columns={tableColumns} data={expFilteredEmployees} itemsPerPage={5} />
      </div>

    </div>
  );
}
