import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

import CustomButton from "../../atoms/customButton/CustomButton";
import CustomInput from "../../atoms/customInput/CustomInput";
import { setUser } from "../../redux/slices/authSlice";
import { $api } from "../../api/api";
import logo from "../../assets/logo-ichgram.svg";
import s from "./loginForm.module.css";

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userObject, setUserObject] = useState({ email: "", password: "" });
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange =
    (field: keyof typeof userObject) => (value: string) => {
      setUserObject((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    if (userObject.email === "") {
      setShowEmailError(true);
      setEmailErrorMessage(t("loginForm.emailRequired"));
      hasError = true;
    } else if (!validateEmail(userObject.email)) {
      setShowEmailError(true);
      setEmailErrorMessage(t("loginForm.emailInvalidFormat"));
      hasError = true;
    } else {
      setShowEmailError(false);
      setEmailErrorMessage("");
    }

    if (userObject.password === "") {
      setShowPasswordError(true);
      setPasswordErrorMessage(t("loginForm.passwordRequired"));
      hasError = true;
    } else if (userObject.password.length < 4) {
      setShowPasswordError(true);
      setPasswordErrorMessage(t("loginForm.passwordValidation"));
      hasError = true;
    } else {
      setShowPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!hasError) {
      setIsSubmitting(true);

      setAuthError("");

      try {
        const response = await $api.post("/auth/login", userObject);
        const { token, user } = response.data;

        if (token) {
          dispatch(setUser({ token, user }));
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          navigate("/home");
        } else {
          setAuthError(t("loginForm.invalidCredentials"));
        }
      } catch (error) {
        console.error("Login error:", error);
        setAuthError(t("loginForm.invalidEmailOrPassword"));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={s.loginFormBox}>
      <form className={s.loginForm} onSubmit={handleSubmit}>
        <img src={logo} alt="logo" />
        <CustomInput
          placeholder={t("loginForm.placeholderEmail")}
          value={userObject.email}
          onChange={handleInputChange("email")}
          type="email"
          style={{
            paddingLeft: "8px",
            backgroundColor: "var(--color-bg-light-grey)",
            color: "var(--color-text-grey)",
          }}
          showError={showEmailError}
          errorMessage={emailErrorMessage}
        />
        <div className={s.passwordContainer}>
          <CustomInput
            placeholder={t("loginForm.placeholderPassword")}
            value={userObject.password}
            onChange={handleInputChange("password")}
            type={showPassword ? "text" : "password"}
            style={{
              paddingLeft: "8px",
              backgroundColor: "var(--color-bg-light-grey)",
              color: "var(--color-text-grey)",
              margin: "7px 0 15px",
            }}
            showError={showPasswordError}
            errorMessage={passwordErrorMessage}
          />
          <span
            className={s.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
          </span>
        </div>
        <CustomButton
          text={t("loginForm.loginButton")}
          type="submit"
          style={{ width: "268px", height: "32px" }}
          disabled={isSubmitting}
        />
        {authError && <div className={s.errorMessage}>{authError}</div>}
        <div className={s.lineBox}>
          <div className={s.line}></div>
          <p>{t("loginForm.or")}</p>
          <div className={s.line}></div>
        </div>
        <Link to={"/reset"} className={s.forgotPasswordLink}>
          {t("loginForm.forgotPassword")}
        </Link>
      </form>
      <div className={s.haveAccountBox}>
        <p>
          {t("loginForm.haveAccount")}{" "}
          <Link
            to={"/register"}
            style={{ color: "var(--color-text-blue)", fontWeight: 600 }}
          >
            {t("loginForm.sign")}
          </Link>
        </p>
      </div>
    </div>
  );
};
