import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Globe, Target } from 'lucide-react';

const milestones = [
  {
    year: "2020",
    title: "Foundation",
    description: "Skill X Genie was founded with a vision to transform education"
  },
  {
    year: "2021",
    title: "Expansion",
    description: "Launched our first international programs"
  },
  {
    year: "2022",
    title: "Innovation",
    description: "Introduced AI-powered learning paths"
  },
  {
    year: "2023",
    title: "Growth",
    description: "Reached 10,000+ active students globally"
  }
];

const values = [
  {
    icon: <Award className="h-6 w-6" />,
    title: "Excellence",
    description: "Committed to delivering the highest quality education"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community",
    description: "Building a supportive learning environment"
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Impact",
    description: "Making quality education accessible worldwide"
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Innovation",
    description: "Continuously evolving our teaching methods"
  }
];

const About = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Skill X Genie</h1>
          <p className="text-xl text-gray-600">Transforming education through innovation and excellence</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Founded in 2020, Skill X Genie emerged from a vision to revolutionize education by bridging the gap between
              traditional learning and practical skills. Our platform combines cutting-edge technology with expert
              mentorship to create an unparalleled learning experience.
            </p>
            <p className="text-gray-600">
              Today, we're proud to have helped thousands of students worldwide achieve their professional goals through
              our comprehensive courses and mentorship programs.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
              alt="Team collaboration"
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto text-blue-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="text-blue-600 font-bold text-2xl mb-2">{milestone.year}</div>
                <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                <p className="text-gray-600">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;