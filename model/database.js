import axios from "axios";
import "dotenv/config";

const loadoutAPI = {
  url: "https://loadoutbuilder-9df0.restdb.io/rest/loadouts",
  config: {
    headers: {
      "Content-Type": "application/json",
      "x-apikey": process.env.REST_API_KEY,
    },
  },
};

// ➤ Save a new loadout
const saveLoadout = async (loadoutData) => {
  try {
    const response = await axios.post(
      loadoutAPI.url,
      loadoutData,
      loadoutAPI.config
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error saving loadout:", error.response?.data || error);
    console.error(
      "🛑 Validation issues:",
      JSON.stringify(error.response?.data?.list, null, 2)
    );
    throw error;
  }
};

// ➤ Get all loadouts
const getLoadouts = async () => {
  try {
    const response = await axios.get(loadoutAPI.url, loadoutAPI.config);
    return response.data;
  } catch (error) {
    console.error("Error fetching loadouts:", error);
    throw error;
  }
};

// ➤ Get a single loadout by ID
const getLoadoutById = async (id) => {
  try {
    const response = await axios.get(
      `${loadoutAPI.url}/${id}`,
      loadoutAPI.config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching loadout by ID:", error);
    throw error;
  }
};

// ➤ Update a loadout
const updateLoadout = async (id, updateData) => {
  try {
    const response = await axios.put(
      `${loadoutAPI.url}/${id}`,
      updateData,
      loadoutAPI.config
    );
    return response.data;
  } catch (error) {
    console.error("Error updating loadout:", error);
    throw error;
  }
};

// ➤ Delete a loadout
const deleteLoadout = async (id) => {
  try {
    await axios.delete(`${loadoutAPI.url}/${id}`, loadoutAPI.config);
    return { message: "Loadout deleted successfully" };
  } catch (error) {
    console.error("Error deleting loadout:", error);
    throw error;
  }
};

export {
  deleteLoadout,
  getLoadoutById,
  getLoadouts,
  saveLoadout,
  updateLoadout,
};
