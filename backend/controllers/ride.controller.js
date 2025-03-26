const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');


module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, pickupCoords, destinationCoords, vehicleType, fare } = req.body;
    // console.log(pickup, destination, pickupCoords, destinationCoords, vehicleType, fare )

    try {
        // Create a new ride in the database
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            pickupCoords,
            destinationCoords,
            vehicleType,
            fare,
            status: "pending", // Default status
        });

        // Get captains in a 2 km radius from the pickup location
        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoords[0], pickupCoords[1], 2);

        // Hide OTP in response
        ride.otp = "";

        // Populate user details in ride response
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate("user");

        // Notify available captains via WebSocket
        captainsInRadius.forEach((captain) => {
            sendMessageToSocketId(captain.socketId, {
                event: "new-ride",
                data: rideWithUser,
            });
        });

        res.status(201).json({ rideId: ride._id, message: "Ride created successfully!" });

    } catch (err) {
        console.error("Ride creation error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, pickupCoordinates, destinationCoordinates } = req.query;
    
    // console.log(pickupCoordinates,destinationCoordinates,"getFarecontroller")
    try {
        const fare = await rideService.getFare(pickup, destination, pickupCoordinates, destinationCoordinates);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    // console.log(rideId)
    // console.log(req.captain)
    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })
        console.log("ride status ",ride.status)
        return res.status(200).json(ride.status);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })
        console.log("ride status: ",ride.status)
        return res.status(200).json(ride.status);
        
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.pendingRides = async (req, res) => {
    try {
        const rides = await rideModel.find({ status: "pending" })
        return res.status(200).json(rides);
    } catch (err) {
        console.error("Error fetching pending rides:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
