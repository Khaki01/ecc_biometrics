import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // надо лучше без NEXT_PUBLIC чтоб прятать бэк

export const authenticate = async (imageFile: File | Blob) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await axios.post(`${BASE_URL}/auth`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      console.error("Server response:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Authentication failed");
  }
};

export const identify = async (imageFile: File | Blob, token: string) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await axios.post(`${BASE_URL}/identify`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      console.error("Server response:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Authentication failed");
  }
};
