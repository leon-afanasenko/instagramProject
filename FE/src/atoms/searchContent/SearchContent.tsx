import s from "./searchContent.module.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getAllUsers } from "../../redux/slices/userSlice";
import CustomInput from "../customInput/CustomInput";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import noPhoto from "../../assets/noPhoto.png";

function SearchContent() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchPerson, setSearchPerson] = useState("");
  const users = useSelector((state: RootState) => state.user.user || []);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.username.toLowerCase().includes(searchPerson.toLowerCase())
      )
    : [];

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className={s.searchContent}>
      <h3>{t("searchContent.search")}</h3>
      <div className={s.searchContent_inputBox}>
        <CustomInput
          type="text"
          placeholder={t("searchContent.placeholder")}
          value={searchPerson}
          onChange={(value) => setSearchPerson(value)}
          style={{ background: "var(--color-bg-dark-grey)" }}
        />
      </div>
      <h5>{t("searchContent.recent")}</h5>
      <div className={s.searchContent_list}>
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className={s.searchContent_listImage}
            onClick={() => handleUserClick(user._id)}
          >
            <img src={user.profile_image || noPhoto} alt={user.username} />
            <h6>{user.username}</h6>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchContent;
