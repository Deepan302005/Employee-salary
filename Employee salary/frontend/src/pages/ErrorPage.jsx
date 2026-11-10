// ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="loader-container animate-fade-in" style={{ textAlign: 'center', padding: '60px 20px', minHeight: '80vh' }}>
      <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycontent: 'center', margin: '0 auto 24px', display: 'flex', justifyContent: 'center' }}>
        <ShieldAlert size={40} />
      </div>
      
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
        Page Not Found
      </h1>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '480px', margin: '0 auto 30px', lineHeight: '1.6' }}>
        The page you are looking for does not exist, has been removed, or has had its name changed. Please return to the dashboard.
      </p>
      
      <Link 
        to="/" 
        className="retry-btn" 
        style={{ 
          background: 'var(--accent-gradient)', 
          color: '#fff', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '12px 24px', 
          borderRadius: '8px', 
          fontWeight: '600',
          boxShadow: 'var(--shadow-glow)'
        }}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}
