import React from "react";
import "../styles/share-modal.css";

const ShareModal = ({ link, onClose }) => {
  const shareMessage = `Name: Anil. A
Username: ${link.username}
Site: ${link.siteName}
URL: ${link.profileLink}`;

  const copyFullMessage = () => {
    navigator.clipboard.writeText(shareMessage);
    toast.success("Share info copied to clipboard!");
    onClose();
  };

  const copyLinkOnly = () => {
    navigator.clipboard.writeText(link.profileLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>
            <i className="fas fa-share-alt"></i> Share {link.siteName}
          </h3>
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="share-modal-content">
          <div className="share-preview">
            <div className="share-info">
              <p><strong>Name:</strong> Anil. A</p>
              <p><strong>Username:</strong> {link.username}</p>
              <p><strong>Site:</strong> {link.siteName}</p>
              <p><strong>URL:</strong> 
                <a href={link.profileLink} target="_blank" rel="noopener noreferrer">
                  {link.profileLink}
                </a>
              </p>
            </div>
          </div>

          <div className="share-actions">
            <button className="share-action-btn primary" onClick={copyFullMessage}>
              <i className="fas fa-copy"></i>
              Copy Full Info
            </button>
            <button className="share-action-btn secondary" onClick={copyLinkOnly}>
              <i className="fas fa-link"></i>
              Copy Link Only
            </button>
            {navigator.share && (
              <button 
                className="share-action-btn mobile"
                onClick={() => {
                  navigator.share({
                    title: `${link.siteName} - ${link.username}`,
                    text: shareMessage,
                    url: link.profileLink,
                  });
                  onClose();
                }}
              >
                <i className="fas fa-share-alt"></i>
                Share via...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;