import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../redux/slices/commentsSlice";
import { RootState } from "../../redux/store";
import noPhoto from "../../assets/noPhoto.png";
import { FaEllipsisV } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import s from "./postModal.module.css";
import { $api } from "../../api/api";
import commbtn from "../../assets/comment_btn.svg";
import heart from "../../assets/heart_btn.svg";
import CommentContent from "../commentContent/CommentContent";

interface ModalProps {
  post: Post;
  onClose: () => void;
  onUpdatePosts: () => void;
}

const EmojiPicker: React.FC<{ onSelectEmoji: (emoji: string) => void }> = ({
  onSelectEmoji,
}) => {
  const [showEmojis, setShowEmojis] = useState(false);

  const emojis = Array.from({ length: 80 }, (_, i) =>
    String.fromCodePoint(0x1f600 + i)
  );

  const toggleEmojiPicker = () => {
    setShowEmojis((prev) => {
      const newState = !prev;
      if (newState) {
        setTimeout(() => {
          setShowEmojis(false);
        }, 6000);
      }
      return newState;
    });
  };

  return (
    <div className={s.emojiDropdown}>
      <button
        type="button"
        className={s.emojiButton}
        onClick={toggleEmojiPicker}
      >
        😊
      </button>
      {showEmojis && (
        <div className={s.emojiList}>
          {emojis.map((emoji, index) => (
            <span
              key={index}
              className={s.emojiItem}
              onClick={() => onSelectEmoji(emoji)}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const PostModal: React.FC<ModalProps> = ({ post, onClose, onUpdatePosts }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption);
  const [editedImage, setEditedImage] = useState(post.image_url);

  useEffect(() => {
    setLikesCount(post.likes_count || 0);
    setCommentsCount(post.comments_count || 0);
  }, [post]);

  const handleAddComment = async () => {
    if (!currentUser || !currentUser._id) {
      setError(t("postModal.errorUserNotFound"));
      return;
    }

    try {
      await dispatch(
        addComment({
          postId: post._id,
          userId: currentUser._id,
          comment_text: newComment.trim(),
        })
      );
      setNewComment("");
      setCommentsCount((prev) => prev + 1);
    } catch (err) {
      setError(t("postModal.errorAddComment"));
    }
  };

  const handleLikePost = async () => {
    if (!currentUser || !currentUser._id) {
      setError(t("postModal.errorUserNotFound"));
      return;
    }

    try {
      await $api.post(`/post/${post._id}/like`, { userId: currentUser._id });
      setLikesCount((prev) => prev + 1);
    } catch (err) {
      console.error("Ошибка при лайке поста:", err);
    }
  };

  const toggleActionMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionMenu(!showActionMenu);
  };

  const handleDeletePost = async () => {
    try {
      await $api.delete(`/post/${post._id}`);
      onUpdatePosts();
      onClose();
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Ошибка при удалении поста:", error);
    }
  };

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalContent_leftside}>
          <img src={post.image_url || noPhoto} alt="post" />
        </div>
        <div></div>
        <div className={s.modalContent_rightside}>
          <div className={s.modalContent_rightside_caption}>
            <div className={s.topBlockTop}>
              <span className={s.gradient_border}>
                <span className={s.gradient_border_inner}>
                  <img src={post.profile_image || noPhoto} alt="profile" />
                </span>
              </span>
              <div className={s.nameCaption}>
                <span className={s.user_name}>{post.user_name}</span>
              </div>
            </div>

            <div className={s.topBlock}>
              <span className={s.gradient_border}>
                <span className={s.gradient_border_inner}>
                  <img src={post.profile_image || noPhoto} alt="profile" />
                </span>
              </span>
              <div className={s.nameCaption}>
                <span className={s.modalCaption}>{post.caption}</span>
              </div>
            </div>

            <button className={s.moreOptionsButton} onClick={toggleActionMenu}>
              <FaEllipsisV />
            </button>
          </div>

          {showActionMenu && (
            <div className={s.actionMenu}>
              <button
                className={`${s.actionButton} ${s.deleteButton}`}
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete
              </button>

              <button
                className={s.actionButton}
                onClick={() => {
                  setShowEditModal(true);
                  toggleActionMenu();
                }}
              >
                Edit
              </button>

              <button className={s.actionButton} onClick={toggleActionMenu}>
                Go to post
              </button>

              <button
                className={s.actionButton}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/post/${post._id}`
                  );
                  alert("Link copied to clipboard!");
                }}
              >
                Copy link
              </button>

              <button className={s.actionButton} onClick={toggleActionMenu}>
                Cancel
              </button>
            </div>
          )}
          {showEditModal && (
            <div className={s.editModal}>
              <div className={s.editModalContent}>
                <h2>Edit Post</h2>

                <textarea
                  className={s.editInput}
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  placeholder="Edit caption"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditedImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                {editedImage && (
                  <img
                    src={editedImage}
                    alt="Preview"
                    className={s.previewImage}
                  />
                )}

                <div className={s.editButtons}>
                  <button
                    className={s.saveButton}
                    onClick={async () => {
                      try {
                        await $api.put(`/post/${post._id}`, {
                          caption: editedCaption,
                          image_url: editedImage,
                        });
                        setShowEditModal(false);
                        onUpdatePosts();
                      } catch (error) {
                        console.error(
                          "Ошибка при сохранении изменений:",
                          error
                        );
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    className={s.cancelButton}
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteConfirmation && (
            <div className={s.deleteConfirmation}>
              <p>Are you sure you want to delete this post?</p>
              <div className={s.delButtons}>
                <button
                  className={s.confirmDeleteButton}
                  onClick={handleDeletePost}
                >
                  Yes
                </button>
                <button
                  className={s.cancelDeleteButton}
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  No
                </button>
              </div>
            </div>
          )}

          <div className={s.commentsSection}>
            <CommentContent postId={post._id} />
          </div>
          <div>
            <div className={s.modalContent_rightside_notifications}>
              <span>
                <img src={commbtn} alt="" /> {commentsCount}
              </span>
              <span>
                <img src={heart} alt="" onClick={handleLikePost} /> {likesCount}{" "}
                Likes
              </span>
            </div>
            <div className={s.modalContent_rightside_notifications_date}>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            <div className={s.addCommentSection}>
              <EmojiPicker
                onSelectEmoji={(emoji) => setNewComment((prev) => prev + emoji)}
              />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("postModal.addComment")}
                className={s.commentInput}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={s.commentButton}
              >
                {t("postModal.submit")}
              </button>
            </div>
            {error && <p className={s.errorText}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
