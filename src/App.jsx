import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "../components/context/cartContext.jsx";

import Menu from "../components/Menu.jsx";
import Index from "../components/Index.jsx";
import Login from "../components/utils/Login.jsx";
import Register from "../components/utils/Register.jsx";
import Profile from "../components/profile.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PizzaBuilder from "../components/PizzaBuilder.jsx";
import Checkout from "../components/Checkout.jsx";
import Cart from "../components/cart.jsx";
import PreviousOrders from "../components/previousOrders.jsx";
import TrackOrder from "../components/trackOrder.jsx";
import ForgotPassword from "../components/ForgotPassword.jsx";
import ResetPassword from "../components/ResetPassword.jsx";
import Legal from "../components/Legal.jsx";

import "./App.css";

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="app">
          <Routes>

            {/* PUBLIC OLDALAK */}
            <Route path="/" element={<Index />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pizza-builder" element={<PizzaBuilder />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/legal" element={<Legal />} />

            {/* VÉDETT OLDALAK */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />



            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/previous-orders"
              element={
                <ProtectedRoute>
                  <PreviousOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/track-orders"
              element={
                <ProtectedRoute>
                  <TrackOrder />
                </ProtectedRoute>
              }
            />  


          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;