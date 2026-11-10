// DepartmentAnalysis.jsx - Module 1 with Role & Dept Salary Variations
import React, { useState, useEffect, useMemo } from 'react';
import KPICards from '../components/KPICards';
import ChartContainer from '../components/ChartContainer';
import DataTable from '../components/DataTable';
import { fetchEmployees } from '../api';
import { Building2, AlertCircle, RotateCcw, Filter, Award, TrendingUp, Users } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export default function DepartmentAnalysis() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Error loading department analysis:", err);
      setError("Could not connect to R Plumber server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const departmentMetrics = useMemo(() => {
    const deptsList = ['Research & Development', 'Sales', 'Human Resources'];
    return deptsList.map(dept => {
      const deptEmps = employees.filter(e => e.Department === dept);
      const avg = deptEmps.length > 0 ? deptEmps.reduce((sum, e) => sum + e.MonthlyIncome, 0) / deptEmps.length : 0;
      const min = deptEmps.length > 0 ? Math.min(...deptEmps.map(e => e.MonthlyIncome)) : 0;
      const max = deptEmps.length > 0 ? Math.max(...deptEmps.map(e => e.MonthlyIncome)) : 0;
      return {
        Department: dept,
        AverageSalary: Math.round(avg),
        Count: deptEmps.length,
        MinSalary: min,
        MaxSalary: max
      };
    });
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (selectedDept === 'All') return employees;
    return employees.filter(e => e.Department === selectedDept);
  }, [employees, selectedDept]);

  const roleBreakdown = useMemo(() => {
    const targetEmps = selectedDept === 'All' ? employees : employees.filter(e => e.Department === selectedDept);
    const rolesMap = {};
    targetEmps.forEach(emp => {
      if (!rolesMap[emp.JobRole]) {
        rolesMap[emp.JobRole] = { count: 0, totalSalary: 0 };
      }
      rolesMap[emp.JobRole].count += 1;
      rolesMap[emp.JobRole].totalSalary += emp.MonthlyIncome;
    });

    return Object.keys(rolesMap).map(role => ({
      JobRole: role,
      Count: rolesMap[role].count,
      AverageSalary: Math.round(rolesMap[role].totalSalary / rolesMap[role].count)
    })).sort((a, b) => b.AverageSalary - a.AverageSalary);
  }, [employees, selectedDept]);

  const tableColumns = [
    { header: 'Employee ID', accessor: 'EmployeeNumber', sortable: true },
    { header: 'Gender', accessor: 'Gender', sortable: true, render: (row) => (
      <span className={`badge ${row.Gender === 'Female' ? 'female' : 'male'}`}>{row.Gender}</span>
    )},
    { header: 'Department', accessor: 'Department', sortable: true },
    { header: 'Job Role', accessor: 'JobRole', sortable: true },
    { header: 'Salary', accessor: 'MonthlyIncome', sortable: true, render: (row) => `₹${row.MonthlyIncome.toLocaleString()}` },
    { header: 'Experience', accessor: 'TotalWorkingYears', sortable: true, render: (row) => `${row.TotalWorkingYears} Yrs` }
  ];

  if (loading) {
    return (
      <div className="loader-container animate-fade-in">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Department Analysis...</p>
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
      
      {/* Module Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <Building2 size={24} />
            </div>
            <h1 className="page-title" style={{ margin: 0 }}>Department Analysis</h1>
          </div>
          <p className="page-subtitle" style={{ marginTop: '4px' }}>
            Comparative study of average compensation, employee distribution, and job role salary variations by department.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Filter size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Filter Dept:</span>
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

      {/* Department KPI Summary */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {departmentMetrics.map((dept, idx) => {
          const isSelected = selectedDept === dept.Department;
          return (
            <div 
              key={idx} 
              className="card" 
              onClick={() => setSelectedDept(isSelected ? 'All' : dept.Department)}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px', 
                position: 'relative', 
                overflow: 'hidden',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.3)' : 'none',
                opacity: selectedDept === 'All' || isSelected ? 1 : 0.45,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: isSelected ? '#fff' : 'var(--text-muted)' }}>
                  {dept.Department}
                </span>
                <Building2 size={18} style={{ color: idx === 0 ? '#6366f1' : idx === 1 ? '#10b981' : '#ec4899' }} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                ₹{dept.AverageSalary.toLocaleString()}
                <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: '6px' }}>avg/mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                <span>Headcount: <strong>{dept.Count} staff</strong></span>
                <span>Range: ₹{Math.round(dept.MinSalary/1000)}k - ₹{Math.round(dept.MaxSalary/1000)}k</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Department Visualizations */}
      <div className="grid-2">
        <ChartContainer title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>Average Salary by Department (Bar Chart)</span>
            {selectedDept !== 'All' && (
              <button 
                onClick={() => setSelectedDept('All')}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Reset Filter ({selectedDept})
              </button>
            )}
          </div>
        }>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              * Click on any department bar below to isolate and filter specific department metrics
            </span>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={departmentMetrics} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="Department" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Avg Monthly Income']} 
                />
                <Bar 
                  dataKey="AverageSalary" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={60}
                  onClick={(data) => {
                    if (data && data.Department) {
                      setSelectedDept(selectedDept === data.Department ? 'All' : data.Department);
                    }
                  }}
                >
                  {departmentMetrics.map((entry, index) => {
                    const isSelected = selectedDept === 'All' || selectedDept === entry.Department;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#6366f1' : index === 1 ? '#10b981' : '#ec4899'} 
                        opacity={isSelected ? 1 : 0.25}
                        stroke={selectedDept === entry.Department ? '#ffffff' : 'none'}
                        strokeWidth={selectedDept === entry.Department ? 2 : 0}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title={`Job Role Salary Variations (${selectedDept === 'All' ? 'All Depts' : selectedDept})`}>
          <div style={{ width: '100%' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={roleBreakdown.slice(0, 6)} margin={{ top: 10, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" fontSize={10} tickFormatter={(v) => `₹${v/1000}k`} axisLine={false} />
                <YAxis type="category" dataKey="JobRole" stroke="var(--text-secondary)" fontSize={10} tickLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} 
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Avg Salary']} 
                />
                <Bar dataKey="AverageSalary" fill="#8b5cf6" radius={[0, 4, 4, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      {/* Role Breakdown Table within Selected Department */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#fff' }}>
            Job Role Salary Breakdown ({selectedDept === 'All' ? 'All Departments' : selectedDept})
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{roleBreakdown.length} Job Roles</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Role</th>
                <th>Employee Count</th>
                <th>Average Monthly Salary</th>
              </tr>
            </thead>
            <tbody>
              {roleBreakdown.map((role, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '500', color: '#fff' }}>{role.JobRole}</td>
                  <td>{role.Count} staff</td>
                  <td style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>₹{role.AverageSalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filtered Department Roster */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#fff' }}>
          Department Staff Records ({filteredEmployees.length} records)
        </h3>
        <DataTable columns={tableColumns} data={filteredEmployees} itemsPerPage={5} />
      </div>

    </div>
  );
}
