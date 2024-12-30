import express from 'express';
import { searchUsers, searchPosts } from '../controllers/searchController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Поиск пользователей по имени
router.get('/users', searchUsers);

// Поиск постов по содержимому
router.get('/posts', searchPosts);

export default router;