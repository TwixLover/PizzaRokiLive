import { useCart } from "./context/cartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./utils/Navbar";
import "./styles/cart.css";
import Footer from "./Footer";
export default function Cart() {
  const { cart, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  return (
  <div>
    <div className="cart-page">
      <Navbar isMenuPage={true} />

      <div className="cart-wrapper container-fluid">
        <div className="row justify-content-center">

      
          <div className="col-lg-7 col-md-10 cart-items">
            <h2 className="cart-title">Your Cart</h2>

            {cart.length === 0 && (
              <div className="empty-cart">
                <h4>Your cart is empty</h4>
                <p>Looks like you haven't added anything yet.</p>
                <button
                  className="btn browse-btn"
                  onClick={() => navigate("/menu")}
                >
                  Browse from Menu
                </button>
              </div>
            )}

            {cart.map((item, index) => (
              <div key={index} className="cart-item-card">
                <div className="item-info">
                  <h5>{item.name}</h5>
                  {item.size && <p>Size: {item.size} cm</p>}
                </div>

                <div className="item-actions">
                  <span className="price">{item.price} din</span>
                  <button
                    className="btn btn-remove"
                    onClick={() => removeFromCart(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

      
          {cart.length > 0 && (
            <div className="col-lg-4 col-md-8 summary-wrapper">
              <div className="summary-box">
                <h4>Order Summary</h4>

                <div className="summary-total">
                  <span>Total</span>
                  <span>{total} din</span>
                </div>

                <button
                  className="btn checkout-btn w-100"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
   
    </div>
       <Footer />
       </div>
  );
}