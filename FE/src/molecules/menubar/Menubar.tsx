import { NavLink } from "react-router-dom";
import s from "./menubar.module.css";
import homeIcon from "../../assets/homeIcon.svg";
import homeIconActive from "../../assets/home-active.svg";
import searchIcon from "../../assets/search.svg";
import searchIconActive from "../../assets/search-active.svg";
import exploreIcon from "../../assets/explore.svg";
import exploreIconActive from "../../assets/explore-active.svg";
import messagesIcon from "../../assets/messages.svg";
import messagesIconActive from "../../assets/messages-active.svg";
import notificationsIcon from "../../assets/notifications.svg";
import notificationsIconActive from "../../assets/notifications-active.svg";
import createIcon from "../../assets/create.svg";
import createIconActive from "../../assets/create-active.svg";
import { useTranslation } from 'react-i18next';
import CustomModal from '../../atoms/customModal/CustomModal';
import React, { useState } from 'react';
import SearchContent from "../../atoms/searchContent/SearchContent";
import CreatePostPage from "../../organisms/createPage/CreatePostPage";

import NotificationsBar from "../notificationsBar/NotificationsBar";


const Menubar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [activeLink, setActiveLink] = useState<string>(''); 
  const [modalSize, setModalSize] = useState<'default' | 'left' | 'large' | 'small'>('default'); 
  const userId = localStorage.getItem('userId') || 'mockUserId';
  const openModal = (type: string) => {
    setIsModalOpen(true);
    switch (type) {
      case 'search':
        setModalSize('left');
        setModalContent(<SearchContent/>);
        break;
      case 'notifications':
        setModalSize('left');
        setModalContent(<NotificationsBar userId={userId}  />);
        break;
      case 'create':
        setModalSize('large');
        setModalContent(<CreatePostPage/>);
        break;
      default:
        setModalContent(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleLinkClick = (link: string) => {
    setActiveLink(link); 
  };

  const { t } = useTranslation();
  
  return (
    <nav className={s.menubar}>
      <NavLink
        to="/home"
        className={({ isActive }) => (isActive ? s.activeLink : s.link)}
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? homeIconActive : homeIcon} alt="Home" />
            <span>{t('menubar.home')}</span>
          </>
        )}
      </NavLink>
      
      <NavLink
        to="/search"
        className={({ isActive }) => (isActive ? s.activeLink : s.link)}
        onClick={(e) => {
          e.preventDefault();
          openModal('search');
          handleLinkClick('search');
        }}
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? searchIconActive : searchIcon} alt="Search" />
            <span>{t('menubar.search')}</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/explore"
        className={({ isActive }) => (isActive ? s.activeLink : s.link)}
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? exploreIconActive : exploreIcon} alt="Explore" />
            <span>{t('menubar.explore')}</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/messages"
        className={({ isActive }) => (isActive ? s.activeLink : s.link)}
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? messagesIconActive : messagesIcon} alt="Messages" />
            <span>{t('menubar.messages')}</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/notifications"
        className={({ isActive }) => (isActive ? s.activeLink : s.link)}
        onClick={(e) => {
          e.preventDefault();
          openModal('notifications');
          handleLinkClick('notifications');
        }}
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? notificationsIconActive : notificationsIcon} alt="Notifications" />
            <span>{t('menubar.notifications')}</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/create"
        className={({ isActive }) => (isActive ? s.activeLink : s.link)}
        onClick={(e) => {
          e.preventDefault();
          openModal('create');
          handleLinkClick('create');
        }}
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? createIconActive : createIcon} alt="Create" />
            <span>{t('menubar.create')}</span>
          </>
        )}
      </NavLink>

      <CustomModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        content={modalContent} 
        modalSize={modalSize} 
      />
    </nav>
  );
};

export default Menubar;
