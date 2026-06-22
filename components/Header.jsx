import React from "react";
import "./styles/header.css";
import Navbar from "./utils/Navbar.jsx";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">

    
      <video
        className="header-video"
        autoPlay
        muted
        loop
        playsInline
        src="https://res.cloudinary.com/dfvlulzlh/video/upload/v1772207988/0227_vtl7zk.mp4"
      />

      <div className="video-overlay"></div>

      <div className="header-content">
        <Navbar isMenuPage={false} />
      </div>

      <div className="main container">
        <h1>
          The best Pizza in town with free delivery is just one phone call away!
        </h1>

        <button type="button" className="btn btn-primary btn-lg call">
          Call us
        </button>

        <h2>Or order online</h2>

        <Link to="/menu">
          <button type="button" className="btn btn-primary btn-lg order">
            View menu
          </button>
        </Link>
      </div>

    </header>
  );
}

export default Header;