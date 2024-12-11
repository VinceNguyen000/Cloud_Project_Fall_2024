import { basicCalls } from "./basicCall"

const login = (params) =>{
    const response = basicCalls.postRequest("login/", params)
    return response
}

const register = (params) =>{
    const response = basicCalls.postRequest("register/", params)
    return response
}

export const authServices = {login, register}