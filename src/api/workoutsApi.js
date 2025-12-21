// api/workoutsApi.js
import axiosClient from './axiosClient';

// ==================== EXERCISES ====================

export async function getExercisesApi(searchQuery = '') {
    const res = await axiosClient.get('/workouts/exercises/', {
        params: { search: searchQuery }
    });
    return res.data;
}

export async function getExerciseApi(id) {
    const res = await axiosClient.get(`/workouts/exercises/${id}/`);
    return res.data;
}

export async function createExerciseApi(payload) {
    const res = await axiosClient.post('/workouts/exercises/', payload);
    return res.data;
}

export async function updateExerciseApi(id, payload) {
    const res = await axiosClient.put(`/workouts/exercises/${id}/`, payload);
    return res.data;
}

export async function deleteExerciseApi(id) {
    const res = await axiosClient.delete(`/workouts/exercises/${id}/`);
    return res.data;
}

// ==================== WORKOUT LOGS ====================

export async function getWorkoutsApi(filters = {}) {
    const res = await axiosClient.get('/workouts/workouts/', {
        params: filters // { start_date, end_date, is_favorite, is_template }
    });
    return res.data;
}

export async function getWorkoutApi(id) {
    const res = await axiosClient.get(`/workouts/workouts/${id}/`);
    return res.data;
}

export async function createWorkoutApi(payload) {
    const res = await axiosClient.post('/workouts/workouts/create/', payload);
    return res.data;
}

export async function updateWorkoutApi(id, payload) {
    const res = await axiosClient.put(`/workouts/workouts/${id}/update/`, payload);
    return res.data;
}

export async function deleteWorkoutApi(id) {
    const res = await axiosClient.delete(`/workouts/workouts/${id}/delete/`);
    return res.data;
}

export async function copyWorkoutApi(payload) {
    // payload: { source_workout_id, new_workout_date, copy_as_template, new_name }
    const res = await axiosClient.post('/workouts/workouts/copy/', payload);
    return res.data;
}

export async function toggleFavoriteApi(id) {
    const res = await axiosClient.post(`/workouts/workouts/${id}/favorite/`);
    return res.data;
}

// ==================== STATISTICS ====================

export async function getWorkoutStatsApi() {
    const res = await axiosClient.get('/workouts/stats/');
    return res.data;
}

export async function getPersonalRecordsApi(exerciseId = null) {
    const params = exerciseId ? { exercise_id: exerciseId } : {};
    const res = await axiosClient.get('/workouts/personal-records/', { params });
    return res.data;
}

// ==================== AI WORKOUT GENERATION ====================

export async function generateAIWorkoutApi(preferences) {
    const res = await axiosClient.post('/ai/generate/', preferences);
    return res.data;
}

export async function saveAIWorkoutApi(workoutPlan, workoutDate = null) {
    const res = await axiosClient.post('/ai/save/', {
        workout_plan: workoutPlan,
        workout_date: workoutDate || new Date().toISOString().split('T')[0]
    });
    return res.data;
}