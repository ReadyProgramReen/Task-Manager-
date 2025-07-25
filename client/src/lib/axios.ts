//created a centralized Axios setup to keep base url and headers DRY

import axios from "axios";

const API = axios.create({
    baseURL: "https://localhost:9000/api",
    withCredentials:true,
});

export default API;