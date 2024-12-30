import express from "express";
import {
  createComment,
  getPostComments,
  deleteComment,
  likeComment,
} from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Добавить комментарий
router.post("/:postId", authMiddleware, createComment);

// Получить все комментарии
router.get("/:postId", authMiddleware, getPostComments);

// Удалить комментарий
router.delete("/:commentId", authMiddleware, deleteComment);

// Лайк или анлайк комментария
router.post("/like/:commentId", authMiddleware, likeComment);

export default router;
