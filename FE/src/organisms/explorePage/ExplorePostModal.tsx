import React from "react";
import HomePagePostModal from "../../molecules/homePagePosts/HomePagePostModal";

interface ExplorePostModalProps {
  post: object;
  isOpen: boolean;
  onClose: () => void;
}

const ExplorePostModal: React.FC<ExplorePostModalProps> = ({
  post,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return <HomePagePostModal post={post} onClose={onClose} />;
};

export default ExplorePostModal;
