import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AddLinkForm from "../components/AddLinkForm";
import LinkCard from "../components/LinkCard";
import API from "../api/api";
import "../styles/admin.css";
import IconButton from "../components/IconButton";
import AdminSettings from "../components/AdminSettings";
import SkeletonCard from "../components/SkeletonCard";
import Analytics from "../components/Analytics";

const AdminDashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");

  const fetchLinks = async () => {
    try {
      const res = await API.get("/links");
      const sorted = res.data.sort(
        (a, b) => (b.clicks || 0) - (a.clicks || 0)
      );
      setLinks(sorted);
      
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(res.data.map(l => l.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  const filteredLinks = filterCategory === "All" 
    ? links 
    : links.filter(l => l.category === filterCategory);

  return (
    <div>
      <Navbar />
      <div className="admin-wrapper">
        <div className="admin-top">
          <h1>
            <i className="fas fa-chart-line"></i> Admin Dashboard
          </h1>
          <IconButton
            icon="sign-out-alt"
            title="Logout"
            onClick={logout}
          />
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section full-width">
            <Analytics links={links}/>
          </div>
          <div className="dashboard-section full-width">
            <AdminSettings />
          </div>
          <div className="dashboard-section full-width">
            <AddLinkForm onAdded={fetchLinks} existingCategories={categories.filter(c => c !== "All")} />
          </div>
        </div>

        <div className="admin-controls">
          <h2 className="section-title">
            <i className="fas fa-link"></i> Your Links
          </h2>
          
          {categories.length > 1 && (
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-chip ${filterCategory === category ? 'active' : ''}`}
                  onClick={() => setFilterCategory(category)}
                >
                  {category === "All" ? (
                    <><i className="fas fa-globe"></i> All</>
                  ) : (
                    <><i className="fas fa-tag"></i> {category}</>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="cards-container">
          {loading
            ? [...Array(4)].map((_, i) => (
                <SkeletonCard key={i}/>
              ))
            : filteredLinks.length > 0 ? (
                filteredLinks.map(link => (
                  <LinkCard
                    key={link._id}
                    link={link}
                    onDelete={fetchLinks}
                    isPublic={false}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-folder-open"></i>
                  <p>No links in this category yet.</p>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;