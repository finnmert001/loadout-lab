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

// Save a new loadout
const saveLoadout = async (loadout) => {
  try {
    const response = await axios.post(
      loadoutAPI.url,
      {
        loadoutName: loadout.loadoutName,
        primaryWeapon: JSON.stringify(loadout.primaryWeapon),
        primaryAttachments: loadout.primaryAttachments,
        secondaryWeapon: JSON.stringify(loadout.secondaryWeapon),
        secondaryAttachments: loadout.secondaryAttachments,
        userId: loadout.userId,
        createdAt: new Date().toISOString(),
      },
      loadoutAPI.config
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all loadouts
const getLoadouts = async () => {
  try {
    const response = await axios.get(loadoutAPI.url, loadoutAPI.config);
    const loadouts = response.data;

    loadouts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return loadouts;
  } catch (error) {
    throw error;
  }
};

// Get a single loadout by ID
const getLoadoutById = async (id) => {
  try {
    const response = await axios.get(
      `${loadoutAPI.url}/${id}`,
      loadoutAPI.config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get loadouts by User ID
const getLoadoutsByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${loadoutAPI.url}?q={"userId": "${userId}"}`,
      loadoutAPI.config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a loadout
const updateLoadout = async (id, updateData) => {
  try {
    const response = await axios.put(
      `${loadoutAPI.url}/${id}`,
      updateData,
      loadoutAPI.config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a loadout
const deleteLoadout = async (id) => {
  try {
    await axios.delete(`${loadoutAPI.url}/${id}`, loadoutAPI.config);
    return { message: "Loadout deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export {
  deleteLoadout,
  getLoadoutById,
  getLoadouts,
  getLoadoutsByUserId,
  saveLoadout,
  updateLoadout,
};
