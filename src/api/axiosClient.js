import axios from 'axios'
import useAuthStore from '../store/authStore'

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api'

//create the instance
const axiosClient = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use((config) => {
    const {accessToken} = useAuthStore.getState();

    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
})

export default axiosClient;