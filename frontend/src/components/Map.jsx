import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  return (
    <div className="map-container ">
      <MapContainer 
        center={[28.6139, 77.2090]} // Default: Delhi, India
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "100vh", width: "100%" }} // Full-screen map
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Marker Example */}
        <Marker position={[28.6139, 77.2090]}>
          <Popup>New Delhi, India</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
