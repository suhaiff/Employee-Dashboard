import React, { useEffect, useState } from "react";
import "./Search.css";

function Search() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("Name");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);


  // Track selected Employee IDs for export
  const [selectedEmployeeIDs, setSelectedEmployeeIDs] = useState([]);

  // Fetch employees from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setFilteredEmployees(data);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  // Auto-search when typing
  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const results = employees.filter((emp) => {
      const value = emp[searchField]?.toString().toLowerCase();
      return value.includes(lowerTerm);
    });
    setFilteredEmployees(results);

    // Remove deselected IDs if they are no longer in filtered results
    setSelectedEmployeeIDs((prev) =>
      prev.filter((id) => results.some((emp) => emp.EmployeeID === id))
    );
  }, [searchTerm, searchField, employees]);

  
  

  // Export selected employees
  const exportSelectedEmployees = () => {
    const selectedEmps = filteredEmployees.filter((emp) =>
      selectedEmployeeIDs.includes(emp.EmployeeID)
    );
  
    if (selectedEmps.length === 0) {
      alert("No employees selected to export!");
      return;
    }
  
    const csvContent = [
      Object.keys(selectedEmps[0]).join(","), // headers
      ...selectedEmps.map((emp) => Object.values(emp).join(","))
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered-export.csv";
    link.click();
  };
  

  return (
    <div className="search-container">
      {/* Navbar */}
      <div className="search-navbar">
        <div className="logo">Employee Dashboard</div>
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        {menuOpen && (
          <nav className="menu">
            <a href="/">Home</a>
            <a href="/employees">Employee Details</a>
            <a href="/search">Search</a>
            <a href="/add">Add Records</a>
            <a href="/delete">Delete Records</a>
            <a href="/statistics">Statistics</a>
          </nav>
        )}
      </div>

      {/* Search Controls */}
      <div className="search-section">
        {/* Header */}
        <header className="search-header">
          <h1>Search Employees Here</h1>
          <p>Find employee details easily.</p>
        </header>
        <div className="search-controls">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="search-dropdown"
          >
            <option value="Name">Name</option>
            <option value="Department">Department</option>
            <option value="Salary">Salary</option>
            <option value="EmployeeID">Employee ID</option>
            <option value="DateOfJoining">Date of Joining</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${searchField}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            onClick={exportSelectedEmployees}
            className="search-export"
          >
            ⬇️ Export Selected Employees
          </button>
        </div>

        
      </div>

      {/* Results Table with Select & Export */}
      <div className="select-all-container">
        <label>
          <input
            type="checkbox"
            checked={
              filteredEmployees.length > 0 &&
              selectedEmployeeIDs.length === filteredEmployees.length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedEmployeeIDs(filteredEmployees.map((emp) => emp.EmployeeID));
              } else {
                setSelectedEmployeeIDs([]);
              }
            }}
          />
          Select All
        </label>
      </div>

      <div className="search-table-card">
        <table className="search-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Date Of Joining</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.EmployeeID}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEmployeeIDs.includes(emp.EmployeeID)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEmployeeIDs([...selectedEmployeeIDs, emp.EmployeeID]);
                        } else {
                          setSelectedEmployeeIDs(
                            selectedEmployeeIDs.filter((id) => id !== emp.EmployeeID)
                          );
                        }
                      }}
                    />
                  </td>
                  <td>{emp.EmployeeID}</td>
                  <td>{emp.Name}</td>
                  <td>{emp.Department}</td>
                  <td>₹{emp.Salary.toLocaleString()}</td>
                  <td>{emp.DateOfJoining}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Search;
