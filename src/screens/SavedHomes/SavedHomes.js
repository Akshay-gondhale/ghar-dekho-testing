import { useEffect, useState } from "react"
import style from "./SavedHomes.module.css"
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SingleProperty from "../../components/SinglePropertyCard/SinglePropertyCard";
import { ImageUrl } from "../../utils/BaseApi";
import { GetSavedProperties, LoadMoreSavedProperties, RemoveSavedProperties } from "../../redux/actions/PropertiesActions";
import { toast } from "react-toastify";

const SavedHomes = () => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false)
    var properties = useSelector(state => state.SavedPropertiesDataReducer)
    const userData = useSelector(state => state.AuthReducer)

    useEffect(() => {
        dispatch(GetSavedProperties(setIsLoading, toast))
        
        return(
            dispatch(RemoveSavedProperties())
        )
    }, [dispatch])

    const loadMorePropertiesData = () => {
        dispatch(LoadMoreSavedProperties(properties, setIsLoadMoreLoading, toast))
    }
    return (
        <>
            <div className={style.mainDiv}>
                {
                    isLoading
                        ?
                        <div className={style.loadingSpinnerWrapper}>
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        :

                        properties.data.length !== 0 ?
                            <>
                                <div className={style.BannedDiv}>
                                    <p className={style.bannerHeading}>Your Bookmarked Properties :)</p>
                                </div>
                                <div className={style.PropertiesWrapper}>
                                    {properties.data.map((data, index) => {
                                        console.log(data.propertyId.shortId)
                                        return (
                                            <SingleProperty
                                                key={index}
                                                id={data.propertyId.shortId}
                                                isLoggedIn={userData.isLoggedIn}
                                                userId={userData.user._id}
                                                homeUserId={data.propertyId.userId}
                                                thumbnail={`${ImageUrl}${data.propertyId.images[0].path}`}
                                                title={data.propertyId.title}
                                                address={`${data.propertyId.area}, ${data.propertyId.city}`}
                                                sellOrRent={data.propertyId.sellOrRent}
                                                ammount={data.propertyId.ammount}
                                                homeType={data.propertyId.homeType}
                                                carpetArea={data.propertyId.carpetArea}
                                            />
                                        )
                                    })}
                                    {properties.isNextAvailable &&
                                        <div className={style.loadMoreWrapper}>
                                            {
                                                isLoadMoreLoading
                                                    ?
                                                    <div className="spinner-border text-success" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    :
                                                    <div onClick={() => loadMorePropertiesData()}>
                                                        <PrimaryButton heading='Load More <i class="fas fa-chevron-circle-down"></i>' />
                                                    </div>
                                            }

                                        </div>
                                    }
                                </div>
                            </>
                            :
                            <div className={style.BannedDiv}>
                                <p className={style.bannerHeading}>You Haven't Bookmarked Any Properties Yet :(</p>
                            </div>
                }
            </div>
        </>
    )
}

export default SavedHomes;