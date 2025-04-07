# UBER CLONE
## Description
This project is a real-time ride booking web application built using the MERN stack and Socket.IO, inspired by Uber. It allows users to select pickup and drop locations on an interactive map, choose a ride type (Bike, Auto, Car), and get instant fare estimates. Captains receive ride requests in real time and share live location and ride status updates with users. The system offers seamless real-time communication, dynamic routing, and a smooth user experience in the browser.

![Screenshot of Website](./frontend/public/screenshot.png)
## Technologies Used

- **Frontend:**
  - React.js
  - Axios for API calls
  - Tailwind CSS

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Socket.io
  - Leaflet

## 🚀 Features

### 👤 User (Rider)
- Interactive map to select pickup and drop-off locations.
- Ride type selection: Car, Auto, or Bike.
- Dynamic fare calculation based on distance and ride type.
- Real-time updates on ride status:
- Ride request sent
- Captain assigned with full details
- Live captain location
- Ride accepted, started, and completed statuses

### 🚖 Captain (Driver)
- Connects to the server to become available.
- Receives real-time ride requests.
- Accepts or rejects requests (extendable).
- Sends live location updates to the rider.
- Sends ride status updates.

### 🗺️ Map, Route, and Fare System
- Built using Leaflet.js + OpenStreetMap.
- Click-and-drag interface for setting pickup/drop points.
- Route drawn between pickup and drop with polylines.
- Fare = Base fare + Per km charge (customizable).

## ⚡ Real-Time Communication with Socket.IO

### Socket Flow
- User creates ride → socket emits request.
- Server broadcasts to captains.
- Captain accepts → server confirms and assigns.

### Live GPS tracking and ride status shared.
- Real-time status: Started, Completed, etc.
- Each ride has a unique socket room for targeted updates.


