import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const loginAPI = {
  url: "https://logins-1476.restdb.io/rest/logins?",
  config: {
    headers: {
      "Content-Type": "application/json",
      "x-apikey": process.env.REST_API_KEY2,
    },
  },
  async createUser(details) {
    try {
      const postResponse = await axios.post(this.url, details, this.config);
      console.log("Database updated with new login:", postResponse.data);
      return postResponse.data;
    } catch (error) {
      console.error("Error updating database:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      throw error;
    }
  },
  async findUserByUsername(username) {
    try {
      const response = await axios.get(
        `${this.url}&q={"username":"${username}"}`,
        this.config
      );
      const user = response.data[0];

      return user || null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  },
};

export default loginAPI;
