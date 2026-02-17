import React from 'react';
import '../../styles/Dashboard.css';

const Card = ({ title, value, icon, color = 'primary', subtitle }) => {
  return (
    <div className={`dashboard-card ${color}`}>
      <div className="card-content">
        <div className="card-info">
          <h3>{title}</h3>
          <p className="card-value">{value}</p>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {icon && <div className="card-icon">{icon}</div>}
      </div>
    </div>
  );
};

export default Card;