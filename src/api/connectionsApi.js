// api/connectionsApi.js
import axiosClient from './axiosClient';

// ==================== TRAINER DISCOVERY ====================

export async function getTrainersApi(filters = {}) {
    const res = await axiosClient.get('/connections/trainers/', {
        params: filters // { search, ordering }
    });
    return res.data;
}

export async function getTrainerApi(id) {
    const res = await axiosClient.get(`/connections/trainers/${id}/`);
    return res.data;
}

// ==================== CONNECTIONS ====================

export async function requestConnectionApi(trainerId, message = '') {
    const res = await axiosClient.post('/connections/request/', {
        trainer_id: trainerId,
        request_message: message
    });
    return res.data;
}

export async function getMyConnectionsApi(status = null) {
    const params = status ? { status } : {};
    const res = await axiosClient.get('/connections/my-connections/', { params });
    return res.data;
}

export async function acceptConnectionApi(connectionId) {
    const res = await axiosClient.post(`/connections/${connectionId}/accept/`);
    return res.data;
}

export async function rejectConnectionApi(connectionId, reason = '') {
    const res = await axiosClient.post(`/connections/${connectionId}/reject/`, {
        reason
    });
    return res.data;
}

export async function updateConnectionPermissionsApi(connectionId, permissions) {
    const res = await axiosClient.put(`/connections/${connectionId}/permissions/`, permissions);
    return res.data;
}

export async function endConnectionApi(connectionId) {
    const res = await axiosClient.delete(`/connections/${connectionId}/end/`);
    return res.data;
}