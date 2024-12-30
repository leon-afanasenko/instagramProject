import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { $api } from "../../api/api";
import { ILocalFollow } from "../../interfaces/follow.interface";
import s from "./follows.module.css";

interface IFollowPanel {
  userId: string;
  follow: ILocalFollow;
  setFollow: (newFollow: ILocalFollow) => void;
}

const FollowsPanel: FC<IFollowPanel> = ({ userId, setFollow, follow }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleGetFollowers = async () => {
      const response = await $api.get(`/follow/${userId}/followers`);
      console.log("followers")
      console.log(response.data)
      setFollow({ ...follow, followers: response.data.length });
    };
    const handleGetFollowing = async () => {
      const response = await $api.get(`/follow/${userId}/following`);

      setFollow({ ...follow, following: response.data.length });
    };

    if (follow.followers === "Loading...") {
      handleGetFollowers();
    }
    if (follow.following === "Loading...") {
      handleGetFollowing();
    }
  }, [userId, follow, setFollow]);

  return (
    <>
      {follow.followers !== "Loading..." && (
        <p>
          <span className={s.text}>{follow.followers}</span>{" "}
          {t("currentUserProfile.followers")}
        </p>
      )}
      {follow.following !== "Loading..." && (
        <p>
          <span className={s.text}>{follow.following}</span>{" "}
          {t("currentUserProfile.following")}
        </p>
      )}
    </>
  );
};

export default FollowsPanel;
