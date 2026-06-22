import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/register.css";
import Navbar from "./Navbar.jsx";
import Footer from "../Footer.jsx";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    house_number: "",
    city: "",
    postal_code: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/routes/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setError("Registration successful! Check your email to verify your account.");
      }
    } catch (err) {
      setError("Server error occurred");
      console.log(err);
    }
  };

  return (
    <div>
      <div className="bg">
        <Navbar isMenuPage={true} />

        <div className="register-bg container-fluid">
          <div className="row min-vh-100 align-items-center">
            <div className="col-lg-6 col-xl-5 d-none d-lg-block"></div>

            <div className="col-12 col-lg-6 col-xl-7 d-flex justify-content-center justify-content-lg-start">
              <form className="register-form ms-lg-5" onSubmit={handleSubmit}>
                <h2>Create your account</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>First Name</label>
                    <input
                      name="first_name"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Last Name</label>
                    <input
                      name="last_name"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 password-wrapper">
                  <label>Password</label>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>

                <div className="mb-3">
                  <label>Phone Number</label>
                  <input
                    name="phone"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label>Address</label>
                    <input
                      name="street"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Number</label>
                    <input
                      name="house_number"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-7 mb-3">
                    <label>City</label>
                    <input
                      name="city"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-5 mb-3">
                    <label>Zip Code</label>
                    <input
                      name="postal_code"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-login w-100 mb-3">
                  Register
                </button>

                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-link">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;