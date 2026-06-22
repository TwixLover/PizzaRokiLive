import express from "express";
import db from "../db.js";
import { requireEmployee } from "../../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", requireEmployee, async (req, res) => {
  try {
    const orders = await db.query(`
      SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'order_item_id', oi.id,
              'quantity', oi.quantity,
              'price', oi.price_at_order,
              'name', mi.name,
              'size', mv.size,
              'toppings', (
                SELECT COALESCE(json_agg(t.name),'[]')
                FROM pizzadb.order_item_toppings oit
                JOIN pizzadb.toppings t ON t.id = oit.topping_id
                WHERE oit.order_item_id = oi.id
              )
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM pizzadb.orders o
      LEFT JOIN pizzadb.order_items oi ON oi.order_id = o.id
      LEFT JOIN pizzadb.menu_items mi ON mi.id = oi.menu_item_id
      LEFT JOIN pizzadb.menu_item_variants mv ON mv.id = oi.variant_id
      WHERE o.status != 'delivered'
      GROUP BY o.id
      ORDER BY o.placed_at DESC
    `);

    res.render("employee", { orders: orders.rows });

  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});


router.put("/:id/status", requireEmployee, async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  try {

    await db.query(`
      UPDATE pizzadb.orders
      SET status = $1
      WHERE id = $2
    `, [status, orderId]);

    const io = req.app.get("io");

    if (status === "delivered") {
      io.emit("order-delivered", { id: orderId });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Status update failed" });
  }
});

export default router;