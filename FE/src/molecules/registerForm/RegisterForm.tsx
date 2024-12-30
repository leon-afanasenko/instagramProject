import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { $api } from "../../api/api";
import CustomButton from "../../atoms/customButton/CustomButton";
import CustomInput from "../../atoms/customInput/CustomInput";
import s from "./registerForm.module.css";
import logo from "../../assets/logo-ichgram.svg";
import { useTranslation } from "react-i18next";

export const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [userObject, setUserObject] = useState({
    email: "",
    password: "",
    username: "",
    full_name: "",
  });

  const [error, setError] = useState({
    email: "",
    username: "",
    general: "",
  });

  const handleInputChange = (field) => (value) => {
    setUserObject((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: "", username: "", general: "" });

    try {
      const response = await $api.post("/auth/register", userObject);
      if (response.status === 201) {
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        const errorData = error.response.data;

        if (error.response.status === 400) {
          setError((prevState) => ({
            ...prevState,
            email: errorData.errors?.email || "",
            username: errorData.errors?.username || "",
            general: !errorData.errors ? errorData.message : "",
          }));
        } else {
          setError((prevState) => ({
            ...prevState,
            general: t("registerForm.unpredictableError"),
          }));
        }
      } else {
        setError((prevState) => ({
          ...prevState,
          general: t("registerForm.unpredictableError"),
        }));
      }
    }
  };

  return (
    <div className={s.registerFormBox}>
      <form className={s.registerForm} onSubmit={handleSubmit}>
        <img src={logo} alt="logo" />
        <h4>{t("registerForm.title")}</h4>
        <CustomInput
          placeholder={t("registerForm.placeholderEmail")}
          value={userObject.email}
          onChange={handleInputChange("email")}
          type="email"
          style={{
            paddingLeft: "8px",
            backgroundColor: "#FAFAFA",
            color: "#737373",
          }}
        />
        {error.email && <p className={s.errorMessage}>{error.email}</p>}{" "}
        <CustomInput
          placeholder={t("registerForm.placeholderFullName")}
          value={userObject.full_name}
          onChange={handleInputChange("full_name")}
          type="text"
          style={{
            paddingLeft: "8px",
            backgroundColor: "#FAFAFA",
            color: "#737373",
            marginTop: "6px",
          }}
        />
        <CustomInput
          placeholder={t("registerForm.placeholderUsername")}
          value={userObject.username}
          onChange={handleInputChange("username")}
          type="text"
          style={{
            paddingLeft: "8px",
            backgroundColor: "#FAFAFA",
            color: "#737373",
            marginTop: "6px",
          }}
        />
        {error.username && <p className={s.errorMessage}>{error.username}</p>}{" "}
        <CustomInput
          placeholder={t("registerForm.placeholderPassword")}
          value={userObject.password}
          onChange={handleInputChange("password")}
          type="password"
          style={{
            paddingLeft: "8px",
            backgroundColor: "#FAFAFA",
            color: "#737373",
            marginTop: "6px",
          }}
        />
        {error.general && <p className={s.errorMessage}>{error.general}</p>}{" "}
        <p className={s.registerForm_p1}>
          {t("registerForm.termsInfo")}{" "}
          <span className={s.agreementLink}>{t("registerForm.learnMore")}</span>
        </p>
        <p className={s.registerForm_p2}>
          {t("registerForm.agreementText")}{" "}
          <span className={s.agreementLink}>{t("registerForm.terms")}</span>,{" "}
          <span className={s.agreementLink}>
            {t("registerForm.privacyPolicy")}
          </span>
          ,{" "}
          <span className={s.agreementLink}>
            {t("registerForm.cookiesPolicy")}
          </span>
          .
        </p>
        <CustomButton
          style={{ width: "268px", height: "32px" }}
          text={t("registerForm.signUpButton")}
          type="submit"
        />
      </form>
      <div className={s.haveAccountBox}>
        <p>
          {t("registerForm.haveAccount")}{" "}
          <Link
            to={"/"}
            style={{ color: "var(--color-text-blue)", fontWeight: 600 }}
          >
            {t("registerForm.login")}
          </Link>
        </p>
      </div>
    </div>
  );
};
