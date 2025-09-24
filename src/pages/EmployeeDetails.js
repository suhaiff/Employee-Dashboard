import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./EmployeeDetails.css";

function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Error Fetching Employees", err));
  }, []);

  const calculateYearsWorked = (dateStr) => {
    const joinDate = new Date(dateStr);
    const today = new Date();
    return today.getFullYear() - joinDate.getFullYear();
  };

  const handleSort = () => {
    if (!sortField) return;

    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);

    const sorted = [...employees].sort((a, b) => {
      if (sortField === "Salary" || sortField === "EmployeeID") {
        return order === "asc"
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      } else if (sortField === "DateOfJoining") {
        return order === "asc"
          ? new Date(a.DateOfJoining) - new Date(b.DateOfJoining)
          : new Date(b.DateOfJoining) - new Date(a.DateOfJoining);
      } else {
        return order === "asc"
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });
    setEmployees(sorted);
  };

  // Export Button
  const handleExport = () => {
    // Adjust the URL if your backend runs on another port
    window.open("http://localhost:8000/employees/export", "_blank");
  };

  return (
    <div className="details-container">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">Employee Dashboard</h2>
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        {menuOpen && (
          <div className="menu">
            <Link to="/">Home</Link>
            <Link to="/employees">Employee Details</Link>
            <Link to="/search">Search</Link>
            <Link to="/add">Add Records</Link>
            <Link to="/delete">Delete Records</Link>
            <Link to="/statistics">Statistics</Link>
          </div>
        )}
      </nav>

      {/* Header */}
      <header className="details-header">
        <h1>Employee Records</h1>
        <p>Sort and explore employee details easily.</p>
      </header>

      {/* Sort Controls */}
      <div className="sort-controls">
        <select
          onChange={(e) => setSortField(e.target.value)}
          value={sortField}
          className="sort-dropdown"
        >
          <option value="">Select Sort Type</option>
          <option value="Name">Name</option>
          <option value="Department">Department</option>
          <option value="Salary">Salary</option>
          <option value="EmployeeID">Employee ID</option>
          <option value="DateOfJoining">Date of Joining</option>
        </select>
        <button onClick={handleSort}>
          Sort {sortOrder === "asc" ? "⬆️" : "⬇️"}
        </button>
        {/* Export Button */}
        
        <button onClick={handleExport} className="export-btn">
          ⬇️ Export to CSV
        </button>
        
      </div>

      
      

      {/* Table */}
      <div className="table-card">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Date of Joining</th>
              <th>Years Worked</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.EmployeeID}>
                <td>{emp.EmployeeID}</td>
                <td>{emp.Name}</td>
                <td>{emp.Department}</td>
                <td>₹{emp.Salary.toLocaleString()}</td>
                <td>{emp.DateOfJoining}</td>
                <td>
                  <span className="years-badge">
                    {calculateYearsWorked(emp.DateOfJoining)} yrs
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeDetails;
