// src/services/axiosInstance.js
import axios from 'axios';

function getCsrfTokenFromCookie() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const axiosInstance = axios.create({
  baseURL: 'https://your-server-url.com/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const csrfToken = getCsrfTokenFromCookie();
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }
  return config;
});

export default axiosInstance;
