import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import CustomButton from "../../atoms/customButton/CustomButton";
import FollowsPanel from "../../components/follows/Follows";
import { getUserById } from "../../redux/slices/userSlice";
import { $api } from "../../api/api";
import noPhoto from "../../assets/noPhoto.png";
import web from "../../assets/web.svg";
import { IFollowItem, ILocalFollow } from "../../interfaces/follow.interface";
import { AppDispatch, RootState } from "../../redux/store";
import s from "./otherProfile.module.css";

function OtherProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);
  const { _id } = useSelector((state: RootState) => state.auth.user!);
  const [follow, setFollow] = useState<ILocalFollow>({
    followers: "Loading...",
    following: "Loading...",
  });

  useEffect(() => {
    if (_id === userId) {
      navigate("/profile");
    }
  }, [_id, userId, navigate]);

  useEffect(() => {
    setFollow({
      followers: "Loading...",
      following: "Loading...",
    });
  }, [userId]);

  useEffect(() => {
    const handleCheckMyFollowing = async () => {
      if (_id && userId) {
        const response = await $api.get(`/follow/${userId}/followers`);
        const data: string[] = [];
        response.data.forEach((item: IFollowItem) =>
          data.push(item.follower_user_id._id)
        );
        console.log("Check my following");
        console.log(data);
        console.log(_id);
        setIsFollowing(data.includes(_id));
      }
    };
    handleCheckMyFollowing();
  }, [_id, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  const handleChangeFollow = (newFollow: ILocalFollow) => {
    setFollow(newFollow);
  };

  const handleFollow = async () => {
    const response = await $api.post(`/follow/${_id}/follow/${userId}`);
    if (response.status === 201) {
      setIsFollowing(true);
      setFollow((prev) => ({
        ...prev,
        followers:
          prev.followers !== "Loading..." ? prev.followers + 1 : prev.followers,
      }));
    }
  };
  const handleUnfollow = async () => {
    const response = await $api.delete(`/follow/${userId}/unfollow/${_id}`);
    if (response.status === 200) {
      setIsFollowing(false);
      setFollow((prev) => ({
        ...prev,
        followers:
          prev.followers !== "Loading..." ? prev.followers - 1 : prev.followers,
      }));
    }
  };

  const handleMessage = () => {
    if (userId) {
      navigate("/messages", { state: { targetUserId: userId } });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {currentUser ? (
        <div className={s.otherProfile}>
          <span className={s.gradient_border}>
            <span className={s.gradient_border_inner}>
              <img
                src={currentUser.profile_image || noPhoto}
                alt={currentUser.username}
              />
            </span>
          </span>
          <div className={s.otherProfile_rightside}>
            <div className={s.otherProfile_rightside_btnBox}>
              <p>{currentUser.username}</p>
              <CustomButton
                text={
                  isFollowing
                    ? t("otherProfile.unfollow")
                    : t("otherProfile.follow")
                }
                style={{
                  fontWeight: 600,
                  color: "var(--color-text-dark)",
                  width: "168.72px",
                  backgroundColor: "var(--color-bg-dark-grey)",
                }}
                onClick={isFollowing ? handleUnfollow : handleFollow}
              />
              <CustomButton
                text={t("otherProfile.message")}
                style={{ width: "168.72px" }}
                onClick={handleMessage}
              />
            </div>
            <div className={s.otherProfile_statistic}>
              <p>
                <span className={s.currentUserProfile_statisticCount}>
                  {currentUser.posts_count}
                </span>{" "}
                {t("otherProfile.posts")}
              </p>

              <FollowsPanel
                userId={userId || ""}
                follow={follow}
                setFollow={handleChangeFollow}
              />
            </div>
            <p className={s.otherProfile_statisticBio}>{currentUser.bio}</p>
            {currentUser.bio_website ? (
              <a className={s.webLink}>
                <img src={web} alt="" />
                {currentUser.bio_website}
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
}

export default OtherProfile;
