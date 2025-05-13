import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Select from 'react-select';
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

const experienceOptions = [
  { value: "less_than_1", label: "Less than 1 year" },
  { value: "1_plus", label: "1+ years" },
  { value: "5_plus", label: "5+ years" },
  { value: "10_plus", label: "10+ years" }
];

const MContact = () => {
  const [selectedExperience, setSelectedExperience] = useState("");
  const [cv, setCv] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCv(e.target.files[0]);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Mentor</h1>
          <p className="text-xl text-gray-600">Join our mentorship program</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Mentorship Application</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <Select options={experienceOptions} classNamePrefix="select" onChange={(option) => setSelectedExperience(option ? option.value : "")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload CV/Resume</label>
                  <input type="file" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" onChange={handleFileChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About Yourself</label>
                  <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Tell us about yourself..." />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Apply Now</button>
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
                  <h4 className="font-medium text-gray-900">Who can apply to become a mentor?</h4>
                  <p className="text-gray-600">Anyone with expertise in robotics, AI, IoT, cybersecurity, or related fields can apply.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Do I need prior mentoring experience to apply?</h4>
                  <p className="text-gray-600">No, prior mentoring experience is not required. However, having industry experience and strong communication skills will be beneficial.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">What is the time commitment for mentors?</h4>
                  <p className="text-gray-600">The time commitment is flexible based on your availability.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MContact;

