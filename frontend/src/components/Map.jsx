// import React, { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix Leaflet default marker icon issues
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
// });

// // Component to update map view when center changes
// const ChangeMapView = ({ center }) => {
//   const map = useMap();
  
//   useEffect(() => {
//     if (center && Array.isArray(center) && center.length === 2 && 
//         center[0] !== null && center[1] !== null) {
//       map.setView(center, map.getZoom());
//     }
//   }, [center, map]);
  
//   return null;
// };


// const Map = ({ center, markers, route ,mapStyles}) => {
//   // Validate center coordinates
//   const defaultCenter = [28.6139, 77.2090]; // Default: New Delhi
//   const validCenter = (center && Array.isArray(center) && center.length === 2 && 
//                       center[0] !== null && center[1] !== null) ? 
//                       center : defaultCenter;
  
//   // Filter out invalid markers
//   const validMarkers = (markers && Array.isArray(markers)) ? 
//     markers.filter(marker => 
//       marker && Array.isArray(marker) && marker.length === 2 && 
//       marker[0] !== null && marker[1] !== null
//     ) : [];
    
//   // Validate and prepare route data
//   // OSRM returns [lon, lat] but Leaflet needs [lat, lon], so we need to flip them
//   const validRoute = (route && Array.isArray(route) && route.length > 0) ?
//     route.map(point => [point[1], point[0]]) :
//     [];

//   return (
//     <div className="map-container">
//       <MapContainer 
//         center={validCenter} 
//         zoom={10} 
//         scrollWheelZoom={true} 
//         style={mapStyles}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
        
//         {validMarkers.map((position, index) => (
//           <Marker key={index} position={position}>
//             <Popup>{index === 0 ? "Pickup Location" : "Dropoff Location"}</Popup>
//           </Marker>
//         ))}
        
//         {validRoute.length > 0 && (
//           <Polyline 
//             positions={validRoute} 
//             color="blue" 
//             weight={4} 
//             opacity={0.7} 
//           />
//         )}
        
//         <ChangeMapView center={validCenter} />
//       </MapContainer>
//     </div>
//   );
// };

// export default Map;

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to automatically fit the map view to show the full route
const FitBounds = ({ markers, route }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0 || route.length > 0) {
      const bounds = L.latLngBounds([...markers, ...route.map(([lat, lon]) => [lat, lon])]);

      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, route, map]);

  return null;
};

const Map = ({ center, markers = [], route = [], mapStyles }) => {
  const defaultCenter = [28.6139, 77.2090]; // Default: New Delhi

  const validCenter = center && Array.isArray(center) && center.length === 2 ? center : defaultCenter;
  const validMarkers = markers.filter((m) => Array.isArray(m) && m.length === 2);
  const validRoute = (route && Array.isArray(route) && route.length > 0) ?
      route.map(point => [point[1], point[0]]) : []; // Convert OSRM lon-lat to Leaflet lat-lon

  return (
    <div className="map-container">
      {/* Force re-render when route changes */}
      <MapContainer key={JSON.stringify(route)} center={validCenter} zoom={10} scrollWheelZoom={true} style={mapStyles}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Add Pickup & Destination Markers */}
        {validMarkers.map((position, index) => (
          <Marker key={index} position={position}>
            <Popup>{index === 0 ? "Pickup Location" : "Dropoff Location"}</Popup>
          </Marker>
        ))}

        {/* Show Route */}
        {validRoute.length > 0 && (
          <Polyline key={JSON.stringify(validRoute)} positions={validRoute} color="blue" weight={4} opacity={0.7} />
        )}

        {/* Auto-Fit Bounds to Markers & Route */}
        <FitBounds markers={validMarkers} route={validRoute} />
      </MapContainer>
    </div>
  );
};

export default Map;
