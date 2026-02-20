import React, { useState } from "react";
import "../styles/contact.css";

const ContactInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contact = {
    name: "Anil A",
    emails: [
      "thisisaniltech@outlook.com",
      "thisisaniltech@gmail.com"
    ]
  };

  const toggleContact = () => {
    setIsOpen(!isOpen);
  };

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="contact-container">
      <button 
        className={`contact-button ${isOpen ? 'active' : ''}`}
        onClick={toggleContact}
        title="Contact Info"
      >
        <i className="fas fa-envelope"></i>
        <span className="contact-badge">2</span>
      </button>

      {isOpen && (
        <div className="contact-popup">
          <div className="contact-header">
            <i className="fas fa-user-circle"></i>
            <div>
              <h4>{contact.name}</h4>
              <p>Click email to send message</p>
            </div>
            <button className="close-popup" onClick={toggleContact}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="contact-emails">
            {contact.emails.map((email, index) => (
              <div 
                key={index} 
                className="email-item"
                onClick={() => handleEmailClick(email)}
              >
                <i className="fas fa-envelope-open-text"></i>
                <span>{email}</span>
                <i className="fas fa-external-link-alt go-icon"></i>
              </div>
            ))}
          </div>

          <div className="contact-footer">
            <i className="fas fa-info-circle"></i>
            <span>Click "Go" to open in mail app</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;