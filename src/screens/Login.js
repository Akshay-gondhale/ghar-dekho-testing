import PrimaryButton from "../components/Buttons/PrimaryButton"
import style from "./Login.module.css"
import { useState } from "react";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import React  from 'react';
import axios from "axios";
const Login = () => {
   
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)


    const submitLogin = () => {
        if (phone.length === 0) {
            toast.error("Please provide a phone number.! 😔", {})
            // setGlobalErr("Please provide a phone number.!")
        }
        else if (password.length === 0) {
            toast.error("Please provide a password.! 😔", {})
            // setGlobalErr("Please provide a password.!")
        }
        else if (phone.length > 10 || phone.length < 10) {
            toast.error("Please provide a valid phone number.! 😔", {})
            // setGlobalErr("Please provide a valid phone number.!")
        }
        else {
            setIsLoading(true)
            axios.post(`/user/login`,{
                phone:phone,
                password:password
            },
            {withCredentials:true})
            .then(res=>{
                console.log(res.data.message)
                toast.success(res.data.message)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
                if(err.response){
                    toast.error(err.response.data.message)
                }

                setIsLoading(false)
            })
            
        }
    }

    return (
        <React.Fragment>
            <div className={style.mainDiv}>
                <div className={style.leftDiv}>
                    <img className={style.bannerImg} src="/images/login.svg" alt="..." />
                </div>
                <div className={style.rightDiv}>
                    <h4 className={style.heading}>Login</h4>
                    <div className={style.inputDivWrapper}>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Phone</p>
                            <input className={style.inputTag} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone" type="number" />

                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Password</p>
                            <input className={style.inputTag} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" type="password" />

                            <Link to="/forgot-password"><p className={style.inputRightData}>Forgot Password?</p></Link>
                        </div>

                        <div onClick={() => { submitLogin() }} className={style.buttonWrapper}>
                            <div className={style.buttonWithLoading}>
                                <PrimaryButton heading='Login <i class="fas fa-arrow-circle-right"></i>' />
                                <div className={isLoading ? "spinner-border text-success " + style.spinnerStyle : style.hidden} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                        <p className={style.signupTag}>Already a User? <Link to="/sign-up"><span className={style.linkStyle}>Sign In</span></Link> </p>
                        
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Login;