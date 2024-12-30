import { RegisterForm } from "../../molecules/registerForm/RegisterForm"
import s from "./registerPage.module.css"

export const RegisterPage = () => {

    return (
        <div className={s.registerPage}>
            <RegisterForm />
        </div>
    )
}