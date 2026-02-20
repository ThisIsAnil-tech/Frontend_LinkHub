import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "../components/IconButton";
import "../styles/admin.css";
import API from "../api/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/login", form);
      if (remember) {
        localStorage.setItem("adminToken", res.data.token);
      } else {
        sessionStorage.setItem("adminToken", res.data.token);
      }
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  const getStrength = (pass) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  return (
    <div className="admin-container">
      <form className="admin-form" onSubmit={login}>
        <h2>
          <i className="fas fa-lock"></i> Admin Login
        </h2>
        <div className="strength">
          <div className={`strength-bar s${getStrength(form.password)}`}></div>
        </div>
        <div className="input-group">
          <i className="fas fa-envelope input-icon"></i>
          <input name="email" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <i className="fas fa-key input-icon"></i>
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        </div>
        <div className="button-group">
          <IconButton icon="sign-in-alt" title="Login" type="submit" />
          <IconButton icon="home" title="Back" onClick={() => navigate("/")} />
        </div>
        <label className="remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          <i className={`fas fa-${remember ? 'check-square' : 'square'}`}></i>
          Remember me
        </label>
      </form>
    </div>
  );
};

export default AdminLogin;