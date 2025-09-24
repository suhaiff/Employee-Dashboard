import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import EmployeeDetails from "./pages/EmployeeDetails";
import Search from "./pages/Search";
import AddRecord from "./pages/AddRecord";
import DeleteRecord from "./pages/DeleteRecord";
import Statistics from "./pages/Statistics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employees" element={<EmployeeDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/add" element={<AddRecord />} />
        <Route path="/delete" element={<DeleteRecord />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
}

export default App;
