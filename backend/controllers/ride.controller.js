const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId, emitToUser } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, pickupCoords, destinationCoords, vehicleType, fare } = req.body;

    try {
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            pickupCoords,
            destinationCoords,
            vehicleType,
            fare,
            status: "pending",
        });

        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoords[0], pickupCoords[1], 2);

        ride.otp = "";

        const rideWithUser = await rideModel.findById(ride._id).populate("user");

        // Send ride to nearby captains using their socketIds
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

    try {
        const fare = await rideService.getFare(pickup, destination, pickupCoordinates, destinationCoordinates);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideModel.findByIdAndUpdate(
            rideId,
            { status: "accepted", captain: req.captain._id },
            { new: true }
        ).populate("user").populate("captain");

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }
        // console.log(ride)

        emitToUser(ride.user._id, "ride-confirmed", ride);

        res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        emitToUser(ride.user._id, "ride-started", ride);

        console.log("ride status ", ride.status);
        return res.status(200).json(ride.status);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        emitToUser(ride.user._id, "ride-ended", ride);

        console.log("ride status: ", ride.status);
        return res.status(200).json(ride.status);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.pendingRides = async (req, res) => {
    try {
        const vehicleType = req.captain.vehicle.vehicleType;

        const rides = await rideModel.find({ status: "pending", vehicleType: vehicleType });
        return res.status(200).json(rides);
    } catch (err) {
        console.error("Error fetching pending rides:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.getRideById = async (req, res) => {
    const { rideId } = req.params;

    try {
        const ride = await rideModel.findById(rideId).populate('user').populate('captain');

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};
