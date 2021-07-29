import style from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const userData = useSelector(state=>state.AuthReducer.user)
    return (
        <>
            <div className={isSidebarOpen ? style.mainDiv : style.hideMobSidebar}>
                <i onClick={()=>{setIsSidebarOpen(false)}} className={"fas fa-times-circle "+ style.closeMobSidebar}></i>
                <div className={style.sidebarHeader}>
                    <div className={style.logoDiv}>
                        <p className={style.logo_txt}>
                            <span className={style.logo_span}>Ghar</span>Dekho
                        </p>
                    </div>
                    <p className={style.brokerName}>{userData.name}</p>
                    <p className={style.brokerContact}>+91 {userData.phone}</p>
                </div>
                <div className={style.sidebarSections}>
                    <NavLink
                        to="/"
                        exact
                        onClick={()=>setIsSidebarOpen(false)}
                        className={style.sideElement}
                        activeClassName={style.activeSideElement}
                    >
                        <i className="fas fa-tachometer-alt"></i> Dashboard
                    </NavLink>
                    <NavLink
                        to="/homes"
                        exact
                        onClick={()=>setIsSidebarOpen(false)}
                        className={style.sideElement}
                        activeClassName={style.activeSideElement}
                    >
                        <i className="fas fa-igloo"></i> Homes
                    </NavLink>
                    <NavLink
                        to="/users"
                        exact
                        onClick={()=>setIsSidebarOpen(false)}
                        className={style.sideElement}
                        activeClassName={style.activeSideElement}
                    >
                        <i className="fas fa-users"></i> Users
                    </NavLink>
                </div>
            </div>
            <div className={style.mobileMainDiv}>
                <i onClick={() => { setIsSidebarOpen(true) }} className="fas fa-bars"></i>
                <p className={style.mob_logo_txt}>
                    <span className={style.logo_span}>Ghar</span>Dekho
                </p>
            </div>
        </>
    );
};

export default Sidebar;
