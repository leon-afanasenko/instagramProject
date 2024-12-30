import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import generateToken from "../config/jwt.js";

// Регистрация пользователя
export const register = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  try {
    console.log("Полученные данные при регистрации:", {
      username,
      email,
      full_name,
    });

    // Проверяем, существует ли пользователь с таким email или username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    console.log("Существующий пользователь:", existingUser);

    if (existingUser) {
      const errors = {};
      if (existingUser.email === email) {
        errors.email = "This email is already taken";
      }
      if (existingUser.username === username) {
        errors.username = "This username is already taken";
      }

      return res.status(400).json({ errors });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Хешированный пароль:", hashedPassword);

    // Создаем нового пользователя
    const user = new User({
      username,
      email,
      password: hashedPassword,
      full_name,
    });

    await user.save();
    console.log("Пользователь сохранён:", user);

    // Генерируем токен
    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Логин пользователя
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Попытка логина с email:", email);

    // Поиск пользователя
    const user = await User.findOne({ email });
    console.log("Найден пользователь:", user);

    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Результат проверки пароля:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    // Генерация токена
    const token = generateToken(user);

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Ошибка при логине:", error);
    res
      .status(500)
      .json({ message: "Authorisation error", error: error.message });
  }
};

// Проверка существования пользователя
export const checkUser = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("Проверка пользователя с email:", email);

    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ message: "User found" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Ошибка при проверке пользователя:", error);
    res
      .status(500)
      .json({
        message: "Ошибка при проверке пользователя",
        error: error.message,
      });
  }
};

// Обновление пароля
export const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    console.log("Запрос на обновление пароля:", { email });

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Необходимые данные не были переданы" });
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Новый хешированный пароль:", hashedPassword);

    // Находим пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Обновляем пароль
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Пароль успешно обновлен" });
  } catch (error) {
    console.error("Ошибка при обновлении пароля:", error);
    res
      .status(500)
      .json({ message: "Ошибка при обновлении пароля", error: error.message });
  }
};
