import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Generator from './pages/Generator';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Generator />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;