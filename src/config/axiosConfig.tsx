import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({});
const api = axios.create({
  baseURL: `${process.env.HOST_SERVER}`,
});
const refreshAccessToken = async () => {
  try {
    const response = await api.post("/api/v1/auth/refreshToken");
    const newAccessToken = response.data.accessToken;
    await AsyncStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.log("Lỗi khi refresh token:", error);
    throw error;
  }
};
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response.status;
    const responseData = error.response.data;
    console.log(responseData);
    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log(12398);
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Tiếp tục gửi yêu cầu ban đầu
      } catch (refreshError) {
        console.log("Lỗi khi refresh token:", refreshError);
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
