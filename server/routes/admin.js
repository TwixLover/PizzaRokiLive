import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  try {
    const itemsRes = await pool.query(
      `SELECT * FROM pizzadb.menu_items ORDER BY type, name`
    );

    const variantsRes = await pool.query(
      `SELECT * FROM pizzadb.menu_item_variants`
    );

    const usersRes = await pool.query(
      `SELECT * FROM pizzadb.users ORDER BY email`
    );

    const items = itemsRes.rows.map(item => ({
      ...item,
      variants: variantsRes.rows.filter(
        v => v.menu_item_id === item.id
      )
    }));

    res.render("admin", {
      menuItems: items,
      users: usersRes.rows
    });

  } catch (err) {
    console.error("Admin GET error:", err);
    res.status(500).send("Admin panel hiba");
  }
});

router.put("/menu/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, base_price, image_url } = req.body;

  try {
    await pool.query(
      `
      UPDATE pizzadb.menu_items
      SET name = $1,
          description = $2,
          base_price = $3,
          image_url = $4
      WHERE id = $5
      `,
      [name, description, base_price, image_url, id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("UPDATE error:", err);
    res.status(500).json({ error: "Frissítés sikertelen" });
  }
});

router.delete("/menu/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `DELETE FROM pizzadb.menu_items WHERE id = $1`,
      [id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ error: "Törlés sikertelen" });
  }
});

router.post("/menu", requireAdmin, async (req, res) => {
  const { name, description, base_price, image_url, type } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO pizzadb.menu_items
      (name, description, base_price, image_url, type)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [name, description, base_price, image_url, type]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("CREATE error:", err);
    res.status(500).json({ error: "Létrehozás sikertelen" });
  }
});


router.put("/user/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  const {
    email,
    first_name,
    last_name,
    phone,
    street,
    house_number,
    city,
    postal_code,
    role
  } = req.body;

  try {

    await pool.query(
      `
      UPDATE pizzadb.users
      SET email = $1,
          first_name = $2,
          last_name = $3,
          phone = $4,
          street = $5,
          house_number = $6,
          city = $7,
          postal_code = $8,
          role = $9,
          updated_at = NOW()
      WHERE id = $10
      `,
      [
        email,
        first_name,
        last_name,
        phone,
        street,
        house_number,
        city,
        postal_code,
        role,
        id
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("USER UPDATE error:", err);
    res.status(500).json({
      error: "Felhasználó frissítése sikertelen"
    });
  }
});



router.delete("/user/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {

    await pool.query(
      `DELETE FROM pizzadb.users WHERE id = $1`,
      [id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("USER DELETE error:", err);
    res.status(500).json({
      error: "Felhasználó törlése sikertelen"
    });
  }
});

export default router;