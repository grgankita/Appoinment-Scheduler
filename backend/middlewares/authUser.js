import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // fixes earlier "undefined" token

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("JWT Error:", error);
    return res.status(401).json({ success: false, message: "Token Invalid" });
  }
};

export default authUser;
