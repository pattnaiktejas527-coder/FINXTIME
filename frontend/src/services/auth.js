import axios from "axios";

const API = "https://finxtime.onrender.com";

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API}/user/register`,
    userData
  );
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API}/user/login`,
    userData
  );
  return response.data;
};