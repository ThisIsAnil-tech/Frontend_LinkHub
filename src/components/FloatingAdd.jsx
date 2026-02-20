import { useNavigate } from "react-router-dom";
import "../styles/fab.css";

const FloatingAdd = () => {
  const navigate = useNavigate();

  return (
    <button
      className="fab"
      onClick={() => navigate("/dashboard")}
      aria-label="Go to Dashboard"
    >
      <i className="fas fa-plus"></i>
    </button>
  );
};

export default FloatingAdd;