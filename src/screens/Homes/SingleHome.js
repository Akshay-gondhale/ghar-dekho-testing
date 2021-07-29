import { useHistory, useParams } from "react-router-dom";
import style from "./SingleHome.module.css"
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetHomeDetails, RemoveHomeDetails } from "../../redux/actions/SingleHomeActions";
import { ImageUrl } from "../../utils/BaseApi"
import axios from "axios";
import { toast } from "react-toastify";
const SingleHome = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isBtnLoading, setIsBtnLoading] = useState(false)

    const [rejectReason, setRejectReason] = useState("");
    const [isReasonOpen, setIsReasonOpen] = useState(false)

    const dispatch = useDispatch();
    const homeDetails = useSelector(state => state.SingleHomeDataReducer)
    const homeData = homeDetails.details;
    const history = useHistory();
    useEffect(() => {
        dispatch(GetHomeDetails(id, setIsLoading, history))
        return dispatch(RemoveHomeDetails());
    }, [setIsLoading, dispatch, history, id])

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

    const setInProgress = () => {
        setIsBtnLoading(true)
        axios.put(`/broker/setHomeInProgress/${id}`)
            .then(res => {
                setIsBtnLoading(false)
                toast.success(res.data.message)
                history.push("/homes")
            })
            .catch(err => {
                console.log(err)
                if (err.response) {
                    setIsBtnLoading(false)
                    toast.error(err.response.message)
                }
                else {
                    setIsBtnLoading(false)
                    toast.error("Something Went Wrong!")
                }

            })
    }
    const setVerified = () => {
        setIsBtnLoading(true)
        axios.put(`/broker/setHomeVerified/${id}`)
            .then(res => {
                setIsBtnLoading(false)
                toast.success(res.data.message)
                history.push("/homes")
            })
            .catch(err => {
                console.log(err)
                if (err.response) {
                    setIsBtnLoading(false)
                    toast.error(err.response.message)
                    return;
                }
                    toast.error("Something Went Wrong!")

            })
    }
    const setRejected = () => {
        if(rejectReason.trim() === ""){
            toast.error("Please provide reason of rejecting!")
        }
        else{
            setIsReasonOpen(false)
            setIsBtnLoading(true)
            axios.put(`/broker/setHomeRejected/${id}`,{
                rejectedReason:rejectReason
            })
                .then(res => {
                    setIsBtnLoading(false)
                    toast.success(res.data.message)
                    history.push("/homes")
                })
                .catch(err => {
                    console.log(err)
                    if (err.response) {
                        setIsBtnLoading(false)
                        toast.error(err.response.message)
                    }
                    else {
                        setIsBtnLoading(false)
                        setRejectReason("")
                        toast.error("Something Went Wrong!")
                    }
    
                })

        }
    }

    return (
        <>
            {
                isReasonOpen &&
                <>
                    <div className={style.mainOuterReason}>
                        <div className={style.mainReasonDiv}>
                            <i onClick={() => setIsReasonOpen(false)} className={"fas fa-times-circle " + style.closeReasonBtn}></i>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Enter Reason Of Rejecting This Home</p>
                                <input className={style.inputTag} value={rejectReason} onChange={(e)=>setRejectReason(e.target.value)} placeholder="Enter a valid reason for rejecting this home" type="text" />
                            </div>
                            <div className={style.buttonWrapper}>
                                <div onClick={()=>setRejected()} className={style.btnStyle}>
                                    <PrimaryButton heading='Submit <i class="fas fa-times-circle"></i>' />
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            }
            {isLoading && homeDetails.foundData === null
                ?
                <div className={style.spinnerWrapper}>
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                :
                homeDetails.foundData === true ?
                    <div className={style.mainDiv}>
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
                                {homeData.images.map((data, index) => {
                                    return (
                                        <div key={index} className={style.imageContainer}>
                                            <img src={`${ImageUrl}${data.path}`} alt="..." />
                                        </div>
                                    )
                                })}
                            </Carousel>
                        </div>
                        <div className={style.homeData}>
                            <div className={style.homeHeader}>
                                <p className={style.homeTitle}>{homeData.title}</p>
                                <p className={style.homeDescription}><span className={style.sellOrRent}>Description:</span> {homeData.description}</p>
                                <p className={style.homeDescription}><span className={style.sellOrRent}>Home Id:</span> {homeData.shortId}</p>
                                <p className={style.homeDescription}><span className={style.sellOrRent}>Status:</span> {homeData.status}</p>
                                {homeData.rejectedReason 
                                ?
                                
                                <p className={style.homeDescription}><span className={style.sellOrRent}>Reason:</span> {homeData.rejectedReason}</p>
                                :
                                ""
                             }
                                <p className={style.ammount}><span className={style.sellOrRent}>{homeData.sellOrRent}: </span><i className="fas fa-rupee-sign"></i> {homeData.ammount}</p>

                            </div>
                            <div className={style.homeUserDetail}>
                                <div className={style.homeDetailWrapper}>
                                    <p className={style.homeDetailHeader}>Owner's Details</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Owner's Name: </span>{homeData.ownerName}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Owner's Phone: </span> +91 {homeData.ownerPhone}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Owner's Email: </span>{homeData.ownerEmail}</p>
                                </div>
                                <div className={style.homeDetailWrapper}>
                                    <p className={style.homeDetailHeader}>User's Details</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>User's Name: </span>{homeData.userId.name}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>User's Phone: </span> +91 {homeData.userId.phone}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>User's Email: </span>{homeData.userId.email}</p>
                                </div>
                            </div>
                            <div className={style.homeUserDetail}>
                                <div className={style.homeDetailWrapper}>
                                    <p className={style.homeDetailHeader}>Address Details</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>House Number: </span>{homeData.houseNumber}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Locality: </span>{homeData.locality}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Area: </span>{homeData.area}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>City: </span>{homeData.city}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Nearest Landmark: </span>{homeData.landmark}</p>
                                </div>
                                <div className={style.homeDetailWrapper}>
                                    <p className={style.homeDetailHeader}>Other Details</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Home Type: </span>{homeData.homeType}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Parking: </span>{homeData.parking}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Home Available On Floor: </span>{homeData.floor}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Total Floor Available In Building: </span>{homeData.totalFloor}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Carpet Area of home: </span>{homeData.carpetArea}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Age of Property: </span>{homeData.age}</p>
                                    <p className={style.homeDetailField}><span className={style.homeDetailFieldHeading}>Only Vegeterians Required?: </span>{homeData.isVeg ? "Yes" : "No"}</p>
                                </div>

                            </div>
                            <div className={style.buttonWrapper}>
                                {isBtnLoading
                                    ?

                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    <>
                                    {console.log(homeData.status)}
                                        {homeData.status === "registered" &&
                                            <div onClick={() => setInProgress()} className={style.btnStyle}>
                                                <PrimaryButton heading='Set as In Progress <i class="fas fa-bicycle"></i>' />
                                            </div>
                                        }
                                        {homeData.status === "in-progress" &&
                                            <>
                                                <div onClick={() => setVerified()} className={style.btnStyle}>
                                                    <PrimaryButton heading='Set as Verified <i class="fas fa-check-circle"></i>' />
                                                </div>
                                                <div onClick={() => setIsReasonOpen(true)} className={style.btnStyle}>
                                                    <PrimaryButton heading='Reject <i class="fas fa-times-circle"></i>' />
                                                </div>
                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </div>

                    </div>
                    :
                    ""
            }
        </>
    )
}

export default SingleHome;