import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/pizza-builder", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT t.id, t.name, t.type, t.price, t.image_url
      FROM pizzadb.toppings t
      JOIN pizzadb.menu_item_toppings mit
        ON mit.topping_id = t.id
      JOIN pizzadb.menu_items m
        ON m.id = mit.menu_item_id
      WHERE m.type = 'Pizza'
      ORDER BY t.type, t.name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Pizza builder toppings error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:menuItemId", async (req, res) => {
  const { menuItemId } = req.params;

  try {
    const result = await pool.query(`
      SELECT t.id, t.name
      FROM pizzadb.menu_item_toppings mit
      JOIN pizzadb.toppings t
        ON t.id = mit.topping_id
      WHERE mit.menu_item_id = $1
      ORDER BY t.name
    `, [menuItemId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Toppings fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, type, price, image_url
      FROM pizzadb.toppings
      ORDER BY type, name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;