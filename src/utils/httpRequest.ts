import axios from "axios";

const httpRequest = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.REACT_APP_BASE_URL ||
    "/api/",
});

httpRequest.interceptors.request.use((config) => {
  // const token =
    // typeof window !== "undefined" ? localStorage.getItem("token") : null;
  // if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMmEzOTU1ZC0xMjcxLTQ2ZTItYTM2Ny1mYjZjN2RhMGIyZWUiLCJyb2xlIjoiU1RVREVOVCIsImlhdCI6MTc1ODA4MzQyMSwiZXhwIjoxNzU4MDg3MDIxfQ.M7IzkQCqurXghGh7bezMWXApwqRKcdLfIvptmNBWw2M`;
  // }
  return config;
});

export const get = async (path: string, option = {}) => {
  const response = await httpRequest.get(path, option);
  return response.data;
};

export const post = async (path: string, data = {}, option = {}) => {
  const response = await httpRequest.post(path, data, option);
  return response.data;
};

export const put = async (path: string, data = {}, option = {}) => {
  const response = await httpRequest.put(path, data, option);
  return response.data;
};

export const del = async (path: string, option = {}) => {
  const response = await httpRequest.delete(path, option);
  return response.data;
};

export default httpRequest;
