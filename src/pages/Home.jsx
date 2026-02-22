import React, { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import LinkCard from "../components/LinkCard";
import "../styles/global.css";
import { motion } from "framer-motion";
import SkeletonCard from "../components/SkeletonCard";
import FloatingAdd from "../components/FloatingAdd";

const Home = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchLinks = async () => {
    try {
      const res = await API.get("/api/links");
      const visibleLinks = res.data.filter(l => l.visible === true);
      setLinks(visibleLinks);
      
      // Extract unique categories from links
      const uniqueCategories = ["All", ...new Set(visibleLinks.map(l => l.category))];
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

  const filteredLinks = links
    .filter(l => selectedCategory === "All" || l.category === selectedCategory)
    .filter(l => l.siteName.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Navbar />
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">
            <i className="fas fa-link"></i> Anil's Links
          </h1>
          <p className="hero-subtitle">Discover and share amazing links</p>
        </div>

        <div className="search-section">
          <div className="search-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              placeholder="Search links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="clear-search" onClick={() => setSearch("")}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {categories.length > 1 && (
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className={`fas fa-${showFilters ? 'times' : 'filter'}`}></i>
              {showFilters ? 'Hide' : 'Show'} Categories
            </button>
          )}

          {showFilters && categories.length > 1 && (
            <motion.div 
              className="category-filters"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "All" ? (
                    <><i className="fas fa-globe"></i> All</>
                  ) : (
                    <><i className="fas fa-tag"></i> {category}</>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {!loading && filteredLinks.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <h3>No links found</h3>
            <p>Try adjusting your search</p>
          </div>
        )}

        <div className="cards-container">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : filteredLinks.map(link => (
                <LinkCard key={link._id} link={link} isPublic={true} />
              ))
          }
        </div>
      </div>
      <FloatingAdd />
    </motion.div>
  );
};

export default Home;
