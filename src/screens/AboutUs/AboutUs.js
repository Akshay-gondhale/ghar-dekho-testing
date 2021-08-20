import { Link } from "react-router-dom";
import style from "./AboutUs.module.css"
const AboutUs = () => {
    return (
        <>
            <div className={style.mainDiv}>
                <div className={style.bannerDiv}>
                    <p className={style.mainHeading}>Hii! there :)</p>
                    <p className={style.mainHeading}>We are GharDekho team.</p>
                    <span className={style.headingDivider}></span>
                </div>
                <div className={style.aboutUsNote}>
                    <div className={style.noteLeftSection}>
                        <p className={style.noteHeading}>A couple of words about us</p>
                        <p className={style.notePara}>Here we introducing an all new specialized home browsing site for people of Bhiwandi. "GharDekho.!". GharDekho is customized and highly specialized for people of Bhiwandi. We provide best options for buying and selling homes across all over Bhiwandi. All homes uploaded on website are verified by actually visiting to home by our brokers. So user can find best home for them without any hesitation. All the searching option likes Home Type, Parking available or not, etc. are available on site. So user can easily find best home for him by using filter section. And also uploading an home is a very easy process. User can easily sell or rent their home on our website by just visiting Sell/Rent Section. All the process of uploading home on site and browsing and finding home for user them self are totally free of cost. User's can sell or browse home to buy are totally free. After all of this if you have any kind of doubt in your mind or have any queries, you can contact us in our <Link className={style.contactUsLink} to="/contact">Contact Us</Link> section. Either you can get in touch by information present in Contact Us section or can simply drop a message for us. We are always there for your queries. After receiving your query we will contact you as soon as possible. <br /><span className={style.noteThankYou}>Thank You.!</span></p>
                    </div>
                    <div className={style.noteRightSection}>
                        <img src="/images/about_us_banner.svg" alt="..." />
                    </div>
                </div>
                <div className={style.ourServices}>
                    <p className={style.ourServicesHeading}>Our Services</p>
                    <div className={style.cardsWrapper}>
                        <div className={style.serviceCard}>
                            <img src="/images/sell_property.svg" alt="..." />
                            <p className={style.cardPara}>Easily sell or rent your home with very few options. And find best deal for you!</p>
                        </div>
                        <div className={style.serviceCard}>
                            <img src="/images/verity_options.svg" alt="..." />
                            <p className={style.cardPara}>Verity of homes are available to browse and find best one for you!</p>
                        </div>
                        <div className={style.serviceCard}>
                            <img src="/images/broker_verify.svg" alt="..." />
                            <p className={style.cardPara}>All homes are verified by our brokers. So that you can browse without any tention!</p>
                        </div>
                        <div className={style.serviceCard}>
                            <img src="/images/support.svg" alt="..." />
                            <p className={style.cardPara}>24hrs support is available for you. Have any question? Just ask us.</p>
                        </div>

                    </div>
                </div>

                <div className={style.ourTeam}>
                    <p className={style.ourServicesHeading}>Our Team</p>
                    <div className={style.innerOurServicesDiv}>
                        <div className={style.textWrapperDiv}>
                            <p className={style.teamPara}>We are the team of GharDekho. We are always passionate to provide you the best service.</p>
                            <p className={style.teamPara}>We believe that - </p>
                            <p className={style.teamQuote}>"None of us is as smart as all of us."</p>
                        </div>
                        <div className={style.ourTeamImgWrapper}>
                            <img src="/images/teamImg.jpg" alt="..." />
                        </div>
                    </div>

                </div>
                <div className={style.projectDetails}>
                    <p className={style.ourServicesHeading}>Project Details</p>
                    <p className={style.projectSubHeading}>(Technologies used)</p>
                    <div className={style.technologiesWrapper}>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/mongodb.png" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/express.png" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/react.png" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/redux.png" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/node.png" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/axios.png" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/gcs.png" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/mongoose.jpg" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/heroku.png" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/socketio.jpg" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/firebase.png" alt="..."/>
                        </div>
                        <div className={style.technologyCard}>
                            <img src="/images/technologies/github.png" alt="..."/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutUs;