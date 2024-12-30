import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import stream from "stream";

import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import getUserIdFromToken from "../utils/helpers.js";
import { log } from "console";

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Получение всех постов пользователя
export const getUserPosts = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const posts = await Post.find({ user_id: userId }).lean();
    const user = await User.findById(userId, {
      username: 1,
      profile_image: 1,
    }).lean();

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const postsDTO = posts.map((post) => ({
      ...post,
      user_name: user.username,
      profile_image: user.profile_image,
    }));

    // Возвращаем преобразованный массив постов
    res.status(200).json(postsDTO);
  } catch (error) {
    console.error("Ошибка при получении постов:", error);
    res.status(500).json({ error: "Ошибка при получении постов" });
  }
};

// Создание нового поста
export const createPost = async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { caption } = req.body;

  try {
    // get image
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    let image_url = "test";

    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Ошибка загрузки" });
        }
        image_url = result.secure_url;

        const user = await User.findById(userId);
        if (!user)
          return res.status(404).json({ error: "Пользователь не найден" });

        // Проверяем, был ли загружен файл
        if (!req.file)
          return res
            .status(400)
            .json({ error: "Изображение не предоставлено" });

        const post = new Post({
          user_id: userId,
          // image_url: `data:image/jpeg;base64,${imageBase64}`, // Используйте соответствующий формат изображения
          image_url,
          user_name: user.username,
          profile_image: user.profile_image,
          caption,
          created_at: new Date(),
        });

        await post.save();

        user.posts_count += 1;
        await user.save();

        res.status(201).json(post);
      })
      .end(req.file.buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ошибка при создании поста" });
  }
};

// Удаление поста
export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Пост не найден" });

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(post.user_id);
    user.posts_count -= 1;
    await user.save();

    res.status(200).json({ message: "Пост удалён" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении поста" });
  }
};

// Получение поста по ID
export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("user_id", "username");
    const user = await User.findById(post.user_id, {
      _id: 0,
      username: 1,
      profile_image: 1,
    }).lean();
    if (!post) return res.status(404).json({ error: "Пост не найден" });
    const postDTO = {
      ...post,
      ...user,
    };
    console.log(postDTO);
    res.status(200).json(postDTO);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении поста" });
  }
};

// Обновление поста
export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { caption } = req.body;

  console.log("Received request body:", req.body);
  console.log("Received request file:", req.file);

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Пост не найден" });
    }

    // Обновляем описание
    if (caption !== undefined) {
      post.caption = caption;
    }

    // Обновляем картинку
    if (req.file) {
      console.log("Uploading file to Cloudinary...");
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload success:", result.secure_url);
              resolve(result);
            }
          })
          .end(req.file.buffer);
      });

      post.image_url = uploadResult.secure_url;
    }

    console.log("Saving post to database...");
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Ошибка при обновлении поста" });
  }
};

// Получение всех постов
export const getAllPosts = async (req, res) => {
  const sender_id = req.user._id;
  console.log(sender_id);
  try {
    const posts = await Post.find({}).populate(
      "user_id",
      "username profile_image"
    );

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении всех постов" });
  }
};

export const getOtherUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const posts = await Post.find({ user_id: user_id }).lean();
    const user = await User.findById(user_id, {
      _id: 0,
      username: 1,
      profile_image: 1,
    }).lean();
    const postsDTO = posts.map((post) => ({
      ...post,
      user_name: user.username,
      profile_image: user.profile_image,
    }));
    res.status(200).json(postsDTO);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении постов" });
  }
};

// Находим все посты пользователей, на которых подписан текущий пользователь
export const getFollowingPosts = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    // Находим пользователя и получаем список его подписок
    const user = await User.findById(userId).populate("following", "_id");
    const followingIds = user.following.map((followedUser) => followedUser._id);

    // Находим все посты пользователей, на которых подписан текущий пользователь
    const posts = await Post.find({ user_id: { $in: followingIds } })
      .populate("user_id", "username profile_image")
      .sort({ created_at: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ошибка при получении постов подписанных пользователей" });
  }
};
