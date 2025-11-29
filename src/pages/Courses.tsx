import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, IndianRupee, Users, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { courses, categories, Course } from '../data/coursesData';

const Courses = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [enrollmentCounts, setEnrollmentCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  useEffect(() => {
    fetchEnrollmentCounts();
  }, []);

  const fetchEnrollmentCounts = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return;
      }

      // Get enrollment counts for each course
      const { data, error } = await supabase
        .from('user_courses')
        .select('course_id');

      if (error) {
        console.error('Error fetching enrollment counts:', error);
        return;
      }

      // Count enrollments per course
      const counts: {[key: string]: number} = {};
      data?.forEach((enrollment: any) => {
        counts[enrollment.course_id] = (counts[enrollment.course_id] || 0) + 1;
      });

      setEnrollmentCounts(counts);
    } catch (error) {
      console.error('Error fetching enrollment counts:', error);
    }
  };

  const filteredCourses = selectedCategory === "All" 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getPopupPosition = () => {
    const popupWidth = 384; // max-w-md = 384px
    const popupHeight = 300; // approximate height
    const margin = 20;
    
    let left = mousePosition.x + 20;
    let top = mousePosition.y - 100;
    
    // Adjust if popup would go off right edge
    if (left + popupWidth > windowSize.width - margin) {
      left = mousePosition.x - popupWidth - 20;
    }
    
    // Adjust if popup would go off left edge
    if (left < margin) {
      left = margin;
    }
    
    // Adjust if popup would go off top edge
    if (top < margin) {
      top = margin;
    }
    
    // Adjust if popup would go off bottom edge
    if (top + popupHeight > windowSize.height - margin) {
      top = windowSize.height - popupHeight - margin;
    }
    
    return { left, top };
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50" onMouseMove={handleMouseMove}>
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
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredCourse(course.id)}
              onMouseLeave={() => setHoveredCourse(null)}
              onClick={() => handleCourseClick(course.id)}
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
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{course.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4" />
                      <span className="text-sm ml-1">{enrollmentCounts[course.id] || 0}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {course.title}
                </h3>
                
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{course.totalHours} • {course.lectures} lectures</span>
                </div>
                
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

                <div className="mt-6 text-center">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                    View Course Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hover Description Popup */}
        <AnimatePresence>
          {hoveredCourse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 bg-white p-6 rounded-xl shadow-2xl border max-w-md"
              style={{
                left: getPopupPosition().left,
                top: getPopupPosition().top,
                pointerEvents: 'none'
              }}
            >
              {(() => {
                const course = courses.find(c => c.id === hoveredCourse);
                if (!course) return null;
                
                return (
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{course.emoji}</span>
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{enrollmentCounts[course.id] || 0} students</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{course.totalHours}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

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