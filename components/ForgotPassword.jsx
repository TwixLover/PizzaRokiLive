import React, { useState } from "react";
import "./styles/authPages.css";
import Navbar from "./utils/Navbar.jsx";
import Footer from "./Footer.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/routes/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="Navbar">
   <Navbar isMenuPage={true} />
    <div className="auth-page">
      

      <div className="auth-container">
        <div className="auth-card">
          <h2>Forgot Password</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="btn auth-btn w-100">
              Send Reset Link
            </button>
          </form>

          {message && <p className="success-msg mt-3">{message}</p>}
        </div>
      </div>

     
    </div>
     <Footer />
    </div>
  );
};

export default ForgotPassword;