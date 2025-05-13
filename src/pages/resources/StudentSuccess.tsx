import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, BookOpen, Users } from 'lucide-react';

const successStories = [
  {
    name: "Alex Chen",
    role: "Robotics Engineer at SpaceX",
    story: "After completing the Robotics Engineering course, I landed my dream job at SpaceX. The hands-on projects and mentorship were invaluable.",
    course: "Foundations of Robotics Engineering",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    name: "Sarah Johnson",
    role: "AI Research Lead at Google",
    story: "The AI & Machine Learning course gave me the foundation I needed to transition into AI research. Now I'm leading a team at Google.",
    course: "AI & Machine Learning Essentials",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    name: "Michael Park",
    role: "CTO at Tech Startup",
    story: "The Technology Leadership program helped me develop the skills needed to lead a successful tech startup. The network I built was incredible.",
    course: "Technology Leadership & Innovation",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  }
];

const stats = [
  { number: "94%", label: "Employment Rate", icon: <Users className="h-6 w-6" /> },
  { number: "85%", label: "Salary Increase", icon: <Award className="h-6 w-6" /> },
  { number: "92%", label: "Course Completion", icon: <BookOpen className="h-6 w-6" /> }
];

const StudentSuccess = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Success Stories</h1>
          <p className="text-xl text-gray-600">See how our graduates are transforming their careers</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg text-center"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto text-blue-600">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{story.name}</h3>
                    <p className="text-blue-600">{story.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{story.story}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{story.course}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSuccess;