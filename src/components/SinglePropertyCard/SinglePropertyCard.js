import { Link } from "react-router-dom";
import style from "./SinglePropertyCard.module.css"
import { motion } from "framer-motion";
const SingleProperty = ({title, address, sellOrRent, ammount, homeType, carpetArea, id, thumbnail, isLoggedIn, userId, homeUserId}) => {
    return (
        <>
            <Link to={isLoggedIn && userId === homeUserId ? `/profile/home/${id}` : `/properties/${id}`} className={style.homeDiv}>
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}} className={style.homeThumbnail}>
                    <img src={thumbnail} alt="..." />
                </motion.div>
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}} className={style.homeData}>
                    <p className={style.homeTitle}>{title}</p>
                    <p className={style.homeAddress}>{address}</p>
                    <p className={style.homeAmmount}><span className={style.sellOrRentHeading}>{sellOrRent}</span>: <i className="fas fa-rupee-sign"></i>{ammount}</p>
                    <div className={style.homeFeaturesWrapper}>
                        <p className={style.homeFeatures}>{homeType}</p>
                        <p className={style.homeFeatures}>{carpetArea} sq. ft.</p>
                    </div>
                </motion.div>
            </Link>
        </>

    )
}

export default SingleProperty;