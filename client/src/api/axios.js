import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
console.log(import.meta.env.VITE_API_URL);

export default instance;
