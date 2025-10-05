import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MessageCircle, Bot, Code, Coffee, FileCode, ChevronDown, ChevronUp, Clock, IndianRupee } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  shortTermPrice: string;
  longTermPrice: string;
  shortTermDuration: string;
  longTermDuration: string;
  icon: JSX.Element;
  category: string;
  shortTermFocus: string;
  longTermFocus: string;
  emoji: string;
}

const courses: Course[] = [
  {
    id: "business-essentials",
    title: "Business Essentials",
    description: "Master the fundamentals of business management, entrepreneurship, and strategic decision-making. This course covers essential topics like business planning, marketing strategies, financial basics, and startup building. Ideal for aspiring entrepreneurs, students, and professionals aiming to enhance their business acumen and develop leadership skills.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    icon: <Briefcase className="h-6 w-6" />,
    category: "Business & Management",
    shortTermFocus: "Quick practical lessons and project-based learning.",
    longTermFocus: "In-depth understanding of business models, case studies, and personal mentorship.",
    emoji: "💼"
  },
  {
    id: "spoken-english",
    title: "Spoken English Mastery",
    description: "Boost your confidence in English communication! Learn grammar, vocabulary, pronunciation, and conversation skills through engaging exercises and real-world practice sessions. Designed for students, professionals, and anyone looking to improve fluency and clarity in speaking.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    icon: <MessageCircle className="h-6 w-6" />,
    category: "Language & Communication",
    shortTermFocus: "Communication basics, accent training, and daily conversations.",
    longTermFocus: "Advanced speaking, presentation skills, interview preparation, and fluency refinement.",
    emoji: "🗣️"
  },
  {
    id: "robotics-fundamentals",
    title: "Robotics Fundamentals",
    description: "Step into the world of robotics — from the basics of sensors and actuators to hands-on robot building and coding. Learn to design, assemble, and program robots using microcontrollers like Arduino and ESP32. Perfect for beginners and enthusiasts looking to start their robotics journey.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    icon: <Bot className="h-6 w-6" />,
    category: "Robotics & Engineering",
    shortTermFocus: "Basic robotics concepts and small project building.",
    longTermFocus: "Advanced projects, automation systems, and AI integration in robotics.",
    emoji: "🤖"
  },
  {
    id: "c-programming",
    title: "C Programming",
    description: "Learn the foundation of all modern programming languages. This course introduces you to data types, loops, arrays, functions, and memory management. Gain a strong understanding of how programming logic works and prepare for advanced languages.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    icon: <Code className="h-6 w-6" />,
    category: "Programming",
    shortTermFocus: "Core syntax and practical exercises.",
    longTermFocus: "Data structures, algorithms, and mini-projects.",
    emoji: "💻"
  },
  {
    id: "cpp-programming",
    title: "C++ Programming",
    description: "Take your coding skills to the next level with C++. Learn object-oriented programming, classes, inheritance, polymorphism, and efficient coding techniques. This course is ideal for those who already know C or want to start with one of the most powerful languages used in software and robotics.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    icon: <FileCode className="h-6 w-6" />,
    category: "Programming",
    shortTermFocus: "Basics of OOP and syntax.",
    longTermFocus: "Advanced concepts and project development.",
    emoji: "💡"
  },
  {
    id: "java-programming",
    title: "Java Programming",
    description: "Build robust, secure, and scalable applications using Java. Learn everything from basic syntax to OOP, file handling, and GUI development. Ideal for those aiming to enter app or software development.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    icon: <Coffee className="h-6 w-6" />,
    category: "Programming",
    shortTermFocus: "Java basics and console programs.",
    longTermFocus: "GUI, APIs, and mini-projects like login systems or apps.",
    emoji: "☕"
  },
  {
    id: "python-programming",
    title: "Python Programming",
    description: "Learn Python, the most beginner-friendly and in-demand language. From simple scripts to automation, data analysis, and AI — this course guides you through hands-on projects that build real skills.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    icon: <Code className="h-6 w-6" />,
    category: "Programming",
    shortTermFocus: "Core Python syntax, loops, and data handling.",
    longTermFocus: "Advanced topics including OOP, libraries (NumPy, Pandas), and AI/ML basics.",
    emoji: "🐍"
  }
];

const categories = [
  "All",
  "Business & Management",
  "Language & Communication",
  "Robotics & Engineering",
  "Programming"
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
            Transform your skills with our comprehensive learning programs
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-md'
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
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {course.icon}
                  </div>
                  <span className="text-2xl">{course.emoji}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-green-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Short-Term</span>
                      </div>
                      <div className="flex items-center font-bold text-green-600">
                        <IndianRupee className="h-4 w-4" />
                        <span>{course.shortTermPrice.replace('₹', '')}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{course.shortTermDuration}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-blue-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Long-Term</span>
                      </div>
                      <div className="flex items-center font-bold text-blue-600">
                        <IndianRupee className="h-4 w-4" />
                        <span>{course.longTermPrice.replace('₹', '')}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{course.longTermDuration}</p>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  className="w-full mt-6 flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                >
                  {expandedCourse === course.id ? (
                    <>
                      Show Less <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Learn More <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>

                {expandedCourse === course.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-4 border-t pt-4"
                  >
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Short-Term Focus ({course.shortTermDuration})
                      </h4>
                      <p className="text-green-700 text-sm">{course.shortTermFocus}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Long-Term Focus ({course.longTermDuration})
                      </h4>
                      <p className="text-blue-700 text-sm">{course.longTermFocus}</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                        Enroll Short-Term
                      </button>
                      <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Enroll Long-Term
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No courses found in this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;