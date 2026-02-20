import React, { useState } from "react";
import "../styles/tooltip.css";

const Tooltip = ({ children, text, position = "top" }) => {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`tooltip tooltip-${position}`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;