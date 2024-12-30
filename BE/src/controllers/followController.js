import { ObjectId } from "mongodb";

import Follow from "../models/followModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

// Получение списка подписчиков пользователя
export const getUserFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({
      user_id: req.params.userId,
    }).populate("follower_user_id", "username");
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении подписчиков" });
  }
};

// Получение списка, на кого подписан пользователь
export const getUserFollowing = async (req, res) => {
  try {
    const following = await Follow.find({
      follower_user_id: req.params.userId,
    }).populate("follower_user_id", "username");
    res.status(200).json(following);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Ошибка при получении списка подписок" });
  }
};

// Подписка на пользователя
export const followUser = async (req, res) => {
  const { userId, targetUserId } = req.params;

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const existingFollow = await Follow.findOne({
      follower_user_id: userId,
      followed_user_id: targetUserId,
    });
    if (existingFollow) {
      return res
        .status(400)
        .json({ error: "Вы уже подписаны на этого пользователя" });
    }

    const follow = new Follow({
      follower_user_id: userId,
      user_id: targetUserId,
      created_at: new Date(),
    });

    user.following_count += 1;
    targetUser.followers_count += 1;

    await user.save();
    await targetUser.save();
    await follow.save();

    const notification = new Notification({
      user_id: targetUser.id,
      type: "Follow",

      content: `started following.`,
      sender_id: userId,
    });

    await notification.save();

    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при подписке на пользователя" });
  }
};

// Отписка от пользователя
export const unfollowUser = async (req, res) => {
  const { userId, targetUserId } = req.params;
  console.log("userId", userId);
  console.log("targetUserId", targetUserId);
  try {
    const follow = await Follow.findOne({
      user_id: new ObjectId(userId),
      follower_user_id: new ObjectId(targetUserId),
    });
    console.log(follow);
    if (!follow) {
      return res
        .status(404)
        .json({ error: "Вы не подписаны на этого пользователя" });
    }

    await Follow.findByIdAndDelete(follow._id);

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    user.following_count -= 1;
    targetUser.followers_count -= 1;

    await user.save();
    await targetUser.save();

    const notification = new Notification({
      user_id: targetUser.id,
      type: "Unfollow",

      content: `stopped following.`,
      sender_id: userId,
    });
    await notification.save();

    res.status(200).json({ message: "Вы отписались от пользователя" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ошибка при отписке от пользователя" });
  }
};
