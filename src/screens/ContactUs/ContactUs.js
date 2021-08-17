import PrimaryButton from "../../components/Buttons/PrimaryButton";
import style from "./ContactUs.module.css"
const ContactUs = () => {

    const textAreaStyle = {
        maxHeight: "12rem",
        minHeight: "12rem",
        resize: "none",
        width: "100%",
        border: "none",
        outline: "none",
        boxSizing: "border-box",

    };

    return (
        <>
            <div className={style.mainDiv}>
                <div className={style.upperDiv}>
                    <h4 className={style.contactHeading}>Don't be a stranger</h4>
                    <h4 className={style.contactHeading}>just say hello!</h4>
                    <p className={style.contactSubHeading}>Thank You! for your interest in our services. Please fill out <br /> the form below or e-mail us at ghardekho@demoemail.com</p>
                </div>
                <div className={style.formDiv}>
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
                            <input className={style.inputTag} placeholder="Enter your name" type="text" />
                        </div>
                        <div className={style.inputDiv}>
                            <p className={style.inputLabel}>Phone</p>
                            <input className={style.inputTag} placeholder="Enter your contact number" min="0" type="number" />
                        </div>
                        <div className={style.inputDiv}>
                            <p className={style.inputLabel}>Message</p>
                            <textarea placeholder="Message" style={textAreaStyle} className={style.inputTag} type="text" />
                        </div>
                        <div className={style.submitDataWrapper}>
                            <button className={style.submitBtn}>
                                <PrimaryButton heading='Submit <i class="fas fa-paper-plane"></i>' />
                            </button>

                            {/* <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> */}
                        </div>
                        <p className={style.contactNote}>
                            Company name not sell, share or trade customer information. Your privacy is very important to us.

                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ContactUs;