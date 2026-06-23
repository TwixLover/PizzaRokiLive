import React, { useState, useEffect } from "react";
import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";

function Navbar({ isMenuPage }) {
const [menuOpen, setMenuOpen] = useState(false);
const [profileOpen, setProfileOpen] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);

const navigate = useNavigate();
const { cart } = useCart();
const cartCount = cart.length;

useEffect(() => {
const checkAuth = async () => {
try {
const res = await fetch("http://localhost:5000/routes/me", {
credentials: "include",
});

setIsLoggedIn(res.ok);
} catch {
setIsLoggedIn(false);
}
};

checkAuth();
}, []);

const handleLogout = async () => {
try {
await fetch("http://localhost:5000/routes/logout", {
method: "POST",
credentials: "include",
});
} catch {}

setIsLoggedIn(false);
navigate("/login");
};

const handleProfileClick = (e) => {
if (window.innerWidth <= 768 && isLoggedIn) { e.preventDefault(); setProfileOpen(!profileOpen); } }; const
  navClass=`Header-nav ${menuOpen ? "open" : "" } ${ isMenuPage ? "is-menu-nav" : "" }`; return ( <>
  <div className={`hamburger ${menuOpen ? "active" : "" }`} onClick={()=> setMenuOpen(!menuOpen)}
    >
    <span></span>
    <span></span>
    <span></span>
  </div>

  <nav className={navClass}>
    <ul>
      <div className="Header-logo">
        <img src="https://i.ibb.co/xqKF3Wzp/logo-white.png" alt="logo white" border="0"></img>
      </div>

      <div className="nav">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/menu">Menu</Link>
        </li>

        <li className={`profile-dropdown ${ profileOpen ? "mobile-open" : "" }`}>
          <Link to={isLoggedIn ? "/profile" : "/login" } onClick={handleProfileClick}>
          Profile
          </Link>

          {isLoggedIn && (
          <ul className="dropdown-menu">
            <li>
              <Link to="/profile">Profile settings</Link>
            </li>
            <li>
              <Link to="/previous-orders">Previous orders</Link>
            </li>
            <li>
              <Link to="/track-orders">Order tracking</Link>
            </li>
          </ul>
          )}
        </li>
      </div>

      <div className="icons-right">

        {/* CART*/}

        <li className="cart-wrapper">
          <Link to="/cart" className="cart-link">
          <svg className="cart" fill="none" stroke="white" strokeWidth="2" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 35 35" width="33" height="35">
            <path
              d="M27.47,23.93H14.92A5.09,5.09,0,0,1,10,20L8,11.87a5.11,5.11,0,0,1,5-6.32h16.5a5.11,5.11,0,0,1,5,6.32l-2,8.15A5.1,5.1,0,0,1,27.47,23.93Z">
            </path>
            <path
              d="M9.46 14a1.25 1.25 0 0 1-1.21-1L6.46 5.23A3.21 3.21 0 0 0 3.32 2.75H1.69a1.25 1.25 0 0 1 0-2.5H3.32A5.71 5.71 0 0 1 8.9 4.66l1.78 7.77a1.24 1.24 0 0 1-.93 1.5A1.43 1.43 0 0 1 9.46 14z">
            </path>
          </svg>

          {cartCount > 0 && (
          <span className="cart-badge">{cartCount}</span>
          )}
          </Link>
        </li>

        {/* LOGIN / LOGOUT  */}
        <li className="login">
          {!isLoggedIn ? (
          <Link to="/login" title="Login">
          <svg xmlns="http://www.w3.org/2000/svg" className="login" shape-rendering="geometricPrecision"
            text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd"
            clip-rule="evenodd" viewBox="0 0 379 511.54" fill="white" width="27" height="27">
            <path fill-rule="nonzero"
              d="M107.83 0h194.21c21.17 0 40.41 8.68 54.34 22.61C370.33 36.56 379 55.82 379 76.96v357.62c0 21.06-8.69 40.29-22.63 54.26l-.1.1c-13.97 13.93-33.19 22.6-54.23 22.6H107.83c-21.15 0-40.41-8.67-54.36-22.62-13.93-13.93-22.61-33.17-22.61-54.34V360.6h37.55v73.98c0 10.81 4.45 20.67 11.59 27.81 7.15 7.15 17.02 11.6 27.83 11.6h194.21c10.83 0 20.7-4.43 27.8-11.54 7.18-7.17 11.61-17.04 11.61-27.87V76.96c0-10.8-4.45-20.67-11.6-27.82-7.13-7.14-17-11.59-27.81-11.59H107.83c-10.84 0-20.7 4.44-27.84 11.58-7.14 7.13-11.58 17-11.58 27.83v73.96H30.86V76.96c0-21.17 8.66-40.42 22.6-54.36C67.4 8.66 86.65 0 107.83 0zm59.06 161.72 97.02 91.6-101.77 96.42-25.8-27.12 50.94-48.28L0 274.66v-37.39l192.03-.33-50.8-47.96 25.66-27.26z" />
            </svg>
          </Link>
          ) : (
          <button onClick={handleLogout} title="Logout" style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" className="logins"
              xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25" height="25" fill="white"  stroke="white" strokeWidth="4"
              viewBox="0 0 91.839 122.88"  enable-background="new 0 0 91.839 122.88" xml:space="preserve">
              <g>
                <path
                  d="M81.75,64.617H41.365c-1.738,0-3.147-1.423-3.147-3.178c0-1.756,1.409-3.179,3.147-3.179h40.383L68.559,43.155 c-1.146-1.31-1.025-3.311,0.271-4.469c1.297-1.159,3.278-1.037,4.425,0.273l17.798,20.383c1.065,1.216,1.037,3.029-0.011,4.21 L73.254,83.92c-1.146,1.311-3.128,1.433-4.425,0.273c-1.296-1.158-1.417-3.16-0.271-4.47L81.75,64.617L81.75,64.617z M70.841,99.629c0-1.756,1.423-3.179,3.178-3.179c1.756,0,3.179,1.423,3.179,3.179v14.242c0,2.475-1.017,4.729-2.648,6.36 c-1.633,1.632-3.887,2.648-6.36,2.648H9.009c-2.475,0-4.73-1.014-6.363-2.646C1.016,118.603,0,116.352,0,113.871V9.009 c0-2.48,1.013-4.733,2.644-6.365C4.275,1.013,6.528,0,9.009,0h59.18c2.479,0,4.731,1.016,6.362,2.646 c1.633,1.633,2.646,3.889,2.646,6.363V23.25c0,1.755-1.423,3.178-3.179,3.178c-1.755,0-3.178-1.423-3.178-3.178V9.009 c0-0.722-0.301-1.385-0.785-1.869c-0.482-0.482-1.144-0.783-1.867-0.783H9.009c-0.726,0-1.389,0.3-1.87,0.782 C6.656,7.62,6.357,8.283,6.357,9.009v104.862c0,0.724,0.301,1.385,0.783,1.867c0.484,0.484,1.147,0.785,1.869,0.785h59.18 c0.72,0,1.381-0.302,1.865-0.786c0.485-0.484,0.787-1.146,0.787-1.866V99.629L70.841,99.629z" />
              </g>
            </svg>
          </button>
          )}
        </li>
      </div>
    </ul>
  </nav>
  </>
  );
  }

  export default Navbar;