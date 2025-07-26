import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // --- USE API SERVICE ---
import { useAuth } from "../../authContext";
import { Heading, Box, Button } from "@primer/react";
import "./auth.css";
import logo from "../../assets/codevault-icon.svg";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate(); // Use navigate hook for redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // --- API CALL IS NOW CLEANER ---
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);
      setLoading(false);
      navigate("/"); // --- USE NAVIGATE FOR REDIRECTION ---
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>
      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
            <Heading as="h1" sx={{ fontSize: 4, mb: 3 }}>Sign In</Heading>
          </Box>
        </div>
        <div className="login-box">
          <form onSubmit={handleLogin}>
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
            <Button
              variant="primary"
              className="login-btn"
              disabled={loading}
              type="submit"
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </div>
        <div className="pass-box">
          <p>New to CodeVault? <Link to="/signup">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
