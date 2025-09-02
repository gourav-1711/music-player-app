import axios from "axios";

export const updater = async (data) => {
  try {
    const res = await axios.post("/api/auth/update", data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // 👈 makes sure cookies (token) are sent
    });
    return res.data;
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};
