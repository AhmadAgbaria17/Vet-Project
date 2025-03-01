import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

export const getUserInfo = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) return null;

    // Decode JWT Token
    const decodedUser = jwtDecode(token);
    return decodedUser;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};
