import React from "react";
import s from "./allPostCard.module.css";

interface AllPostsCardProps {
  image_url: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  user_name: string;
  profile_image: string;
  created_at: string;
}

const AllPostsCard: React.FC<AllPostsCardProps> = (props) => {
  const {
    image_url,
    caption,
    likes_count,
    comments_count,
    user_name,
    profile_image,
    created_at,
  } = props;

  const formattedDate = new Date(created_at).toLocaleDateString();

  return (
    <div className={s.postCard}>
      <header className={s.postCardHeader}>
        <img
          src={profile_image}
          alt={`${user_name} profile`}
          className={s.profileImage}
        />
        <span className={s.userName}>{user_name}</span>
      </header>
      <img src={image_url} alt="post" className={s.postImage} />
      <p className={s.caption}>{caption}</p>
      <footer className={s.postCardFooter}>
        <span className={s.likes}>{likes_count} Likes</span>
        <span className={s.comments}>{comments_count} Comments</span>
        <span className={s.date}>{formattedDate}</span>
      </footer>
    </div>
  );
};

export default AllPostsCard;
