import React, { useState } from "react";

const Reports = () => {
  const [reports, setReports] = useState([
    { id: 1, title: "Doctor Registration Report", date: "2025-04-21", status: "Generated" },
    { id: 2, title: "Specialty Management Report", date: "2025-04-20", status: "Generated" },
    { id: 3, title: "Business Registration Report", date: "2025-04-19", status: "Pending" },
  ]);

  const handleGenerateReport = () => {
    // Logic to generate a new report
    const newReport = {
      id: Date.now(),
      title: prompt("Enter report title:"),
      date: new Date().toISOString().split("T")[0],
      status: "Generated",
    };
    setReports([...reports, newReport]);
  };

  const handleViewReport = (id) => {
    // Logic to view the report
    alert(`Viewing report with ID: ${id}`);
  };

  const handleDownloadReport = (id) => {
    // Logic to download the report
    alert(`Downloading report with ID: ${id}`);
  };

  return (
    <div className="reports-page">
      <h2 className="reports-heading">Reports Management</h2>
      <button className="generate-report-btn" onClick={handleGenerateReport}>
        Generate Report
      </button>
      <table className="report-table">
        <thead>
          <tr>
            <th>Report Title</th>
            <th>Report Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.title}</td>
              <td>{report.date}</td>
              <td>{report.status}</td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => handleViewReport(report.id)}
                >
                  View
                </button>
                <button
                  className="download-btn"
                  onClick={() => handleDownloadReport(report.id)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
