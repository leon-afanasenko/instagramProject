import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getOtherUserPosts } from "../../redux/slices/postsSlice";
import { AppDispatch } from "../../redux/store";
import PostModal from "../postsList2/PostModal";
import s from "./postsListOther.module.css";

const PostsListOther: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams<{ userId: string }>();
  const { posts, loading, error } = useSelector((state: any) => state.posts);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(getOtherUserPosts(userId));
    }
  }, [dispatch, userId]);

  const handleImageClick = (post: any) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className={s.postList}>
        {posts?.reverse().map((post) => (
          <img
            key={post._id}
            src={post.image_url}
            alt="post-thumbnail"
            onClick={() => handleImageClick(post)}
            className={s.postThumbnail}
          />
        ))}
      </div>

      {selectedPost && <PostModal post={selectedPost} onClose={closeModal} />}
    </div>
  );
};

export default PostsListOther;
