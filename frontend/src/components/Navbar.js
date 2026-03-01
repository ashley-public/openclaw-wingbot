import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar navbar-light bg-white border-bottom px-3 py-2">
      <div className="navbar-brand mb-0 fw-bold d-flex align-items-center">
        <img src="/logo.png" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        <span>Lobby</span>
      </div>
      <span className="badge status-live">Live</span>
    </nav>
  );
}