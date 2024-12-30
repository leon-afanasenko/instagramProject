import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import s from "./footer.module.css";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className={s.footer}>
      <div className={s.footer_top}>
        <Link to={"/home"}>{t("footer.home")}</Link>
        <Link to={"/search"}>{t("footer.search")}</Link>
        <Link to={"/explore"}>{t("footer.explore")}</Link>
        <Link to={"/messages"}>{t("footer.messages")}</Link>
        <Link to={"/notifications"}>{t("footer.notifications")}</Link>
        <Link to={"/create"}>{t("footer.create")}</Link>
      </div>
      <div className={s.footer_bottom}>
        <p>Leon © 2024 ICHgram</p>
      </div>
    </footer>
  );
};
