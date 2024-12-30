import jwt from "jsonwebtoken";

const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.user_id;
};

export default getUserIdFromToken;
