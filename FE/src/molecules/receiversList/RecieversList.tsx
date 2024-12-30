import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { getUsersWithChats } from "../../redux/slices/userSlice";
import s from "./recieversList.module.css";
import parseData from "../../helpers/parseData";

const RecieversList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const { username } = useSelector((state: RootState) => state.auth.user!);

  const [activeUserId, setActiveUserId] = useState<string | null>(() =>
    localStorage.getItem("activeUserId")
  );

  useEffect(() => {
    dispatch(getUsersWithChats());
  }, [dispatch]);

  const handleSelectUser = (
    targetUserId: string,
    lastMessageDate: string | null
  ) => {
    setActiveUserId(targetUserId);
    localStorage.setItem("activeUserId", targetUserId);
    navigate("/messages", { state: { targetUserId, lastMessageDate } });
  };

  const getLastMessageDate = (messages: any[]) => {
    if (!messages || messages.length === 0) {
      return null;
    }

    try {
      const timestamps = messages
        .map((message) => new Date(message.created_at).getTime())
        .filter((time) => !isNaN(time));

      if (timestamps.length === 0) {
        return null;
      }

      const lastMessageTimestamp = Math.max(...timestamps);
      const lastMessageDate = new Date(lastMessageTimestamp);

      return lastMessageDate.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error processing message dates:", error);
      return null;
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    console.error("An error occurred:", error);
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className={s.recieversList}>
      <h4>{username}</h4>
      <ul>
        {user.map((chatUser) => {
          const isActive = chatUser._id === activeUserId;
          const lastMessageDate = getLastMessageDate(chatUser.messages);

          return (
            <li
              className={`${s.recieversList_userBox} ${
                isActive ? s.active : ""
              }`}
              key={chatUser._id}
              onClick={() => handleSelectUser(chatUser._id, lastMessageDate)}
            >
              <img
                className={s.userBox_img}
                src={chatUser.profile_image}
                alt={chatUser.username}
              />
              <span className={s.userBox_data}>
                <p className={s.userBox_dataP1}>{chatUser.username}</p>
                <p className={s.userBox_dataP2}>
                  {chatUser.username} sent a message. •{" "}
                  {parseData(chatUser.lastMessage)}
                  {lastMessageDate && (
                    <span className={s.lastMessageDate}>{lastMessageDate}</span>
                  )}
                </p>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecieversList;
