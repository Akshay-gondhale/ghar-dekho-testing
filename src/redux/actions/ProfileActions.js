import {ProfileAction} from "../constants/ProfileActionTypes"
import axios from "axios";



const GetUserPropertiesByStatus = (subSection, setIsLoading, toast) => {
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
            if(err.response){
                toast.error(err.response.data.message)
            }
            else{
                toast.error("Something Went Wrong!");
            }
            dispatch({type:ProfileAction.GET_SUBSECTION_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }   
}

const LoadMorePropertiesByStatus = (subSection, oldData, setIsLoading, toast) =>{
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
            if(err.response){
                toast.error(err.response.data.message)
            }
            else{
                toast.error("Something Went Wrong!");
            }
            dispatch({type:ProfileAction.LOAD_MORE_SUBSECTION_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }
}

const GetUserNotifications = (setIsLoading, toast) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/user/notifications`)
        .then(res=>{
            dispatch({type:ProfileAction.GET_NOTIFICATION_DATA_SUCCESS, payload:{
                data:res.data.data[0].data,
                isNextAvailable:res.data.data[0].isNextAvailable,
                lastId:res.data.data[0].lastId
            }})
            setIsLoading(false)
        })
        .catch(err=>{
            console.log(err)
            if(err.response){
                toast.error(err.response.data.message)
            }
            else{
                toast.error("Something Went Wrong!");
            }
            dispatch({type:ProfileAction.GET_NOTIFICATION_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }
}

const LoadMoreNotifications = (oldData, setIsLoading, toast) =>{
    var oldNotificationArray = oldData.data;
    console.log("inside load more")
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/user/notifications?id=${oldData.lastId}`)
        .then(res=>{
            console.log(res)
            var newNotificationArray = res.data.data[0].data;
            var NotificationArray = [...oldNotificationArray];
            newNotificationArray.map(notificationData=>{
                return NotificationArray.push(notificationData)
            })
            dispatch({type:ProfileAction.GET_NOTIFICATION_DATA_SUCCESS, payload:{
                data:NotificationArray,
                isNextAvailable:res.data.data[0].isNextAvailable,
                lastId:res.data.data[0].lastId
            }})
            setIsLoading(false)
        })
        .catch(err=>{
            console.log(err)
            if(err.response){
                toast.error(err.response.data.message)
            }
            else{
                toast.error("Something Went Wrong!");
            }
            dispatch({type:ProfileAction.GET_NOTIFICATION_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }
}

export {
    GetUserPropertiesByStatus,
    LoadMorePropertiesByStatus,
    GetUserNotifications,
    LoadMoreNotifications,
}