// Employees.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { fetchEmployees } from '../api';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Employees() {
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
      console.error("API error loading employees roster:", err);
      setError("Failed to fetch employee roster records from the R Plumber server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Columns EXACTLY as requested by Task 8
  const columns = [
    {
      header: 'Employee ID',
      accessor: 'EmployeeNumber',
      sortable: true
    },
    {
      header: 'Age',
      accessor: 'Age',
      sortable: true
    },
    {
      header: 'Gender',
      accessor: 'Gender',
      sortable: true,
      render: (row) => (
        <span className={`badge ${row.Gender === 'Female' ? 'info' : 'neutral'}`}>
          {row.Gender}
        </span>
      )
    },
    {
      header: 'Department',
      accessor: 'Department',
      sortable: true
    },
    {
      header: 'Job Role',
      accessor: 'JobRole',
      sortable: true
    },
    {
      header: 'Salary',
      accessor: 'MonthlyIncome',
      sortable: true,
      render: (row) => `₹${row.MonthlyIncome.toLocaleString()}`
    },
    {
      header: 'Experience',
      accessor: 'TotalWorkingYears',
      sortable: true,
      render: (row) => `${row.TotalWorkingYears} Years`
    }
  ];

  if (loading) {
    return (
      <div className="loader-container animate-fade-in">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading employee database...</p>
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
      <div className="page-header">
        <h1 className="page-title">Employee Roster</h1>
        <p className="page-subtitle">Granular database of staff loaded live from R Plumber service.</p>
      </div>

      <DataTable columns={columns} data={employees} itemsPerPage={10} />
    </div>
  );
}
