import { Link, useHistory, useParams } from "react-router-dom";
import style from "./SingleProperty.module.css"
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useEffect, useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { GetOthersHomeDetails, RemoveOthersHomeDetails, RemoveSaveHome, SaveHome } from "../../redux/actions/SingleHomeActions"
import { ImageUrl } from "../../utils/BaseApi"
import { toast } from "react-toastify";

const SingleProperty = () => {
    const { id } = useParams()
    const foundPropertyData = useSelector(state => state.othersSingleHomeDataReducer)
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isSavedHomeLoading, setIsSavedHomeLoading] = useState(false)

    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(() => {
        setIsLoading(true)
        dispatch(GetOthersHomeDetails(id, setIsLoading, history))
        return (
            dispatch(RemoveOthersHomeDetails())

        )
    }, [dispatch, history, id])

    const UserSaveHome = () => {
        dispatch(SaveHome(foundPropertyData.foundProperty, foundPropertyData.foundProperty._id, setIsSavedHomeLoading, toast))
    }

    const UserRemoveSaveHome = () => {
        dispatch(RemoveSaveHome(foundPropertyData.foundProperty, foundPropertyData.foundProperty._id, setIsSavedHomeLoading, toast))

    }

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
            {isLoading ?

                <div className={style.spinnerWrapper}>
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                :
                foundPropertyData.foundData === true ?
                    <div className={style.mainDiv}>
                        <div className={style.carouselWrapper}>
                            <div className={isFullScreen ? style.fullImagesWrapper : style.imagesWrapper}>
                                <i onClick={() => setIsFullScreen(false)} className={"fas fa-times-circle " + style.closeFullScreen}></i>
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
                                    {foundPropertyData.foundProperty.images.map((data, index) => {
                                        return (
                                            <div key={index} className={style.imageContainer}>
                                                <img src={`${ImageUrl}${data.path}`} alt="..." />
                                            </div>
                                        )
                                    })}

                                </Carousel>
                            </div>

                        </div>

                        <div className={style.homeOptions}>
                            <div onClick={() => setIsFullScreen(true)} className={style.maximizeCarousel}>
                                <i className="fas fa-external-link-square-alt"></i>
                            </div>
                            <div className={style.saveHomeIcon}>
                                {
                                    isSavedHomeLoading
                                        ?

                                        <div className={style.savedHomeSpinnerWrapper}>
                                            <div className="spinner-border text-dark" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                        :
                                        foundPropertyData.isSavedHome === null
                                            ?

                                            <i onClick={()=>UserSaveHome()} className="far fa-bookmark"></i>
                                            :
                                            <i onClick={()=>{UserRemoveSaveHome()}} className="fas fa-bookmark"></i>
                                }
                            </div>
                        </div>
                        <div className={style.homeDataDivWrapper}>
                            <div className={style.homeBasicInfo}>
                                <p className={style.homeTitle}>{foundPropertyData.foundProperty.title}</p>
                                <p className={style.homeDescription}>{foundPropertyData.foundProperty.description}</p>
                                <p className={style.registeredOn}>Registered On: {`${new Date(foundPropertyData.foundProperty.createdAt).getDate()}.${new Date(foundPropertyData.foundProperty.createdAt).getMonth() + 1}.${new Date(foundPropertyData.foundProperty.createdAt).getFullYear()}`}</p>
                                <p className={style.sellOrRent}><span className={style.sellOrRentHeading}>{foundPropertyData.foundProperty.sellOrRent}: </span> <i className="fas fa-rupee-sign"></i>{foundPropertyData.foundProperty.ammount}</p>
                            </div>
                            <div className={style.homeDetails}>

                                <div className={style.detailsCell}>
                                    <p className={style.detailHeader}><i className="fas fa-home"></i> Home Type</p>
                                    <p className={style.detailValue}>{foundPropertyData.foundProperty.homeType}</p>
                                </div>
                                <div className={style.detailsCell}>
                                    <p className={style.detailHeader}><i className="fas fa-compass"></i> Location</p>
                                    <p className={style.detailValue}>{`${foundPropertyData.foundProperty.area}, ${foundPropertyData.foundProperty.city}`}</p>
                                </div>
                                <div className={style.detailsCell}>
                                    <p className={style.detailHeader}><i className="fas fa-thumbtack"></i> Nearest Landmark</p>
                                    <p className={style.detailValue}>{foundPropertyData.foundProperty.landmark}</p>
                                </div>
                                <div className={style.detailsCell}>
                                    <p className={style.detailHeader}><i className="fas fa-equals"></i> Carpet Area Of Home</p>
                                    <p className={style.detailValue}>{foundPropertyData.foundProperty.carpetArea} sq. ft.</p>
                                </div>
                                <div className={style.detailsCell}>
                                    <p className={style.detailHeader}><i className="fas fa-car-side"></i> Parking</p>
                                    <p className={style.detailValue}>{foundPropertyData.foundProperty.parking}</p>
                                </div>
                                <div className={style.detailsCell}>
                                    <p className={style.detailHeader}><i className="fas fa-door-open"></i> Home Available On Floor</p>
                                    <p className={style.detailValue}>{foundPropertyData.foundProperty.floor}</p>
                                </div>
                                <div className={style.detailsCell}>
                                    <p className={style.detailHeader}><i className="fas fa-building"></i> Total Floors In Building</p>
                                    <p className={style.detailValue}>{foundPropertyData.foundProperty.totalFloor}</p>
                                </div>
                                <div className={style.detailsCell}>
                                    <p className={style.detailHeader}><i className="fas fa-birthday-cake"></i> Age Of Property On Registration</p>
                                    <p className={style.detailValue}>{foundPropertyData.foundProperty.age}</p>
                                </div>
                                {foundPropertyData.foundProperty.isVeg ?

                                    <div className={style.detailsCell}>
                                        <p className={style.detailHeader}><i className="fas fa-leaf"></i> Vegetarian Community!</p>
                                        <p className={style.detailValue}>This owner wants to sell or rent only vegetarian people.</p>
                                    </div>
                                    :
                                    ""
                                }
                            </div>
                            <Link to={`/conversation/chat/${foundPropertyData.foundProperty.shortId}`} className={style.contactBrokerBtnWrapper}>
                                <PrimaryButton heading='Contact Broker <i class="fas fa-user-tie"></i>' />
                            </Link>
                        </div>

                    </div>
                    :
                    <>
                    </>
            }
        </>
    )
}

export default SingleProperty;