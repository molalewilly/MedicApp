import React, { useState } from "react";

const Specialties = () => {
  const [specialties, setSpecialties] = useState([
    { id: 1, name: "Cardiology" },
    { id: 2, name: "Neurology" },
    { id: 3, name: "Orthopedics" },
  ]);

  const handleAddSpecialty = () => {
    // Logic to add a new specialty
    const newSpecialty = prompt("Enter the new specialty name:");
    if (newSpecialty) {
      setSpecialties([...specialties, { id: Date.now(), name: newSpecialty }]);
    }
  };

  const handleEditSpecialty = (id) => {
    // Logic to edit an existing specialty
    const newName = prompt("Edit the specialty name:");
    if (newName) {
      setSpecialties(
        specialties.map((specialty) =>
          specialty.id === id ? { ...specialty, name: newName } : specialty
        )
      );
    }
  };

  const handleDeleteSpecialty = (id) => {
    // Logic to delete a specialty
    setSpecialties(specialties.filter((specialty) => specialty.id !== id));
  };

  return (
    <div className="specialties-page">
      <h2 className="specialties-heading">Manage Specialties</h2>
      <button className="add-specialty-btn" onClick={handleAddSpecialty}>
        Add Specialty
      </button>
      <table className="specialty-table">
        <thead>
          <tr>
            <th>Specialty Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {specialties.map((specialty) => (
            <tr key={specialty.id}>
              <td>{specialty.name}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEditSpecialty(specialty.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteSpecialty(specialty.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Specialties;
