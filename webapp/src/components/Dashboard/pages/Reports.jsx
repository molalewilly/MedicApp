import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../../firebase";
import DoctorReportModal from './DoctorReportModal';
import './report.css'; 

const ReportsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const snapshot = await getDocs(collection(db, 'doctors'));
      setDoctors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDoctors();
  }, []);

  const handleGenerateReport = (doctor) => {
    setSelectedDoctor(doctor); 
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      {doctors.map((doctor) => (
  <div key={doctor.id} className="doctor-report-container">
    <span>{doctor.name}</span>
    <button
      onClick={() => handleGenerateReport(doctor)}  
      className="generate-report-button"
    >
      Generate Report
    </button>
  </div>
))}


      {selectedDoctor && (
        <DoctorReportModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)} 
        />
      )}
    </div>
  );
};

export default ReportsPage;
