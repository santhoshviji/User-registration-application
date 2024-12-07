import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

export const getUsers = (search = "", page = 0, size = 10) =>
  axios.get(`${API_URL}?search=${search}&page=${page}&size=${size}`);

export const getUserById = (id) => axios.get(`${API_URL}/${id}`);

export const createUser = (user) => axios.post(API_URL, user);

export const updateUser = (id, user) => axios.put(`${API_URL}/${id}`, user);

export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);
