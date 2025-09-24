import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DeleteRecord.css";

const DeleteRecord = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("Name");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [previewEmployee, setPreviewEmployee] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deletedEmployees, setDeletedEmployees] = useState([]);

  // Fetch employees
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/employees").then((res) => {
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    });
  }, []);

  // Live search
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = employees.filter((emp) => {
      const value = emp[searchField]?.toString().toLowerCase();
      return value?.includes(term);
    });
    setFilteredEmployees(results);
  }, [searchTerm, searchField, employees]);

  

  // Select All toggle
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmployees(filteredEmployees);
    } else {
      setSelectedEmployees([]);
    }
  };

  // Delete previewed employee
  const handleDeletePreview = async () => {
    if (!previewEmployee) return;
    if (!window.confirm(`Are you sure you want to delete ${previewEmployee.Name}?`)) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/employees/${previewEmployee.EmployeeID}`);
      setEmployees(employees.filter((e) => e.EmployeeID !== previewEmployee.EmployeeID));
      setDeletedEmployees([...deletedEmployees, previewEmployee]);
      setSelectedEmployees(selectedEmployees.filter((e) => e.EmployeeID !== previewEmployee.EmployeeID));
      setPreviewEmployee(null);
      alert("Employee deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee.");
    }
  };

  // Bulk delete selected employees */
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL employees?")) return;
  
    try {
      await axios.delete("http://127.0.0.1:8000/employees");
      setDeletedEmployees([...deletedEmployees, ...employees]);
      setEmployees([]);
      alert("All employees deleted successfully!");
    } catch (err) {
      console.error("Error deleting all employees:", err);
    }
  };
  return (
    <div className="delete-container">
      {/* Navbar */}
      <nav className="hamburger-navbar">
        <div className="logo">Employee Dashboard</div>
        <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li onClick={() => (window.location.href = "/")}>Home</li>
          <li onClick={() => (window.location.href = "/employees")}>Employee Details</li>
          <li className="active">Delete Records</li>
          <li onClick={() => (window.location.href = "/search")}>Search</li>
          <li onClick={() => (window.location.href = "/add")}>Add Records</li>
          <li onClick={() => (window.location.href = "/statistics")}>Statistics</li>
        </ul>
      </nav>

      {/* Header */}
      <header className="delete-header">
        <h1>Delete a Employee</h1>
        <p>Remove employee details easily.</p>
      </header>

      {/* Search Controls */}
      <div className="search-controls">
        <select value={searchField} onChange={(e) => setSearchField(e.target.value)} className="search-dropdown">
          <option value="Name">Name</option>
          <option value="EmployeeID">Employee ID</option>
          <option value="Department">Department</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchField}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="delete-search"
        />
        <button className="delete-btn" onClick={handleDeletePreview}>Delete Previewed</button>
        <button className="bulk-delete-btn" onClick={handleDeleteAll}>
          🗑️ Bulk Delete (Delete All Employees)
        </button>

      </div>

      {/* Select All */}
      {filteredEmployees.length > 0 && (
        <div className="select-all">
          <input
            type="checkbox"
            checked={selectedEmployees.length === filteredEmployees.length}
            onChange={handleSelectAll}
          /> Select All
        </div>
      )}

      {/* Results List */}
      <div className="employee-results">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div
              key={emp.EmployeeID}
              className={`employee-row ${previewEmployee?.EmployeeID === emp.EmployeeID ? "active" : ""}`}
              onClick={() => setPreviewEmployee(emp)}
            >
              <input
                type="checkbox"
                checked={selectedEmployees.some(e => e.EmployeeID === emp.EmployeeID)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedEmployees([...selectedEmployees, emp]);
                  } else {
                    setSelectedEmployees(
                      selectedEmployees.filter(s => s.EmployeeID !== emp.EmployeeID)
                    );
                  }
                }}
              />

              <span>{emp.Name} (ID: {emp.EmployeeID}) - {emp.Department}</span>
            </div>
          ))
        ) : (
          <p className="delete-empty">No employees found</p>
        )}
      </div>

      {/* Employee Preview Table for Selected Employees */}
      {selectedEmployees.length > 0 && (
        <div className="employee-preview-table">
          <h3>Selected Employees</h3>
          <table className="employee-preview">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Date Of Joining</th>
              </tr>
            </thead>
            <tbody>
              {selectedEmployees.map((emp) => (
                <tr key={emp.EmployeeID}>
                  <td>{emp.EmployeeID}</td>
                  <td>{emp.Name}</td>
                  <td>{emp.Department}</td>
                  <td>₹{emp.Salary.toLocaleString()}</td>
                  <td>{emp.DateOfJoining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* Recently Deleted Section */}
      {deletedEmployees.length > 0 && (
        <div className="deleted-preview">
          <h2>Recently Deleted</h2>
          <div className="deleted-list">
            {deletedEmployees.map((emp) => (
              <div key={emp.EmployeeID} className="deleted-card">
                <div className="deleted-info">
                  <span className="deleted-name">{emp.Name}</span>
                  <span className="deleted-id">(ID: {emp.EmployeeID})</span>
                </div>
                <button
                  className="restore-btn"
                  onClick={async () => {
                    try {
                      await axios.put(
                        `http://127.0.0.1:8000/employees/restore/${emp.EmployeeID}`
                      );
                      // Remove restored employee from deleted list
                      setDeletedEmployees(
                        deletedEmployees.filter(
                          (d) => d.EmployeeID !== emp.EmployeeID
                        )
                      );
                      // Add restored employee back to main employees list
                      setEmployees([...employees, { ...emp, deleted: false }]);
                      alert(`${emp.Name} restored successfully!`);
                    } catch (err) {
                      console.error(err);
                      alert("Failed to restore employee.");
                    }
                  }}
                >
                Restore
              </button>
            </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DeleteRecord;
