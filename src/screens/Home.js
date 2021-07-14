import PrimaryButton from "../components/Buttons/PrimaryButton"
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
        </>
    )
}

export default Home;