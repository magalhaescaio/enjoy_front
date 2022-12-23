import axios from 'axios'
import { getToken } from './authentication'

import { endPoint } from './../constants/default';


const api = axios.create({
    baseURL: endPoint
})



api.interceptors.request.use(async config => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
})


api.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            localStorage.removeItem('OnlyOne-Token')
            window.location.href = '/login'
        }
    }
)
  
export default api