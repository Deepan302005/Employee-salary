// Sidebar.jsx - Sidebar Navigation
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  BarChart2, 
  TrendingUp, 
  PieChart, 
  Users
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-text">
          <TrendingUp size={24} />
          <span>SalaryAnalytics</span>
        </div>
      </div>
      
      <ul className="sidebar-menu">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={toggleSidebar}
            end
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li style={{ marginTop: '12px', paddingLeft: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          Analysis Views
        </li>

        <li>
          <NavLink 
            to="/departments" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={toggleSidebar}
          >
            <Building2 size={18} />
            <span>Department Analysis</span>
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/salary-distribution" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={toggleSidebar}
          >
            <BarChart2 size={18} />
            <span>Salary Distribution</span>
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/experience" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={toggleSidebar}
          >
            <TrendingUp size={18} />
            <span>Experience Scaling</span>
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/gender-diversity" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={toggleSidebar}
          >
            <PieChart size={18} />
            <span>Gender & Diversity</span>
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/employees" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={toggleSidebar}
          >
            <Users size={18} />
            <span>Employee Directory</span>
          </NavLink>
        </li>
      </ul>
      
      <div className="sidebar-footer">
        <p>Employee Salary App v2.0</p>
      </div>
    </aside>
  );
}
