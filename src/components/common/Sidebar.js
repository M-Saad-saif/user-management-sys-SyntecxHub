import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Sidebar.css';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/employees', label: 'Employees', icon: '👥' },
    { path: '/admin/departments', label: 'Departments', icon: '🏢' },
    { path: '/admin/leaves', label: 'Leaves', icon: '📝' },
    { path: '/admin/salary', label: 'Salary', icon: '💰' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ];

  const employeeLinks = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/employee/apply-leave', label: 'Apply Leave', icon: '📝' },
    { path: '/employee/leave-history', label: 'Leave History', icon: '📋' },
    { path: '/employee/settings', label: 'Settings', icon: '⚙️' }
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
        document.body.classList.remove('sidebar-open');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
      document.body.classList.remove('sidebar-open');
    }
  }, [ isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  };

  const closeSidebar = () => {
    setIsOpen(false);
    document.body.classList.remove('sidebar-open');
  };

  // Add main-content class to parent layout
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (isOpen) {
        mainContent.classList.add('sidebar-open');
      } else {
        mainContent.classList.remove('sidebar-open');
      }
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        )}
      </button>

      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>EMS</h2>
          <p>Employee Management</p>
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? closeSidebar : undefined}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;