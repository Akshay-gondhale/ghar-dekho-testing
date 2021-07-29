import { useHistory, useParams } from "react-router-dom";
import style from "./SingleHome.module.css"
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetHomeDetails, RemoveHomeDetails } from "../../redux/actions/SingleHomeActions";
import { ImageUrl } from "../../utils/BaseApi"
const SingleHome = () => {
    console.log("reached here")
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <>
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
                                <p className={style.ammount}><span className={style.sellOrRent}>{homeData.sellOrRent}: </span><i className="fas fa-rupee-sign"></i> {homeData.ammount}</p>

                            </div>

                            {
                                homeData.status === "registered"
                                    ?
                                    <div className={style.statusWrapper + " " + style.registeredStatus}>
                                        <p className={style.statusHeading}>Registered <i className="fab fa-font-awesome-flag"></i></p>
                                        <p className={style.statusDescription}>Your home registered on our website successfully! wait till we assign an broker to you home.</p>
                                    </div>
                                    :
                                    homeData.status === "in-progress"
                                        ?

                                        <div className={style.statusWrapper + " " + style.inProgressStatus}>
                                            <p className={style.statusHeading}>In Progress <i className="fas fa-bicycle"></i></p>
                                            <p className={style.statusDescription}>We assigned an broker to your home! Broker will soon contact you for the verification of your home.</p>
                                        </div>
                                        :
                                        homeData.status === "verified"
                                            ?

                                            <div className={style.statusWrapper + " " + style.verifiedStatus}>
                                                <p className={style.statusHeading}>Verified <i className="fas fa-check-circle"></i></p>
                                                <p className={style.statusDescription}>Your home has verified successfully by our broker! Now your home will visible to all the visitors on our website and visitors can show there interest on your home now.</p>
                                            </div>

                                            :

                                            <div className={style.statusWrapper + " " + style.rejectedStatus}>
                                                <p className={style.statusHeading}>Rejected <i className="fas fa-times-circle"></i></p>
                                                <p className={style.statusDescription}>Your home details are rejected by broker. {homeData.rejectedReason ? `This is the reason of rejecting your home details:${homeData.rejectedReason}` : ""}</p>
                                            </div>


                            }

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
                        </div>

                    </div>
                    :
                    ""
            }
        </>
    )
}

export default SingleHome;