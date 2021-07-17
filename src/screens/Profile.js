import { useState } from "react";
import { useSelector } from "react-redux";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import style from "./Profile.module.css"
const Profile = () => {
    const user = useSelector(state => state.AuthReducer.user)
    const [isEditProfile, setIsEditProfile] = useState(false)

    const [image, setImage] = useState(null)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    return (
        <>
            <div className={style.mainDiv}>
                <div className={style.dataDiv}>
                    <div className={style.imgDiv}>
                        
                    <img src="/images/login.svg" alt="..." />
                        {/* {user.image ? <img src="/images/modiji.jpg" alt="..." /> : <i className={"fas fa-user-circle " + style.profilePicIcon}></i>
                        } */}
                        <i onClick={() => setIsEditProfile(true)} className={"fas fa-pen " + style.imgEdit}></i>
                    </div>
                    <div className={style.infoDiv}>
                        <div className={style.infoField + " " + style.profileName}><p>{user.name}</p><i onClick={() => setIsEditProfile(true)} className="fas fa-pen"></i></div>
                        <div className={style.infoField}><p>+91 {user.phone}</p></div>
                        <div className={style.infoField}><p>{user.email}</p><i onClick={() => setIsEditProfile(true)} className="fas fa-pen"></i></div>
                    </div>
                </div>
            </div>
            <div className={isEditProfile ? style.mainEditDiv : style.hidden}>
                <div className={style.editDiv}>
                    <i onClick={() => setIsEditProfile(false)} className={"far fa-times-circle " + style.editDivCloseBtn}></i>

                    <div className={style.editImgDiv}>
                        {console.log(image)}
                        {image === null ? user.image ? <img src="/images/modiji.jpg" alt="..." /> : <i className={"fas fa-user-circle " + style.profilePicIcon}></i> : <img src={URL.createObjectURL(image)} alt="..." />}
                        <i className={"fas fa-pen " + style.imgEdit}><input onChange={(e) => setImage(e.target.files[0])} className={style.imgSelect} type="file" /></i>
                    </div>
                    <div className={style.editFields}>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Profile Name</p>
                            <input className={style.inputTag} value={name} onChange={(e)=> setName(e.target.value)} placeholder="Enter name" type="text" />

                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Profile Email</p>
                            <input className={style.inputTag} value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="Enter email" type="text" />

                        </div>
                        <span className={style.updateBtn}>
                            <PrimaryButton heading='Update <i class="fas fa-wrench"></i>' />
                        </span>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;