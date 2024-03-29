import style from "./Registration.module.css"
// import { useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton"
import firebase from "../../utils/firebase"
import { useState } from "react"
import validator from "validator"
import React from 'react';

import { toast } from 'react-toastify';
import axios from "axios"
import { useDispatch } from "react-redux";
import { RegisterAuthAction } from "../../redux/actions/AuthActions"
const Regisstration = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("")

    const [isOtpActive, setIsOtpActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const [confirmationResult, setConfirmationResult] = useState();

    const submitData = () => {

        if (name.trim() === "" || phone.trim() === "" || email.trim() === "" || password === "" || confirmPassword === "") {
            toast.error("Please fill all details.! 😔", {
            });
        }
        else if (!validator.isEmail(email)) {
            toast.error("Please enter a valid email.! 😔", {
            });
        }
        else if (phone.length > 10 || phone.length < 10) {
            toast.error("Please provide a valid phone number.! 😔", {
            });
        }
        else if (password !== confirmPassword) {
            toast.error("Password and confirm password not matched.! 😔", {
            });
        }
        else {
            setIsLoading(true)
            axios.get(`/user/exists/${phone}`)
                .then(res => {
                    toast.error("This mobile number is linked with another account use different")
                    setIsLoading(false)
                })
                .catch(err => {
                    console.log(err.response)

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
                            toast.success("OTP is sent to your mobile number")
                            setConfirmationResult(confirmationResult);
                        }).catch((error) => {
                            console.log(error)
                            setIsLoading(false)
                            toast.error("Unable to send OTP. Some internal server error occured.! 😔", {
                            });
                        });


                })

        }
    }

    const VerifyOtp = () => {
        setIsLoading(true)
        const code = otp;
        confirmationResult.confirm(code).then((result) => {
            axios.post(`/user/register`, {
                name: name,
                phone,
                email,
                password
            })
                .then(res => {
                    console.log(res)
                    dispatch(RegisterAuthAction(res.data.data[0]))
                    toast.success("Registration Succesfful.! 😃", {})
                    setIsLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    if (err.response.data.message) {
                        toast.error(err.response.data.message, {})
                    }
                    else{
                        toast.error("Something Went Wrong", {})
                    }

                    setIsLoading(false)

                })
        }).catch((error) => {
            toast.error("Wrong otp.! 😔", {})
            setIsLoading(false)
        });
    }
    return (
        <React.Fragment>
            <div className={style.mainDiv}>
                <div className={style.leftDiv}>
                    <img className={style.bannerImg} src="/images/registration.svg" alt="..." />
                </div>
                <div className={style.rightDiv}>
                    <h4 className={style.heading}>Register</h4>
                    <div className={style.inputDivWrapper}>
                        <div id="recaptcha-container"></div>
                        <div className={!isOtpActive ? style.dataDiv : style.hidden}>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Name</p>
                                <input className={style.inputTag} value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" type="text" />
                            </div>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Email</p>
                                <input className={style.inputTag} value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" type="text" />
                            </div>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Phone</p>
                                <input className={style.inputTag} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone" type="number" />
                            </div>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Password</p>
                                <input className={style.inputTag} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" type="password" />
                            </div>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Confirm Password</p>
                                <input className={style.inputTag} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Enter confirm password" type="password" />
                            </div>
                            <div onClick={() => submitData()} className={style.buttonWrapper}>
                                <PrimaryButton heading='Signup <i class="fas fa-arrow-circle-right"></i>' />
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
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Regisstration;