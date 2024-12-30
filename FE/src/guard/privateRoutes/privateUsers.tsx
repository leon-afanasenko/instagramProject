import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutesUsers: FC = () => {
    const token: string | null = localStorage.getItem("token");

    return token ? (
        <Outlet />
    ) : (
        <Navigate to="/" />
    );
};

export default PrivateRoutesUsers;

