import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, ResponsiveContainer, Cell, LabelList
} from "recharts";
import { Link } from "react-router-dom";
import "./Statistics.css";

const Statistics = () => {
  const [employees, setEmployees] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState("Overall");

  useEffect(() => {
    axios
      .get("http://localhost:8000/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  // Filter employees for charts based on gender filter
  const filteredEmployees = employees.filter(emp =>
    genderFilter === "Overall" ? true : emp.Gender === genderFilter
  );

  // KPI Cards
  const maleCount = employees.filter(e => e.Gender === "Male").length;
  const femaleCount = employees.filter(e => e.Gender === "Female").length;
  const totalCount = maleCount + femaleCount;
  const malePercent = ((maleCount / totalCount) * 100).toFixed(1);
  const femalePercent = ((femaleCount / totalCount) * 100).toFixed(1);

  // Employees by Department
  const employeesByDept = filteredEmployees.reduce((acc, emp) => {
    acc[emp.Department] = (acc[emp.Department] || 0) + 1;
    return acc;
  }, {});

  const deptColors = {
    HR: '#E57373',
    Finance: '#64B5F6',
    IT: '#4DB6AC',
    Marketing: '#FFD54F',
    Operations: '#81C784',
    Sales: '#FFB74D',
    Admin: '#9575CD',
  };

  const dataDept = Object.entries(employeesByDept).map(([dept, count]) => ({ dept, count }));

  // Average Salary by Department
  const avgSalaryByDept = Object.entries(
    filteredEmployees.reduce((acc, emp) => {
      if (!acc[emp.Department]) acc[emp.Department] = { total: 0, count: 0 };
      acc[emp.Department].total += parseFloat(emp.Salary) || 0;
      acc[emp.Department].count += 1;
      return acc;
    }, {})
  ).map(([dept, { total, count }]) => ({
    department: dept,
    avgSalary: total / count,
  }));

  // Joining Trend
  const joiningTrend = filteredEmployees.reduce((acc, emp) => {
    const year = new Date(emp.DateOfJoining).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  // Salary Distribution
  const salaryBins = [0, 20000, 40000, 60000, 80000, 100000];
  const salaryDistribution = salaryBins.map((min, i) => {
    const max = salaryBins[i + 1];
    if (!max) return null;
    const count = filteredEmployees.filter(
      (e) => e.Salary >= min && e.Salary < max
    ).length;
    return { range: `${min}-${max}`, count };
  }).filter(Boolean);

  // Departmental Headcount Over Time
  const deptOverTime = filteredEmployees.reduce((acc, emp) => {
    const year = new Date(emp.DateOfJoining).getFullYear();
    if (!acc[year]) acc[year] = {};
    acc[year][emp.Department] = (acc[year][emp.Department] || 0) + 1;
    return acc;
  }, {});

  const deptData = Object.entries(deptOverTime).map(([year, depts]) => ({
    year,
    ...depts,
  }));

  const departments = [...new Set(filteredEmployees.map((e) => e.Department))];

  // Top Paid Employees
  const topPaidEmployees = [...filteredEmployees]
    .sort((a, b) => b.Salary - a.Salary)
    .slice(0, 5);

  return (
    <div className="statistics-container">
      {/* 🔹 Navbar */}
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
      <header className="statistics-header">
        <h1>Stats of the Crew</h1>
        <p>Can find it out whole statistics of the team here.</p>
      </header>

      {/* KPI Cards */}
      <div className="statistics-kpi-cards">
      <div className="kpi-card">Total Employees: {totalCount}</div>
        <div className="kpi-card">Male Employees: {maleCount}</div>
        <div className="kpi-card">Female Employees: {femaleCount}</div>
        <div className="kpi-card">
          <div className="kpi-grid">
            <div>Male: {malePercent}%</div>
            <div>Female: {femalePercent}%</div>
          </div>
        </div>
      </div>

      {/* Gender Filter */}
      <div className="gender-filter">
        {["Overall", "Male", "Female"].map((g) => (
          <label key={g} style={{ marginRight: "15px" }}>
            <input
              type="radio"
              name="gender"
              value={g}
              checked={genderFilter === g}
              onChange={() => setGenderFilter(g)}
            />
            {g}
          </label>
        ))}
      </div>

      <div className="chartgrids">
        {/* Employees by Department */}
        <div className="chart-section">
          <h2>🧮 Employees by Department</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dataDept}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count">
                {dataDept.map((entry) => (
                  <Cell key={entry.dept} fill={deptColors[entry.dept] || '#8884d8'} />
                ))}
                <LabelList
                  dataKey="count"
                  position="top"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Avg Salary by Department */}
        <div className="chart-section">
          <h2>💰 Average Salary by Department</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={avgSalaryByDept}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 0,
                  }).format(Math.round(value))
                }
              />
              <Bar dataKey="avgSalary">
                {avgSalaryByDept.map((entry) => (
                  <Cell
                    key={entry.department}
                    fill={deptColors[entry.department] || "#8884d8"}
                  />
                ))}
                <LabelList
                  dataKey="avgSalary"
                  position="top"
                  formatter={(value) =>
                    new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                    }).format(Math.round(value))
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>


        {/* Joining Trend */}
        <div className="chart-section">
          <h2>📅 Joining Trend Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={Object.entries(joiningTrend).map(([year, count]) => ({ year, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#FF5722" >
                <LabelList dataKey="count" position="top" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Salary Distribution */}
        <div className="chart-section">
          <h2>📈 Salary Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#9C27B0" >
              <LabelList
                  dataKey="count"
                  position="top"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Departmental Headcount Over Time */}
        <div className="chart-section">
          <h2>🏢 Departmental Headcount Over Time</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              {departments.map((dept, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={dept}
                  stroke={["#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#FF5722"][i % 5]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Paid Employees */}
        <div className="chart-section">
          <h2>🔥 Top 5 Highest Paid Employees</h2>
          <table className="statistics-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {topPaidEmployees.map((emp, i) => (
                <tr key={i}>
                  <td>{emp.Name}</td>
                  <td>{emp.Department}</td>
                  <td>₹{emp.Salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
