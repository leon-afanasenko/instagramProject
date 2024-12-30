
import React from 'react';
import s from "./CreateContent.module.css"
import { ImageForm } from '../../imageForm/ImageForm';

const CreateContent: React.FC = () => {


  return (
    <div className={s.greateContainer}>
      <div className={s.createHeader}>
        <h3>Create new post</h3>
        <a href="">Share</a>
      </div>
     <div className={s.createBox}>
        <div className={s.createBoxLeft}></div>
        <div className={s.createBoxRight}>
            <div  className={s.createBoxRightDescription}></div>
            <div  className={s.createBoxRightBottom}></div>

            <ImageForm />
        </div>
     </div>
    </div>
  );
};

export default CreateContent;
