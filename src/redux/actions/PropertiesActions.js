import axios from "axios";
import { PropertiesActionTypes } from "../constants/PropertiesActionTypes";

const GetProperties = (queryData, setIsLoading, toast) => {
    return async (dispatch) => {
        var query = "";
        if(queryData.searchArea){
            query += `&searchArea=${queryData.searchArea}`
        }
        if(queryData.homeType){
            query += `&homeType=${queryData.homeType}`
        }
        if(queryData.sellOrRent){
            query += `&sellOrRent=${queryData.sellOrRent}`
        }
        if(queryData.ammount){
            query += `&ammount=${queryData.ammount}`
        }
        if(queryData.carpetArea){
            query += `&carpetArea=${queryData.carpetArea}`
        }
        if(queryData.age){
            query += `&age=${queryData.age}`
        }
        if(queryData.floor){
            query += `&floor=${queryData.floor}`
        }
        if(queryData.isVeg){
            query += `&isVeg=${queryData.isVeg}`
        }
        setIsLoading(true)
        axios.get(`/user/getProperties?recordsPerPage=10${query}`)
        .then(res=>{
            dispatch({type:PropertiesActionTypes.GET_PROPERTY_DATA_SUCCESS, payload:{
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
            dispatch({type:PropertiesActionTypes.GET_PROPERTY_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }
}

const LoadMoreProperties = (oldData, queryData, setIsLoading, toast) =>{
    var oldPropertiesArray = oldData.data;
    return async (dispatch) => {
        var query = "";
        if(queryData.searchArea){
            query += `&searchArea=${queryData.searchArea}`
        }
        if(queryData.homeType){
            query += `&homeType=${queryData.homeType}`
        }
        if(queryData.sellOrRent){
            query += `&sellOrRent=${queryData.sellOrRent}`
        }
        if(queryData.ammount){
            query += `&ammount=${queryData.ammount}`
        }
        if(queryData.carpetArea){
            query += `&carpetArea=${queryData.carpetArea}`
        }
        if(queryData.age){
            query += `&age=${queryData.age}`
        }
        if(queryData.floor){
            query += `&floor=${queryData.floor}`
        }
        if(queryData.isVeg){
            query += `&isVeg=${queryData.isVeg}`
        }
        setIsLoading(true)
        axios.get(`/user/getProperties?recordsPerPage=10&id=${oldData.lastId}${query}`)
        .then(res=>{
            console.log(res)
            var newPropertiesArray = res.data.data[0].data;
            var propertiesArray = [...oldPropertiesArray];
            newPropertiesArray.map(propertyData=>{
                return propertiesArray.push(propertyData)
            })
            dispatch({type:PropertiesActionTypes.GET_PROPERTY_DATA_SUCCESS, payload:{
                data:propertiesArray,
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
            dispatch({type:PropertiesActionTypes.GET_PROPERTY_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }
}

const GetSavedProperties = (setIsLoading, toast) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/user/getSavedHomes?recordsPerPage=10`)
        .then(res=>{
            console.log(res.data.data[0].data)
            dispatch({type:PropertiesActionTypes.GET_SAVED_HOMES_DATA_SUCCESS, payload:{
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
            dispatch({type:PropertiesActionTypes.GET_SAVED_HOMES_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }
}

const LoadMoreSavedProperties = (oldData, setIsLoading, toast) =>{
    var oldPropertiesArray = oldData.data;
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/user/getSavedHomes?recordsPerPage=10&id=${oldData.lastId}`)
        .then(res=>{
            console.log(res)
            var newPropertiesArray = res.data.data[0].data;
            var propertiesArray = [...oldPropertiesArray];
            newPropertiesArray.map(propertyData=>{
                return propertiesArray.push(propertyData)
            })
            dispatch({type:PropertiesActionTypes.GET_SAVED_HOMES_DATA_SUCCESS, payload:{
                data:propertiesArray,
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
            dispatch({type:PropertiesActionTypes.GET_SAVED_HOMES_DATA_FAILS, payload:{}})
            setIsLoading(false)
        })
    }
}

const RemoveSavedProperties = () => {
    
    return async (dispatch) => {
        dispatch({type:PropertiesActionTypes.REMOVE_SAVED_HOMES_DATA, payload:{}})
    }
}



export {
    GetProperties,
    LoadMoreProperties,
    GetSavedProperties,
    LoadMoreSavedProperties,
    RemoveSavedProperties
}