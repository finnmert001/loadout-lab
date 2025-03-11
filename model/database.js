import axios from "axios";
import "dotenv/config";

const USE_MOCK_DATA = true; // Set to false to use real API calls

const mockLoadouts = [
  {
    _id: "1",
    loadoutName: "Test Loadout",
    primaryWeapon: { name: "XM4", image: "/images/weapons/AR/xm4DS.png" },
    secondaryWeapon: { name: "AK-74", image: "/images/weapons/AR/ak74DS.png" },
    primaryAttachments: [],
    secondaryAttachments: [],
    userId: "12345",
    createdAt: "2024-06-12T15:30:00.000Z", //first
  },
  {
    _id: "2",
    loadoutName: "Stealth Loadout",
    primaryWeapon: { name: "C9", image: "/images/weapons/SMG/c9DS.png" },
    secondaryWeapon: { name: "KSV", image: "/images/weapons/SMG/ksvDS.png" },
    primaryAttachments: [],
    secondaryAttachments: [],
    userId: "67890",
    createdAt: "2024-06-12T10:15:00.000Z", // second
  },
  {
    _id: "3",
    loadoutName: "First Loadout",
    primaryWeapon: { name: "C9", image: "/images/weapons/SMG/c9DS.png" },
    secondaryWeapon: { name: "KSV", image: "/images/weapons/SMG/ksvDS.png" },
    primaryAttachments: [],
    secondaryAttachments: [],
    userId: "67c716644ac1175d00008199",
    createdAt: "2024-06-12T06:15:00.000Z", //fourth
  },
  {
    _id: "4",
    loadoutName: "Second Loadout",
    primaryWeapon: { name: "XM4", image: "/images/weapons/AR/xm4DS.png" },
    secondaryWeapon: { name: "KSV", image: "/images/weapons/SMG/ksvDS.png" },
    primaryAttachments: [
      "Jason Armory 2x",
      "Suppressor",
      "Balanced Stock",
      "Extended Mag II",
      "Extended Mag II",
    ],
    secondaryAttachments: [
      "Suppressor",
      "Suppressor",
      "Balanced Stock",
      "Extended Mag II",
      "Extended Mag II",
    ],
    userId: "67c716644ac1175d00008199",
    createdAt: "2024-06-12T08:15:00.000Z", //third
  },
];

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
  if (USE_MOCK_DATA) {
    console.log("⚠️ Mock saving loadout:", loadout);
    const newLoadout = {
      ...loadout,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    mockLoadouts.push(newLoadout);
    return newLoadout;
  }

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
    console.error("❌ Error saving loadout:", error);
    throw error;
  }
};

// Get all loadouts
const getLoadouts = async () => {
  if (USE_MOCK_DATA) {
    console.log("⚠️ Using mock loadouts");
    return mockLoadouts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  try {
    const response = await axios.get(loadoutAPI.url, loadoutAPI.config);

    const loadouts = response.data;
    loadouts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return loadouts;
  } catch (error) {
    console.error("Error fetching loadouts:", error);
    throw error;
  }
};

// Get a single loadout by ID
const getLoadoutById = async (id) => {
  if (USE_MOCK_DATA) {
    console.log("⚠️ Using mock loadout for ID:", id);
    return mockLoadouts.find((loadout) => loadout._id === id) || null;
  }

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

// Get loadouts by User ID
const getLoadoutsByUserId = async (userId) => {
  if (USE_MOCK_DATA) {
    console.log("⚠️ Using mock loadouts for user:", userId);
    return mockLoadouts
      .filter((loadout) => loadout.userId === userId) // ✅ Only return loadouts for the user
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // ✅ Sort newest first
  }

  try {
    const response = await axios.get(
      `${loadoutAPI.url}?q={"userId": "${userId}"}`,
      loadoutAPI.config
    );
    const loadouts = response.data;
    loadouts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return loadouts;
  } catch (error) {
    console.error("Error fetching loadouts for user:", error);
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
    console.error("Error updating loadout:", error);
    throw error;
  }
};

// Delete a loadout
const deleteLoadout = async (id) => {
  if (USE_MOCK_DATA) {
    console.log("⚠️ Mock deleting loadout:", id);
    const index = mockLoadouts.findIndex((loadout) => loadout._id === id);
    if (index !== -1) mockLoadouts.splice(index, 1);
    return { message: "Mock loadout deleted successfully" };
  }

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
  getLoadoutsByUserId,
  saveLoadout,
  updateLoadout,
};
