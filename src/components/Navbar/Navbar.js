import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import style from "./Navbar.module.css"
const ImagUrl = "https://storage.googleapis.com/ghardekho-c3029.appspot.com/";
const Navbar = () => {
    //redux data
    const isLoggedIn = useSelector(state => state.AuthReducer.isLoggedIn);
    const user = useSelector(state => state.AuthReducer.user);

    // component useStates
    const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)
    const [mobMenuOpen, setMobMenuOpen] = useState(false)

    const [scroll, setScroll] = useState(100);

    useEffect(() => {
        document.addEventListener("scroll", () => {
          const scrollCheck = window.scrollY < 100;
          if (scrollCheck !== scroll) {
            setScroll(scrollCheck);
          }
        });
      }, [scroll]);

    const openUserDetail = () => {
        setIsUserDetailOpen(isUserDetailOpen => !isUserDetailOpen)
    }

    const openMobMenu = () => {
        setMobMenuOpen(mobMenuOpen => !mobMenuOpen)
    }
    return (
        <>
            <div className={scroll > 0 ? style.navbar : style.navbar_on_scroll}>
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
                    <div onClick={() => {openUserDetail(); setMobMenuOpen(false);}} className={style.sectionTwo}>
                        {isLoggedIn ? <li className={style.rightBtn} ><i className={"fas fa-user-circle " + style.rightBtnIconStyle}></i></li> : <Link to="/login"><li className={style.rightBtn}><i className={"fas fa-sign-in-alt " + style.rightBtnIconStyle}></i></li></Link>}
                        <p className={style.userMobileName}>{user.name}</p>
                    </div>
                </div>
                {isUserDetailOpen &&
                    <div className={style.userDetails}>
                        <div className={style.userProfile}>
                            {user.image ? <img className={style.profileImage} src={`${ImagUrl}${user.image}`} alt="..." /> : <i className="fas fa-user-circle"></i>} 
                            
                            <p className={style.profileName}>{user.name}</p>
                            <p className={style.profilePhone}>+91 {user.phone}</p>
                        </div>
                        <div className={style.userOptions}>
                            <Link onClick={() => openUserDetail()} to="/profile" className={style.userOption}><i className="fas fa-id-badge"></i>Profile</Link>
                            <Link onClick={() => openUserDetail()} to="/post-property" className={style.userOption}><i className="fas fa-map-marker-alt"></i>Post Property</Link>
                            <li onClick={() => openUserDetail()} className={style.userOption}><i className="fas fa-times-circle"></i>Close</li>
                        </div>
                    </div>}
            </div>
        </>
    )
}

export default Navbar;