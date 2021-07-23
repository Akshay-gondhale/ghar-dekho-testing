import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import style from "./Profile.module.css"
import validator from "validator";
import { updateProfile } from "../../redux/actions/AuthActions";
import { useHistory } from "react-router-dom";
import { GetUserPropertiesByStatus, LoadMorePropertiesByStatus } from "../../redux/actions/ProfileActions";
import { ImageUrl } from "../../utils/BaseApi"
import imageCompression from 'browser-image-compression';
const Profile = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const user = useSelector(state => state.AuthReducer.user)
    var subSectionData = useSelector(state => state.ProfileDataReducer)
    // console.log(subSectionData)
    const [isEditProfile, setIsEditProfile] = useState(false)
    const [image, setImage] = useState(null)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [isLoading, setIsLoading] = useState(false);
    const [isSubSectionLoading, setIsSubSectionLoading] = useState(false);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false)

    // data useStates
    const [activeNavElement, setActiveNavElement] = useState("homes")
    const [activeSubNavElement, setActiveSubNavElement] = useState("registered")

    const imageSelector = async (e) => {
        if (e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/png") {
            const options = {
                maxWidthOrHeight: 500,
            }
            var ImageBlob = await imageCompression(e.target.files[0], options)
            console.log(ImageBlob)
            setImage(ImageBlob)
        }
        else {
            toast.error("Please select a profile image!😔")
        }
    }
    const submitUpdateProfile = () => {
        if (name === "" || email === "") {
            toast.error("Name or email is empty!  Please fill them 😔")
        }
        else if (!validator.isEmail(email)) {
            toast.error("Please enter a valid email! 😔")
        }
        else {
            var data = new FormData()
            data.append("name", name);
            data.append("email", email)
            if (image !== null) {
                data.append("profile", image, image.name)
            }
            setIsEditProfile(false)
            dispatch(updateProfile(data, toast, history, setIsLoading))

        }
    }

    const LoadMoreSubSectionData = () => {
        dispatch(LoadMorePropertiesByStatus(activeSubNavElement, subSectionData, setIsLoadMoreLoading))
    }
    useEffect(() => {
        dispatch(GetUserPropertiesByStatus(activeSubNavElement, setIsSubSectionLoading))
    }, [dispatch, activeSubNavElement])
    return (
        <>
            {isLoading
                ?
                <div className={style.profileLoading}>
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                :
                <div>
                    <div className={style.mainDiv}>
                        <div className={style.dataDiv}>
                            <div className={style.imgDiv}>

                                {user.image ? <img src={`${ImageUrl}${user.image}`} alt="..." /> : <i className={"fas fa-user-circle " + style.profilePicIcon}></i>}
                                <i onClick={() => setIsEditProfile(true)} className={"fas fa-pen " + style.imgEdit}></i>
                            </div>
                            <div className={style.infoDiv}>
                                <div className={style.infoField + " " + style.profileName}><p>{user.name}</p><i onClick={() => setIsEditProfile(true)} className="fas fa-pen"></i></div>
                                <div className={style.infoField}><p>+91 {user.phone}</p></div>
                                <div className={style.infoField}><p>{user.email}</p><i onClick={() => setIsEditProfile(true)} className="fas fa-pen"></i></div>
                            </div>
                        </div>
                        <div className={style.profilDataDiv}>
                            <div className={style.mainNavigation}>
                                <li onClick={() => setActiveNavElement("homes")} className={activeNavElement === "homes" ? style.activeNavElement : style.navElement}>Your Homes <i className="fas fa-igloo"></i></li>
                                <li onClick={() => setActiveNavElement("notifications")} className={activeNavElement === "notifications" ? style.activeNavElement : style.navElement}>Notifications <i className="fas fa-comment-alt"></i></li>
                            </div>
                            {
                                activeNavElement === "homes" &&
                                <>
                                    <div className={style.mainSubNavigation}>
                                        <li onClick={() => setActiveSubNavElement("registered")} className={activeSubNavElement === "registered" ? style.activeNavElement : style.navElement}>Registered<i className="fab fa-font-awesome-flag"></i></li>
                                        <li onClick={() => setActiveSubNavElement("in-progress")} className={activeSubNavElement === "in-progress" ? style.activeNavElement : style.navElement}>In Progress <i className="fas fa-bicycle"></i></li>
                                        <li onClick={() => setActiveSubNavElement("verified")} className={activeSubNavElement === "verified" ? style.activeNavElement : style.navElement}>Verified <i className="fas fa-check-circle"></i></li>
                                        <li onClick={() => setActiveSubNavElement("rejected")} className={activeSubNavElement === "rejected" ? style.activeNavElement : style.navElement}>Rejected<i className="fas fa-times-circle"></i></li>
                                    </div>
                                    {
                                        isSubSectionLoading
                                            ?
                                            <div className={style.subSectionDataSpinnerWrapper}>
                                                <div className="spinner-border text-success" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                            :
                                            subSectionData.data.length > 0 ?
                                                <div className={style.subSectionDataDiv}>
                                                    {subSectionData.data.map((data, index) => {
                                                        return (
                                                            <div key={index} className={style.homeDiv}>
                                                                <div className={style.homeThumbnail}>
                                                                    <img src={`${ImageUrl}${data.images[0].path}`} alt="..." />
                                                                </div>
                                                                <div className={style.homeData}>
                                                                    <p className={style.homeTitle}>{data.title}</p>
                                                                    <p className={style.homeAddress}>{`${data.houseNumber}, ${data.locality}, ${data.area}, ${data.city}`}</p>
                                                                    <p className={style.homeAmmount}>{data.sellOrRent}: <i className="fas fa-rupee-sign"></i>{data.ammount}</p>
                                                                    <p className={
                                                                        activeSubNavElement === "registered" ? style.homeRegisteredStyle :
                                                                            activeSubNavElement === "in-progress" ? style.homeInProgressStyle :
                                                                                activeSubNavElement === "verified" ? style.homeVerifiedStyle :
                                                                                    style.homeRejectedStyle
                                                                    }>{
                                                                            activeSubNavElement === "registered" ? <>Registered <i className="fab fa-font-awesome-flag"></i> (No broker assigned yet!)</> :
                                                                                activeSubNavElement === "in-progress" ? <>In progress <i className="fas fa-bicycle"></i> (Broker assigned. will soon contact you!)</> :
                                                                                    activeSubNavElement === "verified" ? <>Verified <i className="fas fa-check-circle"></i> (Your home verified!)</> :
                                                                                        <>Rejected <i className="fas fa-times-circle"></i> (Rejected by broker.)</>
                                                                        }</p>
                                                                    <p className={style.homeRegisteredDate}>Registered On: 23-07-2021</p>
                                                                </div>
                                                            </div>

                                                        )
                                                    })}

                                                    {subSectionData.isNextAvailable &&
                                                        <div className={style.loadMoreWrapper}>
                                                            {
                                                                isLoadMoreLoading
                                                                    ?
                                                                    <div className="spinner-border text-success" role="status">
                                                                        <span className="visually-hidden">Loading...</span>
                                                                    </div>
                                                                    :
                                                                    <div onClick={() => LoadMoreSubSectionData()}>
                                                                        <PrimaryButton heading='Load More <i class="fas fa-chevron-circle-down"></i>' />
                                                                    </div>
                                                            }

                                                        </div>
                                                    }
                                                </div>
                                                :
                                                <div className={style.notFoundData}>
                                                    <i className="fas fa-microscope"></i>
                                                    <p className={style.noDataDescription}>We looked up and down but no data found in this section!</p>
                                                </div>
                                    }
                                </>
                            }
                            {
                                activeNavElement === "notifications" &&
                                <div className={style.mainNotificationDiv}>
                                    <div className={style.notification}>
                                        <p className={style.notificationHeading}>Hello world</p>
                                        <p className={style.notificationTxt}>Artists producing art and engraving on United States banknotes began experimenting with copper plates as an alternative to wood engraving in the early 18th century. Applied to the production of paper currency, copper-plate engraving, and later steel engraving, enabled banknote design and printing to rapidly advance during the 19th century. This vignette, engraved by W. W. Rice, appeared on certain United States fifty-dollar bills issued in 1875. </p>
                                        <p className={style.notificationDate}>23-07-2021 1:50</p>
                                    </div>
                                    <div className={style.notification}>
                                        <p className={style.notificationHeading}>Hello world</p>
                                        <p className={style.notificationTxt}>Artists producing art and engraving on United States banknotes began experimenting with copper plates as an alternative to wood engraving in the early 18th century. Applied to the production of paper currency, copper-plate engraving, and later steel engraving, enabled banknote design and printing to rapidly advance during the 19th century. This vignette, engraved by W. W. Rice, appeared on certain United States fifty-dollar bills issued in 1875. </p>
                                        <p className={style.notificationDate}>23-07-2021 1:50</p>
                                    </div>
                                    <div className={style.notification}>
                                        <p className={style.notificationHeading}>Hello world</p>
                                        <p className={style.notificationTxt}>Artists producing art and engraving on United States banknotes began experimenting with copper plates as an alternative to wood engraving in the early 18th century. Applied to the production of paper currency, copper-plate engraving, and later steel engraving, enabled banknote design and printing to rapidly advance during the 19th century. This vignette, engraved by W. W. Rice, appeared on certain United States fifty-dollar bills issued in 1875. </p>
                                        <p className={style.notificationDate}>23-07-2021 1:50</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={isEditProfile ? style.mainEditDiv : style.hidden}>
                        <div className={style.editDiv}>
                            <i onClick={() => setIsEditProfile(false)} className={"far fa-times-circle " + style.editDivCloseBtn}></i>

                            <div className={style.editImgDiv}>
                                {image === null ? user.image ? <img src={`${ImageUrl}${user.image}`} alt="..." /> : <i className={"fas fa-user-circle " + style.profilePicIcon}></i> : <img src={URL.createObjectURL(image)} alt="..." />}
                                <i className={"fas fa-pen " + style.imgEdit}><input onChange={(e) => imageSelector(e)} className={style.imgSelect} type="file" accept=".jpeg, .jpg, .png" /></i>
                            </div>
                            <div className={style.editFields}>
                                <div className={style.inputWrapper}>
                                    <p className={style.inputLabel}>Profile Name</p>
                                    <input className={style.inputTag} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" type="text" />

                                </div>
                                <div className={style.inputWrapper}>
                                    <p className={style.inputLabel}>Profile Email</p>
                                    <input className={style.inputTag} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" type="text" />

                                </div>
                                <span onClick={() => submitUpdateProfile()} className={style.updateBtn}>
                                    <PrimaryButton heading='Update <i class="fas fa-wrench"></i>' />
                                </span>

                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Profile;