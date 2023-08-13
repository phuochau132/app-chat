import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const axiosInstance = axios.create({
  baseURL: `${Constants.manifest.extra.HOST_SERVER}`,
});
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
const refreshAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    console.log(accessToken);
    const response = await axios.post(
      `${Constants.manifest.extra.HOST_SERVER}/api/auth/refreshToken`,
      null,
      {
        headers: {
          Authorization: `BearerF ${accessToken}`,
        },
      }
    );
    const newAccessToken = response.data.accessToken;
    console.log("refresh Token");
    console.log(newAccessToken);
    await AsyncStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.log("Lỗi khi refresh token:", error);
    throw error;
  }
};
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response.status;
    const responseData = error.response.data;
    console.log(statusCode);
    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("hậu");
      try {
        console.log("hậu 1");
        const newAccessToken = await refreshAccessToken();
        console.log(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log(originalRequest);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Lỗi khi refresh token:", refreshError);
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
