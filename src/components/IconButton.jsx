import React from "react";
import "../styles/icons.css";

const IconButton = ({ icon, onClick, title, type = "button", className = "" }) => {
  return (
    <button 
      className={`icon-btn ${className}`} 
      onClick={onClick} 
      title={title} 
      type={type}
    >
      <i className={`fas fa-${icon}`}></i>
    </button>
  );
};

export default IconButton;