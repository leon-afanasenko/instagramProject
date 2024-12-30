import express from "express";
import {
  register,
  login,
  checkUser,
  updatePassword,
} from "../controllers/authController.js";

const router = express.Router();

// Регистрация нового пользователя
router.post("/register", register);

// Вход пользователя
router.post("/login", login);

// Проверка пользователя
router.post("/check-user", checkUser);

// Обновление пароля
router.post("/update-password", updatePassword);

// Тестовый маршрут
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Test route is working!" });
});

export default router;
