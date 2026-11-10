// DataTable.jsx
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Download } from 'lucide-react';

export default function DataTable({ columns, data, itemsPerPage = 8 }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Table Filters
  const [deptFilter, setDeptFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    if (!data) return [];
    
    let result = [...data];

    // 1. Apply Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(row => 
        (row.EmployeeNumber && String(row.EmployeeNumber).includes(lowerSearch)) ||
        (row.JobRole && row.JobRole.toLowerCase().includes(lowerSearch)) ||
        (row.Department && row.Department.toLowerCase().includes(lowerSearch))
      );
    }

    // 2. Apply Department Filter
    if (deptFilter !== 'All') {
      result = result.filter(row => row.Department === deptFilter);
    }

    // 3. Apply Gender Filter
    if (genderFilter !== 'All') {
      result = result.filter(row => row.Gender === genderFilter);
    }

    // 4. Apply Experience Filter
    if (expFilter !== 'All') {
      result = result.filter(row => {
        const yrs = row.TotalWorkingYears;
        if (expFilter === 'entry') return yrs <= 2;
        if (expFilter === 'mid') return yrs >= 3 && yrs <= 5;
        if (expFilter === 'senior') return yrs >= 6 && yrs <= 10;
        if (expFilter === 'executive') return yrs > 10;
        return true;
      });
    }

    // 5. Apply Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA === undefined || valB === undefined) return 0;

        if (typeof valA === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        } else {
          return sortConfig.direction === 'asc'
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        }
      });
    }

    return result;
  }, [data, searchTerm, sortConfig, deptFilter, genderFilter, expFilter]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Convert currently filtered list to CSV and trigger browser download
  const handleDownloadCSV = () => {
    if (processedData.length === 0) return;

    // Use actual CSV columns for export mapping
    const headers = ['Employee ID', 'Age', 'Gender', 'Department', 'Job Role', 'Salary', 'Experience'];
    const accessors = ['EmployeeNumber', 'Age', 'Gender', 'Department', 'JobRole', 'MonthlyIncome', 'TotalWorkingYears'];
    
    const csvContent = [
      headers.join(','),
      ...processedData.map(row => 
        accessors.map(accessor => {
          let val = row[accessor];
          if (typeof val === 'string') {
            // Escape double quotes inside strings
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `employee_salary_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card table-container animate-fade-in">
      <div className="table-header">
        <div className="table-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by ID, role, dept..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <div className="table-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Department Filter */}
          <select
            className="table-filter-select"
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Departments</option>
            <option value="Research & Development">Research & Development</option>
            <option value="Sales">Sales</option>
            <option value="Human Resources">Human Resources</option>
          </select>

          {/* Gender Filter */}
          <select
            className="table-filter-select"
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>

          {/* Experience Filter */}
          <select
            className="table-filter-select"
            value={expFilter}
            onChange={(e) => {
              setExpFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Experience</option>
            <option value="entry">Entry-Level (0-2 Yrs)</option>
            <option value="mid">Mid-Level (3-5 Yrs)</option>
            <option value="senior">Senior (6-10 Yrs)</option>
            <option value="executive">Executive (10+ Yrs)</option>
          </select>

          {/* Download CSV Action button */}
          <button
            className="pagination-btn"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              height: '38px', 
              padding: '0 12px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              color: 'var(--accent-primary)',
              fontWeight: '500'
            }}
            onClick={handleDownloadCSV}
            title="Download CSV report"
            disabled={processedData.length === 0}
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} onClick={() => col.sortable && requestSort(col.accessor)} style={{ cursor: col.sortable ? 'pointer' : 'default' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown size={12} style={{ opacity: 0.6 }} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No matching employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="table-pagination">
          <span className="pagination-info">
            Showing {Math.min(processedData.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
            {Math.min(processedData.length, currentPage * itemsPerPage)} of {processedData.length} entries
          </span>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button className="pagination-btn" style={{ background: 'var(--accent-primary)', color: '#fff' }}>
              {currentPage}
            </button>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
