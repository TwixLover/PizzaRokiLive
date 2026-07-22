import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "./context/cartContext";
import Navbar from "./utils/Navbar.jsx";
import "./styles/checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();

  const [delivery, setDelivery] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    street: "",
    house_number: "",
    city: "",
    postal_code: "",
  });

  const [errors, setErrors] = useState({});
  const [notes, setNotes] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  

const isRestaurantOpen = () => {
  const now = new Date();

  const day = now.getDay();
  const hour = now.getHours();

  if (day === 3) {
    return false;
  }

  if (hour < 12|| hour >= 22) {
    return false;
  }

  return true;
};

const restaurantOpen = isRestaurantOpen();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://pizzarokilive.onrender.com/profile",
          { withCredentials: true }
        );

        setDelivery({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          phone: res.data.phone || "",
          street: res.data.street || "",
          house_number: res.data.house_number || "",
          city: res.data.city || "",
          postal_code: res.data.postal_code || "",
        });

      } catch (err) {
        console.error("PROFILE ERROR:", err.response?.data || err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setDelivery({
      ...delivery,
      [e.target.name]: e.target.value,
    });


    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    let newErrors = {};

    Object.keys(delivery).forEach((field) => {
      if (!delivery[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrder = async () => {
    if (cart.length === 0) return;

    if (!validate()) return;

    setSubmitting(true);

    try {
      await axios.post(
        "https://pizzarokilive.onrender.com/orders",
        {
          items: cart,
          price: total,
          delivery,
          notes,
        },
        { withCredentials: true }
      );

      clearCart();
      navigate("/");

    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert("Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar isMenuPage={true} />
        <div className="container text-center empty-checkout">
          <h3>Your cart is empty 🛒</h3>
          <button
            className="btn browse-btn mt-3"
            onClick={() => navigate("/menu")}
          >
            Browse from Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar isMenuPage={true} />

      <div className="container-fluid checkout-wrapper">
        <div className="row justify-content-center">

   
          <div className="col-lg-6 col-md-10 form-section">
            <div className="checkout-card">
              <h3>Delivery Information</h3>
      {!restaurantOpen && (
         <div className="closed-warning">
    <h4>Sorry, we are currently closed.</h4>
        <h5>Our working hours:</h5>
    <table>
      <tbody>
        <tr>
          <td>Monday</td>
          <td>15:00 - 23:00</td>
        </tr>

        <tr>
          <td>Tuesday</td>
          <td>15:00 - 23:00</td>
        </tr>

        <tr>
          <td>Wednesday</td>
          <td>CLOSED</td>
        </tr>

        <tr>
          <td>Thursday</td>
          <td>15:00 - 23:00</td>
        </tr>

        <tr>
          <td>Friday</td>
          <td>15:00 - 23:00</td>
        </tr>

        <tr>
          <td>Saturday</td>
          <td>15:00 - 23:00</td>
        </tr>

        <tr>
          <td>Sunday</td>
          <td>15:00 - 23:00</td>
        </tr>
      </tbody>
    </table>
  </div>
)}
              {loadingProfile ? (
                <p>Loading profile...</p>
              ) : (
                <>
                  <div className="row">
                    {Object.keys(delivery).map((field) => (
                      <div key={field} className="col-md-6 mb-3">
                        <label className="form-label">
                          {field.replace("_", " ").toUpperCase()}
                        </label>

                        <input
                          className={`form-control modern-input ${
                            errors[field] ? "is-invalid" : ""
                          }`}
                          name={field}
                          value={delivery[field]}
                          onChange={handleChange}
                        />

                        {errors[field] && (
                          <div className="invalid-feedback">
                            {errors[field]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-control modern-input"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn confirm-btn w-100"
                    onClick={handleOrder}
                    disabled={submitting || !restaurantOpen}
                  >
                    {submitting ? "Processing..." : "Confirm Order 🍕"}
                  </button>
                </>
              )}
            </div>
          </div>


          <div className="col-lg-4 col-md-8 summary-section">
            <div className="summary-box">
              <h4>Order Summary</h4>

              {cart.map((item, index) => (
                <div key={index} className="summary-item">
                  <strong>{item.name}</strong>

                  {item.size && (
                    <div className="small-text">
                      Size: {item.size} cm
                    </div>
                  )}

                  {item.toppings && (
                    <div className="small-text">
                      {item.toppings.map((t) => t.name).join(", ")}
                    </div>
                  )}

                  <div className="price">
                    {item.price} din
                  </div>
                </div>
              ))}

              <div className="summary-total">
                <span>Total</span>
                <span>{total} din</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}