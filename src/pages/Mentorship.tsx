import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, CheckCircle } from 'lucide-react';

const mentors = [
  {
    name: "Dr. Sarah Chen",
    expertise: "Robotics & AI",
    experience: "15+ years",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    name: "Prof. Michael Rodriguez",
    expertise: "Mathematics & Abacus",
    experience: "20+ years",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    name: "Lisa Thompson",
    expertise: "Professional Development",
    experience: "12+ years",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  }
];

const benefits = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "1-on-1 Guidance",
    description: "Personalized attention and feedback from industry experts"
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Industry Experience",
    description: "Learn from professionals with proven track records"
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Flexible Schedule",
    description: "Sessions that fit your timeline and availability"
  }
];

const Mentorship = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentorship Program</h1>
          <p className="text-xl text-gray-600">Learn directly from industry experts</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto text-blue-600">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Mentors</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {mentors.map((mentor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">{mentor.name}</h3>
              <p className="text-blue-600 font-medium mb-2">{mentor.expertise}</p>
              <p className="text-gray-600">{mentor.experience} experience</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mentorship;