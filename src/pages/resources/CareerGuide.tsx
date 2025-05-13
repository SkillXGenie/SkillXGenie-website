import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Target, BookOpen, Award, ArrowRight } from 'lucide-react';

const careerPaths = [
  {
    title: "Robotics Engineer",
    description: "Design, build, and maintain robotic systems and automated equipment.",
    skills: ["Programming", "Electronics", "Mechanical Design", "AI Integration"],
    salary: "$85,000 - $150,000",
    growth: "15% projected growth",
    icon: <Briefcase className="h-6 w-6" />
  },
  {
    title: "AI/ML Engineer",
    description: "Develop and implement machine learning models and AI solutions.",
    skills: ["Python", "Deep Learning", "Data Science", "Cloud Computing"],
    salary: "$95,000 - $165,000",
    growth: "22% projected growth",
    icon: <Target className="h-6 w-6" />
  },
  {
    title: "Tech Lead",
    description: "Lead technical teams and drive technology strategy.",
    skills: ["Leadership", "Architecture", "Project Management", "Communication"],
    salary: "$120,000 - $200,000",
    growth: "12% projected growth",
    icon: <Award className="h-6 w-6" />
  }
];

const CareerGuide = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Guide</h1>
          <p className="text-xl text-gray-600">Explore career paths and opportunities in technology</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {careerPaths.map((path, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-blue-600">
                  {path.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{path.title}</h3>
                <p className="text-gray-600 mb-4">{path.description}</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {path.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Salary Range</h4>
                    <p className="text-gray-600">{path.salary}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Growth Potential</h4>
                    <p className="text-green-600">{path.growth}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Career Development Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Resume Building</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  Technical resume templates
                </li>
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  Skills highlighting guide
                </li>
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  Project portfolio tips
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Interview Preparation</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  Technical interview guides
                </li>
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  Behavioral question practice
                </li>
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  Mock interview sessions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuide;