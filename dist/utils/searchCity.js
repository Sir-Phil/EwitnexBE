"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCityLocation = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Function to search for city location using an external API
const searchCityLocation = (city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiKey = process.env.OPEN_WEATHER_KEY; // Replace with your actual API key
        const apiUrl = `${process.env.OPEN_WEATHER_URL}/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const response = yield axios_1.default.get(apiUrl);
        const { coord } = response.data;
        const latitude = coord.lat;
        const longitude = coord.lon;
        return { latitude, longitude };
    }
    catch (error) {
        throw new Error('Error searching for city location');
    }
});
exports.searchCityLocation = searchCityLocation;
