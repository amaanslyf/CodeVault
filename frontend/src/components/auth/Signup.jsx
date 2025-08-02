// frontend/src/components/auth/Signup.jsx (REPLACE FULL FILE)

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../authContext";
import "./auth.css";
import logo from "../../assets/codevault-icon.svg";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/signup", { email, password, username });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="login-wrapper">
        <div className="login-logo-container">
          <img className="logo-login" src={logo} alt="Logo" />
        </div>
        <div className="login-box-wrapper">
          <div className="login-heading">
            <h1>Sign Up</h1>
          </div>
          <div className="login-box">
            <form onSubmit={handleSignup}>
              {error && <div className="error-message">{error}</div>}
              <div>
                <label className="label">Username</label>
                <input
                  autoComplete="off"
                  name="Username"
                  className="input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
          </div>
          <div className="pass-box">
            <p>Already have an account? <Link to="/auth">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
