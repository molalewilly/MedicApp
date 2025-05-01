import React, { useState } from "react";
import { db } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // import leaflet CSS
import "./registerDoctor.css";

// LocationPicker component
const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng); // Pass clicked location to parent
    },
  });

  return position ? <Marker position={position} /> : null;
};

const RegisterDoctor = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    specialty: "",
    phone: "",
    gender: "",
    location: {
      address: "",
      latitude: "",
      longitude: "",
    },
    experience: "",
    bio: "",
    suspended: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor({
      ...doctor,
      [name]: value,
    });
  };

  const handleLocationSelect = async (latlng) => {
    setDoctor((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: latlng.lat,
        longitude: latlng.lng,
      },
    }));

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`);
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || "";

      setDoctor((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          address: city,
          latitude: latlng.lat,
          longitude: latlng.lng,
        },
      }));
    } catch (error) {
      console.error("Error fetching city name:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "doctors"), {
        ...doctor,
        location: {
          address: doctor.location.address,
          latitude: parseFloat(doctor.location.latitude),
          longitude: parseFloat(doctor.location.longitude),
        },
      });
      alert("Doctor registered successfully!");
      setDoctor({
        name: "",
        email: "",
        specialty: "",
        phone: "",
        gender: "",
        location: {
          address: "",
          latitude: "",
          longitude: "",
        },
        experience: "",
        bio: "",
        suspended: false,
      });
    } catch (error) {
      console.error("Error registering doctor:", error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h2 className="form-heading">Register Doctor</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={doctor.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={doctor.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="specialty"
            value={doctor.specialty}
            onChange={handleInputChange}
            placeholder="Specialty"
            required
          />
          <input
            type="text"
            name="phone"
            value={doctor.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            required
          />
          <input
            type="text"
            name="gender"
            value={doctor.gender}
            onChange={handleInputChange}
            placeholder="Gender"
            required
          />

          {/* MAP Section */}
          <div style={{ height: "400px", marginBottom: "20px" }}>
            <MapContainer
              center={[-24.6544, 25.9086]} // Default center (can be Gaborone or wherever you prefer)
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </MapContainer>
          </div>

          {/* Show picked location */}
          <input
            type="text"
            name="address"
            value={doctor.location.address}
            placeholder="City"
            disabled
          />
          <input
            type="text"
            name="latitude"
            value={doctor.location.latitude}
            placeholder="Latitude"
            disabled
          />
          <input
            type="text"
            name="longitude"
            value={doctor.location.longitude}
            placeholder="Longitude"
            disabled
          />

          <input
            type="number"
            name="experience"
            value={doctor.experience}
            onChange={handleInputChange}
            placeholder="Experience (years)"
            required
          />
          <textarea
            name="bio"
            value={doctor.bio}
            onChange={handleInputChange}
            placeholder="Bio"
            required
          />
          <button type="submit" className="register-btn">
            Register Doctor
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterDoctor;
