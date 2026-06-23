import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../db.js";
import { OAuth2Client } from "google-auth-library";
import { requireAuth } from "../../middleware/authMiddleware.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
   REGISTER
*/
router.post("/register", async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    street,
    house_number,
    city,
    postal_code,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing data" });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "The password must be at least 8 characters long, contain uppercase and lowercase letters, and contain special characters.",
    });
  }

  try {
    const emailExists = await pool.query(
      "SELECT 1 FROM pizzadb.users WHERE email = $1",
      [email]
    );

    if (emailExists.rowCount > 0) {
      return res.status(400).json({ message: "This email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expires = new Date(Date.now() + 1000 * 60 * 15);

    await pool.query(
      `
      INSERT INTO pizzadb.users (
        id, email, password_hash, first_name, last_name,
        phone, street, house_number, city, postal_code, role,
        email_verification_token, email_verification_expires
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'user',$11,$12)
      `,
      [
        uuidv4(),
        email,
        passwordHash,
        first_name,
        last_name,
        phone,
        street,
        house_number,
        city,
        postal_code,
        hashedToken,
        expires,
      ]
    );

    const verifyUrl = `https://pizzarokilive.onrender.com/routes/verify-email/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Verify your email",
      html: `Hi ${first_name},<br> Please verify your email by clicking the link below:<br><a href="${verifyUrl}">Verify Email</a> <br> <br> Pizza Roki team`,
    });

    res.status(201).json({
      message: "Registration successful! Please check your email.",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
   VERIFY EMAIL
*/
router.get("/verify-email/:token", async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    const result = await pool.query(
      `
      SELECT id FROM pizzadb.users
      WHERE email_verification_token = $1
      AND email_verification_expires > NOW()
      `,
      [hashedToken]
    );

    if (result.rowCount === 0) {
      return res.redirect(`https://pizzarokilive-1.onrender.com/login?verified=false`);
    }

    await pool.query(
      `
      UPDATE pizzadb.users
      SET email_verified = true,
          email_verification_token = NULL,
          email_verification_expires = NULL
      WHERE id = $1
      `,
      [result.rows[0].id]
    );

    res.redirect(`https://pizzarokilive-1.onrender.com/login?verified=true`);

  } catch (err) {
    console.error(err);
    res.redirect(`https://pizzarokilive-1.onrender.com/login?verified=false`);
  }
});

/*
   RESEND VERIFICATION
*/
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, email_verified, first_name FROM pizzadb.users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.json({ message: "If the email exists, we sent a link" });
    }

    const user = result.rows[0];

    if (user.email_verified) {
      return res.json({ message: "Email already verified" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expires = new Date(Date.now() + 1000 * 60 * 15);

    await pool.query(
      `
      UPDATE pizzadb.users
      SET email_verification_token = $1,
          email_verification_expires = $2
      WHERE id = $3
      `,
      [hashedToken, expires, user.id]
    );

    const verifyUrl = `https://pizzarokilive.onrender.com/routes/verify-email/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Verify your email",
      html: `Hi ${user.first_name},<br> Please verify your email by clicking the link below:<br><a href="${verifyUrl}">Verify Email</a> <br> <br> Pizza Roki team`,
    });

    res.json({ message: "Verification email sent again" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* 
   LOGIN
*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, email, password_hash, role, email_verified FROM pizzadb.users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const user = result.rows[0];

    if (!user.email_verified && user.password_hash !== "google") {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      sameSite: "none",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
  Google LOGIN
*/
router.post("/google-login", async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const first_name = payload.given_name || "";
    const last_name = payload.family_name || "";

    const userResult = await pool.query(
      "SELECT id, email, role FROM pizzadb.users WHERE email = $1",
      [email]
    );

    let user;

    if (userResult.rowCount === 0) {
      const id = uuidv4();

      await pool.query(
        `
        INSERT INTO pizzadb.users (
          id, email, password_hash, first_name, last_name, role, email_verified
        )
        VALUES ($1,$2,$3,$4,$5,'user', true)
        `,
        [id, email, "google", first_name, last_name]
      );

      user = { id, email, role: "user" };
    } else {
      user = userResult.rows[0];
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({
      message: "Login successful",
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google authentication failed" });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out" });
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, first_name FROM pizzadb.users WHERE email = $1",
      [email]
      
    );
    const firstName = result.rows[0].first_name;
    if (result.rowCount === 0) {
      return res.json({
        message: "If the email exists, we sent a reset link",
      });
    }

    const user = result.rows[0];

    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expires = new Date(Date.now() + 1000 * 60 * 15);

    await pool.query(
      `
      UPDATE pizzadb.users
      SET password_reset_token = $1,
          password_reset_expires = $2
      WHERE id = $3
      `,
      [hashedToken, expires, user.id]
    );

    const resetUrl = `https://pizzarokilive-1.onrender.com/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Reset your password",
      html: `Hi ${firstName},<br> You have requested to reset your password. Please click the link below to reset it:<br><a href="${resetUrl}">Reset Password</a> <br> <br> Pizza Roki team`,
    });

    res.json({
      message: "If the email exists, we sent a reset link",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/reset-password/:token", async (req, res) => {
  const { password, confirmPassword } = req.body;
if (!password || !confirmPassword) {
  return res.status(400).json({
    message: "All fields are required",
  });
}

if (password !== confirmPassword) {
  return res.status(400).json({
    message: "Passwords do not match",
  });
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message:
      "Password must be at least 8 characters long and include uppercase, lowercase, number and special character.",
  });
}
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    const result = await pool.query(
      `
      SELECT id FROM pizzadb.users
      WHERE password_reset_token = $1
      AND password_reset_expires > NOW()
      `,
      [hashedToken]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const user = result.rows[0];

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE pizzadb.users
      SET password_hash = $1,
          password_reset_token = NULL,
          password_reset_expires = NULL
      WHERE id = $2
      `,
      [passwordHash, user.id]
    );

    res.json({ message: "Password successfully reset" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;