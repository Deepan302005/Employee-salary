// EmployeeDirectory.jsx - Module 5
import React, { useState, useEffect, useMemo } from 'react';
import DataTable from '../components/DataTable';
import { fetchEmployees } from '../api';
import { Users, AlertCircle, RotateCcw, Filter, Search, Eye, X, User, Briefcase, Calendar, DollarSign, Award, Heart } from 'lucide-react';

export default function EmployeeDirectory() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedEmployeeModal, setSelectedEmployeeModal] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Error loading employee roster:", err);
      setError("Could not connect to backend service to fetch employee directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const uniqueRoles = useMemo(() => {
    const roles = Array.from(new Set(employees.map(e => e.JobRole).filter(Boolean)));
    return roles.sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // 1. Search Query
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesId = String(emp.EmployeeNumber).includes(query);
        const matchesRole = emp.JobRole ? emp.JobRole.toLowerCase().includes(query) : false;
        const matchesDept = emp.Department ? emp.Department.toLowerCase().includes(query) : false;
        if (!matchesId && !matchesRole && !matchesDept) return false;
      }

      // 2. Department
      if (selectedDept !== 'All' && emp.Department !== selectedDept) return false;
      
      // 3. Gender
      if (selectedGender !== 'All' && emp.Gender !== selectedGender) return false;

      // 4. Role
      if (selectedRole !== 'All' && emp.JobRole !== selectedRole) return false;

      return true;
    });
  }, [employees, searchTerm, selectedDept, selectedGender, selectedRole]);

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'EmployeeNumber',
      sortable: true,
      render: (row) => (
        <span style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>
          #{row.EmployeeNumber}
        </span>
      )
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
        <span className={`badge ${row.Gender === 'Female' ? 'female' : 'male'}`}>
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
      header: 'Monthly Income',
      accessor: 'MonthlyIncome',
      sortable: true,
      render: (row) => (
        <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>
          ₹{row.MonthlyIncome.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Experience',
      accessor: 'TotalWorkingYears',
      sortable: true,
      render: (row) => `${row.TotalWorkingYears} Years`
    },
    {
      header: 'Action',
      accessor: 'actions',
      sortable: false,
      render: (row) => (
        <button 
          onClick={() => setSelectedEmployeeModal(row)}
          style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: 'var(--accent-primary)',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Eye size={13} />
          View
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="loader-container animate-fade-in">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Employee Directory...</p>
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
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Users size={24} />
            </div>
            <h1 className="page-title" style={{ margin: 0 }}>Employee Directory</h1>
          </div>
          <p className="page-subtitle" style={{ marginTop: '4px' }}>
            Comprehensive searchable and filterable database table of all 1,470+ active employee records.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <span>Total Database Records: <strong style={{ color: '#fff' }}>{employees.length}</strong></span>
        </div>
      </div>

      {/* Directory Search & Filters Panel */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <Filter size={18} style={{ color: '#3b82f6' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: '#fff' }}>Search & Filter Directory</h3>
        </div>

        <div className="filters-bar">
          <div className="filter-group" style={{ flexGrow: 2 }}>
            <span className="filter-label">Search Query</span>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search by ID, Job Role, Department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-select"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Department</span>
            <select className="filter-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="All">All Departments</option>
              <option value="Research & Development">Research & Development</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Gender</span>
            <select className="filter-select" value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="All">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Job Role</span>
            <select className="filter-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="All">All Roles</option>
              {uniqueRoles.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedDept !== 'All' || selectedGender !== 'All' || selectedRole !== 'All') && (
            <button 
              className="reset-filters-btn" 
              onClick={() => { setSearchTerm(''); setSelectedDept('All'); setSelectedGender('All'); setSelectedRole('All'); }}
            >
              <RotateCcw size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Directory Table */}
      <DataTable columns={columns} data={filteredEmployees} itemsPerPage={10} />

      {/* Employee Details Modal */}
      {selectedEmployeeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: '500px', width: '100%', borderColor: 'var(--accent-primary)', position: 'relative' }}>
            <button 
              onClick={() => setSelectedEmployeeModal(null)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                #{selectedEmployeeModal.EmployeeNumber}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>
                  Employee #{selectedEmployeeModal.EmployeeNumber}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--accent-primary)' }}>
                  {selectedEmployeeModal.JobRole} • {selectedEmployeeModal.Department}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>AGE</span><div>{selectedEmployeeModal.Age} Years</div></div>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>GENDER</span><div>{selectedEmployeeModal.Gender}</div></div>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>MONTHLY SALARY</span><div style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>₹{selectedEmployeeModal.MonthlyIncome.toLocaleString()}</div></div>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>MARITAL STATUS</span><div>{selectedEmployeeModal.MaritalStatus || 'N/A'}</div></div>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>TOTAL EXPERIENCE</span><div>{selectedEmployeeModal.TotalWorkingYears} Years</div></div>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>COMPANY TENURE</span><div>{selectedEmployeeModal.YearsAtCompany} Years</div></div>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>JOB SATISFACTION</span><div>{selectedEmployeeModal.JobSatisfaction ? `${selectedEmployeeModal.JobSatisfaction} / 4` : 'N/A'}</div></div>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>PERFORMANCE RATING</span><div>{selectedEmployeeModal.PerformanceRating ? `${selectedEmployeeModal.PerformanceRating} / 4` : 'N/A'}</div></div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'right' }}>
              <button 
                onClick={() => setSelectedEmployeeModal(null)}
                style={{
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
