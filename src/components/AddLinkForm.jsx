import React, { useState, useEffect } from "react";
import API from "../api/api";
import "../styles/form.css";
import toast from "react-hot-toast";
import IconButton from "./IconButton";

const AddLinkForm = ({ onAdded, existingCategories = [] }) => {
  const [isOpen, setIsOpen] = useState(true); // Default open since it's a form
  const [form, setForm] = useState({
    siteName: "",
    username: "",
    profileLink: "",
    logo: null,
    category: "",
    visible: true,
    newCategory: ""
  });
  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    setCategories([...new Set([...existingCategories])]);
  }, [existingCategories]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowNewCategory(true);
      setForm({...form, category: ""});
    } else {
      setShowNewCategory(false);
      setForm({...form, category: value});
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    
    let finalCategory = form.category;
    if (showNewCategory && form.newCategory.trim()) {
      finalCategory = form.newCategory.trim();
    }

    if (!finalCategory) {
      toast.error("Please select or enter a category");
      return;
    }

    const formData = new FormData();
    formData.append("siteName", form.siteName);
    formData.append("username", form.username);
    formData.append("profileLink", form.profileLink);
    formData.append("category", finalCategory);
    formData.append("visible", form.visible);
    if (form.logo) {
      formData.append("logo", form.logo);
    }

    try {
      await API.post("/links/add", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Link added successfully!");
      setForm({
        siteName: "",
        username: "",
        profileLink: "",
        logo: null,
        category: "",
        visible: true,
        newCategory: ""
      });
      setShowNewCategory(false);
      
      if (showNewCategory && finalCategory && !categories.includes(finalCategory)) {
        setCategories([...categories, finalCategory]);
      }
      
      if (onAdded) onAdded();
    } catch (err) {
      toast.error("Error adding link");
    }
  };

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="settings-container">
      <div className="settings-header" onClick={toggleForm}>
        <div className="settings-title">
          <i className={`fas fa-${isOpen ? 'chevron-down' : 'chevron-right'}`}></i>
          <h3>
            <i className="fas fa-plus-circle"></i> Add New Link
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
          <form onSubmit={submitForm}>
            {/* Basic Information Section */}
            <div className="settings-section">
              <h4 className="section-subtitle">
                <i className="fas fa-info-circle"></i> Basic Information
              </h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-globe"></i> Site Name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    placeholder="e.g., LinkedIn, GitHub, Twitter"
                    value={form.siteName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-user"></i> Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Your username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-link"></i> Profile Link
                </label>
                <input
                  type="url"
                  name="profileLink"
                  placeholder="https://..."
                  value={form.profileLink}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Divider */}
            <div className="settings-divider">
              <span>MEDIA & CATEGORY</span>
            </div>

            {/* Logo Upload Section */}
            <div className="settings-section">
              <h4 className="section-subtitle">
                <i className="fas fa-image"></i> Logo Upload
              </h4>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-upload"></i> Site Logo (PNG only)
                </label>
                <div className="file-input-wrapper">
                  <input
                    id="logo-upload"
                    type="file"
                    name="logo"
                    accept="image/png"
                    onChange={(e) => setForm({...form, logo: e.target.files[0]})}
                    className="file-input"
                  />
                  <label htmlFor="logo-upload" className="file-label">
                    <i className="fas fa-cloud-upload-alt"></i> 
                    {form.logo ? ' Change Logo' : ' Choose Logo'}
                  </label>
                  {form.logo && (
                    <div className="file-preview">
                      <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                      <span className="file-name">{form.logo.name}</span>
                      <button
                        type="button"
                        className="file-remove"
                        onClick={() => setForm({...form, logo: null})}
                        title="Remove"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="settings-divider">
              <span>ORGANIZATION</span>
            </div>

            {/* Category Selection */}
            <div className="settings-section">
              <h4 className="section-subtitle">
                <i className="fas fa-folder"></i> Category
              </h4>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-tag"></i> Select or Create Category
                </label>
                
                {!showNewCategory ? (
                  <select
                    value={form.category}
                    onChange={handleCategorySelect}
                    required
                    className="category-select"
                  >
                    <option value="">-- Choose a category --</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="new" className="new-category-option">
                      ➕ Create New Category
                    </option>
                  </select>
                ) : (
                  <div className="new-category-wrapper">
                    <input
                      type="text"
                      name="newCategory"
                      placeholder="Enter new category name"
                      value={form.newCategory}
                      onChange={handleChange}
                      autoFocus
                      required
                      className="new-category-input"
                    />
                    <button 
                      type="button" 
                      className="cancel-new"
                      onClick={() => {
                        setShowNewCategory(false);
                        setForm({...form, category: "", newCategory: ""});
                      }}
                      title="Cancel"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="settings-divider">
              <span>VISIBILITY</span>
            </div>

            {/* Visibility Settings */}
            <div className="settings-section">
              <h4 className="section-subtitle">
                <i className="fas fa-eye"></i> Display Settings
              </h4>
              
              <div className="form-group">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={form.visible}
                    onChange={(e) => setForm({...form, visible: e.target.checked})}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom">
                    <i className={`fas fa-${form.visible ? 'eye' : 'eye-slash'}`}></i>
                  </span>
                  <span className="checkbox-label">
                    {form.visible ? 'Visible' : 'Hidden'} on public page
                  </span>
                </label>
              </div>
            </div>

            {/* Preview Section */}
            <div className="preview-section">
              <h5>
                <i className="fas fa-eye"></i> Link Preview
              </h5>
              <div className="preview-card link-preview">
                <div className="preview-content">
                  <div className="preview-logo">
                    {form.logo ? (
                      <img 
                        src={URL.createObjectURL(form.logo)} 
                        alt="logo preview"
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                      />
                    ) : (
                      <i className="fas fa-link" style={{ fontSize: '24px', opacity: 0.5 }}></i>
                    )}
                  </div>
                  <div className="preview-details">
                    <strong>{form.siteName || 'Site Name'}</strong>
                    <p>{form.username || 'username'}</p>
                  </div>
                  <span className="preview-category">
                    {form.category || 'category'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <i className="fas fa-plus-circle"></i> Add Link
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setForm({
                    siteName: "",
                    username: "",
                    profileLink: "",
                    logo: null,
                    category: "",
                    visible: true,
                    newCategory: ""
                  });
                  setShowNewCategory(false);
                }}
              >
                <i className="fas fa-undo"></i> Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddLinkForm;