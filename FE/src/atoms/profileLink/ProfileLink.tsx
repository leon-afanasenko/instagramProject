import s from "./profileLink.module.css"
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useTranslation } from 'react-i18next';
import noPhoto from "../../assets/noPhoto.png"

const ProfileLink = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const { t } = useTranslation();
    return (
        <nav className={s.profileLink}>
            <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? s.activeLink : s.link)}
            >
                <div className={s.profileLink_photoBox}>
                <img src={user.profile_image || noPhoto} alt={user.username} />
                </div>
                <span>{t('profileLink.profile')}</span>
            </NavLink>
        </nav>
    );
};
export default ProfileLink;