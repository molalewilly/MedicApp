import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "./manageDoctor.css";

const ManageDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorToEdit, setDoctorToEdit] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "doctors"), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDoctors(docs);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      await deleteDoc(doc(db, "doctors", id));
    }
  };

  const handleSuspend = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "doctors", id), {
        suspended: !currentStatus,
      });
    } catch (error) {
      console.error("Error toggling suspension:", error);
    }
  };

  const handleEdit = (doctor) => {
    setDoctorToEdit(doctor);
  };

  const handleSaveEdit = async (updatedDoctor) => {
    try {
      await updateDoc(doc(db, "doctors", updatedDoctor.id), {
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        specialty: updatedDoctor.specialty,
        phone: updatedDoctor.phone,
       
        experience: updatedDoctor.experience,
        bio: updatedDoctor.bio,
        location: {
          address: updatedDoctor.location.address,
          latitude: updatedDoctor.location.latitude,
          longitude: updatedDoctor.location.longitude,
        },
        suspended: updatedDoctor.suspended,
      });
      setDoctorToEdit(null);
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  return (
    <div className="manage-page">
      <h2 className="manage-heading">Manage Doctors</h2>
      
      {/* Table Container */}
      <div className="table-container">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialty</th>
              <th>Phone</th>
              
              <th>Location</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.specialty}</td>
                <td>{doctor.phone}</td>
              
                <td>
                  {doctor.location ? (
                    <span>
                      {doctor.location.address || "Address not provided"}
                      {doctor.location.latitude && doctor.location.longitude && (
                        <span> (Lat: {doctor.location.latitude}, Long: {doctor.location.longitude})</span>
                      )}
                    </span>
                  ) : (
                    "No location"
                  )}
                </td>
                <td>{doctor.experience} yrs</td>
                <td style={{ fontWeight: "bold", color: doctor.suspended ? "#ef4444" : "#10b981" }}>
                  {doctor.suspended ? "Suspended" : "Active"}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(doctor)}>Edit</button>
                  <button
                    className="suspend-btn"
                    onClick={() => handleSuspend(doctor.id, doctor.suspended)}
                  >
                    {doctor.suspended ? "Activate" : "Suspend"}
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(doctor.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {doctorToEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Doctor</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit(doctorToEdit);
              }}
            >
              <input
                type="text"
                value={doctorToEdit.name}
                onChange={(e) => setDoctorToEdit({ ...doctorToEdit, name: e.target.value })}
                required
              />
              <input
                type="email"
                value={doctorToEdit.email}
                onChange={(e) => setDoctorToEdit({ ...doctorToEdit, email: e.target.value })}
                required
              />
              <input
                type="text"
                value={doctorToEdit.specialty}
                onChange={(e) => setDoctorToEdit({ ...doctorToEdit, specialty: e.target.value })}
                required
              />
              <input
                type="text"
                value={doctorToEdit.phone}
                onChange={(e) => setDoctorToEdit({ ...doctorToEdit, phone: e.target.value })}
                required
              />
              <input
                type="text"
                value={doctorToEdit.location?.address || ""}
                onChange={(e) => setDoctorToEdit({ ...doctorToEdit, location: { ...doctorToEdit.location, address: e.target.value } })}
                placeholder="Address"
                required
              />
              <input
                type="text"
                value={doctorToEdit.location?.latitude || ""}
                onChange={(e) => setDoctorToEdit({ ...doctorToEdit, location: { ...doctorToEdit.location, latitude: e.target.value } })}
                placeholder="Latitude"
                required
              />
              <input
                type="text"
                value={doctorToEdit.location?.longitude || ""}
                onChange={(e) => setDoctorToEdit({ ...doctorToEdit, location: { ...doctorToEdit.location, longitude: e.target.value } })}
                placeholder="Longitude"
                required
              />
              <input
                type="number"
                value={doctorToEdit.experience}
                onChange={(e) => setDoctorToEdit({ ...doctorToEdit, experience: e.target.value })}
                required
              />
              <div className="button-container">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="close-btn" onClick={() => setDoctorToEdit(null)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctor;
