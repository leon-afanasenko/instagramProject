import s from "./notificationBar.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { $api } from "../../api/api";
import { Notification } from "../../interfaces/notification.interface";
import { RootState } from "../../redux/store";
import NotificationItem from "./item/item";

const NotificationsBar = () => {
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !token) {
        setError("User is not authenticated");
        return;
      }

      try {
        const response = await $api.get(
          `/notifications/${user._id}/notifications`
        );
        setNotifications(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.response?.data?.error ||
            "An error occurred while fetching notifications"
        );
      }
    };

    fetchNotifications();
  }, [user, token]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!notifications) {
    return <div>Loading...</div>;
  }

  return (
    <div className="notifications-bar">
      {notifications.length === 0 ? (
        <div>No notifications</div>
      ) : (
        <ul className={s.notificationsList}>
          {notifications.map((item) => (
            <NotificationItem key={item._id} {...item} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsBar;
