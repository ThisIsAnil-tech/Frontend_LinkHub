import "../styles/skeleton.css";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-logo"></div>
      <div className="skeleton-lines">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
