import OtherProfile from '../../molecules/otherProfile/OtherProfile';
import PostsListOther from '../../molecules/postsListOther/PostsListOther';
import s from "./otherProfilePage.module.css"

const OtherProfilePage: React.FC = () => {
  return (
    <div className={s.profilePage}>
      <OtherProfile />
      <PostsListOther/>
    </div>
  );
};

export default OtherProfilePage;