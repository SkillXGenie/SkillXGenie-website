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

// Resource Pages
import Blog from './pages/resources/Blog';
import StudentSuccess from './pages/resources/StudentSuccess';
import CareerGuide from './pages/resources/CareerGuide';
import HelpCenter from './pages/resources/HelpCenter';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiePolicy from './pages/legal/CookiePolicy';
import Accessibility from './pages/legal/Accessibility';

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
            
            {/* Resource Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/student-success" element={<StudentSuccess />} />
            <Route path="/career-guide" element={<CareerGuide />} />
            <Route path="/help-center" element={<HelpCenter />} />
            
            {/* Legal Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
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