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

module.exports.getDistanceTime = async (pickup, destination,pickupCoordinates,destinationCoordinates) => {
    if (!pickup || !destination) {
        throw new Error('pickup and destination are required');
    }

    console.log("here 1")
    // Convert pickup & destination strings to coordinates
    // const pickupCoords = await module.exports.getAddressCoordinate(pickup);
    // const destinationCoords = await module.exports.getAddressCoordinate(destination);

    // const pickupCoords = pickupCoordinates;
    // const destinationCoords = destinationCoordinates;
    // console.log(pickupCoords,destinationCoords,"service")
    if (!pickupCoordinates || !destinationCoordinates) {
        throw new Error('Failed to fetch coordinates for pickup or destination');
    }
    console.log("here 2")

    console.log("pickup:", pickupCoordinates);
    console.log("Destination:", destinationCoordinates);

    const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoordinates[1]},${pickupCoordinates[0]};${destinationCoordinates[1]},${destinationCoordinates[0]}?overview=false`;

    try {
        const response = await axios.get(url, {
            headers: { "Content-Type": "application/json" },
            // timeout: 5000, // Set a timeout to avoid hanging requests
            // validateStatus: function (status) {
            //     return status >= 200 && status < 300; // Accept only successful responses
            // }
        });
        // console.log("response",response)
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