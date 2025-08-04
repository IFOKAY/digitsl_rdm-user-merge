import axios from 'axios';

// Correct base URL (no /api)
const API_BASE_URL = 'https://w3-unified-profile-api.ibm.com/v3';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add request interceptor for error handling
api.interceptors.request.use(
    (config) => {
        // You can add auth token here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response Error:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request Error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Authentication service
export const authService = {
    login: (credentials) => api.post('/login', credentials),
};

export const userService = {
    getProfileById: (id) => api.get(`/profiles/${encodeURIComponent(id)}/profile`),
    register: (userData) => api.post('/register', userData),
    updateProfile: (email, userData) => axios.put(`http://localhost:8082/api/profile/${email}`, userData, { withCredentials: true }),
};

export const practiceService = {
    getAll: () => api.get('/practices'),
    getById: (id) => api.get(`/practices/${id}`),
    create: (practice) => api.post('/practices', practice),
    update: (id, practice) => api.put(`/practices/${id}`, practice),
    delete: (id) => api.delete(`/practices/${id}`),
};

export const practiceAreaService = {
    getAll: () => api.get('/practice-areas'),
    getByPracticeId: (practiceId) => api.get(`/practice-areas/practice/${practiceId}`),
    getById: (id) => api.get(`/practice-areas/${id}`),
    create: (practiceArea) => api.post('/practice-areas', practiceArea),
    update: (id, practiceArea) => api.put(`/practice-areas/${id}`, practiceArea),
    delete: (id) => api.delete(`/practice-areas/${id}`),
};

export const userSkillService = {
    getAll: () => api.get('/user-skills'),
    getByUserId: (userId) => api.get(`/user-skills/user/${userId}`),
    getByPracticeAreaId: (practiceAreaId) => api.get(`/user-skills/practice-area/${practiceAreaId}`),
    getById: (id) => api.get(`/user-skills/${id}`),
    create: (userSkill) => api.post('/user-skills', userSkill),
    update: (id, userSkill) => api.put(`/user-skills/${id}`, userSkill),
    delete: (id) => api.delete(`/user-skills/${id}`),
}; 

export const approvalService = {
    submitForApproval: (payload) => axios.post('http://localhost:8082/api/submit-for-approval', payload, { withCredentials: true }),
};

export async function fetchIBMUserProfile(email) {
    try {
        // Use the full email for IBM API as per documentation and working curl
        const res = await axios.get(
            `https://w3-unified-profile-api.ibm.com/v3/profiles/${encodeURIComponent(email)}/profile`
        );
        return res.data;
    } catch (error) {
        console.error('Failed to fetch IBM user profile:', error);
        throw error;
    }
} 