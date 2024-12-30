import React, { useState, useEffect, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { useSelector } from "react-redux";

import CustomButton from "../../atoms/customButton/CustomButton";
import { $api } from "../../api/api";
import avaImage from "../../assets/noPhoto.png";
import parseData from "../../helpers/parseData";
import { RootState } from "../../redux/store";
import styles from "./PostItem.module.css";

type Post = {
  _id: string;
  user_id: string | { _id: string };
  image_url: string;
  caption: string;
  created_at: string;
  user_name: string;
  profile_image: string;
  likes_count?: number;
  comments_count?: number;
  last_comment?: string;
};

type PostItemProps = {
  item: Post;
  likesCount: number;
  setLikesCount: (postId: string, newCount: number) => void;
  onClick: () => void;
  listFollowing: string[] | null;
  handleRemoveSomeFollow: (arg0: string) => void;
  handleAddSomeFollow: (arg0: string) => void;
};

const PostItem: React.FC<PostItemProps> = ({
  item,
  likesCount,
  setLikesCount,
  onClick,
  listFollowing,
  handleAddSomeFollow,
  handleRemoveSomeFollow,
}) => {
  console.log(item);
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { _id } = currentUser || {};
  const userId =
    typeof item.user_id === "string" ? item.user_id : item.user_id?._id || "";

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  if (!currentUser) {
    console.error("Current user not found");
    return null;
  }
  if (userId === _id) {
    return null;
  }

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const response = await $api.get(`/likes/user/${_id}`);
        const userLikes = response.data;
        if (userLikes.includes(item._id)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Ошибка при загрузке статуса лайка:", error);
      }
    };

    fetchLikedStatus();
  }, [item._id, _id]);

  useEffect(() => {
    if (listFollowing && userId) {
      setIsFollowing(listFollowing.includes(userId));
    }
  }, [_id, userId, listFollowing]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await $api.delete(`/likes/${item._id}/${_id}`);
        setLikesCount(item._id, likesCount - 1);
      } else {
        await $api.post(`/likes/${item._id}/${_id}`);
        setLikesCount(item._id, likesCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Ошибка при изменении лайка:", error);
    }
  };

  const handleFollow = async () => {
    if (!_id || !userId) {
      console.error(
        "Не удалось выполнить подписку: отсутствует _id или userId"
      );
      return;
    }

    try {
      const response = await $api.post(`/follow/${_id}/follow/${userId}`);
      if (response.status === 201) {
        setIsFollowing(true);
      }
      handleAddSomeFollow(userId);
    } catch (error) {
      console.error("Ошибка при подписке:", error);
    }
  };

  const handleUnfollow = async () => {
    if (!_id || !userId) {
      console.error("Не удалось выполнить отписку: отсутствует _id или userId");
      return;
    }

    try {
      const response = await $api.delete(`/follow/${userId}/unfollow/${_id}`);
      if (response.status === 200) {
        setIsFollowing(false);
      }

      handleRemoveSomeFollow(userId);
    } catch (error) {
      console.error("Ошибка при отписке:", error);
    }
  };

  const handleClickToFollow = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <li
      className={styles.postItem}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
          <img
            src={item.user_id.profile_image || avaImage}
            alt="avatar"
            className={styles.avatar}
          />
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{item.user_id.username}</span>
          <span className={styles.greytext}>
            &#8226; {parseData(item.created_at)} &#8226;
          </span>
          {isFollowing !== null && (
            <CustomButton
              text={
                isFollowing
                  ? t("otherProfile.unfollow")
                  : t("otherProfile.follow")
              }
              style={{
                fontWeight: 600,
                color: "var( --color-text-blue)",
                backgroundColor: "transparent",
              }}
              onClick={handleClickToFollow}
            />
          )}
        </div>
      </div>
      <div className={styles.imgPost}>
        <img
          src={item.image_url}
          alt="Post Image"
          className={styles.postImage}
        />
      </div>
      <div className={styles.bottomBlock}>
        <div className={styles.actions}>
          <FaHeart
            className={`${styles.likeIcon} ${
              isLiked ? styles.liked : styles.unliked
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            size={20}
          />
          <span className={styles.likesCount}>{likesCount} likes</span>
          <FaRegComment className="text-gray-500" size={20} />
        </div>
        <span>
          <span className="font-semibold italic">{item.user_name}</span>:{" "}
          {item.caption}
        </span>
      </div>
      <div className={styles.commentsContainer}>
        <span>{item.last_comment || "Add a comment..."}</span>
        <span className={styles.commentText}>
          View all comments ({item.comments_count})
        </span>
      </div>
    </li>
  );
};

export default PostItem;
