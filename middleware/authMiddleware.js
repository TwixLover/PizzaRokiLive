import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).send("Invalid token");
  }
};

export const requireAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).send("Invalid token");
  }
};

export const requireEmployee = (req, res, next) => {
  console.log("Cookies:", req.cookies);
  console.log("Token:", req.cookies.token);

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "employee") {
      return res.status(403).send("Forbidden");
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).send("Invalid token");
    console.log(err);
  }
};