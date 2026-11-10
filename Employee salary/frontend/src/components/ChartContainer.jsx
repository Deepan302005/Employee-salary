// ChartContainer.jsx
import React, { useState } from 'react';

export default function ChartContainer({ title, type, filters, onFilterChange, children }) {
  const [activeFilter, setActiveFilter] = useState(filters && filters[0]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  return (
    <div className="card chart-container animate-fade-in">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {filters && filters.length > 0 && (
          <div className="chart-filters">
            {filters.map((filter, index) => (
              <button
                key={index}
                className={`chart-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="chart-body">
        {children ? children : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No visualization configured.
          </div>
        )}
      </div>
    </div>
  );
}
