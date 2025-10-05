import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Rocket as RocketLaunch, Brain, Users, Code, Calculator, Briefcase, CheckCircle, Trophy, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import AuthModal from './auth/AuthModal';


const Hero = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    setIsSupabaseConfigured(!!(supabaseUrl && supabaseKey));
  }, []);

  const features = [
    {
      icon: <Code className="h-6 w-6 text-blue-600" />,
      title: "Robotics & Coding",
      description: "Learn programming and robotics through hands-on projects"
    },
    {
      icon: <Calculator className="h-6 w-6 text-blue-600" />,
      title: "Abacus Mastery",
      description: "Develop lightning-fast mental math abilities"
    },
    {
      icon: <Briefcase className="h-6 w-6 text-blue-600" />,
      title: "Professional Skills",
      description: "Build essential workplace and leadership capabilities"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Students" },
    { number: "500+", label: "Expert Mentors" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Partner Schools" }
  ];

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                <TypeAnimation
                  sequence={[
                    'Unlock Real-World Skills',
                    1000,
                    'Master Robotics',
                    1000,
                    'Learn Abacus',
                    1000,
                    'Develop Professionally',
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
                <br />
                <span className="text-blue-600">with Skill X Genie</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Transform your future with hands-on learning experiences in robotics, 
                mathematics, and professional skills. Join our community of learners today!
              </p>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={() => navigate('/Courses')}
                >
                  Explore Courses
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  onClick={() => navigate('/MContact')}
                >
                  Join as Mentor
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2132&q=80"
                alt="Students working with technology"
                className="rounded-lg shadow-2xl"
              />
              
              {/* Learn by Doing Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20, rotateX: 15 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -8, 0], 
                  rotateX: 0 
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 0.5 },
                  rotateX: { duration: 0.8, delay: 0.5 },
                  y: { 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }
                }}
                whileHover={{ 
                  y: -10, 
                  rotateX: 5, 
                  rotateY: 5,
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-2xl transform-gpu perspective-1000 hover:shadow-blue-500/20 transition-all duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.1)'
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full shadow-lg">
                    <RocketLaunch className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Learn by Doing</h3>
                    <p className="text-sm text-blue-600 font-medium">Hands-on Projects</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Expert Mentors Card */}
              <motion.div 
                initial={{ opacity: 0, y: -20, rotateX: -15 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -6, 0], 
                  rotateX: 0 
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 0.7 },
                  rotateX: { duration: 0.8, delay: 0.7 },
                  y: { 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.7
                  }
                }}
                whileHover={{ 
                  y: -10, 
                  rotateX: -5, 
                  rotateY: -5,
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className="absolute -top-10 -right-10 bg-white p-6 rounded-xl shadow-2xl transform-gpu perspective-1000 hover:shadow-green-500/20 transition-all duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.1)'
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Expert Mentors</h3>
                    <p className="text-sm text-green-600 font-medium">Industry Leaders</p>
                  </div>
                </div>
              </motion.div>

              {/* Industry Leaders Card */}
              <motion.div 
                initial={{ opacity: 0, x: 30, rotateY: 15 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  y: [0, -5, 0],
                  rotateY: 0 
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 0.9 },
                  x: { duration: 0.8, delay: 0.9 },
                  rotateY: { duration: 0.8, delay: 0.9 },
                  y: { 
                    duration: 2.8, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.9
                  }
                }}
                whileHover={{ 
                  x: 10, 
                  rotateY: 10, 
                  rotateX: 5,
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className="absolute top-1/2 -right-16 bg-white p-4 rounded-xl shadow-2xl transform-gpu perspective-1000 hover:shadow-purple-500/20 transition-all duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
                  border: '1px solid rgba(147, 51, 234, 0.1)'
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-full shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Industry Leaders</h3>
                    <p className="text-xs text-purple-600 font-medium">Expert Network</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 text-center"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Trusted by Leading Educational Institutions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-70">
              <img src="https://via.placeholder.com/200x80?text=Partner+1" alt="Partner 1" />
              <img src="https://via.placeholder.com/200x80?text=Partner+2" alt="Partner 2" />
              <img src="https://via.placeholder.com/200x80?text=Partner+3" alt="Partner 3" />
              <img src="https://via.placeholder.com/200x80?text=Partner+4" alt="Partner 4" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transform Your Skills</h2>
            <p className="text-xl text-gray-600">Comprehensive learning paths designed for your success</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from our community of learners</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "David", testimonial: "The hands-on learning approach at Skill X Genie transformed my understanding of robotics. The mentors are incredibly supportive and knowledgeable." },
              { name: "Manoj", testimonial: "Skill X Genie's programming courses gave me the confidence to pursue a career in software development. The practical projects were invaluable." },
              { name: "Surya", testimonial: "The business essentials course helped me launch my startup successfully. The mentorship program provided excellent guidance throughout my journey." }
            ].map((student, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{student.name}</h4>
                    <p className="text-gray-600 text-sm">Course Graduate</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "{student.testimonial}"
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl text-blue-100 mb-8">Join thousands of successful students who have transformed their skills with us</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              onClick={() => {
                if (isSupabaseConfigured) {
                  setIsAuthModalOpen(true);
                } else {
                  alert('Authentication is not configured. Please contact support.');
                }
              }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Hero;