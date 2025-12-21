import axiosClient from './axiosClient';

export async function getMyProfileApi() {
    const res = await axiosClient.get('/users/profile/');
    return res.data;
}

export async function updateMyProfileApi(payload) {
    const res = await axiosClient.put('/users/profile/', payload);
    return res.data;
}

export async function getUserProfileApi(userId) {
    // For viewing other users' profiles (trainers)
    const res = await axiosClient.get(`/users/profile/${userId}/`);
    return res.data;
}