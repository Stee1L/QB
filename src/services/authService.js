import axios from 'axios';

const API_URL = '/api/auth/';

const register = (email, password) => {
  return axios.post(API_URL + 'register', {
    email,
    password,
  });
};

const login = (email, password) => {
  return axios.post(API_URL + 'login', {
    email,
    password,
  });
};

const forgotPassword = (email) => {
  return axios.post(API_URL + 'forgotpassword', {
    email,
  });
};

const resetPassword = (email, token, password) => {
  return axios.post(API_URL + 'resetpassword', {
    email,
    token,
    password,
  });
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
};
