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
                        <li><Link to="/PostProperty">Rent/Sell Home</Link></li>
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
                        <i className="fab fa-facebook-square"></i>
                        <i className="fab fa-instagram-square"></i>
                        <i className="fas fa-envelope"></i>
                        <i className="fab fa-twitter-square"></i>
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