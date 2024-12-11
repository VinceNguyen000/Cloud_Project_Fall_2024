import { basicCalls } from "./basicCall";

const getFeatureList = async (params) => {
    const response = await basicCalls.getRequest(`getfeaturelist?dataset_name=${params.dataset_name}`)
    return response
}

const getChartData = async (params) => {
    const response = await basicCalls.getRequest(`getchartdata?table_name=${params.table_name}&feature_list=${params.feature_list}`)
    return response
}

const uploadDataset = async(params) => {
    const response = await basicCalls.postRequest(`uploadfiles/`, params)
    return response
}

const saveDashboardPreferences = async(params) => {
    const response = await basicCalls.postRequest('savedashboardpref/', params)
    return response
}

const getDatasetNames = async(params) => {
    console.log(params, "params")
    const response = await basicCalls.getRequest(`getdatasetlist?user_id=${params.user_id}`)
    return response
}

const getLineChartData = async(params) => {
    const response = await basicCalls.postRequest('getlinechartdata', params)
    return response
}

const getBarChartData = async(params) => {
    const response = await basicCalls.postRequest('getbarchartdata', params)
    return response
}

const getDashboardPreferences = async(params) => {
    const response = await basicCalls.getRequest(`getdashboarddata?dataset_id=${params.dataset_id}`)
    return response
}

export const featureServices = {getFeatureList, getChartData, uploadDataset, saveDashboardPreferences, getDatasetNames, getLineChartData,
    getBarChartData, getDashboardPreferences
}