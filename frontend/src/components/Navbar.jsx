import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/codevault_icon.png";


const Navbar = () => {
  return (
    <nav>
      
        <div>
          <Link to="/">
          <img
            src={logo}
            alt="CodeVault Logo"
          />
          </Link>
          <h3>Welcome to CodeVault</h3>
        </div>
      
      <div>
        <Link to="/createrepo">
          <p className="link">Create a Repository</p>
        </Link>
        <Link to="/profile">
          <p className="link">Profile</p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
