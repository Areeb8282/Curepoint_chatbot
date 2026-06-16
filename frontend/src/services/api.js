import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = (data) =>
  axios.post(`${API_URL}/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${API_URL}/auth/login`, data);

export const sendChatMessage = (message, area, history = [], round = 0) =>
  axios.post(`${API_URL}/chat`, { message, area, user_id: 'guest', history, round });

export const getDoctors = () =>
  axios.get(`${API_URL}/doctors`);

export const getDoctorById = (id) =>
  axios.get(`${API_URL}/doctors/${id}`);

export const filterDoctors = (params) =>
  axios.get(`${API_URL}/doctors/filter`, { params });

export const bookAppointment = (data) =>
  axios.post(`${API_URL}/appointments`, data);

export const getHospitals = () =>
  axios.get(`${API_URL}/hospitals`);

export const getHospitalById = (id) =>
  axios.get(`${API_URL}/hospitals/${id}`);
