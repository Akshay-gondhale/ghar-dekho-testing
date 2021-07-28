import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { GetPropertiesByStatus, LoadMorePropertiesByStatus } from "../../redux/actions/HomeActions";
import style from "./Homes.module.css"
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { ImageUrl } from "../../utils/BaseApi"
import { Link } from "react-router-dom";
const Homes = () => {
    const dispatch = useDispatch()
    var subSectionData = useSelector(state => state.HomeDataReducer)



    const [activeSubNavElement, setActiveSubNavElement] = useState("registered")
    const [isSubSectionLoading, setIsSubSectionLoading] = useState(false);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false)

    const LoadMoreSubSectionData = () => {
        dispatch(LoadMorePropertiesByStatus(activeSubNavElement, subSectionData, setIsLoadMoreLoading))
    }

    useEffect(() => {
        dispatch(GetPropertiesByStatus(activeSubNavElement, setIsSubSectionLoading))
    }, [dispatch, activeSubNavElement])
    return (
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

                                var registrationDate = new Date(data.createdAt)
                                var actualRegistrationDate = `${registrationDate.getDate()}-${registrationDate.getMonth() + 1}-${registrationDate.getFullYear()}`;
                                return (
                                    <Link to={`homes/${data.shortId}`} key={index} className={style.homeDiv}>
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
                                                        activeSubNavElement === "in-progress" ? <>In progress <i className="fas fa-bicycle"></i> (Contact owner to verify home!)</> :
                                                            activeSubNavElement === "verified" ? <>Verified <i className="fas fa-check-circle"></i> (This home is verified!)</> :
                                                                <>Rejected <i className="fas fa-times-circle"></i> (You rejected this home!)</>
                                                }</p>
                                                {data.rejectedReason !== null && 
                                                <>
                                                <p className={style.homeRejectedStyle}>Reason: {data.rejectedReason}</p>
                                                </>}
                                            <p className={style.homeRegisteredDate}>Registered On: {actualRegistrationDate}</p>
                                        </div>
                                    </Link>

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

    )
}
export default Homes;