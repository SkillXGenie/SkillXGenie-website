import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import AuthModal from '../components/auth/AuthModal';
import { courses } from '../data/coursesData';
import { 
  Star, 
  Users, 
  Clock, 
  IndianRupee, 
  ShoppingCart, 
  Play, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle
} from 'lucide-react';

interface CourseContent {
  [key: string]: {
    shortTerm: {
      modules: Array<{
        title: string;
        lectures: Array<{
          title: string;
          duration: string;
          type?: 'quiz' | 'project';
          questions?: number;
        }>;
      }>;
      totalModules: number;
      totalLectures: number;
      totalDuration: string;
    };
    longTerm: {
      modules: number;
      lectures: number;
      duration: string;
      description: string;
    };
  };
}

const courseContent: CourseContent = {
  "business-essentials": {
    shortTerm: {
      modules: [
        {
          title: "Module 1: Introduction to Business",
          lectures: [
            { title: "What is Business & Why it Matters", duration: "05:12" },
            { title: "Types of Businesses Explained", duration: "04:36" },
            { title: "Understanding Market Needs", duration: "06:25" },
            { title: "Quiz 1: Basics of Business", duration: "5 Questions", type: "quiz", questions: 5 }
          ]
        },
        {
          title: "Module 2: Marketing Essentials",
          lectures: [
            { title: "Branding & Positioning", duration: "07:10" },
            { title: "Digital Marketing Fundamentals", duration: "08:15" },
            { title: "Social Media Promotion Tips", duration: "05:20" },
            { title: "Quiz 2: Marketing Strategy", duration: "5 Questions", type: "quiz", questions: 5 }
          ]
        },
        {
          title: "Module 3: Finance & Budgeting",
          lectures: [
            { title: "Business Budget Planning", duration: "08:30" },
            { title: "Cost vs Revenue Explained", duration: "06:12" },
            { title: "Break-Even Analysis", duration: "05:00" },
            { title: "Quiz 3: Understanding Business Finance", duration: "4 Questions", type: "quiz", questions: 4 }
          ]
        },
        {
          title: "Module 4: Entrepreneurship Skills",
          lectures: [
            { title: "How to Start a Small Business", duration: "07:10" },
            { title: "Decision Making & Risk Taking", duration: "05:50" },
            { title: "Pitching & Presentation Skills", duration: "06:00" },
            { title: "Final Assessment", duration: "1 Mini Project", type: "project" }
          ]
        }
      ],
      totalModules: 4,
      totalLectures: 24,
      totalDuration: "4h 20m"
    },
    longTerm: {
      modules: 8,
      lectures: 60,
      duration: "20h",
      description: "Modules include detailed sections on leadership, business ethics, marketing analytics, entrepreneurship case studies, project management, and startup development. Each module ends with case-based quizzes and a capstone project: Build Your Own Startup Plan."
    }
  },
  "spoken-english": {
    shortTerm: {
      modules: [
        {
          title: "Module 1: Foundation",
          lectures: [
            { title: "Grammar Basics Refresher", duration: "06:00" },
            { title: "Common Mistakes in English", duration: "05:15" },
            { title: "Vocabulary Building", duration: "04:50" }
          ]
        },
        {
          title: "Module 2: Daily Communication",
          lectures: [
            { title: "Greetings & Introductions", duration: "03:50" },
            { title: "Conversational Practice (with Examples)", duration: "07:30" },
            { title: "Small Talk Techniques", duration: "05:00" }
          ]
        },
        {
          title: "Module 3: Accent & Pronunciation",
          lectures: [
            { title: "Phonetics Simplified", duration: "06:20" },
            { title: "Accent Neutralization", duration: "07:10" },
            { title: "Listening & Speaking Exercises", duration: "05:50" }
          ]
        },
        {
          title: "Module 4: Practical Fluency",
          lectures: [
            { title: "Real-Life Speaking Scenarios", duration: "08:00" },
            { title: "Interview & Presentation Skills", duration: "06:45" },
            { title: "Final Assessment: Recorded Task", duration: "Project", type: "project" }
          ]
        }
      ],
      totalModules: 4,
      totalLectures: 28,
      totalDuration: "4h"
    },
    longTerm: {
      modules: 8,
      lectures: 70,
      duration: "25h",
      description: "Includes deep conversational training, advanced grammar, public speaking, debate sessions, group discussions, and a fluency evaluation project at the end."
    }
  },
  "robotics-fundamentals": {
    shortTerm: {
      modules: [
        {
          title: "Module 1: Introduction to Robotics",
          lectures: [
            { title: "What is a Robot?", duration: "05:15" },
            { title: "Components of a Robot", duration: "06:00" },
            { title: "Basic Robotics Terminology", duration: "05:20" },
            { title: "Quiz 1", duration: "Quiz", type: "quiz" }
          ]
        },
        {
          title: "Module 2: Electronics & Sensors",
          lectures: [
            { title: "Understanding Microcontrollers", duration: "06:30" },
            { title: "Sensor Types (IR, Ultrasonic, Line, etc.)", duration: "08:10" },
            { title: "Interfacing Basics", duration: "05:20" }
          ]
        },
        {
          title: "Module 3: Motors & Movement",
          lectures: [
            { title: "DC, Servo, Stepper Motors", duration: "06:40" },
            { title: "Motor Drivers Explained", duration: "05:10" },
            { title: "Building Basic Motion Control", duration: "08:15" }
          ]
        },
        {
          title: "Module 4: Building a Line Follower",
          lectures: [
            { title: "Code Walkthrough (Arduino)", duration: "09:00" },
            { title: "Testing & Calibration", duration: "07:20" },
            { title: "Final Project: Line Following Bot", duration: "Project", type: "project" }
          ]
        }
      ],
      totalModules: 4,
      totalLectures: 25,
      totalDuration: "4h 30m"
    },
    longTerm: {
      modules: 8,
      lectures: 80,
      duration: "30h",
      description: "Covers advanced robotics topics: IoT integration, AI in Robotics, Obstacle Avoidance, Bluetooth Control, Autonomous Navigation, and Final Capstone Project (ESP32 Smart Robot)."
    }
  },
  "c-programming": {
    shortTerm: {
      modules: [
        {
          title: "Module 1: Introduction to C",
          lectures: [
            { title: "What is C & Why Learn It", duration: "04:30" },
            { title: "Setting up Compiler", duration: "06:10" },
            { title: "Syntax & Structure", duration: "05:00" }
          ]
        },
        {
          title: "Module 2: Variables & Control Flow",
          lectures: [
            { title: "Data Types & Operators", duration: "06:45" },
            { title: "If-Else, Loops", duration: "07:00" },
            { title: "Quiz 1", duration: "Quiz", type: "quiz" }
          ]
        },
        {
          title: "Module 3: Functions & Arrays",
          lectures: [
            { title: "Function Basics", duration: "06:30" },
            { title: "Arrays & Strings", duration: "07:10" },
            { title: "Practical Coding Examples", duration: "08:00" }
          ]
        },
        {
          title: "Module 4: Mini Project",
          lectures: [
            { title: "Building a Calculator in C", duration: "10:00" },
            { title: "Debugging Tips", duration: "04:20" }
          ]
        }
      ],
      totalModules: 4,
      totalLectures: 22,
      totalDuration: "3h 45m"
    },
    longTerm: {
      modules: 9,
      lectures: 70,
      duration: "25h",
      description: "Covers advanced data structures (Stacks, Queues, Linked Lists), memory management, file handling, and final project: Student Management System in C."
    }
  },
  "cpp-programming": {
    shortTerm: {
      modules: [
        {
          title: "Module 1: C++ Basics",
          lectures: [
            { title: "C++ vs C", duration: "05:00" },
            { title: "Setup & First Program", duration: "06:15" },
            { title: "Syntax Overview", duration: "04:30" }
          ]
        },
        {
          title: "Module 2: OOP Concepts",
          lectures: [
            { title: "Classes & Objects", duration: "06:20" },
            { title: "Inheritance & Polymorphism", duration: "08:00" },
            { title: "Quiz 1", duration: "Quiz", type: "quiz" }
          ]
        },
        {
          title: "Module 3: Functions & Arrays",
          lectures: [
            { title: "Templates, Overloading", duration: "07:30" },
            { title: "Arrays & Vectors", duration: "06:50" }
          ]
        },
        {
          title: "Module 4: Mini Project",
          lectures: [
            { title: "Inventory Management Program", duration: "09:00" }
          ]
        }
      ],
      totalModules: 4,
      totalLectures: 25,
      totalDuration: "4h"
    },
    longTerm: {
      modules: 8,
      lectures: 80,
      duration: "28h",
      description: "Covers file handling, STL, data structures, algorithms, and advanced OOP applications. Final capstone project: Banking System Simulation."
    }
  },
  "java-programming": {
    shortTerm: {
      modules: [
        {
          title: "Module 1: Introduction to Java",
          lectures: [
            { title: "Installing Java & IDE", duration: "05:00" },
            { title: "Data Types & Variables", duration: "06:15" },
            { title: "Control Statements", duration: "06:00" }
          ]
        },
        {
          title: "Module 2: OOP in Java",
          lectures: [
            { title: "Classes & Objects", duration: "07:10" },
            { title: "Inheritance & Interfaces", duration: "08:00" },
            { title: "Quiz 1", duration: "Quiz", type: "quiz" }
          ]
        },
        {
          title: "Module 3: File Handling & Exceptions",
          lectures: [
            { title: "Try-Catch Explained", duration: "05:40" },
            { title: "File I/O Operations", duration: "07:30" }
          ]
        },
        {
          title: "Module 4: Mini Project",
          lectures: [
            { title: "Create a Login System", duration: "10:00" }
          ]
        }
      ],
      totalModules: 4,
      totalLectures: 26,
      totalDuration: "4h 20m"
    },
    longTerm: {
      modules: 8,
      lectures: 85,
      duration: "30h",
      description: "Includes GUI (Swing/JavaFX), database integration, multithreading, API connections, and final capstone project: Library Management System."
    }
  },
  "python-programming": {
    shortTerm: {
      modules: [
        {
          title: "Module 1: Introduction to Python",
          lectures: [
            { title: "What is Python & Setup", duration: "04:20" },
            { title: "Data Types & Variables", duration: "05:30" },
            { title: "Loops & Conditionals", duration: "06:00" }
          ]
        },
        {
          title: "Module 2: Functions & Lists",
          lectures: [
            { title: "Functions Basics", duration: "07:10" },
            { title: "Lists, Tuples, Dictionaries", duration: "06:45" }
          ]
        },
        {
          title: "Module 3: Libraries & File Handling",
          lectures: [
            { title: "NumPy & Pandas Basics", duration: "08:30" },
            { title: "File I/O Operations", duration: "07:15" }
          ]
        },
        {
          title: "Module 4: Mini Project",
          lectures: [
            { title: "Build a To-Do App", duration: "09:20" }
          ]
        }
      ],
      totalModules: 4,
      totalLectures: 28,
      totalDuration: "4h 30m"
    },
    longTerm: {
      modules: 8,
      lectures: 85,
      duration: "32h",
      description: "Covers OOP, Flask web apps, automation, data visualization (Matplotlib), and AI/ML intro project: Predictive Data Analysis."
    }
  }
};

const courses = [
  {
    id: "business-essentials",
    title: "Business Essentials",
    description: "Master the fundamentals of business management, entrepreneurship, and strategic decision-making. This course covers essential topics like business planning, marketing strategies, financial basics, and startup building. Ideal for aspiring entrepreneurs, students, and professionals aiming to enhance their business acumen and develop leadership skills.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    category: "Business & Management",
    shortTermFocus: "Quick practical lessons and project-based learning.",
    longTermFocus: "In-depth understanding of business models, case studies, and personal mentorship.",
    emoji: "💼",
    rating: 4.8,
    students: 0,
    totalHours: "4h 20m",
    lectures: 24,
    instructor: "SkillXGenie",
    lastUpdated: "December 2024",
    language: "English",
    level: "Beginner"
  },
  {
    id: "spoken-english",
    title: "Spoken English Mastery",
    description: "Boost your confidence in English communication! Learn grammar, vocabulary, pronunciation, and conversation skills through engaging exercises and real-world practice sessions. Designed for students, professionals, and anyone looking to improve fluency and clarity in speaking.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    category: "Language & Communication",
    shortTermFocus: "Communication basics, accent training, and daily conversations.",
    longTermFocus: "Advanced speaking, presentation skills, interview preparation, and fluency refinement.",
    emoji: "🗣️",
    rating: 4.7,
    students: 0,
    totalHours: "4h",
    lectures: 28,
    instructor: "SkillXGenie",
    lastUpdated: "December 2024",
    language: "English",
    level: "All Levels"
  },
  {
    id: "robotics-fundamentals",
    title: "Robotics Fundamentals",
    description: "Step into the world of robotics — from the basics of sensors and actuators to hands-on robot building and coding. Learn to design, assemble, and program robots using microcontrollers like Arduino and ESP32. Perfect for beginners and enthusiasts looking to start their robotics journey.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    category: "Robotics & Engineering",
    shortTermFocus: "Basic robotics concepts and small project building.",
    longTermFocus: "Advanced projects, automation systems, and AI integration in robotics.",
    emoji: "🤖",
    rating: 4.9,
    students: 0,
    totalHours: "4h 30m",
    lectures: 25,
    instructor: "SkillXGenie",
    lastUpdated: "December 2024",
    language: "English",
    level: "Beginner"
  },
  {
    id: "c-programming",
    title: "C Programming",
    description: "Learn the foundation of all modern programming languages. This course introduces you to data types, loops, arrays, functions, and memory management. Gain a strong understanding of how programming logic works and prepare for advanced languages.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    category: "Programming",
    shortTermFocus: "Core syntax and practical exercises.",
    longTermFocus: "Data structures, algorithms, and mini-projects.",
    emoji: "💻",
    rating: 4.6,
    students: 0,
    totalHours: "3h 45m",
    lectures: 22,
    instructor: "SkillXGenie",
    lastUpdated: "December 2024",
    language: "English",
    level: "Beginner"
  },
  {
    id: "cpp-programming",
    title: "C++ Programming",
    description: "Take your coding skills to the next level with C++. Learn object-oriented programming, classes, inheritance, polymorphism, and efficient coding techniques. This course is ideal for those who already know C or want to start with one of the most powerful languages used in software and robotics.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    category: "Programming",
    shortTermFocus: "Basics of OOP and syntax.",
    longTermFocus: "Advanced concepts and project development.",
    emoji: "💡",
    rating: 4.7,
    students: 0,
    totalHours: "4h",
    lectures: 25,
    instructor: "SkillXGenie",
    lastUpdated: "December 2024",
    language: "English",
    level: "Intermediate"
  },
  {
    id: "java-programming",
    title: "Java Programming",
    description: "Build robust, secure, and scalable applications using Java. Learn everything from basic syntax to OOP, file handling, and GUI development. Ideal for those aiming to enter app or software development.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    category: "Programming",
    shortTermFocus: "Java basics and console programs.",
    longTermFocus: "GUI, APIs, and mini-projects like login systems or apps.",
    emoji: "☕",
    rating: 4.8,
    students: 0,
    totalHours: "4h 20m",
    lectures: 26,
    instructor: "SkillXGenie",
    lastUpdated: "December 2024",
    language: "English",
    level: "Beginner"
  },
  {
    id: "python-programming",
    title: "Python Programming",
    description: "Learn Python, the most beginner-friendly and in-demand language. From simple scripts to automation, data analysis, and AI — this course guides you through hands-on projects that build real skills.",
    shortTermPrice: "₹299",
    longTermPrice: "₹2,999",
    shortTermDuration: "30 Days",
    longTermDuration: "3-4 Months",
    category: "Programming",
    shortTermFocus: "Core Python syntax, loops, and data handling.",
    longTermFocus: "Advanced topics including OOP, libraries (NumPy, Pandas), and AI/ML basics.",
    emoji: "🐍",
    rating: 4.9,
    students: 0,
    totalHours: "4h 30m",
    lectures: 28,
    instructor: "SkillXGenie",
    lastUpdated: "December 2024",
    language: "English",
    level: "Beginner"
  }
];

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<'short' | 'long'>('short');
  const [reviews, setReviews] = useState<Array<{id: number, name: string, rating: number, comment: string, date: string}>>([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [cart, setCart] = useState<Array<{courseId: string, plan: 'short' | 'long', price: string}>>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<'short' | 'long' | null>(null);

  const course = courses.find(c => c.id === courseId);
  const content = courseContent[courseId || ''];

  useEffect(() => {
    getUser();
    // Load cart from localStorage
    const savedCart = localStorage.getItem('courseCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        getUser();
        // If there was a pending purchase, proceed with it
        if (pendingPurchase) {
          handleBuyNow(pendingPurchase);
          setPendingPurchase(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pendingPurchase]);

  const getUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
        return;
      }
      setUser(user);
    } catch (error) {
      console.error('Error getting user:', error);
    }
  };

  const saveCart = (newCart: typeof cart) => {
    setCart(newCart);
    localStorage.setItem('courseCart', JSON.stringify(newCart));
  };

  const addToCart = (plan: 'short' | 'long') => {
    if (!course) return;
    
    const priceString = plan === 'short' ? course.shortTermPrice : course.longTermPrice;
    const newItem = { courseId: course.id, plan, price: priceString };
    
    // Check if item already exists
    const savedCart = localStorage.getItem('courseCart');
    const currentCart = savedCart ? JSON.parse(savedCart) : [];
    const existingIndex = currentCart.findIndex(item => item.courseId === course.id && item.plan === plan);
    
    if (existingIndex === -1) {
      const newCart = [...currentCart, { courseId: course.id, plan, price: priceString }];
      localStorage.setItem('courseCart', JSON.stringify(newCart));
      setCart(newCart);
      alert('Course added to cart!');
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
    } else {
      alert('Course already in cart!');
    }
  };

  const handleBuyNow = (plan: 'short' | 'long') => {
    if (!user) {
      // Save the intended purchase and show login modal
      setPendingPurchase(plan);
      // Also add to cart so it's saved
      addToCart(plan);
      setIsAuthModalOpen(true);
      return;
    }

    // User is logged in, add to cart and go to checkout
    addToCart(plan);
    navigate('/checkout');
  };

  const toggleModule = (moduleTitle: string) => {
    // Show purchase modal instead of expanding
    setShowPurchaseModal(true);
  };

  const expandAllSections = () => {
    if (allExpanded) {
      setExpandedModules([]);
      setAllExpanded(false);
    } else {
      // Show purchase modal for expanding all
      setShowPurchaseModal(true);
    }
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.name && newReview.comment) {
      const review = {
        id: Date.now(),
        ...newReview,
        date: new Date().toLocaleDateString()
      };
      setReviews([...reviews, review]);
      setNewReview({ name: '', rating: 5, comment: '' });
    }
  };

  if (!course || !content) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center text-blue-200 hover:text-white mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Courses
          </button>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{course.emoji}</span>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                  <p className="text-blue-200 text-lg">{course.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-blue-200 ml-1">({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{course.totalHours}</span>
                </div>
              </div>
              
              <div className="text-sm text-blue-200">
                <p>Created by {course.instructor}</p>
                <p>Last updated {course.lastUpdated}</p>
                <p>{course.language} • {course.level}</p>
              </div>
            </div>
            
            {/* Pricing Card */}
            <div className="bg-white rounded-xl p-6 shadow-xl h-fit">
              <div className="mb-6">
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setSelectedPlan('short')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedPlan === 'short'
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Short-Term
                  </button>
                  <button
                    onClick={() => setSelectedPlan('long')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedPlan === 'long'
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Long-Term
                  </button>
                </div>
                
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <IndianRupee className="h-8 w-8 text-gray-800" />
                    <span className="text-4xl font-bold text-gray-800">
                      {selectedPlan === 'short' ? course.shortTermPrice.replace('₹', '') : course.longTermPrice.replace('₹', '')}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {selectedPlan === 'short' ? course.shortTermDuration : course.longTermDuration}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => addToCart(selectedPlan)}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Add to cart
                </button>
                <button
                  onClick={() => handleBuyNow(selectedPlan)}
                  className="w-full border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
                >
                  Buy now
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-600 mb-4">
                30-Day Money-Back Guarantee
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Full Lifetime Access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* What you'll learn */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Master the fundamentals and core concepts</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Build practical, real-world projects</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Develop industry-relevant skills</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Apply knowledge through hands-on exercises</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Gain confidence in practical applications</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Prepare for advanced topics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course content */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Course content</h2>
              
              <div className="mb-4 text-sm text-gray-600">
                {content.shortTerm.totalModules} sections • {content.shortTerm.totalLectures} lectures • {content.shortTerm.totalDuration} total length
              </div>

              <div className="space-y-2">
                {content.shortTerm.modules.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleModule(module.title)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        {expandedModules.includes(module.title) ? (
                          <ChevronUp className="h-5 w-5 mr-3" />
                        ) : (
                          <ChevronDown className="h-5 w-5 mr-3" />
                        )}
                        <span className="font-medium">{module.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {module.lectures.length} lectures
                      </span>
                    </button>
                    
                    {expandedModules.includes(module.title) && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {module.lectures.map((lecture, lectureIndex) => (
                          <div key={lectureIndex} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center">
                              {lecture.type === 'quiz' ? (
                                <Award className="h-4 w-4 text-orange-500 mr-3" />
                              ) : lecture.type === 'project' ? (
                                <BookOpen className="h-4 w-4 text-green-500 mr-3" />
                              ) : (
                                <Play className="h-4 w-4 text-gray-400 mr-3" />
                              )}
                              <span className="text-sm">{lecture.title}</span>
                            </div>
                            <span className="text-sm text-gray-500">{lecture.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Purchase Modal */}
              {showPurchaseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V9m0 0V7m0 2h2m-2 0H10" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Content Locked</h3>
                      <p className="text-gray-600">Purchase this course to access all content and lectures.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Short-Term (30 Days)</span>
                          <div className="flex items-center font-bold text-green-600">
                            <IndianRupee className="h-4 w-4" />
                            <span>299</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            addToCart('short');
                            setShowPurchaseModal(false);
                          }}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors mb-2"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow('short')}
                          className="w-full border border-green-600 text-green-600 py-2 px-4 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Long-Term (3-4 Months)</span>
                          <div className="flex items-center font-bold text-blue-600">
                            <IndianRupee className="h-4 w-4" />
                            <span>2,999</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            addToCart('long');
                            setShowPurchaseModal(false);
                          }}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-2"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow('long')}
                          className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowPurchaseModal(false)}
                      className="w-full mt-4 text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Long-term course info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Long-Term Course ({course.longTermDuration})</h3>
                <p className="text-blue-800 text-sm mb-2">
                  {content.longTerm.modules} Modules • {content.longTerm.lectures} Lectures • {content.longTerm.duration}
                </p>
                <p className="text-blue-700 text-sm">{content.longTerm.description}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
              
              {reviews.length === 0 ? (
                <p className="text-gray-500 mb-6">No reviews yet. Be the first to review this course!</p>
              ) : (
                <div className="space-y-4 mb-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{review.name}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Review Form */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={newReview.name}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating})}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              rating <= newReview.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Share your experience with this course..."
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Instructor</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {course.instructor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-medium">{course.instructor}</h4>
                  <p className="text-sm text-gray-600">Expert Instructor</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-2" />
                  <span>{course.rating} Instructor Rating</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>1 Course</span>
                </div>
              </div>
            </div>

            {/* Course Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">This course includes:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-3" />
                  <span>{course.totalHours} on-demand video</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-gray-500 mr-3" />
                  <span>{course.lectures} lectures</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-gray-500 mr-3" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-gray-500 mr-3" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-gray-500 mr-3" />
                  <span>Access on mobile and TV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingPurchase(null);
        }}
      />
    </div>
  );
};

export default CourseDetail;