import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, NavLink, Link } from "react-router-dom";
import style from "./Navbar.module.css"
const Navbar = () => {
    const isLoggedIn = useSelector(state => state.AuthReducer.isLoggedIn);
    const user = useSelector(state => state.AuthReducer.user);


    const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)
    const [mobMenuOpen, setMobMenuOpen] = useState(false)

    const openUserDetail = () => {
        setIsUserDetailOpen(isUserDetailOpen => !isUserDetailOpen)
    }

    const openMobMenu = () => {
        setMobMenuOpen(mobMenuOpen => !mobMenuOpen)
    }
    return (
        <>
            <div className={style.navbar}>
                <Link to="/" className={style.logo}>
                    <p className={style.logo_txt}><span className={style.logo_span}>Ghar</span>Dekho</p>
                </Link>
                <i onClick={() => openMobMenu()} className={"fas fa-bars " + style.menuBtnIconStyle}></i>
                <div className={mobMenuOpen ? style.activeNavElements : style.navElements}>
                    <i onClick={() => openMobMenu()} className={"fas fa-times-circle " + style.closeMobMenu}></i>
                    <div className={style.sectionOne}>
                        <NavLink onClick={()=>setMobMenuOpen(false)} to="/" exact className={style.navElement} activeClassName={style.activeNavElement}>Home</NavLink>
                        <NavLink onClick={()=>setMobMenuOpen(false)} to="/properties" exact className={style.navElement} activeClassName={style.activeNavElement}>Properties</NavLink>
                        <NavLink onClick={()=>setMobMenuOpen(false)} to="/about" exact className={style.navElement} activeClassName={style.activeNavElement}>About</NavLink>
                        <NavLink onClick={()=>setMobMenuOpen(false)} to="/contact" exact className={style.navElement} activeClassName={style.activeNavElement}>Contact Us</NavLink>
                    </div>
                    <div onClick={() => openUserDetail()} className={style.sectionTwo}>
                        {isLoggedIn ? <li className={style.rightBtn} ><i className={"fas fa-user-circle " + style.rightBtnIconStyle}></i></li> : <Link to="/login"><li className={style.rightBtn}><i className={"fas fa-sign-in-alt " + style.rightBtnIconStyle}></i></li></Link>}
                        <p className={style.userMobileName}>{user.name}</p>
                    </div>
                </div>
                {isUserDetailOpen &&
                    <div className={style.userDetails}>
                        <div className={style.userProfile}>
                            {/* <i className="fas fa-user-circle"></i> */}
                            <img className={style.profileImage} src="/images/modiji.jpg" alt="Couldn't load profile image..." />
                            <p className={style.profileName}>{user.name}</p>
                            <p className={style.profilePhone}>+91 {user.phone}</p>
                        </div>
                        <div className={style.userOptions}>
                            <li className={style.userOption}><i class="fas fa-id-badge"></i>Profile</li>
                            <li onClick={() => openUserDetail()} className={style.userOption}><i class="fas fa-times-circle"></i>Close</li>
                        </div>
                    </div>}
            </div>
        </>
    )
}

export default Navbar;