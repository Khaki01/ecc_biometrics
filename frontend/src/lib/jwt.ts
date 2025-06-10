import { jwtDecode } from "jwt-decode";

// Check if token is valid (not expired)
export const isTokenValid = (token: string) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (!decoded.exp) {
      return false;
    }
    return decoded.exp > currentTime;
  } catch (e) {
    console.error(e);
    return false;
  }
};

// Get token payload
export const getTokenPayload = (token: string) => {
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (e) {
    console.error(e);
    return null;
  }
};
