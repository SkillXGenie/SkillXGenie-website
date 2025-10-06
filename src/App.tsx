import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Mentorship from './pages/Mentorship';
import About from './pages/About';
import Contact from './pages/Contact';
import NewsletterPopup from './components/popups/NewsletterPopup';
import MContact from './pages/MContact';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';

function App() {
  const [showNewsletter, setShowNewsletter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewsletter(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/MContact" element={<MContact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Routes>
        </main>
        <Footer />

        <NewsletterPopup
          isOpen={showNewsletter}
          onClose={() => setShowNewsletter(false)}
        />
      </div>
    </Router>
  );
}

export default App;