import React, { useState, useContext } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/form.css";

const AdminSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newEmail: "",
    newPassword: ""
  });
  const [confirm, setConfirm] = useState("");

  const {
    accent, setAccent,
    gradient, setGradient
  } = useContext(ThemeContext);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await API.put("/admin/update", form);
      toast.success("Updated successfully");
      
      setForm({
        currentPassword: "",
        newEmail: "",
        newPassword: ""
      });
      setConfirm("");
      
      // Don't collapse after update - let user see success message
    } catch {
      toast.error("Update failed");
    }
  };

  const toggleSettings = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setForm({
        currentPassword: "",
        newEmail: "",
        newPassword: ""
      });
      setConfirm("");
    }
  };

  // Gradient options
  const gradientOptions = [
    { value: "default", label: "Soft Blue", colors: ["#667eea", "#764ba2"] },
    { value: "sunset", label: "Sunset", colors: ["#ffecd2", "#fcb69f"] },
    { value: "night", label: "Dark Ocean", colors: ["#141e30", "#243b55"] },
    { value: "mint", label: "Mint", colors: ["#d4fc79", "#96e6a1"] },
    { value: "ocean", label: "Ocean", colors: ["#2193b0", "#6dd5ed"] },
    { value: "peach", label: "Peach", colors: ["#ff6b6b", "#feca57"] },
    { value: "purple", label: "Purple Haze", colors: ["#8e2de2", "#4a00e0"] },
    { value: "forest", label: "Forest", colors: ["#134e5e", "#71b280"] }
  ];

  return (
    <div className="settings-container">
      <div className="settings-header" onClick={toggleSettings}>
        <div className="settings-title">
          <i className={`fas fa-${isOpen ? 'chevron-down' : 'chevron-right'}`}></i>
          <h3>
            <i className="fas fa-cog"></i> Admin Settings & Customization
          </h3>
        </div>
        <button 
          className="settings-toggle"
          type="button"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          <i className={`fas fa-${isOpen ? 'minus' : 'plus'}`}></i>
        </button>
      </div>

      {isOpen && (
        <div className="settings-form">
          {/* Account Settings Section */}
          <div className="settings-section">
            <h4 className="section-subtitle">
              <i className="fas fa-user-shield"></i> Account Settings
            </h4>
            <form onSubmit={submit}>
              <div className="form-group">
                <label>
                  <i className="fas fa-lock"></i> Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-envelope"></i> New Email
                  </label>
                  <input
                    type="email"
                    name="newEmail"
                    placeholder="Enter new email"
                    value={form.newEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-key"></i> New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={form.newPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-check-circle"></i> Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary">
                <i className="fas fa-save"></i> Update Account
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="settings-divider">
            <span>UI CUSTOMIZATION</span>
          </div>

          {/* UI Customization Section */}
          <div className="settings-section">
            <h4 className="section-subtitle">
              <i className="fas fa-palette"></i> Appearance Settings
            </h4>
            
            {/* Accent Color Picker */}
            <div className="form-group">
              <label>
                <i className="fas fa-droplet"></i> Accent Color
              </label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  placeholder="#6366f1"
                  className="color-input"
                />
              </div>
              <div className="color-presets">
                {['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
                  <button
                    key={color}
                    className="color-preset"
                    style={{ backgroundColor: color }}
                    onClick={() => setAccent(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Background Gradient Selector */}
            <div className="form-group">
              <label>
                <i className="fas fa-image"></i> Background Style
              </label>
              <div className="gradient-grid">
                {gradientOptions.map(option => (
                  <button
                    key={option.value}
                    className={`gradient-card ${gradient === option.value ? 'active' : ''}`}
                    onClick={() => setGradient(option.value)}
                    style={{
                      background: `linear-gradient(135deg, ${option.colors[0]}, ${option.colors[1]})`
                    }}
                  >
                    <span>{option.label}</span>
                    {gradient === option.value && (
                      <i className="fas fa-check-circle"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div className="preview-section">
              <h5>
                <i className="fas fa-eye"></i> Live Preview
              </h5>
              <div 
                className="preview-card"
                style={{
                  borderLeft: `4px solid ${accent}`,
                  background: `linear-gradient(135deg, ${gradientOptions.find(g => g.value === gradient)?.colors[0] || '#667eea'}, ${gradientOptions.find(g => g.value === gradient)?.colors[1] || '#764ba2'})`
                }}
              >
                <div className="preview-content">
                  <div className="preview-dot" style={{ background: accent }}></div>
                  <div>
                    <strong style={{ color: gradient === 'night' ? 'white' : 'inherit' }}>
                      Preview Style
                    </strong>
                    <p style={{ color: gradient === 'night' ? '#ccc' : 'inherit' }}>
                      Your links will look great with this theme!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;