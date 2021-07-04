import PrimaryButton from "../components/Buttons/PrimaryButton"
import style from "./Login.module.css"
import { useState } from "react";
const Login = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    
    const [globalErr, setGlobalErr] = useState("")


    const submitLogin = () => {
        if(phone.length === 0){
            setGlobalErr("Please provide a phone number.!")
        }
        else if(password.length === 0){
            setGlobalErr("Please provide a password.!")
        }
        else if(phone.length > 10 || phone.length < 10){
            setGlobalErr("Please provide a valid phone number.!")
        }
        else{
            setGlobalErr("")
            console.log("all good")
            alert("All good");
        }
    }
    return (
        <>
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
                            
                            <p className={style.inputRightData}>Forgot Password?</p>
                        </div>
                        {console.log(globalErr.length)}
                        <div className={globalErr.length > 0 ? style.globalErrWrapper : style.hidden}>
                             <p className={style.errHeading}>{globalErr}</p>
                        </div>
                        <div onClick={() => { submitLogin() }} className={style.buttonWrapper}>
                            <PrimaryButton heading='Login <i class="fas fa-arrow-circle-right"></i>' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;