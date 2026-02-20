import React from "react";
import API from "../api/api";
import IconButton from "./IconButton";
import "../styles/cards.css";
import toast from "react-hot-toast";
import { useSwipeable } from "react-swipeable";

const LinkCard = ({ link, onDelete, isPublic = false }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link.profileLink);
    toast.success("Link copied!");
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this link?")) return;
    await API.delete(`/links/${link._id}`);
    if (onDelete) onDelete();
    toast.success("Link deleted!");
  };

  const handleVisit = async () => {
    try {
      await API.post(`/links/click/${link._id}`);
    } catch {}
    window.open(link.profileLink, "_blank");
  };

  const handleShare = () => {
    // Format the message exactly as you want
    const shareMessage = `Name: Anil. A
Username: ${link.username}
Site: ${link.siteName}
URL: ${link.profileLink}`;

    // Encode for URL
    const encodedMessage = encodeURIComponent(shareMessage);
    
    // WhatsApp sharing URLs
    const whatsappWebUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;
    const whatsappAppUrl = `whatsapp://send?text=${encodedMessage}`;
    const whatsappApiUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

    // Try to detect if on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open WhatsApp app first
      window.location.href = whatsappAppUrl;
      
      // Fallback to web after a short delay
      setTimeout(() => {
        window.open(whatsappApiUrl, '_blank');
      }, 500);
    } else {
      // On desktop, open WhatsApp Web
      window.open(whatsappWebUrl, '_blank', 'width=700,height=600');
    }

    // Show success message
    toast.success(
      <div>
        <i className="fab fa-whatsapp" style={{ color: '#25D366', marginRight: '8px' }}></i>
        Opening WhatsApp...
      </div>
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => !isPublic && onDelete && handleDelete(),
    trackMouse: true
  });

  // Get logo URL correctly
  const getLogoUrl = () => {
    if (!link.logoUrl) return null;
    if (link.logoUrl.startsWith('http')) return link.logoUrl;
    return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${link.logoUrl}`;
  };

  const logoUrl = getLogoUrl();

  return (
    <div className={`card ${!isPublic && 'admin-card'}`} {...handlers}>
      <div className="card-top">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={link.siteName} 
            className="card-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML += '<div class="card-logo-placeholder"><i class="fas fa-link"></i></div>';
            }}
          />
        ) : (
          <div className="card-logo-placeholder">
            <i className="fas fa-link"></i>
          </div>
        )}
        <div className="card-info">
          <h3>{link.siteName}</h3>
          <p className="username">
            <i className="fas fa-user"></i> {link.username}
          </p>
          {!isPublic && (
            <p className="clicks">
              <i className="fas fa-eye"></i> {link.clicks || 0} clicks
            </p>
          )}
        </div>
      </div>

      {!isPublic && (
        <span className="badge">
          <i className="fas fa-tag"></i> {link.category}
        </span>
      )}

      <div className="card-buttons">
        <IconButton icon="copy" title="Copy Link" onClick={copyToClipboard} />
        <IconButton icon="external-link-alt" title="Visit Link" onClick={handleVisit} />
        <IconButton icon="share-alt" title="Share" onClick={handleShare} />
        {!isPublic && onDelete && (
          <IconButton icon="trash" title="Delete" onClick={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default LinkCard;