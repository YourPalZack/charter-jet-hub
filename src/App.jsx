import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { FlightDetails } from './pages/FlightDetails';
import { SubmitFlight } from './pages/SubmitFlight';
import { HowItWorks } from './pages/HowItWorks';
import { OperatorDirectory } from './pages/OperatorDirectory';
import { OperatorProfile } from './pages/OperatorProfile';
import { AuthProvider } from './contexts/AuthContext';

export function App() {
  console.log('App is rendering');

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <div className="p-4 bg-blue-500 text-white text-center">
            App is loaded successfully!
          </div>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/flights/:categorySlug" element={<CategoryPage />} />
              <Route path="/flight/:id/:slug" element={<FlightDetails />} />
              <Route path="/submit-flight" element={<SubmitFlight />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/charter-operators" element={<OperatorDirectory />} />
              <Route path="/operator/:id/:slug" element={<OperatorProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}