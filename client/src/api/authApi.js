import axios from "./axios";

export const loginAPI = async (data) => {
  const res = await axios.post("/api/auth/login", data);
  return res.data;
};

export const registerAPI = async (data) => {
  const res = await axios.post("/api/auth/register", data);
  return res.data;
};
