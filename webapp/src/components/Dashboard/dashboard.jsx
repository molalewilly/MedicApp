import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import RegisterDoctor from "./pages/RegisterDoctor";
import ManageDoctors from "./pages/ManageDoctors";
import Specialties from "./pages/Specialties";
import Businesses from "./pages/Businesses";
import Reports from "./pages/Reports";
import { Home, Plus, Edit, BarChart2, FileText, CheckCircle } from "lucide-react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <h2 className="text-xl font-bold mb-6 text-yellow-500">Admin Portal</h2>
        <nav className="flex flex-col gap-4 text-gray-700 font-medium">
          <Link to="/dashboard" className="sidebar-link">
            <Home size={18} /> Dashboard
          </Link>
          <Link to="/dashboard/register" className="sidebar-link">
            <Plus size={18} /> Register Doctor
          </Link>
          <Link to="/dashboard/manage" className="sidebar-link">
            <Edit size={18} /> Manage Doctors
          </Link>
          <Link to="/dashboard/specialties" className="sidebar-link">
            <CheckCircle size={18} /> Specialties
          </Link>
          <Link to="/dashboard/businesses" className="sidebar-link">
            <FileText size={18} /> Businesses
          </Link>
          <Link to="/dashboard/reports" className="sidebar-link">
            <BarChart2 size={18} /> Reports
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/register" element={<RegisterDoctor />} />
          <Route path="/manage" element={<ManageDoctors />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [uniqueSpecialties, setUniqueSpecialties] = useState(0);

  useEffect(() => {
    // Fetch the doctors and calculate total and unique specialties
    const fetchDoctors = async () => {
      const doctorsCollection = collection(db, "doctors");
      const doctorSnapshot = await getDocs(doctorsCollection);
      const doctors = doctorSnapshot.docs.map(doc => doc.data());

      setTotalDoctors(doctorSnapshot.size); // Total doctor count

      // Get unique specialties
      const specialties = doctors.map(doctor => doctor.specialty);
      const uniqueSpecialtiesSet = new Set(specialties);
      setUniqueSpecialties(uniqueSpecialtiesSet.size); // Set size is the count of unique specialties
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
      <div className="dashboard-stats-grid">
        <StatCard title="Total Doctors" count={totalDoctors} />
        <StatCard title="Specialties" count={uniqueSpecialties} />
        <StatCard title="Businesses Pending" count={5} />
        <StatCard title="Reports Generated" count={12} />
      </div>
    </div>
  );
};

const StatCard = ({ title, count }) => (
  <div className="stat-card">
    <h4 className="text-gray-600 font-medium">{title}</h4>
    <p className="text-3xl font-bold text-gray-900">{count}</p>
  </div>
);

export default Dashboard;
