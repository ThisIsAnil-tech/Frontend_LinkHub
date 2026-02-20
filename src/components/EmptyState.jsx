import React from "react";
import "../styles/empty-state.css";

const EmptyState = ({ icon, title, message, action }) => {
  return (
    <div className="empty-state-component">
      <div className="empty-state-icon">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && (
        <button className="empty-state-action" onClick={action.onClick}>
          <i className={`fas fa-${action.icon}`}></i>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;