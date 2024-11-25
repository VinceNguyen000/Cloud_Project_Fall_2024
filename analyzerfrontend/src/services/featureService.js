import { basicCalls } from "./basicCall";

const getFeatureList = async (params) => {
    const response = await basicCalls.getRequest(`getfeaturelist?table_name=${params.table_name}`)
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

export const featureServices = {getFeatureList, getChartData, uploadDataset}