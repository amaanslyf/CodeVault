import React, { useState, useEffect } from "react";
import axios from "axios";       // Import axios for making HTTP requests and connect to the backend, axios is a promise-based HTTP client for the browser and Node.js
import { useAuth } from "../../authContext";

import { Heading, Box, Button } from "@primer/react";  
import "./auth.css";

import logo from "../../assets/codevault-icon.svg";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");    
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();    // Prevent the default form submission behavior

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3002/signup", {  // Make a POST request to the backend signup endpoint 
        email: email,
        password: password,
        username: username,
      });

// If the signup is successful, store the userId and token in localStorage and set the current user in the auth context
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";  //we can also use navigate("/") 
    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
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
          <Box sx={{  }}>
            <Heading as="h1" sx={{ fontSize: 4 }}>Sign Up</Heading>  {/* Replaced PageHeader with Heading */}
          </Box>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Username</label>
            <input
              autoComplete="off"
              name="Username"
              id="Username"
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="div">
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={handleSignup}
          >
            {loading ? "Loading..." : "Signup"}   
          </Button>
        </div>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/auth">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;