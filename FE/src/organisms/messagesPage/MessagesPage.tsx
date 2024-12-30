import MessagesRoom from "../../molecules/messageRoom/MessageRoom";
import RecieversList from "../../molecules/receiversList/RecieversList";
import s from "./messagePage.module.css";




const MessagesPage: React.FC = () => {
 
  return (
    <div className={s.messagePage}>
  <RecieversList />
  <MessagesRoom />
    </div>
  );
};

export default MessagesPage;
