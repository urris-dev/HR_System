import React, { useEffect } from "react";
import { useLogin } from "@/hooks/login";

import CompanyLogo from "@/assets/company-logo.svg";
import './Login.css';

import Modal from "@/components/Modal/Modal.jsx";

export default function LoginForm() {
    const {
        error,
        loading,
        setEmail,
        setPassword,
        switchPasswordVisibility,
        passwordType,
        submitLogin,
        handleCloseModal,
        checkLogged
    } = useLogin();

    useEffect(() => 
        checkLogged()
    )

    return (
        <div className="login-form-wrapper">
            <div className="login-form-container">
                <form onSubmit={submitLogin} className="login-form">
                    <div className="login-form__header">
                        <h1>Вход в аккаунт</h1>
                    </div>
                    <div className="login-form__fields">
                        <div className="input-container">
                            <label htmlFor="email">Адрес электронной почты</label>
                            <input type="email" name="email" required onChange={(event) => setEmail(event.target.value)}/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="password">Пароль</label>
                            <input type={passwordType} name="password" required onChange={(event) => setPassword(event.target.value)}/>
                            <span>Пароль должен содержать от 8 до 60 символов</span>
                            <label htmlFor="showPassword">
                            <input
                                type="checkbox"
                                id="showPassword"
                                onClick={switchPasswordVisibility}
                                />
                            <span>Показать пароль</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="login-button">
                        {loading ? <p>Загрузка...</p> : <p>Войти в аккаунт</p>}
                    </button>
                </form>
                <div className="company-logo">
                    <img src={CompanyLogo}/>
                </div>
            </div>
            {error && (
                <Modal
                    type='error'
                    message={error}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}