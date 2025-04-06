const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const { default: mongoose } = require('mongoose');

let io;

// Store userId -> socketId
const connectedUsers = new Map();

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Handle join event
        socket.on('join', async (data) => {
            // console.log(data," join event");
            const { userId, userType } = data;

            if (!userId || !userType) return;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.warn("Invalid ObjectId:", userId);
                return;
            }   

            // Save socketId in DB
            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                }

                // Save in memory
                connectedUsers.set(userId.toString(), socket.id);
                console.log(connectedUsers)
                console.log(`${userType} ${userId} joined with socket ${socket.id}`);
            } catch (err) {
                console.error(`Error in join:`, err);
            }
        });

        // Handle location update from captain
        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng
                    }
                });
            } catch (err) {
                console.error('Error updating location:', err);
            }
        });

        //  NEW: Handle ride confirmation from captain
        socket.on('ride-confirmed', async ({ rideId, userId, captainId, status }) => {
            console.log(`Ride confirmed: ${rideId} by captain ${captainId}`);
            // console.log(rideId, userId, captainId, status)
            const socketId = connectedUsers.get(captainId.toString());
            // console.log(socketId, "socketId");
            if (socketId) {
                io.to(socketId).emit('ride-confirmed', {
                    rideId,
                    captainId,
                    status
                });
            } else {
                console.log(`User ${userId} not connected.`);
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            for (const [userId, sId] of connectedUsers.entries()) {
                if (sId === socket.id) {
                    connectedUsers.delete(userId);
                    break;
                }
            }
        });
    });
}

// Emit by socketId (used in controller)
const sendMessageToSocketId = (socketId, messageObject) => {
    console.log("ride status from socket is: ", messageObject.data?.status);

    if (io && socketId) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized or socketId missing.');
    }
};

// Emit by userId (used in controller)
const emitToUser = (userId, event, data) => {
    const socketId = connectedUsers.get(userId.toString());
    if (socketId) {
        io.to(socketId).emit(event, data);
    }
};

module.exports = { initializeSocket, sendMessageToSocketId, emitToUser, connectedUsers };
