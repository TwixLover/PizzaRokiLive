import { useEffect, useState } from "react";
import { useCart } from "./context/cartContext";
import axios from "axios";
import "./styles/pizzaBuilder.css";
import Navbar from "./utils/Navbar.jsx";
import Footer from "./Footer.jsx";

export default function PizzaBuilder() {
  const { addToCart } = useCart();

  const [toppings, setToppings] = useState([]);
  const [selected, setSelected] = useState([]);
  const [size, setSize] = useState(42);
  const [price, setPrice] = useState(0);

  const MAX_TOPPINGS = 8;
  const renderOrder = ["Dough", "Sauce", "Meat", "Vegetables", "Cheese"];

  const doughPrices = {
    "Classic dough": { 32: 800, 42: 1000, 50: 1200 },
    "Dough with cheese and pepperoni filled edges": {
      32: 850,
      42: 1100,
      50: 1250,
    },
    "Dough with cheese filled edges": {
      32: 900,
      42: 1050,
      50: 1300,
    },
  };

  useEffect(() => {
    axios.get("https://pizzarokilive.onrender.com/toppings/pizza-builder")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setToppings(data);
        console.log("TOPPINGS FETCHED:", data);
        const classicDough = data.find(
          (t) =>
            t.type === "Dough" &&
            t.name.toLowerCase().includes("classic")
        );

        if (classicDough) {
          setSelected([classicDough]);
        }
      })
      .catch((err) =>
        console.error("TOPPINGS FETCH ERROR:", err)
      );
  }, []);

  /*PRICE CALCULATION */
  useEffect(() => {
    let total = 0;

    const selectedDough = selected.find(
      (t) => t.type === "Dough"
    );

    if (selectedDough) {
      total +=
        doughPrices[selectedDough.name]?.[size] || 0;
    }

    selected
      .filter((t) => t.type !== "Dough")
      .forEach((t) => {
        total += Number(t.price || 0);
      });

    setPrice(total);
  }, [selected, size]);

  const toppingCount = selected.filter(
    (t) => t.type !== "Sauce" && t.type !== "Dough"
  ).length;


  const toggleTopping = (topping) => {
    const isSingle =
      topping.type === "Sauce" ||
      topping.type === "Dough";

    if (isSingle) {
      setSelected((prev) => [
        ...prev.filter(
          (t) => t.type !== topping.type
        ),
        topping,
      ]);
      return;
    }

    setSelected((prev) => {
      const exists = prev.find(
        (t) => t.id === topping.id
      );

      if (!exists && toppingCount >= MAX_TOPPINGS)
        return prev;

      return exists
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping];
    });
  };

 
  const handleAddToCart = () => {
    const selectedDough = selected.find(
      (t) => t.type === "Dough"
    );
    const selectedSauce = selected.find(
      (t) => t.type === "Sauce"
    );

    if (!selectedDough || !selectedSauce || price === 0)
      return;

    addToCart({
      id: crypto.randomUUID(),
      type: "custom_pizza",
      name: "Custom Pizza",
      size,
      toppings: selected,
      price,
      quantity: 1,
    });



   
    setSelected([selectedDough]);
    setSize(42);
  };


  const grouped = toppings.reduce((acc, t) => {
    if (!acc[t.type]) acc[t.type] = [];
    acc[t.type].push(t);
    return acc;
  }, {});

  const renderSection = (type) => {
    if (!grouped[type]) return null;

    return (
      <div className="section">
        <h5>{type}</h5>

        {grouped[type].map((t) => {
          const isSingle =
            type === "Sauce" || type === "Dough";

          const exists = selected.some(
            (s) => s.id === t.id
          );

          const disabled =
            !isSingle &&
            !exists &&
            toppingCount >= MAX_TOPPINGS;

          return (
            <div
              key={t.id}
              className="form-check"
            >
              <input
                className="form-check-input"
                type={
                  isSingle ? "radio" : "checkbox"
                }
                name={isSingle ? type : undefined}
                checked={exists}
                disabled={disabled}
                onChange={() =>
                  toggleTopping(t)
                }
              />
              <label className="form-check-label">
                {t.name}
                {t.type !== "Dough" &&
                  t.price &&
                  ` (+${t.price} din)`}
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  const selectedDough = selected.find(
    (t) => t.type === "Dough"
  );
  const selectedSauce = selected.find(
    (t) => t.type === "Sauce"
  );

  return (
    <div>
    <div className="Pizza-Maker">
      <Navbar isMenuPage={true} />

      <div className="container-fluid pizza-builder">
        <div className="row">

        
          <div className="col-md-6 d-flex flex-column align-items-center pt-4">
            <div className="topping-counter">
              <span>{toppingCount}</span> /{" "}
              {MAX_TOPPINGS} toppings
            </div>

            <div
              className={`pizza-container size-${size}`}
            >
              {renderOrder.map((type) =>
                selected
                  .filter(
                    (t) => t.type === type
                  )
                  .map((t) => (
                    <img
                      key={t.id}
                      src={t.image_url}
                      alt={t.name}
                      className="pizza-layer fade-in"
                    />
                  ))
              )}
            </div>
          </div>

        
          <div className="col-md-6 options-grid">
            <div className="left-column">

              <div className="section">
                <h5>Size</h5>
                <div className="size-picker">
                  {[32, 42, 50].map((s) => (
                    <label
                      key={s}
                      className={`size-option ${
                        size === s
                          ? "active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="size"
                        checked={size === s}
                        onChange={() =>
                          setSize(s)
                        }
                      />
                      {s} cm
                    </label>
                  ))}
                </div>
              </div>

              {renderSection("Dough")}
              {renderSection("Sauce")}
              {renderSection("Meat")}
            </div>

            <div className="right-column">
              {renderSection("Vegetables")}
              {renderSection("Cheese")}
            </div>

            <div className="order-full">
              <div className="price-box">
                <h4>Total: {price} din</h4>

                <button
                  className={`btn w-100 mt-3 success ${
                    selectedDough &&
                    selectedSauce &&
                    price !== 0
                      ? "order-btn-active"
                      : "order-btn-disabled"
                  }`}
                  disabled={
                    !selectedDough ||
                    !selectedSauce ||
                    price === 0
                  }
                  onClick={handleAddToCart}
                  
                >
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
   
    </div>
     <Footer />
    </div>
  );
}