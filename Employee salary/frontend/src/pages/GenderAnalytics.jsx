// GenderAnalytics.jsx - Gender & Diversity Page with Dynamic Filter & Interactive Cards
import React, { useState, useEffect, useMemo } from 'react';
import ChartContainer from '../components/ChartContainer';
import DataTable from '../components/DataTable';
import { fetchEmployees } from '../api';
import { PieChart as PieChartIcon, AlertCircle, RotateCcw, Filter, Users, Scale, CheckCircle2, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function GenderAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedGenderFilter, setSelectedGenderFilter] = useState('All');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Error loading gender analytics:", err);
      setError("Could not connect to API backend service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const genderMetrics = useMemo(() => {
    const femaleEmps = employees.filter(e => e.Gender === 'Female');
    const maleEmps = employees.filter(e => e.Gender === 'Male');

    const femaleAvg = femaleEmps.length > 0 ? femaleEmps.reduce((sum, e) => sum + e.MonthlyIncome, 0) / femaleEmps.length : 0;
    const maleAvg = maleEmps.length > 0 ? maleEmps.reduce((sum, e) => sum + e.MonthlyIncome, 0) / maleEmps.length : 0;

    const total = employees.length;
    const femalePct = total > 0 ? ((femaleEmps.length / total) * 100).toFixed(1) : 0;
    const malePct = total > 0 ? ((maleEmps.length / total) * 100).toFixed(1) : 0;

    let gapPct = 0;
    let gapText = 'Equal Baseline Parity';
    if (femaleAvg > maleAvg && maleAvg > 0) {
      gapPct = (((femaleAvg - maleAvg) / maleAvg) * 100).toFixed(1);
      gapText = `Female avg is ${gapPct}% higher`;
    } else if (maleAvg > femaleAvg && femaleAvg > 0) {
      gapPct = (((maleAvg - femaleAvg) / femaleAvg) * 100).toFixed(1);
      gapText = `Male avg is ${gapPct}% higher`;
    }

    return {
      femaleCount: femaleEmps.length,
      femalePct,
      femaleAvg: Math.round(femaleAvg),
      maleCount: maleEmps.length,
      malePct,
      maleAvg: Math.round(maleAvg),
      gapPct,
      gapText
    };
  }, [employees]);

  const pieData = useMemo(() => [
    { Gender: 'Female', Count: genderMetrics.femaleCount, AvgSalary: genderMetrics.femaleAvg },
    { Gender: 'Male', Count: genderMetrics.maleCount, AvgSalary: genderMetrics.maleAvg }
  ], [genderMetrics]);

  const deptGenderData = useMemo(() => {
    const depts = ['Research & Development', 'Sales', 'Human Resources'];
    return depts.map(dept => {
      const fEmps = employees.filter(e => e.Department === dept && e.Gender === 'Female');
      const mEmps = employees.filter(e => e.Department === dept && e.Gender === 'Male');

      const fAvg = fEmps.length > 0 ? fEmps.reduce((s, e) => s + e.MonthlyIncome, 0) / fEmps.length : 0;
      const mAvg = mEmps.length > 0 ? mEmps.reduce((s, e) => s + e.MonthlyIncome, 0) / mEmps.length : 0;

      return {
        Department: dept,
        FemaleAvg: Math.round(fAvg),
        MaleAvg: Math.round(mAvg)
      };
    });
  }, [employees]);

  // Filtered dataset for staff table & dynamic view response
  const filteredEmployees = useMemo(() => {
    if (selectedGenderFilter === 'All') return employees;
    return employees.filter(e => e.Gender === selectedGenderFilter);
  }, [employees, selectedGenderFilter]);

  const tableColumns = [
    { header: 'Employee ID', accessor: 'EmployeeNumber', sortable: true },
    { header: 'Gender', accessor: 'Gender', sortable: true, render: (row) => (
      <span className={`badge ${row.Gender === 'Female' ? 'female' : 'male'}`}>{row.Gender}</span>
    )},
    { header: 'Age', accessor: 'Age', sortable: true },
    { header: 'Department', accessor: 'Department', sortable: true },
    { header: 'Job Role', accessor: 'JobRole', sortable: true },
    { header: 'Monthly Income', accessor: 'MonthlyIncome', sortable: true, render: (row) => `₹${row.MonthlyIncome.toLocaleString()}` }
  ];

  if (loading) {
    return (
      <div className="loader-container animate-fade-in">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Gender Analytics...</p>
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
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <PieChartIcon size={24} />
            </div>
            <h1 className="page-title" style={{ margin: 0 }}>Gender & Diversity</h1>
          </div>
          <p className="page-subtitle" style={{ marginTop: '4px' }}>
            Workforce demographic ratios, equal pay parity evaluation, and gender compensation metrics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Filter size={16} style={{ color: '#ec4899' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Select Gender:</span>
          <select 
            className="filter-select" 
            value={selectedGenderFilter} 
            onChange={(e) => setSelectedGenderFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '13px', width: 'auto' }}
          >
            <option value="All">All Genders</option>
            <option value="Female">Female Staff Only</option>
            <option value="Male">Male Staff Only</option>
          </select>
        </div>
      </div>

      {/* Interactive Gender Comparison KPI Cards */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        
        {/* Female Workforce Card */}
        <div 
          className={`card ${selectedGenderFilter === 'Female' ? 'active-card' : ''}`}
          onClick={() => setSelectedGenderFilter(selectedGenderFilter === 'Female' ? 'All' : 'Female')}
          style={{ 
            cursor: 'pointer',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            border: selectedGenderFilter === 'Female' ? '2px solid #ec4899' : '1px solid var(--border-color)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>FEMALE WORKFORCE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {selectedGenderFilter === 'Female' && <CheckCircle2 size={16} style={{ color: '#ec4899' }} />}
              <Users size={18} style={{ color: '#ec4899' }} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {genderMetrics.femaleCount.toLocaleString()} <span style={{ fontSize: '14px', color: '#ec4899' }}>({genderMetrics.femalePct}%)</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            Average Salary: <strong style={{ color: 'var(--accent-success)' }}>₹{genderMetrics.femaleAvg.toLocaleString()}</strong>
          </div>
        </div>

        {/* Male Workforce Card */}
        <div 
          className={`card ${selectedGenderFilter === 'Male' ? 'active-card' : ''}`}
          onClick={() => setSelectedGenderFilter(selectedGenderFilter === 'Male' ? 'All' : 'Male')}
          style={{ 
            cursor: 'pointer',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            border: selectedGenderFilter === 'Male' ? '2px solid #3b82f6' : '1px solid var(--border-color)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>MALE WORKFORCE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {selectedGenderFilter === 'Male' && <CheckCircle2 size={16} style={{ color: '#3b82f6' }} />}
              <Users size={18} style={{ color: '#3b82f6' }} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {genderMetrics.maleCount.toLocaleString()} <span style={{ fontSize: '14px', color: '#3b82f6' }}>({genderMetrics.malePct}%)</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            Average Salary: <strong style={{ color: 'var(--accent-success)' }}>₹{genderMetrics.maleAvg.toLocaleString()}</strong>
          </div>
        </div>

        {/* Dynamic Pay Parity & Gender Segment Breakdown Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
              {selectedGenderFilter === 'All' ? 'PAY PARITY COMPARISON' : `${selectedGenderFilter.toUpperCase()} SEGMENT INSIGHT`}
            </span>
            <Scale size={18} style={{ color: '#ec4899' }} />
          </div>

          <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {selectedGenderFilter === 'All' && genderMetrics.gapText}
            {selectedGenderFilter === 'Female' && `₹${genderMetrics.femaleAvg.toLocaleString()} / mo avg`}
            {selectedGenderFilter === 'Male' && `₹${genderMetrics.maleAvg.toLocaleString()} / mo avg`}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            {selectedGenderFilter === 'All' && 'Overall differential margin across base monthly income'}
            {selectedGenderFilter === 'Female' && `${genderMetrics.femaleCount} active female staff (${genderMetrics.femalePct}% of workforce)`}
            {selectedGenderFilter === 'Male' && `${genderMetrics.maleCount} active male staff (${genderMetrics.malePct}% of workforce)`}
          </div>
        </div>

      </div>

      {/* Main Gender Visualizations */}
      <div className="grid-2">
        <ChartContainer title={`Employees by Gender (${selectedGenderFilter === 'All' ? 'Overall Workforce' : selectedGenderFilter + ' Filtered'})`}>
          <div className="mock-pie-chart" style={{ width: '100%', height: '260px', gap: '20px' }}>
            <div style={{ flexGrow: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="Count"
                    nameKey="Gender"
                  >
                    <Cell fill="#ec4899" opacity={selectedGenderFilter === 'All' || selectedGenderFilter === 'Female' ? 1 : 0.25} />
                    <Cell fill="#3b82f6" opacity={selectedGenderFilter === 'All' || selectedGenderFilter === 'Male' ? 1 : 0.25} />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} 
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend" style={{ minWidth: '160px' }}>
              {pieData.map((d, idx) => {
                const isSelected = selectedGenderFilter === 'All' || selectedGenderFilter === d.Gender;
                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedGenderFilter(selectedGenderFilter === d.Gender ? 'All' : d.Gender)}
                    className="legend-item" 
                    style={{ 
                      cursor: 'pointer',
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '2px', 
                      marginBottom: '12px',
                      opacity: isSelected ? 1 : 0.4
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="legend-color" style={{ backgroundColor: idx === 0 ? '#ec4899' : '#3b82f6' }}></div>
                      <span style={{ fontWeight: '600', color: '#fff' }}>{d.Gender}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '20px' }}>
                      {d.Count.toLocaleString()} staff (₹{d.AvgSalary.toLocaleString()} avg)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartContainer>

        <ChartContainer title="Department Gender Average Salary Comparison">
          <div style={{ width: '100%' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={deptGenderData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="Department" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Avg Income']} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
                {(selectedGenderFilter === 'All' || selectedGenderFilter === 'Female') && (
                  <Bar dataKey="FemaleAvg" name="Female Avg" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={35} />
                )}
                {(selectedGenderFilter === 'All' || selectedGenderFilter === 'Male') && (
                  <Bar dataKey="MaleAvg" name="Male Avg" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={35} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      {/* Staff Roster */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#fff' }}>
          Gender Segment Roster ({filteredEmployees.length} staff)
        </h3>
        <DataTable columns={tableColumns} data={filteredEmployees} itemsPerPage={5} />
      </div>

    </div>
  );
}
