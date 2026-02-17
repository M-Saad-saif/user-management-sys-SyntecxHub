import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Sidebar.css';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { isAdmin } = useAuth();

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

  return (
    <div className="sidebar">
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
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;