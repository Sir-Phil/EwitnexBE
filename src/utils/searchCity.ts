import axios from 'axios';

import dotenv from 'dotenv';

dotenv.config();

// Function to search for city location using an external API
const searchCityLocation = async (city: string): Promise<{ latitude: number; longitude: number }> => {
  try {
    const apiKey = process.env.OPEN_WEATHER_KEY; // Replace with your actual API key
    const apiUrl =  `${process.env.OPEN_WEATHER_URL}/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await axios.get(apiUrl);
    const { coord } = response.data;

    const latitude = coord.lat;
    const longitude = coord.lon;

    return { latitude, longitude };
  } catch (error) {
    throw new Error('Error searching for city location');
  }
};

export { searchCityLocation };
