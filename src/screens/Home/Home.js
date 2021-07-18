
import PrimaryButton from "../../components/Buttons/PrimaryButton"
import style from "./Home.module.css"
const Home = () => {
    return (
        <>
            <div className={style.homeBanner}>
                <div className={style.leftDiv}>
                    <p className={style.logo}><span className={style.greenLogo}>Ghar</span>Dekho</p>
                    <p className={style.slogan}>One of the best site to browse home across Bhiwandi.</p>
                    <div><PrimaryButton heading={`Know More <i class="fas fa-arrow-circle-right"></i>`} /></div>
                </div>
                <div className={style.rightDiv}>
                    <img className={style.bannerImg} src="/images/homeBanner.svg" alt="..."/>
                </div>
            </div>
            <div className={style.infoDivRight}>
                <div className={style.infoDataRight}>
                    <p className={style.infoHeadingRight}>Verified Properties</p>
                    <p className={style.infoTxtRight}>All properties uploaded on website are verified by our brokers. Whenever a new property get posts on website our brokers picks them up and verify that property by actually visiting to the property. So that website users can freely browse homes without having tention of fake homes.</p>
                </div>
                <div className={style.infoImgRight}>
                    <img src="/images/verifiedProperties.svg" alt="..." />
                </div>
            </div>
            <div className={style.infoDivLeft}>
                <div className={style.infoDataLeft}>
                    <p className={style.infoHeadingLeft}>Verity Of Homes</p>
                    <p className={style.infoTxtLeft}>All users have different needs and requirements. So here are the varieties of homes uploaded on our website like 1BHK, 1RK, 2BHK,etc. Also users have option to find homes for rent or to own. Also we have kept option in mind like parking, square foot area of home, vegetarian community for homes.</p>
                </div>
                <div className={style.infoImgLeft}>
                    <img src="/images/verityHomes.svg" alt="..." />
                </div>
            </div>
            
            <div className={style.infoDivRight}>
                <div className={style.infoDataRight}>
                    <p className={style.infoHeadingRight}>User Frienly UI</p>
                    <p className={style.infoTxtRight}>The UI is also designed by keeping users in mind. So that users won't get trouble to find there home on our site</p>
                </div>
                <div className={style.infoImgRight}>
                    <img src="/images/userFriendly.svg" alt="..." />
                </div>
            </div>
            <div className={style.infoDivCenter}>
                <div className={style.infoDataCenter}>
                    <p className={style.infoHeadingCenter}>Excited To Browse Homes?</p>
                    <p className={style.infoTxtCenter}>Click the below button to find best deals across the Bhiwandi!</p>
                    <div className={style.browseBtn}><PrimaryButton heading={`Browse <i class="fas fa-rocket"></i>`} /></div>
                </div>
                <div className={style.infoImgCenter}>
                    <img src="/images/excitedToBrowseHomes.svg" alt="..." />
                </div>
            </div>

        </>
    )
}

export default Home;