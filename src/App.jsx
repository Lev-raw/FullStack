import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import Showtime from './components/Showtime';
import PerformanceSpaces from './components/PerformanceSpaces';
import LegacyLibrary from './components/LegacyLibrary';
import CulinaryExperience from './components/CulinaryExperience';
import SpaceDirectory from './components/SpaceDirectory';
import PulsePage from './components/PulsePage';
import PulseAdmin from './components/PulseAdmin';
import AboutAdmin from './components/AboutAdmin';
import AdminDashboard from './components/AdminDashboard';
import SiteSectionsAdmin from './components/SiteSectionsAdmin';
import Insider from './components/Insider';
import Footer from './components/Footer';
import './components/Sections.css';
import './HomePage.css';
import AuditoriumBooking from './pages/AuditoriumBooking';
import ShowtimePage from './pages/ShowtimePage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import AboutABG from './components/AboutABG';

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="home-main">
        <Hero />
        <AboutSection />
        <Showtime />
        <PerformanceSpaces />
        <LegacyLibrary />
        <CulinaryExperience />
        <SpaceDirectory />
        <PulsePage />
        <Insider />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/showtime" element={<ShowtimePage />} />
        <Route path="/booking/:showId" element={<AuditoriumBooking />} />
  
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/account" element={<Navigate to="/account/profile" replace />} />
        <Route path='/about'element={<AboutABG/>}></Route>  
        <Route path="/account/:section" element={<AccountPage />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="about" replace />} />
          <Route path="about" element={<AboutAdmin />} />
          <Route path="pulse" element={<PulseAdmin />} />
          <Route path="sections/:sectionKey" element={<SiteSectionsAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
