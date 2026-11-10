// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DepartmentAnalysis from './pages/DepartmentAnalysis';
import SalaryDistribution from './pages/SalaryDistribution';
import ExperienceAnalytics from './pages/ExperienceAnalytics';
import GenderAnalytics from './pages/GenderAnalytics';
import EmployeeDirectory from './pages/EmployeeDirectory';
import Profile from './pages/Profile';
import ErrorPage from './pages/ErrorPage';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content Layout */}
        <div className="main-content">
          <Navbar onToggleSidebar={toggleSidebar} />
          
          <main className="page-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/departments" element={<DepartmentAnalysis />} />
              <Route path="/salary-distribution" element={<SalaryDistribution />} />
              <Route path="/experience" element={<ExperienceAnalytics />} />
              <Route path="/gender-diversity" element={<GenderAnalytics />} />
              <Route path="/employees" element={<EmployeeDirectory />} />
              <Route path="/profile" element={<Profile />} />
              {/* Catch-all Route for unmatched urls */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
