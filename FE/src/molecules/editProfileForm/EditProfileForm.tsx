import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import CustomButton from "../../atoms/customButton/CustomButton";
import { setUser } from "../../redux/slices/authSlice";
import { $api } from "../../api/api";
import noPhoto from "../../assets/noPhoto.png";
import { RootState } from "../../redux/store";
import s from "./editProfileForm.module.css";

const EditProfileForm: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(user?.username || "");
  const [bioWebsite, setBioWebsite] = useState(user?.bio_website || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState(user?.profile_image || "");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [charCount, setCharCount] = useState(bio.length);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio_website", bioWebsite);
      formData.append("bio", bio);
      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }

      const response = await $api.put("/user/current", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(
        setUser({
          token: localStorage.getItem("token") || "",
          user: response.data,
        })
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = event.target.value;
    setBio(newBio);
    setCharCount(newBio.length);
  };

  return (
    <form className={s.editProfileForm} onSubmit={handleSubmit}>
      <h4>{t("editProfileForm.edit")}</h4>
      <div className={s.editProfileForm_imgForm}>
        <img
          src={profileImage || noPhoto}
          alt="Profile"
          className={s.profileImage}
        />
        <div className={s.userInfo}>
          <p className={s.username}>
            {username || t("editProfileForm.defaultUsername")}
          </p>
          <p className={s.userBio}>{bio || t("editProfileForm.defaultBio")}</p>
        </div>
        <label className={s.uploadButton}>
          {t("editProfileForm.newPhoto")}
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </label>
      </div>

      <label>
        {t("editProfileForm.username")}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={s.inputField}
        />
      </label>

      <label>
        {t("editProfileForm.website")}
        <input
          type="text"
          value={bioWebsite}
          onChange={(e) => setBioWebsite(e.target.value)}
          className={s.inputField}
        />
      </label>

      <label>
        {t("editProfileForm.about")}
        <textarea
          value={bio}
          onChange={handleBioChange}
          className={s.textareaField}
          maxLength={150}
        />
        <div className={s.charCount}>{charCount} / 150</div>
      </label>

      <CustomButton
        text={t("editProfileForm.saveBtn")}
        type="submit"
        className={s.saveButton}
      />
    </form>
  );
};

export default EditProfileForm;
