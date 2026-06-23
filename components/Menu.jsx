import { useState, useEffect, useRef } from "react";
import { useCart } from "./context/cartContext";
import Navbar from "./utils/Navbar.jsx";
import Footer from "./Footer.jsx";
import "./styles/menu.css";
import { Link } from "react-router-dom";

const CustomizeModal = ({ item, onClose, onConfirm }) => {
  const [toppings, setToppings] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const res = await fetch(
          `https://pizzarokilive.onrender.com/toppings/${item.id}`
        );
        const data = await res.json();
        setToppings(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchToppings();
  }, [item.id]);

  const toggleTopping = (topping) => {
    setSelected((prev) =>
      prev.find((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{item.name} - Customize</h2>

        <div className="toppings-list">
          {toppings.length === 0 ? (
            <p style={{ opacity: 0.6 }}>
              No extra toppings available.
            </p>
          ) : (
            toppings.map((topping) => (
              <label key={topping.id} className="topping-option">
                <input
                  type="checkbox"
                  checked={!!selected.find((t) => t.id === topping.id)}
                  onChange={() => toggleTopping(topping)}
                />
                {topping.name}
              </label>
            ))
          )}
        </div>

        <div className="modal-actions">
          <button
            className="order-btn"
            onClick={() => onConfirm(selected)}
          >
            Order 🛒
          </button>

          <button className="close-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};



const MenuItem = ({ item, index, showCustomize }) => {
  const { addToCart } = useCart();
  const ref = useRef();
  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const initialSize =
    item.variants && item.variants.length > 0
      ? item.variants[0].size
      : null;

  const [selectedSize, setSelectedSize] = useState(initialSize);

  const currentVariant = item.variants
    ? item.variants.find((v) => v.size === selectedSize)
    : null;

  const currentPrice = currentVariant
    ? currentVariant.price
    : item.base_price;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current.classList.add("show");
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
  }, []);

  const handleAdd = (selectedToppings = []) => {
    addToCart({
      id: crypto.randomUUID(),
      type: "menu_item",
      menu_item_id: item.id,
      variant_id: currentVariant?.id || null,
      name: item.name,
      size: selectedSize,
      price: Number(currentPrice),
      quantity: 1,
      toppings: selectedToppings,
    });

    setShowModal(false);
    setAdded(true);

    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <>
      <div
        ref={ref}
        className={`menu-row ${index % 2 === 0 ? "left" : "right"}`}
      >
        <div className="menu-img">
          <img src={item.image_url} alt={item.name} />
        </div>

        <div className="menu-info">
          <h2>{item.name}</h2>
          <p>{item.description}</p>

          {item.variants && item.variants.length > 0 && (
            <div className="size-picker">
              {item.variants.map((variant) => (
                <div
                  key={variant.id}
                  className={`size-box ${
                    selectedSize === variant.size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(variant.size)}
                >
                  {variant.size} cm
                </div>
              ))}
            </div>
          )}

          <div className="price">
            {Number(currentPrice).toFixed(0)} Din
          </div>

          <div className="actions">
            {showCustomize ? (
              <button
                className="customize-btn"
                onClick={() => setShowModal(true)}
              >
                Customize ＋
              </button>
            ) : (
              <button
                className={`order-btn ${added ? "success" : ""}`}
                onClick={() => handleAdd()}
              >
                {added ? "✔" : "Order 🛒"}
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <CustomizeModal
          item={item}
          onClose={() => setShowModal(false)}
          onConfirm={handleAdd}
        />
      )}
    </>
  );
};



const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch("https://pizzarokilive.onrender.com/menu");
      const data = await res.json();
      setMenuItems(data);
    };

    fetchMenu();
  }, []);

  const pizzas = menuItems.filter((i) => i.type === "Pizza");
  const grills = menuItems.filter((i) => i.type === "Grill");
  const others = menuItems.filter((i) => i.type === "Other");

  return (
    <div className="menu">
      <Navbar isMenuPage={true} />

   
      <div className="builder-hero">
        <video
          className="hero-video"
          src="https://res.cloudinary.com/dfvlulzlh/video/upload/v1772207988/0227_vtl7zk.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="hero-overlay" />

        <div className="builder-cta">
          <h1>Create Your Dream Pizza</h1>
          <p>Fresh ingredients. Infinite combinations.</p>
          <Link to="/pizza-builder">
            <button className="builder-btn">
              Build Your Own 🍕
            </button>
          </Link>
          <br />
          <br /><br /> <br /> <br />
          <h3>Or choose from the menu below</h3>
        </div>
      </div>

      <div className="menu-section">
        <h1>Pizzas</h1>
        {pizzas.map((item, index) => (
          <MenuItem
            key={item.id}
            item={item}
            index={index}
            showCustomize={false}
          />
        ))}
      </div>

      <div className="menu-section">
        <h1>Grill</h1>
        {grills.map((item, index) => (
          <MenuItem
            key={item.id}
            item={item}
            index={index}
            showCustomize={item.name !== "Mixed meat"}
          />
        ))}
      </div>

      <div className="menu-section">
        <h1>Others</h1>
        {others.map((item, index) => {
          const isSandwich =
            item.name.toLowerCase().includes("sandwich");

          return (
            <MenuItem
              key={item.id}
              item={item}
              index={index}
              showCustomize={isSandwich}
            />
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default Menu;