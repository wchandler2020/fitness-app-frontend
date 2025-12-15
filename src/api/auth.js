import axiosClient from "./axiosClient";

// login -> /api/token/
export async function loginApi(payload) {
    const res = await axiosClient.post('/token/', payload);
    return res.data;
}

// register -> /api/register/
export async function registerApi(payload){
    const res = await axiosClient.post('/register/', payload);
    return res.data;
}
