import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import Logo from "../imagens/Logo_Nav.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logout logic here, example:
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">
          <img src={Logo} alt="Logo" width={50} />
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/perfil" className="navbar-link">
          Perfil
        </Link>
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
