import axios from 'axios'

const serverUrl = 'http://44.201.124.105/'

const makeRequest = async (method, url, postData = null, multipart = false) => {
    const response = await axios({
        method: method,
        url: `${serverUrl}${url}`,
        data: postData,
    })

    return response
};

const getRequest = async (url) => {
    const response = await makeRequest('get', url)
    return response
}

const postRequest = async (url, postData) => {
    const response = await makeRequest('post', url, postData)
    return response
}

export const basicCalls = {getRequest, postRequest}