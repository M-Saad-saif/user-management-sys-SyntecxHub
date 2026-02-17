import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h1>Welcome, {user?.employee?.fullName || user?.email}</h1>
      </div>
      <div className="navbar-right">
        <div className="user-info">
          <span className="user-role">{user?.role?.toUpperCase()}</span>
        </div>
        <Button variant="danger" size="small" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;