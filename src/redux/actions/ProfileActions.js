import {ProfileAction} from "../constants/ProfileActionTypes"
import axios from "axios";



const GetUserPropertiesByStatus = (subSection, setIsLoading) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/user/properties/${subSection}`)
        .then(res=>{
            dispatch({type:ProfileAction.GET_SUBSECTION_DATA_SUCCESS, payload:{
                subSection,
                data:res.data.data[0].foundProperties,
                isNextAvailable:res.data.data[0].isNextAvailable,
                lastId:res.data.data[0].lastId
            }})
            setIsLoading(false)
        })
        .catch(err=>{
            console.log(err)
            dispatch({type:ProfileAction.GET_SUBSECTION_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }   
}

const LoadMorePropertiesByStatus = (subSection, oldData, setIsLoading) =>{
    var oldPropertyArray = oldData.data;
    console.log("inside load more")
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/user/properties/${subSection}?id=${oldData.lastId}`)
        .then(res=>{
            // console.log(res)
            var newPropertyArray = res.data.data[0].foundProperties;
            var propertyArray = [...oldPropertyArray];
            newPropertyArray.map(propertyData=>{
                return propertyArray.push(propertyData)
            })
            dispatch({type:ProfileAction.LOAD_MORE_SUBSECTION_DATA_SUCCESS, payload:{
                subSection,
                data:propertyArray,
                isNextAvailable:res.data.data[0].isNextAvailable,
                lastId:res.data.data[0].lastId
            }})
            setIsLoading(false)
        })
        .catch(err=>{
            console.log(err)
            dispatch({type:ProfileAction.LOAD_MORE_SUBSECTION_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }
}

export {
    GetUserPropertiesByStatus,
    LoadMorePropertiesByStatus
}