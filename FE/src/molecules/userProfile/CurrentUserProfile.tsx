import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import CustomButton from "../../atoms/customButton/CustomButton";
import FollowsPanel from "../../components/follows/Follows";
import { logout } from "../../redux/slices/authSlice";
import noPhoto from "../../assets/noPhoto.png";
import { ILocalFollow } from "../../interfaces/follow.interface";
import { RootState } from "../../redux/store";
import s from "./currentUserProfile.module.css";
import web from "../../assets/web.svg";

const CurrentUserProfile: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [follow, setFollow] = useState<ILocalFollow>({
    followers: "Loading...",
    following: "Loading...",
  });

  if (!user) return <div>{t("currentUserProfile.error")}</div>;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };
  const handleChangeFollow = (newFollow: ILocalFollow) => {
    setFollow(newFollow);
  };

  return (
    <div className={s.currentUserProfile}>
      <span className={s.gradient_border}>
        <span className={s.gradient_border_inner}>
          <img src={user.profile_image || noPhoto} alt={user.username} />
        </span>
      </span>
      <div className={s.currentUserProfile_rightside}>
        <div className={s.currentUserProfile_rightside_btnBox}>
          <p>{user.username}</p>
          <CustomButton
            className={s.btn}
            text={t("currentUserProfile.btnEdit")}
            style={{
              fontWeight: 600,
              color: "var(--color-text-dark)",
              width: "168.72px",
              backgroundColor: "var(--color-bg-dark-grey)",
            }}
            onClick={handleEditProfile}
          />
          <CustomButton
            className={s.btn}
            text={t("currentUserProfile.btnLogOut")}
            style={{
              width: "168.72px",
              fontWeight: 600,
            }}
            onClick={handleLogout}
          />
        </div>
        <div className={s.currentUserProfile_statistic}>
          <p>
            <span className={s.currentUserProfile_statisticCount}>
              {user.posts_count}
            </span>{" "}
            {t("currentUserProfile.posts")}
          </p>
          <FollowsPanel
            userId={user._id}
            follow={follow}
            setFollow={handleChangeFollow}
          />
        </div>
        <p className={s.currentUserProfile_statisticBio}>{user.bio}</p>
        {user.bio_website ? (
          <a className={s.webLink}>
            <img src={web} alt="" />
            {user.bio_website}
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CurrentUserProfile;
