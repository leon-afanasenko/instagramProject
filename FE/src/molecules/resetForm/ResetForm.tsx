import s from "./resetForm.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { $api } from "../../api/api";
import CustomButton from "../../atoms/customButton/CustomButton";
import CustomInput from "../../atoms/customInput/CustomInput";
import trouble from "../../assets/trouble_logging _in.svg";
import { useTranslation } from "react-i18next";

export const ResetForm = () => {
  const { t } = useTranslation();

  const [userObject, setUserObject] = useState({
    email: "",
    password: "",
    username: "",
    full_name: "",
  });

  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setUserObject((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await $api.post("/auth/check-user", {
        email: userObject.email,
      });
      if (response.status === 200) {
        setIsPasswordReset(true);
      } else {
        setError(t("resetForm.userNotFound"));
      }
    } catch (error) {
      console.error("Ошибка при проверке пользователя:", error);
      setError(t("resetForm.checkError"));
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await $api.post("/auth/update-password", {
        email: userObject.email,
        newPassword,
      });
      if (response.status === 200) {
        alert(t("resetForm.passwordUpdated"));
        setIsPasswordReset(false);
        setNewPassword("");
      } else {
        setError(t("resetForm.updateError"));
      }
    } catch (error) {
      console.error("Ошибка при обновлении пароля:", error);
      setError(t("resetForm.updateError"));
    }
  };

  return (
    <div className={s.resetFormBox}>
      <form
        className={s.resetForm}
        onSubmit={isPasswordReset ? handleUpdatePassword : handleCheckUser}
      >
        <img src={trouble} alt="logo" />
        <h5>{t("resetForm.trouble")}</h5>
        <p className={s.instruction}>{t("resetForm.instruction")}</p>

        <CustomInput
          placeholder={t("resetForm.placeholderEmail")}
          value={userObject.email}
          onChange={(value) => handleInputChange("email", value)}
          type="email"
          style={{
            paddingLeft: "8px",
            backgroundColor: "var(--color-bg-light-grey)",
            color: "var(--color-text-grey)",
          }}
        />

        {isPasswordReset && (
          <CustomInput
            placeholder={t("resetForm.placeholderNewPassword")}
            value={newPassword}
            onChange={setNewPassword}
            type="password"
            style={{
              paddingLeft: "8px",
              backgroundColor: "var(--color-bg-light-grey)",
              color: "var(--color-text-grey)",
              marginTop: "6px",
            }}
          />
        )}

        {error && <p className={s.errorMessage}>{error}</p>}

        <CustomButton
          text={
            isPasswordReset
              ? t("resetForm.saveNewPasswordButton")
              : t("resetForm.resetPasswordButton")
          }
          style={{ width: "268px", height: "32px" }}
          type="submit"
        />

        <div className={s.lineBox}>
          <div className={s.line}></div>
          <p>{t("loginForm.or")}</p>
          <div className={s.line}></div>
        </div>

        <Link to={"/register"} className={s.createAccount}>
          {t("resetForm.createAccount")}
        </Link>
        <div className={s.back}>
          <Link
            to={"/"}
            style={{ color: "var(--color-text-dark)", fontWeight: 600 }}
          >
            {t("resetForm.back")}
          </Link>
        </div>
      </form>
    </div>
  );
};
