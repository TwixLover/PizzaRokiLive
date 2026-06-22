import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../db.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;


router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         first_name,
         last_name,
         email,
         phone,
         street,
         house_number,
         city,
         postal_code,
         password_hash
       FROM pizzadb.users
       WHERE id = $1`,
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      street: user.street,
      house_number: user.house_number,
      city: user.city,
      postal_code: user.postal_code,
      isGoogleUser: user.password_hash === "google",
    });

  } catch (err) {
    console.error("PROFILE GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/", requireAuth, async (req, res) => {
  const {
    email,
    phone,
    street,
    house_number,
    city,
    postal_code,
    oldPassword,
    newPassword
  } = req.body;

  if (!oldPassword)
    return res.status(400).json({ message: "Jelenlegi jelszó szükséges!" });

  if (!emailRegex.test(email))
    return res.status(400).json({ message: "Érvénytelen email formátum!" });

  try {
    const userResult = await pool.query(
      `SELECT password_hash FROM pizzadb.users WHERE id = $1`,
      [req.user.id]
    );

    const user = userResult.rows[0];

    
    if (user.password_hash === "google") {
      return res.status(400).json({ message: "Google felhasználó. Használd a Google hitelesítést!" });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ message: "Hibás jelszó!" });

    let passwordHash = user.password_hash;

    if (newPassword) {
      if (!strongPasswordRegex.test(newPassword)) {
        return res.status(400).json({
          message:
            "Az új jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell kisbetűt, nagybetűt, számot és speciális karaktert!"
        });
      }

      passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await pool.query(
      `UPDATE pizzadb.users SET
        email=$1, phone=$2, street=$3, house_number=$4, city=$5, postal_code=$6, password_hash=$7
       WHERE id=$8`,
      [email, phone, street, house_number, city, postal_code, passwordHash, req.user.id]
    );

    res.json({ message: "Profil frissítve" });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/google-update", requireAuth, async (req, res) => {
  const { credential, email, phone, street, house_number, city, postal_code } = req.body;

  if (!credential)
    return res.status(400).json({ message: "Google hitelesítés szükséges!" });

  if (!emailRegex.test(email))
    return res.status(400).json({ message: "Érvénytelen email formátum!" });

  try {
    
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (payload.email !== req.user.email)
      return res.status(401).json({ message: "Google email mismatch" });

    const userResult = await pool.query(
      `SELECT password_hash FROM pizzadb.users WHERE id = $1`,
      [req.user.id]
    );

    if (userResult.rows[0].password_hash !== "google") {
      return res.status(400).json({ message: "Ez nem Google felhasználó!" });
    }

    await pool.query(
      `UPDATE pizzadb.users SET
        email=$1, phone=$2, street=$3, house_number=$4, city=$5, postal_code=$6
       WHERE id=$7`,
      [email, phone, street, house_number, city, postal_code, req.user.id]
    );

    res.json({ message: "Profil frissítve Google hitelesítéssel" });

  } catch (err) {
    console.error("GOOGLE PROFILE UPDATE ERROR:", err);
    res.status(401).json({ message: "Google hitelesítés sikertelen" });
  }
});

export default router;
