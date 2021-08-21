import PrimaryButton from "../../components/Buttons/PrimaryButton";
import style from "./ContactUs.module.css"
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
const ContactUs = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("")

    const textAreaStyle = {
        maxHeight: "12rem",
        minHeight: "12rem",
        resize: "none",
        width: "100%",
        border: "none",
        outline: "none",
        boxSizing: "border-box",

    };

    const submitForm = (e) => {
        e.preventDefault();
        setIsLoading(true)
        if (!isLoading) {
            if (name.trim() === "" || phone.trim === "" || message.trim() === "") {
                toast.error("Please fill all the details.!")
                setIsLoading(false)
            }
            else if (phone.length < 10 || phone.length > 10) {
                toast.error("Please provide a valid mobile number.!")
                setIsLoading(false)
            }
            else {
                axios.post("/user/contactUsMessage", {
                    name: name.trim(),
                    phone: phone.trim(),
                    message: message.trim()
                })
                    .then(res => {
                        console.log(res)
                        toast.success(`Grabbed your message ${res.data.data[0].name} 🙌🏻 Thank You.!`)
                        setName("")
                        setPhone("")
                        setMessage("")
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.log(err)
                        if (err.response) {
                            toast.error(err.response.submitDataWrapper.message)
                        }
                        else {
                            toast.error("Something went wrong please try again later.")
                        }
                        setName("")
                        setPhone("")
                        setMessage("")
                        setIsLoading(false)
                    })
            }
        }
    }

    return (
        <>
            <div className={style.mainDiv}>
                <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: .5 }} className={style.upperDiv}>
                    <h4 className={style.contactHeading}>Don't be a stranger</h4>
                    <h4 className={style.contactHeading}>just say hello!</h4>
                    <p className={style.contactSubHeading}>Thank You! for your interest in our services. Please fill out <br /> the form below or e-mail us at ghardekho@demoemail.com</p>
                </motion.div>
                <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: .5 }} className={style.formDiv}>
                    <div className={style.formLeftSection}>
                        <img className={style.leftSectionImg} src="/images/ContactUs.svg" alt="..." />
                        <div className={style.contactDetials}>
                            <div className={style.contactDetial}>
                                <i className="fas fa-map-marker-alt"></i>
                                <p>Bhiwandi, Thane.</p>
                            </div>
                            <div className={style.contactDetial}>
                                <i className="fas fa-phone-alt"></i>
                                <p>+91 7276115611</p>
                            </div>
                            <div className={style.contactDetial}>
                                <i className="fas fa-envelope"></i>
                                <p>ghardekho@demoemail.com</p>
                            </div>
                        </div>
                    </div>
                    <form className={style.formRightSection}>
                        <div className={style.inputDiv}>
                            <p className={style.inputLabel}>Name</p>
                            <input value={name} onChange={(e) => setName(e.target.value)} className={style.inputTag} placeholder="Enter your name" type="text" />
                        </div>
                        <div className={style.inputDiv}>
                            <p className={style.inputLabel}>Phone</p>
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={style.inputTag} placeholder="Enter your contact number" min="0" type="number" />
                        </div>
                        <div className={style.inputDiv}>
                            <p className={style.inputLabel}>Message</p>
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" style={textAreaStyle} className={style.inputTag} type="text" />
                        </div>
                        <div className={style.submitDataWrapper}>
                            <button onClick={(e) => submitForm(e)} className={style.submitBtn}>
                                <PrimaryButton heading='Submit <i class="fas fa-paper-plane"></i>' />
                            </button>

                            {
                                isLoading
                                &&
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            }
                        </div>
                        <p className={style.contactNote}>
                            Company name not sell, share or trade customer information. Your privacy is very important to us.

                        </p>
                    </form>
                </motion.div>
            </div>
        </>
    )
}

export default ContactUs;