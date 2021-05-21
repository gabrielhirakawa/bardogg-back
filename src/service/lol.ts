/* eslint-disable prettier/prettier */
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.LOL_URL,
});

export default api;
