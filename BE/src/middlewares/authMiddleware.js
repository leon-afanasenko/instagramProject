import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Доступ запрещен. Токен не предоставлен." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Неверный токен." });
  }
};

export default authMiddleware;
