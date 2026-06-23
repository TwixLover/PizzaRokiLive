import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { pool } from "./db.js";
import toppingsRoutes from "./routes/toppings.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import profileRoutes from "./routes/profile.js";
import ordersRoutes from "./routes/orders.js";
import employeeRoutes from "./routes/employee.js";
import { createServer } from "http";
import { Server } from "socket.io";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.disable("x-powered-by");

app.use(cors({
  origin: ["http://localhost:5173",
  "https://pizzarokilive-1.onrender.com/",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());



app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "server/views"));
app.use(express.static(path.join(process.cwd(), "server/public")));



app.use("/routes", authRoutes);
app.use("/admin", adminRoutes);
app.use("/profile", profileRoutes);
app.use("/toppings", toppingsRoutes);
app.use("/orders", ordersRoutes);
app.use("/employee", employeeRoutes);



app.get("/menu", async (req, res) => {
  try {
    const query = `
      SELECT 
          i.id, 
          i.name, 
          i.description,
          i.base_price,
          i.image_url,
          i.rating,
          i.type,
          json_agg(
              json_build_object(
                  'size', v.size, 
                  'price', v.price
              )
              ORDER BY v.size ASC
          ) FILTER (WHERE v.id IS NOT NULL) AS variants
      FROM pizzadb.menu_items i
      LEFT JOIN pizzadb.menu_item_variants v 
        ON i.id = v.menu_item_id
      GROUP BY 
        i.id, i.name, i.description, 
        i.base_price, i.image_url, 
        i.rating, i.type
      ORDER BY i.name;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Menu query error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});



const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
  "http://localhost:5173",
  "http://192.168.1.25:5173",
  "https://pizzarokilive-1.onrender.com/"
],
    credentials: true
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

httpServer.listen(5000,"0.0.0.0", () => {
  console.log("Server running on http://localhost:5000");
});