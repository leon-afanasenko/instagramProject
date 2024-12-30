import {
  changeTimeInLastMessage,
  getUserById,
} from "../../redux/slices/userSlice";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import CustomButton from "../../atoms/customButton/CustomButton";
import mess from "../../assets/messages.svg";
import { AppDispatch, RootState } from "../../redux/store";
import s from "./messageRoom.module.css";

interface IMessage {
  _id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  created_at: Date;
}

const socketURL: string = "http://localhost:5005";

const MessagesRoom: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageText, setMessageText] = useState<string>("");

  const { _id, profile_image: userAvatar } = useSelector(
    (state: RootState) => state.auth.user!
  );
  const recipient = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef<Socket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const targetUserId = location.state?.targetUserId;

  const token: string | null = localStorage.getItem("token");

  useEffect(() => {
    const socket = io(socketURL, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to the server socket");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      console.log("Socket instance destroyed");
    };
  }, [token]);

  useEffect(() => {
    const socket = socketRef.current;

    if (socket && isConnected && targetUserId) {
      socket.emit("joinRoom", { targetUserId });

      const handleLoadMessages = (loadedMessages: IMessage[]) => {
        setMessages(loadedMessages);
        console.log("Loaded messages:", loadedMessages);
      };

      socket.on("loadMessages", handleLoadMessages);

      return () => {
        socket.off("loadMessages", handleLoadMessages);
      };
    }
  }, [isConnected, targetUserId]);

  useEffect(() => {
    const socket = socketRef.current;

    if (socket) {
      const handleReceiveMessage = (newMessage: IMessage) => {
        console.log("New message received:", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, []);

  useEffect(() => {
    if (targetUserId) {
      dispatch(getUserById(targetUserId));
    }
  }, [targetUserId, dispatch]);

  const handleChangeMessage = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessageText(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  const handleSend = () => {
    if (messageText.trim().length > 0 && targetUserId && socketRef.current) {
      socketRef.current.emit("sendMessage", {
        targetUserId,
        messageText,
      });
      setMessageText("");
      adjustTextareaHeight();
      dispatch(
        changeTimeInLastMessage({
          userId: targetUserId,
          lastMessage: new Date().toISOString(),
        })
      );
    } else {
      alert("Please enter a message");
    }
  };

  const handleViewProfile = () => {
    if (recipient && recipient._id) {
      navigate(`/profile/${recipient._id}`);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastMessageDate = messages.length
    ? new Date(
        Math.max(
          ...messages.map((message) => new Date(message.created_at).getTime())
        )
      )
    : null;

  return (
    <div className={s.messageRoom}>
      {recipient && (
        <>
          <div className={s.recipientInfo}>
            <img
              src={recipient.profile_image}
              alt={recipient.username}
              className={s.profileImage}
            />
            <div>
              <h5>{recipient.username}</h5>
            </div>
          </div>
          <div className={s.recipientInfo_inside}>
            <img
              src={recipient.profile_image}
              alt={recipient.username}
              className={s.profileImage_inside}
            />
            <div>
              <h4>{recipient.username}</h4>
              <p>{recipient.username} • ICHgram</p>
            </div>
            <CustomButton
              text="View profile"
              style={{
                color: "var(--color-text-dark)",
                backgroundColor: "var(--color-bg-dark-grey)",
              }}
              onClick={handleViewProfile}
            />
          </div>
        </>
      )}
      {lastMessageDate && (
        <div className={s.lastMessageDate}>
          <p>{lastMessageDate.toLocaleString()}</p>
        </div>
      )}
      {isConnected && targetUserId ? (
        <>
          <ul className={s.list}>
            {messages.map((message) => {
              const isMyMessage = message.sender_id === _id;
              const userImage = isMyMessage
                ? userAvatar
                : recipient?.profile_image;

              return (
                <li
                  key={message._id}
                  className={`${s.list_item} ${
                    isMyMessage ? s.list_item_my : s.list_item_their
                  }`}
                >
                  {!isMyMessage && (
                    <img
                      src={userImage}
                      alt="avatar"
                      className={`${s.avatar} ${s.avatar_their}`}
                    />
                  )}

                  <div
                    className={`${s.message_wrapper} ${
                      isMyMessage ? s.message_my : s.message_their
                    }`}
                  >
                    <span className={s.message_text}>
                      {message.message_text}
                    </span>
                  </div>

                  {isMyMessage && (
                    <img
                      src={userImage}
                      alt="avatar"
                      className={`${s.avatar} ${s.avatar_my}`}
                    />
                  )}
                </li>
              );
            })}
            <div ref={messagesEndRef} />
          </ul>

          <div className={s.form}>
            <textarea
              ref={textareaRef}
              onChange={handleChangeMessage}
              placeholder="Write message"
              value={messageText}
              style={{
                resize: "none",
                overflow: "hidden",
                width: "32vw",
                boxSizing: "border-box",
                fontSize: "16px",
                height: "44px",
              }}
            />
            <button onClick={handleSend}>
              <img src={mess} alt="messages" />
            </button>
          </div>
        </>
      ) : (
        <p>{isConnected ? "Please select a chat" : "Connecting to chat..."}</p>
      )}
    </div>
  );
};

export default MessagesRoom;
