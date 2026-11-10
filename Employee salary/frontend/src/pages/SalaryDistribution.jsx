// SalaryDistribution.jsx - Module 2 with Interactive Salary Spread Range Scale & Details Breakdown
import React, { useState, useEffect, useMemo } from 'react';
import ChartContainer from '../components/ChartContainer';
import DataTable from '../components/DataTable';
import { fetchEmployees } from '../api';
import { BarChart2, AlertCircle, RotateCcw, Filter, DollarSign, Layers, CheckCircle2, Sliders, Info, Users, User, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function SalaryDistribution() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedTier, setSelectedTier] = useState('All');

  // Interactive Range Scale Slider state
  const [activeQuartileKey, setActiveQuartileKey] = useState('median'); // 'min' | 'q1' | 'median' | 'q3' | 'max' | 'custom'
  const [sliderValue, setSliderValue] = useState(4919);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Error loading salary distribution:", err);
      setError("Could not connect to backend service to load salary distribution.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute Overall Histogram Distribution Buckets
  const histogramData = useMemo(() => {
    if (employees.length === 0) return [];
    const under5 = employees.filter(emp => emp.MonthlyIncome < 5000).length;
    const fiveToTen = employees.filter(emp => emp.MonthlyIncome >= 5000 && emp.MonthlyIncome < 10000).length;
    const tenToFifteen = employees.filter(emp => emp.MonthlyIncome >= 10000 && emp.MonthlyIncome < 15000).length;
    const overFifteen = employees.filter(emp => emp.MonthlyIncome >= 15000).length;
    return [
      { range: '< ₹5k', key: 'under5', count: under5, pct: ((under5/employees.length)*100).toFixed(1) },
      { range: '₹5k - ₹10k', key: '5to10', count: fiveToTen, pct: ((fiveToTen/employees.length)*100).toFixed(1) },
      { range: '₹10k - ₹15k', key: '10to15', count: tenToFifteen, pct: ((tenToFifteen/employees.length)*100).toFixed(1) },
      { range: '> ₹15k', key: 'over15', count: overFifteen, pct: ((overFifteen/employees.length)*100).toFixed(1) }
    ];
  }, [employees]);

  // Compute Department x Salary Tier Variation dataset
  const deptSalaryVariation = useMemo(() => {
    const brackets = [
      { label: '< ₹5k', filter: e => e.MonthlyIncome < 5000 },
      { label: '₹5k - ₹10k', filter: e => e.MonthlyIncome >= 5000 && e.MonthlyIncome < 10000 },
      { label: '₹10k - ₹15k', filter: e => e.MonthlyIncome >= 10000 && e.MonthlyIncome < 15000 },
      { label: '> ₹15k', filter: e => e.MonthlyIncome >= 15000 }
    ];

    return brackets.map(b => {
      const bEmps = employees.filter(b.filter);
      const rndCount = bEmps.filter(e => e.Department === 'Research & Development').length;
      const salesCount = bEmps.filter(e => e.Department === 'Sales').length;
      const hrCount = bEmps.filter(e => e.Department === 'Human Resources').length;

      return {
        range: b.label,
        'Research & Development': rndCount,
        'Sales': salesCount,
        'Human Resources': hrCount
      };
    });
  }, [employees]);

  // Compute Statistical Quartiles for Box Plot
  const statsData = useMemo(() => {
    if (employees.length === 0) return null;
    const incomes = employees.map(e => e.MonthlyIncome).sort((a, b) => a - b);
    const min = incomes[0];
    const max = incomes[incomes.length - 1];

    const getPercentile = (arr, percentile) => {
      const idx = (arr.length - 1) * percentile;
      const base = Math.floor(idx);
      const rest = idx - base;
      if (arr[base + 1] !== undefined) {
        return arr[base] + rest * (arr[base + 1] - arr[base]);
      }
      return arr[base];
    };

    const q1 = getPercentile(incomes, 0.25);
    const median = getPercentile(incomes, 0.50);
    const q3 = getPercentile(incomes, 0.75);

    return { min, q1, median, q3, max };
  }, [employees]);

  // Sync sliderValue with median on initial load
  useEffect(() => {
    if (statsData && activeQuartileKey === 'median') {
      setSliderValue(Math.round(statsData.median));
    }
  }, [statsData]);

  // Handle clicking specific quartile button
  const handleSelectQuartile = (key) => {
    setActiveQuartileKey(key);
    if (!statsData) return;
    if (key === 'min') setSliderValue(Math.round(statsData.min));
    if (key === 'q1') setSliderValue(Math.round(statsData.q1));
    if (key === 'median') setSliderValue(Math.round(statsData.median));
    if (key === 'q3') setSliderValue(Math.round(statsData.q3));
    if (key === 'max') setSliderValue(Math.round(statsData.max));
  };

  // Compute breakdown details for the currently active slider value
  const selectedThresholdDetails = useMemo(() => {
    if (employees.length === 0) return null;
    const currentVal = sliderValue;

    const underEmps = employees.filter(e => e.MonthlyIncome <= currentVal);
    const overEmps = employees.filter(e => e.MonthlyIncome > currentVal);
    const nearEmps = employees
      .filter(e => Math.abs(e.MonthlyIncome - currentVal) <= 1500)
      .slice(0, 4);

    const total = employees.length;
    const underPct = ((underEmps.length / total) * 100).toFixed(1);
    const overPct = ((overEmps.length / total) * 100).toFixed(1);

    let quartileLabel = 'Custom Range Position';
    if (statsData) {
      if (Math.abs(currentVal - statsData.min) < 50) quartileLabel = 'Minimum Base (0th Percentile)';
      else if (Math.abs(currentVal - statsData.q1) < 150) quartileLabel = 'Q1 Bracket (25th Percentile)';
      else if (Math.abs(currentVal - statsData.median) < 150) quartileLabel = 'Median Benchmark (50th Percentile)';
      else if (Math.abs(currentVal - statsData.q3) < 200) quartileLabel = 'Q3 Bracket (75th Percentile)';
      else if (Math.abs(currentVal - statsData.max) < 200) quartileLabel = 'Maximum Scale (100th Percentile)';
    }

    return {
      threshold: currentVal,
      label: quartileLabel,
      underCount: underEmps.length,
      underPct,
      overCount: overEmps.length,
      overPct,
      nearEmps
    };
  }, [employees, sliderValue, statsData]);

  // Filter employees according to selected salary tier
  const filteredEmployees = useMemo(() => {
    if (selectedTier === 'All') return employees;
    if (selectedTier === 'under5') return employees.filter(e => e.MonthlyIncome < 5000);
    if (selectedTier === '5to10') return employees.filter(e => e.MonthlyIncome >= 5000 && e.MonthlyIncome < 10000);
    if (selectedTier === '10to15') return employees.filter(e => e.MonthlyIncome >= 10000 && e.MonthlyIncome < 15000);
    if (selectedTier === 'over15') return employees.filter(e => e.MonthlyIncome >= 15000);
    return employees;
  }, [employees, selectedTier]);

  const renderBoxPlot = () => {
    if (!statsData) return null;
    const { min, q1, median, q3, max } = statsData;
    const minBound = 1000;
    const maxBound = 20000;
    
    const getX = (val) => 10 + ((val - minBound) / (maxBound - minBound)) * 80;

    const xMin = getX(min);
    const xQ1 = getX(q1);
    const xMedian = getX(median);
    const xQ3 = getX(q3);
    const xMax = getX(max);
    const xCurrent = getX(sliderValue);

    return (
      <div style={{ padding: '10px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Interactive Point Selector Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'min', label: 'Min', val: Math.round(min) },
            { key: 'q1', label: 'Q1 (25%)', val: Math.round(q1) },
            { key: 'median', label: 'Median (50%)', val: Math.round(median) },
            { key: 'q3', label: 'Q3 (75%)', val: Math.round(q3) },
            { key: 'max', label: 'Max', val: Math.round(max) },
          ].map((pt) => {
            const isSel = activeQuartileKey === pt.key;
            return (
              <button
                key={pt.key}
                onClick={() => handleSelectQuartile(pt.key)}
                style={{
                  background: isSel ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isSel ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  color: isSel ? '#fff' : 'var(--text-secondary)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexGrow: 1
                }}
              >
                {pt.label}: ₹{pt.val.toLocaleString()}
              </button>
            );
          })}
        </div>

        {/* Interactive SVG Box Plot */}
        <svg width="100%" height="70" style={{ overflow: 'visible' }}>
          <line x1={`${xMin}%`} y1="35" x2={`${xMax}%`} y2="35" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="4 4" />
          <rect x={`${xQ1}%`} y="15" width={`${Math.max(xQ3 - xQ1, 1)}%`} height="40" fill="url(#boxColor)" stroke="var(--accent-primary)" strokeWidth="2" rx="4" />
          <line x1={`${xMedian}%`} y1="15" x2={`${xMedian}%`} y2="55" stroke="#fff" strokeWidth="3" />
          
          {/* Active Handle Indicator */}
          <circle cx={`${xCurrent}%`} cy="35" r="8" fill="#10b981" stroke="#fff" strokeWidth="2" />
          <line x1={`${xCurrent}%`} y1="5" x2={`${xCurrent}%`} y2="65" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />

          <defs>
            <linearGradient id="boxColor" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </svg>

        {/* Interactive Drag Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sliders size={13} style={{ color: 'var(--accent-success)' }} />
              Drag range scale slider to adjust salary threshold:
            </span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-success)' }}>
              Selected: ₹{sliderValue.toLocaleString()} / mo
            </span>
          </div>

          <input 
            type="range"
            min={1000}
            max={20000}
            step={250}
            value={sliderValue}
            onChange={(e) => {
              setSliderValue(Number(e.target.value));
              setActiveQuartileKey('custom');
            }}
            style={{
              width: '100%',
              accentColor: 'var(--accent-success)',
              cursor: 'pointer',
              height: '6px'
            }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>₹1,000 / mo</span>
            <span>₹10,000 / mo</span>
            <span>₹20,000 / mo</span>
          </div>
        </div>

      </div>
    );
  };

  const tableColumns = [
    { header: 'Employee ID', accessor: 'EmployeeNumber', sortable: true },
    { header: 'Age', accessor: 'Age', sortable: true },
    { header: 'Gender', accessor: 'Gender', sortable: true, render: (row) => (
      <span className={`badge ${row.Gender === 'Female' ? 'info' : 'neutral'}`}>{row.Gender}</span>
    )},
    { header: 'Department', accessor: 'Department', sortable: true },
    { header: 'Job Role', accessor: 'JobRole', sortable: true },
    { header: 'Salary', accessor: 'MonthlyIncome', sortable: true, render: (row) => `₹${row.MonthlyIncome.toLocaleString()}` }
  ];

  if (loading) {
    return (
      <div className="loader-container animate-fade-in">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Salary Distribution...</p>
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
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-success)' }}>
              <BarChart2 size={24} />
            </div>
            <h1 className="page-title" style={{ margin: 0 }}>Salary Distribution</h1>
          </div>
          <p className="page-subtitle" style={{ marginTop: '4px' }}>
            Income bracket breakdown, department variations by salary tier, and quartile salary spread analysis.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Layers size={16} style={{ color: 'var(--accent-success)' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Salary Tier:</span>
          <select 
            className="filter-select" 
            value={selectedTier} 
            onChange={(e) => setSelectedTier(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '13px', width: 'auto' }}
          >
            <option value="All">All Salary Ranges</option>
            <option value="under5">&lt; ₹5,000 / month</option>
            <option value="5to10">₹5,000 - ₹10,000 / month</option>
            <option value="10to15">₹10,000 - ₹15,000 / month</option>
            <option value="over15">&gt; ₹15,000 / month</option>
          </select>
        </div>
      </div>

      {/* Salary Tier Cards */}
      <div className="grid-4">
        {histogramData.map((item, idx) => (
          <div 
            key={idx} 
            className={`card ${selectedTier === item.key ? 'active-card' : ''}`}
            onClick={() => setSelectedTier(selectedTier === item.key ? 'All' : item.key)}
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px',
              border: selectedTier === item.key ? '2px solid var(--accent-success)' : '1px solid var(--border-color)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>{item.range}</span>
              <CheckCircle2 size={16} style={{ color: selectedTier === item.key ? 'var(--accent-success)' : 'transparent' }} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-heading)' }}>
              {item.count.toLocaleString()}
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '4px' }}>staff</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--accent-success)', fontWeight: '500' }}>
              {item.pct}% of workforce
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2">
        {/* Department x Salary Tier Variation Bar Chart */}
        <ChartContainer title="Salary Distribution Variations BY Department">
          <div style={{ width: '100%' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={deptSalaryVariation} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="range" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Research & Development" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Sales" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Human Resources" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Interactive Salary Spread Box Plot & Range Slider */}
        <ChartContainer title="Interactive Salary Spread Scale & Quartile Selector">
          {renderBoxPlot()}
        </ChartContainer>
      </div>

      {/* SEPARATE DEDICATED BREAKDOWN CARD FOR SELECTED SALARY THRESHOLD */}
      {selectedThresholdDetails && (
        <div className="card animate-fade-in" style={{ borderColor: 'var(--accent-success)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={20} style={{ color: 'var(--accent-success)' }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>
                  Selected Threshold Breakdown: {selectedThresholdDetails.label}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Detailed analysis for salary point ₹{selectedThresholdDetails.threshold.toLocaleString()} / month
                </span>
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-success)' }}>
              ₹{selectedThresholdDetails.threshold.toLocaleString()}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowDownRight size={14} style={{ color: '#f87171' }} /> Earn Below / Equal Threshold
              </span>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>
                {selectedThresholdDetails.underCount.toLocaleString()} <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>staff ({selectedThresholdDetails.underPct}%)</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpRight size={14} style={{ color: '#34d399' }} /> Earn Above Threshold
              </span>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>
                {selectedThresholdDetails.overCount.toLocaleString()} <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>staff ({selectedThresholdDetails.overPct}%)</span>
              </div>
            </div>
          </div>

          {/* Representative Staff Members at this salary mark */}
          {selectedThresholdDetails.nearEmps.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} style={{ color: 'var(--accent-primary)' }} />
                Representative Employees Near ₹{selectedThresholdDetails.threshold.toLocaleString()}/mo:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {selectedThresholdDetails.nearEmps.map((emp, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '2px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold' }}>
                      <span>#{emp.EmployeeNumber} • {emp.JobRole}</span>
                      <span style={{ color: 'var(--accent-success)' }}>₹{emp.MonthlyIncome.toLocaleString()}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>{emp.Department} • {emp.TotalWorkingYears} Yrs Exp</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Employee List for Filtered Tier */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#fff' }}>
          Employees in Selected Salary Bracket ({filteredEmployees.length} staff)
        </h3>
        <DataTable columns={tableColumns} data={filteredEmployees} itemsPerPage={5} />
      </div>

    </div>
  );
}
