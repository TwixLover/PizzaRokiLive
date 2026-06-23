import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/trackOrder.css";
import Navbar from "./utils/Navbar.jsx";
import Footer from "./Footer.jsx";
import { Link } from "react-router-dom";

function TrackOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    fetchOrders();

    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);

  }, []);

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        "https://pizzarokilive.onrender.com/orders/active-orders",
        { withCredentials: true }
      );

      setOrders(res.data || []);

    } catch (err) {
      console.log(err);
    }

  };

  const getProgress = (status) => {

    switch (status) {

      case "pending": return 25;
      case "in_progress": return 50;
      case "ready": return 75;
      case "driver_on_the_way": return 100;
      default: return 0;

    }

  };

  return (

<div className="tracking-wrapper">

  <Navbar isMenuPage={true} />

  <main className="tracking-main">

    <div className="tracking-container">

      <h2 className="tracking-title">
        Track Your Orders
      </h2>



      {orders.length === 0 && (

        <div className="no-orders">

          <h3>No orders yet</h3>

          <p>Order now and track your delicious pizza in real time.</p>

          <Link to="/menu">
            <button className="order-now-btn">
              Order Now
            </button>
          </Link>

        </div>

      )}

      {orders.length > 0 && (

        <div className="tracking-grid">

          {orders.map(order => {

            const progress = getProgress(order.status);

            return (

              <div key={order.id} className="tracking-card">

                <h4 className="order-time">
                  Order placed at: {new Date(order.placed_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </h4>

                <div className="pizza-progress">

                  <svg viewBox="0 0 200 200">

                    <circle
                      className="pizza-bg"
                      cx="100"
                      cy="100"
                      r="80"
                    />

                    <circle
                      className="pizza-progress-bar"
                      cx="100"
                      cy="100"
                      r="80"
                      style={{
                        strokeDasharray: 502,
                        strokeDashoffset: 502 - (502 * progress) / 100
                      }}
                    />

                  </svg>

                  <div className="pizza-center">
                    {order.status.replaceAll("_"," ")}
                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>

  </main>

  <Footer />

</div>

  );

}

export default TrackOrders;