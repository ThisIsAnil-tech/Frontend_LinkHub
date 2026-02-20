import React, { useState } from "react";
import "../styles/analytics.css";

const Analytics = ({ links }) => {
  const [timeRange, setTimeRange] = useState("all");
  
  // Calculate analytics
  const totalClicks = links.reduce((s, l) => s + (l.clicks || 0), 0);
  const activeLinks = links.filter(l => l.visible !== false).length;
  const totalLinks = links.length;
  
  // Find top performing links
  const topLinks = [...links]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 5);
  
  const topLink = topLinks[0];
  
  // Calculate category distribution
  const categoryStats = links.reduce((acc, link) => {
    const cat = link.category || 'Uncategorized';
    if (!acc[cat]) {
      acc[cat] = { count: 0, clicks: 0 };
    }
    acc[cat].count++;
    acc[cat].clicks += link.clicks || 0;
    return acc;
  }, {});
  
  // Calculate click distribution for pie chart
  const totalClicksValue = totalClicks || 1; // Avoid division by zero
  const pieData = Object.entries(categoryStats).map(([cat, data]) => ({
    category: cat,
    clicks: data.clicks,
    percentage: (data.clicks / totalClicksValue) * 100,
    count: data.count
  })).sort((a, b) => b.clicks - a.clicks);

  // Get color for category
  const getCategoryColor = (index) => {
    const colors = [
      '#667eea', '#764ba2', '#f687b3', '#f6ad55', '#68d391', 
      '#4fd1c5', '#f56565', '#9f7aea', '#fc8181', '#48bb78'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="analytics-container">
      {/* Header with time filter */}
      <div className="analytics-header">
        <div className="analytics-title">
          <i className="fas fa-chart-line"></i>
          <h2>Link Analytics</h2>
        </div>
        
        <div className="time-filter">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <i className="fas fa-mouse-pointer"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Clicks</span>
            <span className="stat-value">{totalClicks.toLocaleString()}</span>
          </div>
          <div className="stat-trend positive">
            <i className="fas fa-arrow-up"></i> 12%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f6ad55, #ed8936)' }}>
            <i className="fas fa-link"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Links</span>
            <span className="stat-value">{activeLinks}/{totalLinks}</span>
          </div>
          <div className="stat-trend">
            <i className="fas fa-check-circle"></i> {((activeLinks/totalLinks)*100 || 0).toFixed(0)}% active
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f687b3, #ed64a6)' }}>
            <i className="fas fa-trophy"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Categories</span>
            <span className="stat-value">{Object.keys(categoryStats).length}</span>
          </div>
          <div className="stat-trend">
            <i className="fas fa-folder"></i> {totalLinks} total links
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #68d391, #38a169)' }}>
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Avg. Clicks/Link</span>
            <span className="stat-value">
              {totalLinks ? (totalClicks / totalLinks).toFixed(1) : 0}
            </span>
          </div>
          <div className="stat-trend">
            <i className="fas fa-chart-line"></i> per link
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="charts-row">
        {/* Click Distribution Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="fas fa-chart-pie"></i>
              Click Distribution by Category
            </h3>
          </div>
          
          <div className="pie-chart-container">
            {pieData.length > 0 ? (
              <>
                <div className="pie-chart">
                  <svg viewBox="0 0 100 100" className="pie-svg">
                    {pieData.reduce((acc, item, index) => {
                      const startAngle = acc.reduce((sum, d) => sum + d.percentage, 0);
                      const endAngle = startAngle + item.percentage;
                      
                      const startRad = (startAngle * 3.6 - 90) * (Math.PI / 180);
                      const endRad = (endAngle * 3.6 - 90) * (Math.PI / 180);
                      
                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);
                      
                      const largeArc = item.percentage > 50 ? 1 : 0;
                      
                      const pathData = [
                        `M 50 50`,
                        `L ${x1} ${y1}`,
                        `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
                        `Z`
                      ].join(' ');
                      
                      acc.push(
                        <path
                          key={item.category}
                          d={pathData}
                          fill={getCategoryColor(index)}
                          stroke="white"
                          strokeWidth="1"
                        >
                          <title>{item.category}: {item.clicks} clicks ({item.percentage.toFixed(1)}%)</title>
                        </path>
                      );
                      return acc;
                    }, [])}
                    
                    {/* Inner circle for donut effect */}
                    <circle cx="50" cy="50" r="25" fill="white" />
                  </svg>
                </div>
                
                <div className="chart-legend">
                  {pieData.map((item, index) => (
                    <div key={item.category} className="legend-item">
                      <span 
                        className="legend-color" 
                        style={{ backgroundColor: getCategoryColor(index) }}
                      ></span>
                      <span className="legend-label">{item.category}</span>
                      <span className="legend-value">{item.clicks}</span>
                      <span className="legend-percentage">{item.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-data-message">
                <i className="fas fa-chart-pie"></i>
                <p>No click data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Links */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i className="fas fa-crown"></i>
              Top Performing Links
            </h3>
            {topLink && (
              <span className="top-badge">
                <i className="fas fa-star"></i> Best Performer
              </span>
            )}
          </div>
          
          <div className="top-links-list">
            {topLinks.length > 0 ? (
              topLinks.map((link, index) => (
                <div key={link._id || index} className="top-link-item">
                  <div className="rank-badge" style={{ 
                    background: index === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' :
                               index === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                               index === 2 ? 'linear-gradient(135deg, #b45309, #92400e)' :
                               'linear-gradient(135deg, #667eea, #764ba2)'
                  }}>
                    #{index + 1}
                  </div>
                  
                  <div className="link-info">
                    <div className="link-name">
                      <strong>{link.siteName}</strong>
                      {link.visible === false && (
                        <span className="hidden-badge">
                          <i className="fas fa-eye-slash"></i> Hidden
                        </span>
                      )}
                    </div>
                    <div className="link-meta">
                      <span className="link-category">
                        <i className="fas fa-folder"></i> {link.category || 'Uncategorized'}
                      </span>
                      <span className="link-username">
                        <i className="fas fa-user"></i> {link.username}
                      </span>
                    </div>
                  </div>
                  
                  <div className="link-stats">
                    <div className="click-count">
                      <i className="fas fa-mouse-pointer"></i>
                      <span className="click-number">{link.clicks || 0}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${((link.clicks || 0) / (topLink.clicks || 1)) * 100}%`,
                          background: index === 0 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' :
                                     'linear-gradient(90deg, #667eea, #764ba2)'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-message">
                <i className="fas fa-link"></i>
                <p>No links added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Stats Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>
            <i className="fas fa-table"></i>
            Category Performance
          </h3>
        </div>
        
        <div className="table-wrapper">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Links</th>
                <th>Total Clicks</th>
                <th>Avg. Clicks/Link</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {pieData.map((item, index) => (
                <tr key={item.category}>
                  <td>
                    <div className="category-cell">
                      <span 
                        className="category-dot" 
                        style={{ backgroundColor: getCategoryColor(index) }}
                      ></span>
                      {item.category}
                    </div>
                  </td>
                  <td>{item.count}</td>
                  <td>
                    <strong>{item.clicks}</strong>
                  </td>
                  <td>{(item.clicks / item.count).toFixed(1)}</td>
                  <td>
                    <div className="performance-bar">
                      <div 
                        className="performance-fill"
                        style={{ 
                          width: `${(item.clicks / totalClicks) * 100}%`,
                          background: `linear-gradient(90deg, ${getCategoryColor(index)}80, ${getCategoryColor(index)})`
                        }}
                      ></div>
                      <span>{((item.clicks / totalClicks) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="analytics-footer">
        <div className="insight-message">
          <i className="fas fa-lightbulb"></i>
          {topLink ? (
            <span>
              <strong>Pro tip:</strong> "{topLink.siteName}" is your best performing link 
              with {topLink.clicks} clicks. Consider featuring it more prominently!
            </span>
          ) : (
            <span>Add some links to start seeing analytics insights!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;