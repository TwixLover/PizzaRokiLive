import express from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import db from "../db.js";
import { sendOrderNotification } from "../discordBot.js";

const router = express.Router();

const isRestaurantOpen = () => {
  const now = new Date();

  const day = now.getDay(); 
  const hour = now.getHours();
  

  if (day === 3) {
    return false;
  }

  if (hour < 12 || hour >= 22) {
    return false;
  }

  return true;
};
router.post("/", requireAuth, async (req, res) => {
    if (!isRestaurantOpen()) {
    return res.status(403).json({
      error: "Restaurant is currently closed",
      message: "Our working hours are 12:00 PM - 10:00 PM, Tuesday to Sunday. We are closed on Wednesdays."
      
    });
    console.log("ORDER REJECTED - RESTAURANT CLOSED")
  }

  const { items, price, delivery, notes } = req.body;
  const userId = req.user.id;

  try {
    await db.query("BEGIN");

    const orderResult = await db.query(
      `INSERT INTO pizzadb.orders 
       (user_id, total_amount, status, notes,
        delivery_first_name,
        delivery_last_name,
        delivery_phone,
        delivery_street,
        delivery_house_number,
        delivery_city,
        delivery_postal_code)
       VALUES ($1,$2,'pending',$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [
        userId,
        price,
        notes,
        delivery.first_name,
        delivery.last_name,
        delivery.phone,
        delivery.street,
        delivery.house_number,
        delivery.city,
        delivery.postal_code,
      ]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      let variantId = item.variant_id || null;

      const itemResult = await db.query(
        `INSERT INTO pizzadb.order_items
         (order_id, menu_item_id, variant_id, price_at_order, quantity)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING id`,
        [
          orderId,
          item.menu_item_id || null,
          variantId,
          item.price,
          item.quantity || 1,
        ]
      );

      const orderItemId = itemResult.rows[0].id;

      if (item.toppings?.length) {
        for (const topping of item.toppings) {
          await db.query(
            `INSERT INTO pizzadb.order_item_toppings
             (order_item_id, topping_id, topping_price)
             VALUES ($1,$2,$3)`,
            [orderItemId, topping.id, topping.price || 0]
          );
        }
      }
    }

    await db.query("COMMIT");

sendOrderNotification({
  orderId,
  delivery,
  price,
  items,
  notes
});


    res.json({ success: true, orderId });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: "Order failed" });
  }
});


router.get("/my-orders", requireAuth, async (req, res) => {
  console.log("FETCHING PREVIOUS ORDERS FOR USER:", req.user.id);
  const userId = req.user.id;

  try {
    const result = await db.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.placed_at,
        COALESCE(
          json_agg(
            json_build_object(
              'menu_item_id', oi.menu_item_id,
              'variant_id', oi.variant_id,
              'quantity', oi.quantity,
              'price', oi.price_at_order,
              'name', mi.name,
              'size', mv.size,
              'toppings', (
                SELECT COALESCE(
                  json_agg(
                    json_build_object(
                      'id', t.id,
                      'name', t.name
                    )
                  ),
                  '[]'
                )
                FROM pizzadb.order_item_toppings oit
                JOIN pizzadb.toppings t 
                  ON t.id = oit.topping_id
                WHERE oit.order_item_id = oi.id
              )
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM pizzadb.orders o
      LEFT JOIN pizzadb.order_items oi 
        ON oi.order_id = o.id
      LEFT JOIN pizzadb.menu_items mi 
        ON mi.id = oi.menu_item_id
      LEFT JOIN pizzadb.menu_item_variants mv
        ON mv.id = oi.variant_id
      WHERE o.user_id = $1
      AND o.status = 'delivered'
      GROUP BY o.id
      ORDER BY o.placed_at DESC
    `, [userId]);

    res.json(result.rows);

  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
router.get("/active-orders", requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {

    const result = await db.query(`
      SELECT 
        id,
        status,
        placed_at
      FROM pizzadb.orders
      WHERE user_id = $1
      AND status != 'delivered'
      ORDER BY placed_at DESC
    `, [userId]);

    res.json(result.rows);

  } catch (err) {

    console.error("ACTIVE ORDERS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch active orders" });

  }
});

export default router;