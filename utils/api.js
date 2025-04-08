// utils/api.js
import axios from 'axios';

// Replace with your machine's IP for mobile testing!
const API_BASE_URL = 'http://172.21.153.152/wesleyan-marketplace'; // <- your local IP here

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // To support sessions (important!)
});

export default api;