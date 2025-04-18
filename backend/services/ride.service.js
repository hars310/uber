const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function getFare(pickup, destination, pickupCoordinates, destinationCoordinates) {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination,pickupCoordinates,destinationCoordinates);
        console.log(distanceTime)
    // Validate the response
    if (!distanceTime || !distanceTime.distance || !distanceTime.duration) {
        throw new Error("Failed to fetch distance and time for fare calculation");
    }

    const baseFare = { auto: 30, car: 50, moto: 20 };
    const perKmRate = { auto: 10, car: 15, moto: 8 };
    const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

    const fare = {
        auto: Math.round(
            baseFare.auto +
            (distanceTime.distance / 1000) * perKmRate.auto +
            (distanceTime.duration / 60) * perMinuteRate.auto
        ),
        car: Math.round(
            baseFare.car +
            (distanceTime.distance / 1000) * perKmRate.car +
            (distanceTime.duration / 60) * perMinuteRate.car
        ),
        moto: Math.round(
            baseFare.moto +
            (distanceTime.distance / 1000) * perKmRate.moto +
            (distanceTime.duration / 60) * perMinuteRate.moto
        )
    };

    console.log("Calculated Fare:", fare); // Debugging

    return fare;
}

module.exports.getFare = getFare;


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


module.exports.createRide = async ({
            user,
            pickup,
            destination,
            pickupCoords,
            destinationCoords,
            vehicleType,
            fare,
            status
}) => {
    if (!user || !pickup || !destination || !vehicleType || !pickupCoords || !destinationCoords || !fare ) {
        throw new Error('All fields are required');
    }

    // const fare = await getFare(pickup, destination);



    const ride = rideModel.create({
        user,
        pickup,
        destination,
        pickupCoords,
        destinationCoords,
        otp: getOtp(6),
        fare,
        status,
        vehicleType
    })

    return ride;
}

module.exports.confirmRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride ID is required');
    }

    console.log("Confirming ride:", rideId, captain);

    // Update ride status and assign captain
    await rideModel.findOneAndUpdate(
        { _id: rideId },
        { status: 'accepted', captain: captain._id }
    );

    // Fetch ride details with user information
    const ride = await rideModel.findOne({ _id: rideId })
        .populate('user', 'fullname email') 
        .populate('captain', 'fullname') 
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
};


module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }
    // console.log(ride.status)
    // if (ride.status !== 'ongoing') {
    //     return res.status(400).json({ message: "Ride is not in an ongoing state." });
    // }
    
    

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}

