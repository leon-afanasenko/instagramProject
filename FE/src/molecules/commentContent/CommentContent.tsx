import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import { fetchComments, likeComment } from "../../redux/slices/commentsSlice";
import noPhoto from "../../assets/noPhoto.png";
import parseData from "../../helpers/parseData";
import { RootState } from "../../redux/store";
import s from "./CommentContent.module.css";

interface CommentContentProps {
  postId: string;
}

const CommentContent: React.FC<CommentContentProps> = ({ postId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const comments = useSelector((state: RootState) => state.comments.comments);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.comments.loading);

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser || !currentUser._id) {
      console.error(t("postModal.errorUserNotFound"));
      return;
    }
    try {
      await dispatch(
        likeComment({ commentId, userId: currentUser._id })
      ).unwrap();
      dispatch(fetchComments(postId));
    } catch (err) {
      console.error("Ошибка при лайке комментария:", err);
    }
  };

  if (loading) {
    return <p>{t("postModal.loadingComments")}</p>;
  }

  return (
    <div className={s.commentsSection}>
      {comments.map((comment: any) => (
        <div key={comment._id} className={s.comment}>
          <img
            src={comment.userAvatar || noPhoto}
            alt="comment-avatar"
            className={s.commentAvatar}
          />
          <div className={s.commentContent}>
            <p>
              <strong>
                {comment.user_id === currentUser?._id
                  ? currentUser?.username
                  : comment.username || t("postModal.anonymous")}
              </strong>{" "}
              · {parseData(comment.created_at)}
            </p>
            <p>{comment.comment_text}</p>
          </div>
          <div className={s.commentActions}>
            <FaHeart
              className={`${s.likeIcon} ${
                comment.likes?.includes(currentUser._id) ? s.liked : s.unliked
              }`}
              onClick={() => handleLikeComment(comment._id)}
            />
            <span className={s.likeCount}>{comment.likes?.length || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentContent;
