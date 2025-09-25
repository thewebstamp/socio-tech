import axios from "axios";

const api = axios.create({
    baseURL: "https://socio-tech-server.onrender.com/api",
    withCredentials: true
});

export default api;