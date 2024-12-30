import User from '../models/userModel.js';
import Post from '../models/postModel.js';

// Поиск пользователей по имени
export const searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find({ username: { $regex: query, $options: 'i' } }).select('username bio');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при поиске пользователей' });
  }
};

// Поиск постов по содержимому
export const searchPosts = async (req, res) => {
  const { query } = req.query;

  try {
    const filter = query ? {
      $or: [
        { content: { $regex: query, $options: 'i' } },
        { caption: { $regex: query, $options: 'i' } }
      ]
    } : {};

    const posts = await Post.find(filter).populate('user_id', 'username');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при поиске постов' });
  }
};