//created a centralized Axios setup to keep base url and headers DRY

import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials:true,
});

export default API;