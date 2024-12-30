import s from "../notificationBar.module.css";
import { FC, useEffect, useState } from "react";
import { getUserByIdApi } from "../../../api/services/usersService";
import { $api } from "../../../api/api";
import parseData from "../../../helpers/parseData";
import { Notification } from "../../../interfaces/notification.interface";
import { IUser } from "../../../interfaces/user.interface";

const NotificationItem: FC<Notification> = ({
  _id,
  content,
  sender_id,
  created_at,
  is_read,
  type,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [read, setRead] = useState<boolean>(is_read);

  useEffect(() => {
    const handleGetUser = async () => {
      const data = await getUserByIdApi(sender_id);
      setUser(data);
    };
    handleGetUser();
  }, [sender_id]);

  const handleReadNotification = async () => {
    if (!read) {
      try {
        await $api.patch(`/notifications/${_id}`, {
          is_read: true,
        });
        setRead(true);
      } catch (error) {
        console.error("Ошибка при чтении уведомления:", error);
      }
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <li
      key={_id}
      className={s.notificationItem}
      style={{ background: !read ? "var(--color-bg-dark-grey)" : "#FFF" }}
      onMouseEnter={handleReadNotification}
    >
      <div className={s.userAvatar_box}>
        <img
          className={s.avatar}
          src={user.profile_image}
          alt={user.username}
        />
        <div>
          <p>
            <span className={s.userName}>{user.username}</span> {content}
          </p>
          <p className={s.parsedData}>{parseData(created_at)}</p>
        </div>
      </div>
    </li>
  );
};

export default NotificationItem;
