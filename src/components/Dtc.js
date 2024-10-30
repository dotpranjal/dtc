import React, { useEffect, useState } from 'react';
import * as protobuf from 'protobufjs';
import './Dtc.css';
import vehicle_positions from './vehicle_positions.proto'; // Import the .proto definition

const Dtc = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await fetch('/api/realtime/VehiclePositions.pb?key=5el7oDea7cIOT8wwdiY0CFSk6zn3dAQl');
        if (!response.ok) throw new Error('Network response was not ok');

        const arrayBuffer = await response.arrayBuffer();
        const binaryData = new Uint8Array(arrayBuffer);

        // Assuming you have a .proto file defining the VehiclePosition message
        const root = new protobuf.Root();
        await root.loadFile('./vehicle_positions.proto'); 
        const VehiclePosition = root.lookupType('VehiclePosition');

        const vehiclePositions = VehiclePosition.decodeDelimited(binaryData);

        setData(vehiclePositions);
      } catch (err) {
        console.error('Error fetching or parsing data:', err);
        setError(err.message);
      }
    };

    fetchBusData();
  }, []);


  return (
    <div>
      <h1>Live Bus Location Tracking</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {data.map((vehicle) => (
          <li key={vehicle.id}>
            <strong>Vehicle ID:</strong> {vehicle.id}
            <br />
            <strong>Latitude:</strong> {vehicle.latitude}
            <br />
            <strong>Longitude:</strong> {vehicle.longitude}
            {/* Add other fields as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dtc;