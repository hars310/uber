const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await axios.get(url);
        if (response.data.length > 0) {
            const location = response.data[0];
            return {
                ltd: parseFloat(location.lat),
                lng: parseFloat(location.lon)
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    // Convert origin & destination strings to coordinates
    const originCoords = await module.exports.getAddressCoordinate(origin);
    const destinationCoords = await module.exports.getAddressCoordinate(destination);

    if (!originCoords || !destinationCoords) {
        throw new Error('Failed to fetch coordinates for origin or destination');
    }

    console.log("Origin:", originCoords);
    console.log("Destination:", destinationCoords);

    const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destinationCoords.lng},${destinationCoords.ltd}?overview=false`;

    try {
        const response = await axios.get(url);
        if (response.data.routes.length > 0) {
            return {
                distance: response.data.routes[0].distance, // in meters
                duration: response.data.routes[0].duration // in seconds
            };
        } else {
            throw new Error('No routes found');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}


module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=5`;

    try {
        const response = await axios.get(url);
        if (response.data.features.length > 0) {
            return response.data.features.map((feature) => feature.properties.name);
        } else {
            throw new Error('No suggestions found');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    if (!ltd || !lng || !radius) {
        throw new Error("Latitude, longitude, and radius are required");
    }

    try {
        const captains = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, ltd], radius / 6371] // Convert km to radians
                }
            }
        });

        return captains;
    } catch (error) {
        console.error("Error fetching captains:", error.message);
        throw new Error("Failed to fetch captains in the radius");
    }
};