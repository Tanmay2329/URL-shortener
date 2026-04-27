import axios from "axios";

export const APAI = axios.create({
    baseURL: "https://url-shortener-production-fb16.up.railway.app",
});