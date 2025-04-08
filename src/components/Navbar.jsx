import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://d3v0px0pttie1i.cloudfront.net/uploads/branding/logo/e51dfbdc-ab14-4b23-94e8-b9e5eda640d4/425ec81c.png" 
              alt="Pillar Logo" 
              className="h-8"
            />
            <span className="text-xl font-semibold text-gray-900">
              Kanban Generator
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}