import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/login.css";
import Navbar from "./Navbar.jsx";
import Footer from "../Footer.jsx";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const verified = params.get("verified");

  const redirectByRole = (user) => {
    if (user.role === "admin") {
      window.location.href = "http://localhost:5000/admin";
    } 
    else if (user.role === "employee") {
      window.location.href = "http://localhost:5000/employee";
    } 
    else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);

    try {
      const res = await fetch("http://localhost:5000/routes/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");

        if (data.message?.includes("verify")) {
          setShowResend(true);
        }

        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      redirectByRole(data.user);

    } catch (err) {
      console.error(err);
      setError("Szerverhiba");
    }
  };

  const handleResend = async () => {
    setResendMessage("");

    try {
      const res = await fetch("http://localhost:5000/routes/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setResendMessage(data.message);

    } catch (err) {
      console.error(err);
      setResendMessage("Error sending email");
    }
  };

  return (
    <div>
      <div className="bg">
        <Navbar isMenuPage={true} />

        <div className="login-bg container-fluid">
          <div className="row vh-100 align-items-center">

            <div className="col-lg-12 col-xl-5 d-none d-lg-block"></div>

            <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center flex-column">
              <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>

                {verified === "true" && (
                  <div className="alert alert-success">
                    Email verified successfully! You can now log in.
                  </div>
                )}

                {verified === "false" && (
                  <div className="alert alert-danger">
                    Invalid or expired verification link.
                  </div>
                )}

                {error && <p className="text-danger">{error}</p>}

                {showResend && (
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={handleResend}
                    >
                      Resend verification email
                    </button>

                    {resendMessage && (
                      <div className="text-success">
                        {resendMessage}
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-2 password-wrapper">
                  <label>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>

                <button className="btn btn-login w-100 mb-3">
                  Login
                </button>

                <p className="register-text">
                  You don't have account?{" "}
                  <Link to="/register">Register</Link>
                </p>
                <p className="text-center mt-2 register-text">
  <Link to="/forgot-password">Forgot password?</Link>
</p>
              </form>

              <div className="Google text-center mt-4">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const res = await fetch(
                        "http://localhost:5000/routes/google-login",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            credential: credentialResponse.credential,
                          }),
                          credentials: "include",
                        }
                      );

                      if (!res.ok) {
                        setError("Google login failed");
                        return;
                      }

                      window.location.replace("/");
                    } catch (err) {
                      console.error(err);
                      setError("Google login error");
                    }
                  }}
                  onError={() => {
                    setError("Google login failed");
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;