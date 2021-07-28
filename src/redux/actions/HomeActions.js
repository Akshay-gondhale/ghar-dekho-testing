import {HomeAction} from "../constants/HomeActionTypes"
import axios from "axios";



const GetPropertiesByStatus = (subSection, setIsLoading) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/broker/properties/${subSection}`)
        .then(res=>{
            dispatch({type:HomeAction.GET_SUBSECTION_DATA_SUCCESS, payload:{
                subSection,
                data:res.data.data[0].foundProperties,
                isNextAvailable:res.data.data[0].isNextAvailable,
                lastId:res.data.data[0].lastId
            }})
            setIsLoading(false)
        })
        .catch(err=>{
            console.log(err)
            dispatch({type:HomeAction.GET_SUBSECTION_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }   
}

const LoadMorePropertiesByStatus = (subSection, oldData, setIsLoading) =>{
    var oldPropertyArray = oldData.data;
    console.log("inside load more")
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/broker/properties/${subSection}?id=${oldData.lastId}`)
        .then(res=>{
            // console.log(res)
            var newPropertyArray = res.data.data[0].foundProperties;
            var propertyArray = [...oldPropertyArray];
            newPropertyArray.map(propertyData=>{
                return propertyArray.push(propertyData)
            })
            dispatch({type:HomeAction.LOAD_MORE_SUBSECTION_DATA_SUCCESS, payload:{
                subSection,
                data:propertyArray,
                isNextAvailable:res.data.data[0].isNextAvailable,
                lastId:res.data.data[0].lastId
            }})
            setIsLoading(false)
        })
        .catch(err=>{
            console.log(err)
            dispatch({type:HomeAction.LOAD_MORE_SUBSECTION_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }
}

export {
    GetPropertiesByStatus,
    LoadMorePropertiesByStatus
}