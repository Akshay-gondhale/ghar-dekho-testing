import style from "./ForgotPassword.module.css"
import PrimaryButton from "../../components/Buttons/PrimaryButton"
import firebase from "../../utils/firebase"
import { useHistory } from 'react-router-dom';
import { useState } from "react"
import { toast } from 'react-toastify';
import React from 'react';
import axios from "axios";
const ForgotPassword = () => {
    const history = useHistory();
    const [otp, setOtp] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [isOtpActive, setIsOtpActive] = useState(false);
    const [isPhoneActive, setIsPhoneActive] = useState(true);
    const [isPasswordActive, setIsPasswordActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const [confirmationResult, setConfirmationResult] = useState();

    const submitData = () => {

        if (phone === "") {
            toast.error("Please provide a phone number.! 😔", {
            });
        }
        else if (phone.length > 10 || phone.length < 10) {
            toast.error("Please provide a valid phone number.! 😔", {
            });
        }
        else {

            setIsLoading(true)
            axios.get(`/broker/exists/${phone}`)
                .then(res => {
                    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                        'size': 'invisible',
                        'callback': (response) => {
                            // reCAPTCHA solved, allow signInWithPhoneNumber.
                            console.log("rechapta solved")
                        }
                    });

                    const phoneNumber = `+91${phone}`;
                    const appVerifier = window.recaptchaVerifier;
                    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
                        .then((confirmationResult) => {
                            setIsLoading(false)
                            setIsOtpActive(true)
                            setIsPhoneActive(false)
                            setIsPasswordActive(false)
                            setConfirmationResult(confirmationResult);
                            toast.success("OTP is sent to your mobile number")
                        }).catch((error) => {
                            setIsLoading(false)
                            console.log(error)
                            toast.error("Unable to send OTP due to no internet or Some internal server error occured.! 😔", {
                            });
                        });
                })
                .catch(err => {

                    console.log(err.response)
                    if (err.response.data.message) {
                        toast.error("This mobile is not linked with any account! Please register first.", {})
                    }
                    else {
                        toast.error("Something Went Wrong", {})
                    }

                    setIsLoading(false)
                })

        }
    }

    const VerifyOtp = () => {
        setIsLoading(true)
        const code = otp;
        confirmationResult.confirm(code).then((result) => {
            setIsLoading(false)
            toast.success("OTP verification Succesfful.! 😃", {})

            setIsOtpActive(false)
            setIsPhoneActive(false)
            setIsPasswordActive(true)
        }).catch((error) => {
            setIsLoading(false)
            toast.error("Wrong otp.! 😔", {})
        });
    }

    const submitPassword = () => {
        if (password === "" || confirmPassword === "") {
            toast.error("Please fill password.! 😔")
        }
        else if (password !== confirmPassword) {
            toast.error("Password and confirm password not matched.! 😔")
        }
        else {
            setIsLoading(true)
            axios.put(`/broker/resetPassword`, {
                phone,
                password
            })
                .then(res => {
                    setIsLoading(false)
                    toast.success(res.data.message)
                    history.push("/");
                })
                .catch(err => {
                    console.log(err.response)
                    if (err.response.data.message) {
                        toast.error(err.response.data.message, {})
                    }
                    else {
                        toast.error("Something Went Wrong", {})
                    }

                    setIsLoading(false)
                })
        }
    }
    return (
        <React.Fragment>
            <div className={style.mainDiv}>
                <div className={style.leftDiv}>
                    <img className={style.bannerImg} src="/images/forgotPassword.svg" alt="..." />
                </div>
                <div className={style.rightDiv}>
                    <h4 className={style.heading}>Forgot Password</h4>
                    <div className={style.inputDivWrapper}>
                        <div id="recaptcha-container"></div>
                        <div className={isPhoneActive ? style.dataDiv : style.hidden}>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Phone</p>
                                <input className={style.inputTag} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter registered phone number" type="number" />
                            </div>

                            <div onClick={() => submitData()} className={style.buttonWrapper}>
                                <PrimaryButton heading='Submit <i class="fas fa-arrow-circle-right"></i>' />
                                <div className={isLoading ? "spinner-border text-success" : style.hidden} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>

                        </div>
                        <div className={isOtpActive ? style.verifyOtp : style.hidden}>

                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Enter Otp</p>
                                <input className={style.inputTag} value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter otp which is sent to you mobile number" type="number" />
                            </div>
                            <div onClick={() => VerifyOtp()} className={style.buttonWrapper}>
                                <PrimaryButton heading='Confirm OTP <i class="fas fa-arrow-circle-right"></i>' />
                                <div className={isLoading ? "spinner-border text-success" : style.hidden} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                        <div className={isPasswordActive ? style.verifyOtp : style.hidden}>

                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Enter Password</p>
                                <input className={style.inputTag} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" type="password" />
                            </div>

                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Enter confirm Password</p>
                                <input className={style.inputTag} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Enter confirm password" type="password" />
                            </div>
                            <div onClick={() => submitPassword()} className={style.buttonWrapper}>
                                <PrimaryButton heading='Reset Password <i class="fas fa-arrow-circle-right"></i>' />
                                <div className={isLoading ? "spinner-border text-success" : style.hidden} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>

    )
}

export default ForgotPassword;