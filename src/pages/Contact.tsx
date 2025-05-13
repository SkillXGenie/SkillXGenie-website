import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Select, { MultiValue } from 'react-select';

const contactInfo = [
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone",
    details: "+1 (555) 123-4567",
    subDetails: "Mon-Fri from 8am to 5pm"
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    details: "info@skillxgenie.com",
    subDetails: "Online support 24/7"
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Address",
    details: "123 Innovation Drive",
    subDetails: "San Francisco, CA 94105"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Working Hours",
    details: "Monday - Friday",
    subDetails: "9:00 AM - 6:00 PM"
  }
];
const courseOptions = [
  { value: "Foundations of Robotics Engineering", label: "Foundations of Robotics Engineering" },
  { value: "AI & Machine Learning Essentials", label: "AI & Machine Learning Essentials" },
  { value: "IoT Systems Development", label: "IoT Systems Development" },
  { value: "Cybersecurity Fundamentals", label: "Cybersecurity Fundamentals" },
  { value: "Data Analytics & Visualization", label: "Data Analytics & Visualization" },
  { value: "Technology Leadership & Innovation", label: "Technology Leadership & Innovation" }
];

const Contact = () => {
  const [selectedCourses, setSelectedCourses] = useState<{ value: string; label: string }[]>([]);
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with our team</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interested Courses
                  </label>
                  <Select
                    isMulti
                    options={courseOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(selected: MultiValue<{ value: string; label: string }> ) => setSelectedCourses(selected as { value: string; label: string }[])}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your message here..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 gap-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-blue-600">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                  <p className="text-gray-600">{info.details}</p>
                  <p className="text-sm text-gray-500">{info.subDetails}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">FAQ</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">How do I enroll in a course?</h4>
                  <p className="text-gray-600">Simply browse our courses and click the "Enroll Now" button.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">What payment methods do you accept?</h4>
                  <p className="text-gray-600">We accept all major credit cards and PayPal.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Can I get a refund?</h4>
                  <p className="text-gray-600">Yes, within 30 days of purchase if you're not satisfied.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;