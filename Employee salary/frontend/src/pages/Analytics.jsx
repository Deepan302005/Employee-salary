// Analytics.jsx
import React, { useState, useEffect } from 'react';
import ChartContainer from '../components/ChartContainer';
import { fetchExperience, fetchEmployees } from '../api';
import { AlertCircle, RotateCcw, Star } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDept, setSelectedDept] = useState('All');
  
  const [experienceData, setExperienceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDot, setSelectedDot] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [exp, emps] = await Promise.all([
        fetchExperience(selectedDept),
        fetchEmployees(selectedDept)
      ]);
      setExperienceData(exp);
      setEmployees(emps);
    } catch (err) {
      console.error("API error loading analytics data:", err);
      setError("Failed to load experience trends and distribution map from the R Plumber server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDept]);

  if (loading) {
    return (
      <div className="loader-container animate-fade-in">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading analytics charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-banner animate-fade-in">
        <div className="error-title">
          <AlertCircle size={22} />
          <span>API Connection Error</span>
        </div>
        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{error}</p>
        <button className="retry-btn" onClick={loadData} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RotateCcw size={14} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Advanced Salary Analytics</h1>
          <p className="page-subtitle">Interactive analysis of how compensation scales against tenure, role, and satisfaction ratings.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Department Filter:</span>
          <select 
            className="filter-select" 
            value={selectedDept} 
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '13px', width: 'auto' }}
          >
            <option value="All">All Departments</option>
            <option value="Research & Development">Research & Development</option>
            <option value="Sales">Sales</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>
      </div>

      <div className="grid-2">
        {/* Experience vs. Average Salary Trend (Recharts Area Chart) */}
        <ChartContainer title="Salary Scaling by Experience (Tenure-Based)">
          <div style={{ width: '100%' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={experienceData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="TotalWorkingYears" 
                  stroke="var(--text-secondary)" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(v) => `${v} Yr`}
                  minTickGap={20} // Prevents labels from overlapping and going outside bounds
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `₹${v/1000}k`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                  formatter={(value) => [`₹${Math.round(value).toLocaleString()}`, 'Avg Salary']} 
                />
                <Area 
                  type="monotone" 
                  dataKey="AverageSalary" 
                  stroke="var(--accent-secondary)" 
                  strokeWidth={3} 
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Salary Scatter Distribution Chart */}
        <ChartContainer title="Compensation Scatter Plot (Individual Outliers)">
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              *Click on any node to view individual employee compensation details
            </span>
            <div className="scatter-plot-container">
              {employees.map((emp, idx) => {
                // Map Age to X axis (range: 18 - 60)
                const xPct = ((emp.Age - 18) / (60 - 18)) * 88 + 6;
                // Map Income to Y axis (range: 1000 - 20000)
                const yPct = ((emp.MonthlyIncome - 1000) / (20000 - 1000)) * 85 + 5;
                
                return (
                  <div
                    key={idx}
                    className="scatter-dot"
                    style={{
                      left: `${xPct}%`,
                      bottom: `${yPct}%`,
                      backgroundColor: emp.Gender === 'Female' ? '#ec4899' : '#3b82f6'
                    }}
                    onClick={() => setSelectedDot(emp)}
                    title={`Age: ${emp.Age}, Salary: ₹${emp.MonthlyIncome}`}
                  />
                );
              })}
            </div>
            
            {/* Scatter X-Y Axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Age: 18</span>
              <span>Age: 35</span>
              <span>Age: 60</span>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Selected Outlier Detail Panel */}
      {selectedDot && (
        <div className="card animate-fade-in" style={{ borderColor: 'var(--accent-primary)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '16px' }}>
              <Star size={18} style={{ color: 'var(--accent-warning)' }} />
              Employee Profile Details: ID #{selectedDot.EmployeeNumber}
            </h4>
            <button 
              onClick={() => setSelectedDot(null)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}
            >
              Clear Selection
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Job Title:</strong> <span style={{ color: '#fff' }}>{selectedDot.JobRole}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Department:</strong> <span style={{ color: '#fff' }}>{selectedDot.Department}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Monthly Income:</strong> <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>₹{selectedDot.MonthlyIncome.toLocaleString()}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Experience:</strong> <span style={{ color: '#fff' }}>{selectedDot.TotalWorkingYears} Years</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Company Tenure:</strong> <span style={{ color: '#fff' }}>{selectedDot.YearsAtCompany} Years</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
