import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Select, { MultiValue } from 'react-select';
import { supabase } from '../lib/supabaseClient';

const contactInfo = [
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone",
    details: "+91 8008615692",
    subDetails: "Mon-Fri from 9am to 6pm"
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    details: "skillxgenie@gmail.com",
    subDetails: "Online support 24/7"
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Address",
    details: "Palamaner, agraharam road",
    subDetails: "Andhra Pradesh, India"
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('Contact form submission (demo mode):', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSelectedCourses([]);
        setIsSubmitting(false);
        return;
      }

      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      // Prepare submission data
      const submissionData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject + (selectedCourses.length > 0 ? ` | Interested in: ${selectedCourses.map(c => c.label).join(', ')}` : ''),
        message: formData.message,
        user_id: user?.id || null,
        submitted_at: new Date().toISOString()
      };

      // Save to database
      const { error } = await supabase
        .from('contact_submissions')
        .insert([submissionData]);

      if (error) {
        console.error('Error submitting contact form:', error);
        alert('Failed to submit your message. Please try again or contact us directly.');
      } else {
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSelectedCourses([]);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to submit your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
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
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
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
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your message here..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
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