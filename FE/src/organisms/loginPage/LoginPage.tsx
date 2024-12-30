import s from "./loginPage.module.css"
import phones from "../../assets/phones.svg"
import { LoginForm } from "../../molecules/loginForm/LoginForm"

export const LoginPage = () => {

    return (
        <div className={s.loginPage}>
          <img src={phones} alt="phone" />
        <div className={s.loginFormBox}>
            <LoginForm/>
            </div>
        </div>
    )
}