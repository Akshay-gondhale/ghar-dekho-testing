import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import PrimaryButton from "../../components/Buttons/PrimaryButton"
import SingleProperty from "../../components/SinglePropertyCard/SinglePropertyCard"
import { GetProperties, LoadMoreProperties } from "../../redux/actions/PropertiesActions"
import style from "./Properties.module.css"
import { ImageUrl } from "../../utils/BaseApi"
const Properties = () => {
    const userData = useSelector(state=>state.AuthReducer)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // query useStates
    const [searchArea, setSearchArea] = useState("")
    const [homeType, setHomeType] = useState("null")
    const [sellOrRent, setSellOrRent] = useState("null")
    const [floor, setFloor] = useState("")
    const [carpetArea, setCarpetArea] = useState("")
    const [age, setAge] = useState("")
    const [ammount, setAmmount] = useState("")
    const [isVeg, setIsVeg] = useState(false)
    const dispatch = useDispatch()
    var properties = useSelector(state => state.PropertiesDataReducer)


    useEffect(() => {
        setIsLoading(true)
        dispatch(GetProperties({}, setIsLoading, toast));
    }, [dispatch])

    const submitQuery = (e) => {
        setIsFilterOpen(false)
        e.preventDefault();
        var queryData = {};
        if (searchArea.trim() !== "") {
            queryData.searchArea = searchArea.trim()
        }
        if (sellOrRent !== "null") {
            queryData.sellOrRent = sellOrRent
        }
        if (homeType !== "null") {
            queryData.homeType = homeType
        }
        if (floor !== "") {
            queryData.floor = floor
        }
        if (carpetArea !== "") {
            queryData.carpetArea = carpetArea
        }
        if (age !== "") {
            queryData.age = age
        }
        if (ammount !== "") {
            queryData.ammount = ammount
        }
        if (isVeg === true) {
            queryData.isVeg = isVeg
        }
        dispatch(GetProperties(queryData, setIsLoading));

    }

    const loadMorePropertiesData = () => {
        var queryData = {};
        if (searchArea.trim() !== "") {
            queryData.searchArea = searchArea.trim()
        }
        if (sellOrRent !== "null") {
            queryData.sellOrRent = sellOrRent
        }
        if (homeType !== "null") {
            queryData.homeType = homeType
        }
        if (floor !== "") {
            queryData.floor = floor
        }
        if (carpetArea !== "") {
            queryData.carpetArea = carpetArea
        }
        if (age !== "") {
            queryData.age = age
        }
        if (ammount !== "") {
            queryData.ammount = ammount
        }
        if (isVeg === true) {
            queryData.isVeg = isVeg
        }
        dispatch(LoadMoreProperties(properties, queryData, setIsLoadMoreLoading, toast));
    }
    const resetFilter = () => {
        setSearchArea("")
        setHomeType("null")
        setSellOrRent("null")
        setAmmount("")
        setCarpetArea("")
        setFloor("")
        setAge("")
        setIsVeg(false)
    }
    return (
        <>
            <div className={style.mainDiv}>
                <form className={style.searchWrapper}>
                    <div className={style.searchField}>
                        <input value={searchArea} onChange={(e) => setSearchArea(e.target.value)} className={style.searchInputField} placeholder="Search By Area" />
                        <button onClick={(e) => submitQuery(e)} className={style.searchBtn}><i className="fas fa-search"></i></button>
                    </div>

                </form>
                <form className={style.filterWrapper}>
                    <div className={style.filterBtn}>
                        <p onClick={() => setIsFilterOpen(isOpen => !isOpen)} className={style.filterHeading}><i className="fas fa-sliders-h"></i> Filter</p>
                    </div>
                    <div className={isFilterOpen ? style.filterOptions : style.filterOptionsHidden}>

                        <div className={style.halfFilterOption}>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Select Sell/Rent</p>
                                <select value={sellOrRent} onChange={e => setSellOrRent(e.target.value)} className={style.inputTag}>
                                    <option value="null">All</option>
                                    <option value="sell">Sell</option>
                                    <option value="rent">Rent</option>
                                </select>
                            </div>
                        </div>
                        <div className={style.halfFilterOption}>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Select Home Type</p>
                                <select value={homeType} onChange={(e => setHomeType(e.target.value))} className={style.inputTag}>
                                    <option value="null">All</option>
                                    <option value="1RK">1RK</option>
                                    <option value="1BHK">1BHK</option>
                                    <option value="2BHK">2BHK</option>
                                    <option value="3BHK">3BHK</option>
                                </select>
                            </div>
                        </div>
                        <div className={style.halfFilterOption}>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Enter Maximum Ammount Of Sell/Rent</p>
                                <input value={ammount} onChange={(e => setAmmount(e.target.value))} className={style.inputTag} placeholder="Enter Maximum Ammount Of Sell/Rent" type="number" min={0} />
                            </div>
                        </div>
                        <div className={style.halfFilterOption}>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Minimum Carpet Area Required <span className={style.headingNote}>(In sq.ft)</span></p>
                                <input value={carpetArea} onChange={(e => setCarpetArea(e.target.value))} className={style.inputTag} placeholder="Minimum Carpet Area Required" type="number" min={0} />
                            </div>
                        </div>
                        <div className={style.halfFilterOption}>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Maximum Age of Property Required <span className={style.headingNote}>(In years)</span></p>
                                <input value={age} onChange={(e => setAge(e.target.value))} className={style.inputTag} placeholder="Maximum Age of Property Required" type="number" min={0} />
                            </div>
                        </div>
                        <div className={style.halfFilterOption}>
                            <div className={style.inputWrapper}>
                                <p className={style.inputLabel}>Home Required On Floor</p>
                                <input value={floor} onChange={(e => setFloor(e.target.value))} className={style.inputTag} placeholder="Home Required On Floor" type="number" min={0} />
                            </div>
                        </div>
                        <div className={style.checkBoxWrapper2}>
                            <p className={style.checkBoxText}>Show only vegetarian locality</p>
                            <input type="checkbox" value={isVeg} checked={isVeg ? true : false} onChange={() => { setIsVeg(isVeg => !isVeg) }} className={style.checkBox} />
                        </div>
                        <div className={style.submitBtnWrapper}>
                            <button onClick={(e) => submitQuery(e)} className={style.submitBtn}>
                                <PrimaryButton heading='Search <i class="fas fa-arrow-circle-right"></i>' />
                            </button>
                            <div onClick={() => resetFilter()} className={style.submitBtn}>
                                <PrimaryButton heading='Reset <i class="fas fa-times-circle"></i>' />
                            </div>
                            

                        </div>
                    </div>
                </form>

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
                            <div className={style.PropertiesWrapper}>
                                {properties.data.map((data, index) => {
                                    return (
                                        <SingleProperty
                                            key={index}
                                            id={data.shortId}
                                            isLoggedIn={userData.isLoggedIn}
                                            userId = {userData.user._id}
                                            homeUserId = {data.userId}
                                            thumbnail={`${ImageUrl}${data.images[0].path}`}
                                            title={data.title}
                                            address={`${data.area}, ${data.city}`}
                                            sellOrRent={data.sellOrRent}
                                            ammount={data.ammount}
                                            homeType={data.homeType}
                                            carpetArea={data.carpetArea}
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
                            :
                            <div className={style.notFoundData}>
                                <i className="fas fa-igloo"></i>
                                <p className={style.noDataDescription}>We looked up and down but no data found related to your search!</p>
                            </div>
                } </div>
        </>
    )
}

export default Properties;