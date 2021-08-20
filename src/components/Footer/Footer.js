import { Link } from "react-router-dom";
import style from  "./Footer.module.css"
const Footer = () => {
    return (
        <>
            <section className={style.footer}>
                <div className={style.main_footer_div}>
                    <div className={style.logo_slogan + " " + style.mob_footer}>
                        <div className={style.logo3}>
                            <p>
                                <span>Ghar</span>Dekho.com
                            </p>
                        </div>
                        <div className={style.slogan1}>
                            One of the best site to browse home across Bhiwandi.
                        </div>
                    </div>
                    <div className={style.quick_links + " " + style.mob_footer}>
                        <p className={style.footer_heading}>Quick Links</p>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/properties">Properties</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/post-property">Rent/Sell Home</Link></li>
                    </div>
                    <div className={style.about + " " + style.mob_footer}>
                        <p className={style.footer_heading}>Contact Details </p>
                        <li><i className="fas fa-phone-alt"></i>+91 7276115611</li>
                        <li><i className="fas fa-envelope"></i>akshay.pajv@gmail.com</li>
                        <li><i className="fas fa-map-marker-alt"></i>Padmanagar, Bhiwandi.</li>
                    </div>
                </div>
                <div className={style.copyright}>
                    <div className={style.social_links}>
                        <a rel="noreferrer" href="https://www.facebook.com/akshay.gondhale.562/" target="_blank"><i className={"fab fa-facebook " + style.social_icon}></i></a>
                        <a rel="noreferrer" href="https://www.instagram.com/akshay_gondhale/" target="_blank"><i className={"fab fa-instagram " + style.social_icon}></i></a>
                        <a rel="noreferrer" href="https://twitter.com/akshay_gondhale" target="_blank"><i className={"fab fa-twitter " + style.social_icon}></i></a>
                        <a rel="noreferrer" href="mailto:akshay.pajv@gmail.com" target="_blank"><i className={"fas fa-at " + style.social_icon}></i></a>
                    </div>
                    <div className={style.end_div}>
                        <p className={style.madeBy}>Made with <i className="fas fa-heart"></i> and <i className="fas fa-mug-hot"></i> by Akshay in Bhiwandi.</p>
                        <p>Copyright © 2021 GharDekho. All rights reserved.</p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Footer;