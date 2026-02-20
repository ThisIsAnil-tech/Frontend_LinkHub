import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "./IconButton";
import "../styles/navbar.css";
import { ThemeContext } from "../context/ThemeContext";
import { jwtDecode } from "jwt-decode";
import ContactInfo from "./ContactInfo";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useContext(ThemeContext);

  const token =
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken");

  let email = "";
  if (token) {
    try {
      email = jwtDecode(token).email;
    } catch {}
  }

  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {location.pathname !== "/" && (
          <IconButton
            icon="home"
            onClick={() => navigate("/")}
            title="Home"
          />
        )}
        <h2 className="logo" onClick={()=>navigate("/")}>
          LinkHub
        </h2>
      </div>

      <button className="menu-btn" onClick={() => setOpen(!open)}>
        <i className="fas fa-bars"></i>
      </button>

      <div className={`nav-right ${open ? "show" : ""}`}>
        {/* Contact Info - Added before theme toggle */}
        <ContactInfo />

        <IconButton
          icon={theme === "light" ? "moon" : "sun"}
          title="Toggle theme"
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
        />

        {email && (
          <span className="admin-email">
            <i className="fas fa-user-circle"></i> {email}
          </span>
        )}

        {!token && location.pathname !== "/admin" && (
          <IconButton
            icon="sign-in-alt"
            onClick={() => navigate("/admin")}
            title="Login"
          />
        )}

        {token && location.pathname !== "/dashboard" && (
          <IconButton
            icon="user-cog"
            onClick={() => navigate("/dashboard")}
            title="Dashboard"
          />
        )}

        {token && (
          <IconButton
            icon="sign-out-alt"
            onClick={logout}
            title="Logout"
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;