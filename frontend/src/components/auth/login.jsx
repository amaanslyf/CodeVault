// frontend/src/components/auth/Login.jsx (REPLACE FULL FILE)

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../authContext";
import "./auth.css";
import logo from "../../assets/codevault-icon.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    // --- NEW: Add the auth-page-wrapper div here ---
    <div className="auth-page-wrapper">
      <div className="login-wrapper">
        <div className="login-logo-container">
          <img className="logo-login" src={logo} alt="Logo" />
        </div>
        <div className="login-box-wrapper">
          <div className="login-heading">
            <h1>Sign In</h1>
          </div>
          <div className="login-box">
            <form onSubmit={handleLogin}>
              {error && <div className="error-message">{error}</div>}
              <div>
                <label className="label">Email address</label>
                <input
                  autoComplete="off"
                  name="Email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  autoComplete="off"
                  name="Password"
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                className="login-btn"
                disabled={loading}
                type="submit"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
          <div className="pass-box">
            <p>New to CodeVault? <Link to="/signup">Create an account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
