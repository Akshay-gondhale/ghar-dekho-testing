import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import style from "./Profile.module.css"
import validator from "validator";
import { updateProfile } from "../../redux/actions/AuthActions";
import { useHistory } from "react-router-dom";
const ImagUrl = "https://storage.googleapis.com/ghardekho-c3029.appspot.com/";
const Profile = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const user = useSelector(state => state.AuthReducer.user)
    const [isEditProfile, setIsEditProfile] = useState(false)
    const [image, setImage] = useState(null)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [isLoading, setIsLoading] = useState(false);

    const imageSelector = (e) => {
        if(e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/png"){
            setImage(e.target.files[0])
        }
        else{
            toast.error("Please select a profile image!😔")
        }
    }
    const submitUpdateProfile = () => {
        if(name === "" || email ===""){
            toast.error("Name or email is empty!  Please fill them 😔")
        }
        else if(!validator.isEmail(email)){
            toast.error("Please enter a valid email! 😔")
        }
        else{
            var data = new FormData()
            data.append("name", name);
            data.append("email", email)
            if(image !== null){
                data.append("profile", image)
            }
            setIsEditProfile(false)
            dispatch(updateProfile(data, toast, history, setIsLoading))
            
        }
    }
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

                                {user.image ? <img src={`${ImagUrl}${user.image}`} alt="..." /> : <i className={"fas fa-user-circle " + style.profilePicIcon}></i>}
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
                                {image === null ? user.image ? <img src={`${ImagUrl}${user.image}`} alt="..." /> : <i className={"fas fa-user-circle " + style.profilePicIcon}></i> : <img src={URL.createObjectURL(image)} alt="..." />}
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
                                <span onClick={()=>submitUpdateProfile()} className={style.updateBtn}>
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