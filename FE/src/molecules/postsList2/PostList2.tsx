import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../../redux/slices/postsSlice";
import PostModal from "./PostModal";
import s from "./postList2.module.css";

interface Post {
  _id: string;
  image_url: string;
  caption?: string;
  [key: string]: unknown;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

interface RootState {
  posts: PostsState;
}

const PostsList: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    dispatch(getAllPosts() as any);
  }, [dispatch]);

  const handleImageClick = (post: Post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const handleUpdatePosts = () => {
    dispatch(getAllPosts() as any);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className={s.postList}>
        {posts
          ?.slice()
          .reverse()
          .map((post) => (
            <img
              key={post._id}
              src={post.image_url}
              alt="post-thumbnail"
              onClick={() => handleImageClick(post)}
              className={s.postThumbnail}
            />
          ))}
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={closeModal}
          onUpdatePosts={handleUpdatePosts}
        />
      )}
    </div>
  );
};

export default PostsList;
