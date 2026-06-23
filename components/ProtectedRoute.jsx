import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    axios.get("https://pizzarokilive.onrender.com/routes/me", {
      withCredentials: true
    })
    .then(() => {
      setAuthorized(true);
      setLoading(false);
    })
    .catch(() => {
      setAuthorized(false);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center mt-5">Ellenőrzés...</div>;

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
