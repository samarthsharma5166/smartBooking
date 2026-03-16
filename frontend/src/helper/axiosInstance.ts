import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/";
// const BASE_URL = "https://4v1gfcbl-3000.inc1.devtunnels.ms/api/v1/";


const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
