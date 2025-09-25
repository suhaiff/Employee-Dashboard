import React, { useState } from "react";
import "./AddRecord.css";

function AddRecord() {
  const [employee, setEmployee] = useState({
    EmployeeID: "",
    Name: "",
    Department: "",
    Salary: "",
    DateOfJoining: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Handle single input change
  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  // ✅ Submit new employee with duplicate check
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !employee.EmployeeID ||
      !employee.Name ||
      !employee.Department ||
      !employee.Salary ||
      !employee.DateOfJoining
    ) {
      setMessage("⚠️ All fields are mandatory!");
      return;
    }

    const newEmp = {
      EmployeeID: parseInt(employee.EmployeeID, 10),
      Name: employee.Name.trim(),
      Department: employee.Department.trim(),
      Salary: parseFloat(employee.Salary),
      DateOfJoining: employee.DateOfJoining,
    };

    try {
      const res = await fetch("https://employee-backend-k5pq.onrender.com/employees");
      const existing = await res.json();

      const duplicateById = existing.some(
        (emp) => Number(emp.EmployeeID) === newEmp.EmployeeID
      );
      const duplicateByAll = existing.some(
        (emp) =>
          emp.Name.trim().toLowerCase() === newEmp.Name.toLowerCase() &&
          emp.Department.trim().toLowerCase() === newEmp.Department.toLowerCase() &&
          emp.DateOfJoining === newEmp.DateOfJoining
      );

      if (duplicateById || duplicateByAll) {
        setMessage("❌ Employee already exists. Duplicate prevented.");
        return;
      }

      const addRes = await fetch("https://employee-backend-k5pq.onrender.com/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmp),
      });

      const data = await addRes.json();
      if (data.error) {
        setMessage(`❌ ${data.error}`);
      } else {
        setMessage("✅ Employee added successfully!");
        setEmployee({
          EmployeeID: "",
          Name: "",
          Department: "",
          Salary: "",
          DateOfJoining: "",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding employee");
    }
  };

  // ✅ Bulk import with header check + server validation
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Quick client-side header check
    const text = await file.text();
    const firstLine = text.split(/\r\n|\n/)[0];
    const headers = firstLine.split(",").map((h) => h.trim());
    const expected = [
      "EmployeeID",
      "Name",
      "Department",
      "Salary",
      "DateOfJoining",
    ];
    if (JSON.stringify(headers) !== JSON.stringify(expected)) {
      setMessage(`❌ CSV header mismatch. Expected: ${expected.join(",")}`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://employee-backend-k5pq.onrender.com/employees", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Import failed" }));
        setMessage(`❌ Import error: ${err.detail || "Server error"}`);
        return;
      }
      const result = await res.json();
      let msg = `✅ Imported ${result.added} employees.`;
      if (result.skipped && result.skipped > 0) {
        msg += ` Skipped ${result.skipped} rows. Check console for details.`;
        console.warn("Skipped rows:", result.skippedRows);
      }
      setMessage(msg);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error importing employees");
    }
  };

  return (
    <div className="add-container">
      {/* Navbar */}
      <div className="add-navbar">
        <div className="logo">Employee Records</div>
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

      {/* Header */}
      <header className="add-header">
        <h1>Add New Employee</h1>
        <p>Find employee details easily.</p>
      </header>

      {/* Form Section */}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="EmployeeID"
            placeholder="Employee ID"
            value={employee.EmployeeID}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Name"
            placeholder="Name"
            value={employee.Name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Department"
            placeholder="Department"
            value={employee.Department}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="Salary"
            placeholder="Salary"
            value={employee.Salary}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="DateOfJoining"
            value={employee.DateOfJoining}
            onChange={handleChange}
            required
          />
          <button type="submit" className="add-btn">
            Add Employee
          </button>
        </form>

        {/* Bulk Import */}
        <div className="import-section">
          <h3>Bulk Import Employees</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="file-input"
          />
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default AddRecord;
