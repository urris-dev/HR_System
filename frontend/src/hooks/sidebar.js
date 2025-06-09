import { useNavigate } from "react-router-dom";
import { logout } from "@/api/auth.js";

export const useSidebar = () => {
    const navigate = useNavigate();

    async function handleLogout() {
        localStorage.clear();
        await logout();
        window.location.reload();
    }

    function checkLogged() {
        if (!localStorage.getItem("logged")) {
            navigate("/login");
        }
    }

    return {
        handleLogout,
        checkLogged
    }
}