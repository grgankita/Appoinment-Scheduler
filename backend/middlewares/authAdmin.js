import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error(" JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authAdmin;
