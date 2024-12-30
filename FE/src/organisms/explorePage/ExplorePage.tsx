import { useEffect, useState } from 'react';
import { getAllPublicPosts } from '../../redux/slices/postsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { FC } from 'react';
import ExplorePostModal from './ExplorePostModal';

import s from '../explorePage/ExplorePage.module.css';

interface Post {
  _id: string;
  image_url: string;
  caption?: string;
}

export const Explore: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllPublicPosts());
  }, [dispatch]);

  const handleImageClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={s.pageContainer}>
      <main className={s.content}>
        <div className={s.gallery}>
          {posts.map((item: Post, index: number) => (
            <div
              key={item._id}
              className={
                (Math.floor(index / 3) % 2 === 0 && index % 3 === 4) ||
                (Math.floor(index / 3) % 2 === 1 && index % 3 === 0)
                  ? `${s.postContainer} ${s.largePost}`
                  : s.postContainer
              }
              onClick={() => handleImageClick(item)}
            >
              <img
                src={item.image_url}
                alt={item.caption || 'Post image'}
                className={s.image}
              />
            </div>
          ))}
        </div>
      </main>
      {selectedPost && (
        <ExplorePostModal post={selectedPost} isOpen={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
};

export default Explore;
