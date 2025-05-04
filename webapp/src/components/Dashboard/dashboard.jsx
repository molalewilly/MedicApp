import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import RegisterDoctor from "./pages/RegisterDoctor";
import ManageDoctors from "./pages/ManageDoctors";
import Reports from "./pages/Reports";
import { Home, Plus, Edit, BarChart2 } from "lucide-react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";  
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("authToken");  
        navigate("/login", { replace: true }); 
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  
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
          <Link to="/dashboard/reports" className="sidebar-link">
            <BarChart2 size={18} /> Reports
          </Link>
        </nav>

        <button onClick={logout} className="logout-button mt-6 text-red-600 font-semibold">
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/register" element={<RegisterDoctor />} />
          <Route path="/manage" element={<ManageDoctors />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [uniqueSpecialties, setUniqueSpecialties] = useState(0);
  const [suspendedDoctors, setSuspendedDoctors] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "doctors"), (snapshot) => {
      const doctors = snapshot.docs.map(doc => doc.data());

      setTotalDoctors(doctors.length);

      const specialties = doctors.map(doctor => doctor.specialty);
      const uniqueSet = new Set(specialties);
      setUniqueSpecialties(uniqueSet.size);

      const suspendedCount = doctors.filter(doctor => doctor.suspended === true).length;
      setSuspendedDoctors(suspendedCount);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
      <div className="dashboard-stats-grid">
        <StatCard title="Total Doctors" count={totalDoctors} />
        <StatCard title="Specialties" count={uniqueSpecialties} />
        <StatCard title="Suspended Doctors" count={suspendedDoctors} />
       
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
