import express from 'express';
import { getPostLikes, likePost, unlikePost, getUserLikes} from '../controllers/likeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Маршрут для получения лайков поста
router.get('/:postId/likes', authMiddleware, getPostLikes);

// Лайк поста
router.post('/:postId/:userId', likePost);

// Удаление лайка
router.delete('/:postId/:userId', unlikePost);


//все лайки текущего пользователя
router.get('/user/:userId', getUserLikes);


export default router;