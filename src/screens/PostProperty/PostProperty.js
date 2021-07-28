import style from "./PostProperty.module.css"
import React, { useEffect, useState } from 'react';
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { toast } from "react-toastify";
import validator from "validator";
import axios from "axios";
import { useHistory } from "react-router-dom";
import imageCompression from 'browser-image-compression';
const PostProperty = () => {
    const user = useSelector(state => state.AuthReducer.user);
    const history = useHistory()
    //section one
    const [uploaderName, setUploaderName] = useState(user.name)
    const [uploaderEmail, setUploaderEmail] = useState(user.email)
    const [uploaderPhone, setUploaderPhone] = useState(user.phone)
    const [sameAsUploader, setSameAsUploader] = useState(false)

    const [ownerName, setOwnerName] = useState("")
    const [ownerEmail, setOwnerEmail] = useState("")
    const [ownerPhone, setOwnerPhone] = useState("")

    //section 2
    const [houseNumber, setHouseNumber] = useState("")
    const [locality, setLocality] = useState("")
    const [area, setArea] = useState("")
    const [city, setCity] = useState("Bhiwandi")
    const [landmark, setLandmark] = useState("")

    const [homeType, setHomeType] = useState("null")
    const [parking, setParking] = useState("null")
    const [floor, setFloor] = useState("")
    const [totalFloor, setTotalFloor] = useState("")
    const [carpetArea, setCarpetArea] = useState("")
    const [age, setAge] = useState("")
    const [isVeg, setIsVeg] = useState(false)

    //section 3
    const [imagesObj, setImagesObj] = useState("")
    const [images, setImages] = useState([])

    //section 4
    const [sellOrRent, setSellOrRent] = useState("null")
    const [ammount, setAmmount] = useState("")
    const [description, setDescription] = useState("")
    const [title, setTitle] = useState("")

    const [submitLoading, setSubmitLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)


    useEffect(() => {
        if (sameAsUploader) {
            setOwnerName(uploaderName)
            setOwnerPhone(uploaderPhone)
            setOwnerEmail(uploaderEmail)
        }
        else {
            setOwnerName("")
            setOwnerPhone("")
            setOwnerEmail("")
        }
    }, [sameAsUploader, uploaderName, uploaderPhone, uploaderEmail])

    useEffect(() => {
        if (imagesObj !== "" && typeof (imagesObj) !== undefined && imagesObj !== null) {
            setImageLoading(true)
            var imagesArray = Object.keys(imagesObj).map(key => {
                return imagesObj[key];
            })

            //compressing files
            const options = {
                maxSizeMB:1,
                useWebWorker: true
            }
            const imageBlobs = imagesArray.map(async (data, index) => {
                const blobdata = await imageCompression(data, options)
                return blobdata;
            })

            Promise.all(imageBlobs)
                .then(image => {
                    setImages(image)
                    setImageLoading(false)
                })
                .catch(err => {
                    toast.error("Something went wrong while image uploading")
                    console.log(err)
                    setImageLoading(false)
                })

        }
    }, [imagesObj])

    const arrowStyles = {
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 15px)',
        width: "2rem",
        height: "2rem",
        cursor: 'pointer',
        backgroundColor: "rgba(0,0,0,0.1)",
        border: "none",
        borderRadius: "50%",
        fontSize: "1.1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#283747",
        outline: "none"
    };


    const submitHome = () => {
        if (
            ownerName.trim() === "" ||
            ownerPhone.trim() === "" ||
            ownerEmail.trim() === "" ||

            houseNumber.trim() === "" ||
            locality.trim() === "" ||
            area.trim() === "" ||
            city.trim() === "" ||
            landmark.trim() === "" ||

            homeType === "null" ||
            parking === "null" ||
            floor.trim() === "" ||
            totalFloor.trim() === "" ||
            carpetArea.trim() === "" ||
            age.trim() === "" ||
            sellOrRent === "null" ||
            ammount.trim() === "" ||
            description.trim() === "" ||
            title.trim() === ""

        ) {
            toast.error("All details are required! 😔")
        }
        else if (!validator.isEmail(ownerEmail)) {
            toast.error("Please enter a valid email of owner.! 😔", {
            });
        }
        else if (ownerPhone.length > 10 || ownerPhone.length < 10) {
            toast.error("Please provide a valid phone number of owner.! 😔", {
            });
        }
        else if (images.length === 0) {
            toast.error("Please Upload Home Images! 😔")

        }
        else {
            setSubmitLoading(true)
            const propertyData = new FormData();
            propertyData.append("ownerName", ownerName);
            propertyData.append("ownerPhone", ownerPhone);
            propertyData.append("ownerEmail", ownerEmail);
            propertyData.append("houseNumber", houseNumber);
            propertyData.append("locality", locality)
            propertyData.append("area", area)
            propertyData.append("city", city)
            propertyData.append("landmark", landmark)
            propertyData.append("homeType", homeType)
            propertyData.append("parking", parking)
            propertyData.append("floor", floor)
            propertyData.append("totalFloor", totalFloor)
            propertyData.append("carpetArea", carpetArea)
            propertyData.append("age", age)
            propertyData.append("isVeg", isVeg)
            propertyData.append("sellOrRent", sellOrRent)
            propertyData.append("ammount", ammount)
            propertyData.append("title", title)
            propertyData.append("description", description)

            for (let i = 0; i < images.length; i++) {
                const element = images[i];
                propertyData.append("images", element, element.name)
            }

            axios({
                method: "POST",
                url: "/user/postProperty",
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                data: propertyData
            })
                .then(res => {
                    console.log(res)
                    toast.success(res.data.message)
                    setSubmitLoading(false)
                    history.push("/")
                })
                .catch(err => {
                    console.log(err)
                    toast.error("Got error")
                    setSubmitLoading(false)
                })
        }
    }

    const imageValidation = (e) => {
        setImagesObj(null)
        console.log("in image  validation")
        var isValid = true;
        if (e.target.files.length > 10) {
            toast.error("Image upload limit is 10! 😔")
            return;
        }
        for (let i = 0; i < e.target.files.length; i++) {
            const element = e.target.files[i];
            console.log("checking file = " + i);
            if (element.type === "image/jpeg" || element.type === "image/png") {
                isValid = true
            }
            else {
                isValid = false
                console.log("got unsupported file " + element.type)
                break;
            }

        }
        if (isValid) {

            setImagesObj(e.target.files)
        }
        else {
            toast.error("Please select valid images! 😔")
        }
    }
    return (
        <>
            <div className={style.mainDiv}>
                <div className={style.innerMainDiv}>
                    <p className={style.divHeading}>Owner Details</p>
                    <div className={style.innerMainSubDiv}>
                        <p className={style.divSubHeading}>Uploader's Details</p>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Uploader's Name</p>
                            <input className={style.inputTag} value={uploaderName} onChange={e => setUploaderName(e.target.value)} placeholder="Enter name" disabled type="text" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Uploader's Email</p>
                            <input className={style.inputTag} value={uploaderEmail} onChange={e => setUploaderEmail(e.target.value)} placeholder="Enter email" disabled type="text" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Uploader's Phone</p>
                            <input className={style.inputTag} value={uploaderPhone} onChange={e => setUploaderPhone(e.target.value)} placeholder="Enter phone" disabled type="text" />
                        </div>
                    </div>
                    <div className={style.innerMainSubDiv}>
                        <p className={style.divSubHeading}>Owner's Details</p>
                        <div className={style.checkBoxWrapper}>
                            <p className={style.checkBoxText}>Same as above</p>
                            <input type="checkbox" value={sameAsUploader} checked={sameAsUploader} onChange={() => setSameAsUploader(sameAsUploader => !sameAsUploader)} className={style.checkBox} />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Owner's Name</p>
                            <input className={style.inputTag} value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Enter name" type="text" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Owner's Email</p>
                            <input className={style.inputTag} value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="Enter email" type="text" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Owner's Phone</p>
                            <input className={style.inputTag} value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} placeholder="Enter phone" type="text" />
                        </div>
                    </div>

                </div>
                <div className={style.innerMainDiv}>
                    <p className={style.divHeading}>Home Details</p>
                    <div className={style.innerMainSubDiv}>
                        <p className={style.divSubHeading}>Enter Full Address</p>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>House Number</p>
                            <input className={style.inputTag} value={houseNumber} onChange={e => setHouseNumber(e.target.value)} placeholder="Enter house number" type="text" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Street/Building/Locality Name</p>
                            <input className={style.inputTag} value={locality} onChange={e => setLocality(e.target.value)} placeholder="Enter Street/Building/Locality name" type="text" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Area</p>
                            <input className={style.inputTag} value={area} onChange={e => setArea(e.target.value)} placeholder="Enter area" type="text" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>City <span className={style.headingNote}>(Note: We are currently available in Bhiwandi only!)</span></p>
                            <input className={style.inputTag} value={city} onChange={e => setCity(e.target.value)} placeholder="Enter city" disabled type="text" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Nearest Landmark</p>
                            <input className={style.inputTag} value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="Enter nearest landmark" type="text" />
                        </div>

                    </div>
                    <div className={style.innerMainSubDiv}>
                        <p className={style.divSubHeading}>Enter Home Details</p>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Select Home Type</p>
                            <select value={homeType} onChange={(e => setHomeType(e.target.value))} className={style.inputTag}>
                                <option value="null">Choose One</option>
                                <option value="1RK">1RK</option>
                                <option value="1BHK">1BHK</option>
                                <option value="2BHK">2BHK</option>
                                <option value="3BHK">3BHK</option>
                            </select>
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Is Parking Available There?</p>
                            <select value={parking} onChange={e => setParking(e.target.value)} className={style.inputTag}>
                                <option value="null">Choose One</option>
                                <option value="Not Available">Not Available</option>
                                <option value="Only Two Wheeler Parking">Only Two Wheeler Parking</option>
                                <option value="Two Wheeler And Four Wheeler Parking">Two Wheeler And Four Wheeler Parking</option>
                            </select>
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Home Available On Floor</p>
                            <input className={style.inputTag} min="0" value={floor} onChange={e => setFloor(e.target.value)} placeholder="Enter FLoor Number. Eg-1st, 2nd, etc" type="number" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Total Floors Available In Building</p>
                            <input className={style.inputTag} min="0" value={totalFloor} onChange={e => setTotalFloor(e.target.value)} placeholder="Enter Total Floors Available in Building. Eg- 4, 5, etc" type="number" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Carpet Area of Home <span className={style.headingNote}>(In sq.ft)</span></p>
                            <input className={style.inputTag} min="0" value={carpetArea} onChange={e => setCarpetArea(e.target.value)} placeholder="Enter Carpet Area Of Home. Eg - 3000 sq.ft, etc" type="number" />
                        </div>
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Age of Property <span className={style.headingNote}>(In years)</span></p>
                            <input className={style.inputTag} min="0" value={age} onChange={e => setAge(e.target.value)} placeholder="Enter Age of Property. Eg - 3 years, etc" type="number" />
                        </div>
                        <div className={style.checkBoxWrapper2}>
                            <p className={style.checkBoxText}>You have to sell/rent only vegetarians? If yes please click here.</p>
                            <input type="checkbox" value={isVeg} checked={isVeg ? true : false} onChange={() => { setIsVeg(isVeg => !isVeg) }} name="sameAsAbove" className={style.checkBox} />
                        </div>

                    </div>

                </div>
                <div className={style.innerMainDiv}>
                    <p className={style.divHeading}>Upload Images</p>
                    <div className={style.innerMainSubDiv}>
                        <p className={style.divSubHeading}>Please upload best Images of your Home!.</p>
                        <span style={{ width: "100%" }} className={style.headingNote}>(Note:These images will be viewable to all users on website who are browsing homes.)</span>

                        <div className={style.uploadImgWrapper}>
                            {imageLoading
                                ?
                                <div className={"spinner-border text-success " + style.imageLoadingSpinnerWrapper} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                :

                                <div className={style.uploadDiv}>
                                    <PrimaryButton heading='Upload Images <i class="fas fa-upload"></i>' />
                                    <input accept=".jpeg, .jpg, .png" onChange={e => imageValidation(e)} multiple={true} type="file" />
                                </div>
                            }

                        </div>
                        {images.length > 0 &&
                            <div className={style.imagesWrapperDiv}>
                                <p className={style.divSubHeading}>Preview</p>
                                <div className={style.imagesWrapper}>
                                    <Carousel
                                        infiniteLoop={true}
                                        autoPlay={true}
                                        interval={3000}
                                        showStatus={false}
                                        showThumbs={false}
                                        renderArrowPrev={(onClickHandler, hasPrev, label) =>
                                            hasPrev && (
                                                <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, left: 15 }}>
                                                    <i className="fas fa-caret-left"></i>
                                                </button>
                                            )
                                        }
                                        renderArrowNext={(onClickHandler, hasNext, label) =>
                                            hasNext && (
                                                <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, right: 15 }}>
                                                    <i className="fas fa-caret-right"></i>
                                                </button>
                                            )
                                        }
                                    >

                                        {images.length > 0 && images.map((data, index) => {
                                            return (
                                                <div key={index} className={style.imageContainer}>
                                                    <img src={URL.createObjectURL(data)} alt="..." />
                                                </div>
                                            )
                                        })}
                                    </Carousel>

                                </div>
                            </div>}
                    </div>

                </div>
                <div className={style.innerMainDiv}>
                    <p className={style.divHeading}>Rent or Sell</p>
                    <div className={style.innerMainSubDiv}>
                        <p className={style.divSubHeading}>Please select either you want to sell Home or to give it on Rent</p>

                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Select Type</p>
                            <select value={sellOrRent} onChange={e => setSellOrRent(e.target.value)} className={style.inputTag}>
                                <option value="null">Choose One</option>
                                <option value="sell">Sell</option>
                                <option value="rent">Rent</option>
                            </select>
                        </div>
                        {sellOrRent !== "null" &&

                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Ammount Of {sellOrRent}</p>
                                <input value={ammount} onChange={e => setAmmount(e.target.value)} className={style.inputTag} min="0" placeholder={`Enter ammount of ${sellOrRent}`} type="number" />
                            </div>
                        }
                        <div className={style.inputWrapper}>
                            <p className={style.inputLabel}>Title For Your Property</p>
                            <input className={style.inputTag} value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter title eg: khurana's house, etc" type="text" />
                        </div>
                        <div className={style.textareaWrapper}>
                            <p className={style.inputLabel}>Description</p>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className={style.inputTag} placeholder="Enter sweet description of your home in few lines like water facility, building architecture, neighbours behaviour, etc to attract users!" />

                        </div>
                        <div className={style.submitBtnWrapper}>
                            {submitLoading
                                ?
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                :

                                <div onClick={() => submitHome()} className={style.submitBtn}>
                                    <PrimaryButton heading='Submit <i class="fas fa-paper-plane"></i>' />
                                </div>
                            }
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

export default PostProperty;