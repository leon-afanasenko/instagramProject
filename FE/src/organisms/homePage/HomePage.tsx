import React from "react";
import HomePagePosts from "../../molecules/homePagePosts/HomePagePosts";
import s from "./HomePage.module.css";
import allUpdates from "../../assets/allUdate.png";

const HomePage: React.FC = () => {
  return (
    <div className={s.homepagepost}>
      <HomePagePosts />
      <div className={s.allUpdates}>
        <img src={allUpdates} alt="All updates" />
        <p className={s.allUpBig}>You've seen all the updates</p>
        <p className={s.allUpSmall}>You have viewed all new publications</p>
      </div>
    </div>
  );
};

export default HomePage;
