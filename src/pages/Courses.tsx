import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Brain, Briefcase, Cpu, Network, LineChart, Users, Rocket, Terminal, Database, Cloud, CircuitBoard } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  icon: JSX.Element;
  category: string;
  learningOutcomes: string[];
  prerequisites: string[];
  targetAudience: string;
  startDate: string;
  maxStudents: number;
}

const courses: Course[] = [
  {
    id: "robotics-101",
    title: "Foundations of Robotics Engineering",
    description: "Master the fundamentals of robotics engineering, including mechanical systems, electronics, and programming. Build your first autonomous robot through hands-on projects.",
    duration: "12 weeks",
    level: "Beginner",
    price: "$599",
    icon: <CircuitBoard className="h-6 w-6" />,
    category: "Robotics & Engineering",
    learningOutcomes: [
      "Design and build basic robotic systems",
      "Program autonomous behaviors",
      "Understand sensor integration",
      "Implement basic motion control"
    ],
    prerequisites: ["Basic mathematics", "No prior programming experience required"],
    targetAudience: "Aspiring robotics engineers and hobbyists",
    startDate: "January 15, 2025",
    maxStudents: 30
  },
  {
    id: "ai-ml-fundamentals",
    title: "AI & Machine Learning Essentials",
    description: "Dive into the world of artificial intelligence and machine learning. Learn to develop intelligent systems and understand the mathematics behind modern AI.",
    duration: "16 weeks",
    level: "Intermediate",
    price: "$799",
    icon: <Brain className="h-6 w-6" />,
    category: "Artificial Intelligence",
    learningOutcomes: [
      "Implement basic ML algorithms",
      "Build neural networks",
      "Process and analyze data",
      "Deploy AI models"
    ],
    prerequisites: ["Python basics", "Fundamental mathematics"],
    targetAudience: "Software developers and data enthusiasts",
    startDate: "February 1, 2025",
    maxStudents: 25
  },
  {
    id: "iot-systems",
    title: "IoT Systems Development",
    description: "Learn to build connected devices and IoT systems. Cover hardware integration, networking, and cloud connectivity for smart devices.",
    duration: "10 weeks",
    level: "Intermediate",
    price: "$649",
    icon: <Cpu className="h-6 w-6" />,
    category: "IoT & Connected Systems",
    learningOutcomes: [
      "Design IoT architectures",
      "Implement sensor networks",
      "Develop cloud connectivity",
      "Create IoT applications"
    ],
    prerequisites: ["Basic electronics", "Programming fundamentals"],
    targetAudience: "Electronics enthusiasts and developers",
    startDate: "March 1, 2025",
    maxStudents: 20
  },
  {
    id: "cybersecurity-essentials",
    title: "Cybersecurity Fundamentals",
    description: "Master the essentials of cybersecurity, including network security, ethical hacking, and security best practices.",
    duration: "14 weeks",
    level: "Beginner",
    price: "$699",
    icon: <Network className="h-6 w-6" />,
    category: "Cybersecurity",
    learningOutcomes: [
      "Understand security principles",
      "Implement security measures",
      "Perform security audits",
      "Deploy security solutions"
    ],
    prerequisites: ["Basic networking knowledge"],
    targetAudience: "IT professionals and security enthusiasts",
    startDate: "April 1, 2025",
    maxStudents: 25
  },
  {
    id: "data-analytics",
    title: "Data Analytics & Visualization",
    description: "Learn to analyze and visualize data using modern tools and techniques. Master data storytelling and business intelligence.",
    duration: "12 weeks",
    level: "Intermediate",
    price: "$699",
    icon: <LineChart className="h-6 w-6" />,
    category: "Data Science",
    learningOutcomes: [
      "Analyze complex datasets",
      "Create compelling visualizations",
      "Build dashboards",
      "Generate insights"
    ],
    prerequisites: ["Basic statistics", "Excel proficiency"],
    targetAudience: "Business analysts and data professionals",
    startDate: "March 15, 2025",
    maxStudents: 30
  },
  {
    id: "tech-leadership",
    title: "Technology Leadership & Innovation",
    description: "Develop leadership skills specifically for technology teams. Learn project management, team dynamics, and innovation strategies.",
    duration: "8 weeks",
    level: "Advanced",
    price: "$899",
    icon: <Users className="h-6 w-6" />,
    category: "Professional Development",
    learningOutcomes: [
      "Lead technical teams",
      "Manage tech projects",
      "Drive innovation",
      "Build high-performing teams"
    ],
    prerequisites: ["5+ years tech experience", "Team leadership exposure"],
    targetAudience: "Tech leads and aspiring CTOs",
    startDate: "May 1, 2025",
    maxStudents: 20
  }
];

const categories = [
  "All",
  "Robotics & Engineering",
  "Artificial Intelligence",
  "IoT & Connected Systems",
  "Cybersecurity",
  "Data Science",
  "Professional Development"
];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const filteredCourses = selectedCategory === "All" 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">2025 Course Catalog</h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your career with our cutting-edge technology courses
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-blue-600">
                  {course.icon}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className="text-sm text-gray-500">{course.duration}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Level:</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Start Date:</span>
                    <span className="font-medium">{course.startDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="font-bold text-blue-600">{course.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4"
                >
                  {expandedCourse === course.id ? 'Show Less' : 'Learn More'}
                </button>

                {expandedCourse === course.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Learning Outcomes</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {course.learningOutcomes.map((outcome, i) => (
                          <li key={i}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {course.prerequisites.map((prereq, i) => (
                          <li key={i}>{prereq}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Target Audience</h4>
                      <p className="text-sm text-gray-600">{course.targetAudience}</p>
                    </div>

                    <div className="pt-4">
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Pre-register Now
                      </button>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Limited to {course.maxStudents} students
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;