import jwt from "jsonwebtoken";

// Professional authentication middleware
const authProfessional = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(" Incoming headers:", req.headers);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }

  const ptoken = authHeader.split(" ")[1];
  try {
    const token_decode = jwt.verify(ptoken, process.env.JWT_SECRET);
    req.profId = token_decode.id;
    console.log(" Middleware set req.profId as:", req.profId);

    console.log(" Decoded token:", token_decode);
    next();
  } catch (error) {
    console.log("jwt error", error);
    res.json({ success: false, message: error.message });
  }
};

export default authProfessional;
