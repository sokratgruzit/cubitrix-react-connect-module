import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ValidateAuth } from "../TwoFactorAuth/ValidateAuth.jsx";
import axios from "axios";
import styles from "./RecoveryLogin.module.css";

export const RecoveryLogin = () => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const address = useSelector(state => state.connect.account);
    const dispatch = useDispatch();

    const handleLogin = () => {
        if (email !== "" && password !== "") {
            axios.post("/accounts/recovery/login", {
                address
            }).then(res => {
                return res.data.otp_enabled;
            }).then(res => {
                if (res) {
                    dispatch({
                        type: "GET_OTP_ENABLED",
                        otp_enabled: res
                    });
                }
            });
        }
    };

    return (
        <>
            <div className={styles.container}>
                <h1>Recovery Login</h1>
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                />
                <input 
                    type="password" 
                    placeholder="Enter your password" 
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                />
                <div onClick={handleLogin} className={styles.submitBtn}>Login</div>
            </div>
            <ValidateAuth />
        </>
    );
};
