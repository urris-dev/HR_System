import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { login } from "@/api/auth.js";

export const useLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || localStorage.getItem("email"));
    const [password, setPassword] = useState('');
    const [passwordType, setPasswordType] = useState('password');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function checkLogged() {
        if (localStorage.getItem("logged")) {
            navigate("/workspace");
        } else {
            navigate("/login");
        }
    }

    function switchPasswordVisibility() {
        passwordType == 'password' ? setPasswordType('text') : setPasswordType('password'); 
    }
    
    function handleCloseModal() {
        setError(null);
    }

    function isDataValid() {
        return password.length >= 8 && password.length <= 60;
    }

    async function submitLogin(event) {
        event.preventDefault();
        setLoading(true);

        if (isDataValid()) {
            const resp = await login(email, password);
            if (resp.status !== 200) {
                setLoading(false);
                setError((await resp.json()).detail);
            } else {
                localStorage.setItem("userAccessLevel", (await resp.json()).access_level);
                localStorage.setItem("logged", "true");
                navigate("/workspace");
            }
        } else {
            setLoading(false);
            setError("Введённый пароль не соответствует шаблону");
        }
    }

    return {
        passwordType,
        error,
        loading,
        setEmail,
        setPassword,
        switchPasswordVisibility,
        submitLogin,
        handleCloseModal,
        checkLogged
    };
};