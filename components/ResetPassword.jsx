import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/authPages.css";
import Navbar from "./utils/Navbar.jsx";
import Footer from "./Footer.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/routes/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setMessage("Password reset successful!");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="Navbar">
      <Navbar isMenuPage={true} />
    <div className="auth-page">
      

      <div className="auth-container">
        <div className="auth-card">
          <h2>Reset Password</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              className="form-control mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="form-control mb-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button className="btn auth-btn w-100">
              Reset Password
            </button>
          </form>

          {error && <p className="error-msg mt-2">{error}</p>}
          {message && <p className="success-msg mt-2">{message}</p>}
        </div>
      </div>

    </div>
    
      <Footer />
    </div>
  );
};

export default ResetPassword;