import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/cartContext";
import "./styles/previousOrders.css";
import Navbar from "./utils/Navbar";

export default function PreviousOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addedOrderId, setAddedOrderId] = useState(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get("http://localhost:5000/orders/my-orders", {
      withCredentials: true,
    })
    .then(res => setOrders(res.data))
    .catch(err => console.error(err));
  }, []);
 
  const handleReorder = (order) => {
    order.items.forEach(item => {
      addToCart({
        id: crypto.randomUUID(),
        type: "menu_item",
        menu_item_id: item.menu_item_id,
        variant_id: item.variant_id,
        name: item.name || "Custom Pizza",
        size: item.size,
        price: Number(item.price),
        quantity: item.quantity,
        toppings: item.toppings || [],
      });
    });

    setAddedOrderId(order.id);

    setTimeout(() => {
      setAddedOrderId(null);
    }, 2000);
  };

  if (orders.length === 0) {
    return (
      <div className="previous-orders empty">
        <h2>No previous orders yet</h2>
        <button onClick={() => navigate("/menu")}>
          Order Now
        </button>
      </div>
    );
  }

  return (
    <div className="previous-orders-main">
      <Navbar isMenuPage={true}></Navbar>
    <div className="previous-orders">
      <h2>Your Orders</h2>

      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.id} className="order-card">

            <div className="order-date">
              {new Date(order.placed_at).toLocaleDateString()}
            </div>

            <div className="total">
              {order.total_amount} RSD
            </div>

            <div className="actions">
              <button
                className="details"
                onClick={() => setSelectedOrder(order)}
              >
                View Details
              </button>

              <button
                className={`reorder ${
                  addedOrderId === order.id ? "success" : ""
                }`}
                onClick={() => handleReorder(order)}
              >
                {addedOrderId === order.id ? "✔" : "Re-Order"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="details-overlay">
          <div className="details-box">
            <h3>Order Details</h3>

            {selectedOrder.items.map((item, index) => (
              <div key={index} className="detail-item">
                <strong>
                  {item.quantity}x {item.name || "Custom Pizza"}
                </strong>

                {item.size && (
                  <div className="detail-sub">
                    Size: {item.size} cm
                  </div>
                )}

                {item.toppings?.length > 0 && (
                  <div className="detail-toppings">
                    {item.toppings.map(t => t.name).join(", ")}
                  </div>
                )}
              </div>
            ))}

            <button
              className="close-btn"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>

    </div>
    
  );
}