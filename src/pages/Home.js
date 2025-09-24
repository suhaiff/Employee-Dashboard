import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const logoSrc = process.env.PUBLIC_URL + "/logo.png"; // public/logo.png

  return (
    <div className="home-container">
      <header className="hero">
        <div className="nav">
          <Link to="/" className="brand">
            <img src={logoSrc} alt="Company logo" className="brand-logo" />
            <span className="brand-text">Employee Records</span>
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setShowMenu((s) => !s)}
            aria-expanded={showMenu}
            aria-label="Toggle menu"
          >
            {showMenu ? "Close Menu ✖" : "Show Menu ☰"}
          </button>
        </div>

        <div className="hero-content">
          <h1>Welcome to Employee Records System</h1>
          <p className="subtitle">
            Manage, search and analyze employee data — fast, secure and elegant.
          </p>
        </div>
      </header>

      {showMenu && (
        <nav className="menu" role="navigation">
          <ul>
            <li>
              <Link to="/employees" onClick={() => setShowMenu(false)}>
                📋 Employee Details
              </Link>
            </li>
            <li>
              <Link to="/search" onClick={() => setShowMenu(false)}>
                🔍 Search
              </Link>
            </li>
            <li>
              <Link to="/add" onClick={() => setShowMenu(false)}>
                ➕ Add Records
              </Link>
            </li>
            <li>
              <Link to="/delete" onClick={() => setShowMenu(false)}>
                🗑️ Delete Records
              </Link>
            </li>
            <li>
              <Link to="/statistics" onClick={() => setShowMenu(false)}>
                📊 Statistics
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <section className="about">
        <h2>About This Application</h2>
        <p>
          The Employee Records System helps HR teams track employees, salaries,
          and hiring dates with powerful search, sorting, and CSV export features.
          Built with React (frontend) and FastAPI (backend).
        </p>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Employee Records System • Built with React + FastAPI</p>
      </footer>
    </div>
  );
}
