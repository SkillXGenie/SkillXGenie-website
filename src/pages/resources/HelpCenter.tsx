import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from 'lucide-react';

const faqs = [
  {
    category: "Course Information",
    questions: [
      {
        q: "How do I enroll in a course?",
        a: "To enroll in a course, browse our course catalog, select your desired course, and click the 'Pre-register Now' button. Follow the registration process and complete the payment to secure your spot."
      },
      {
        q: "What are the prerequisites for courses?",
        a: "Prerequisites vary by course and are clearly listed on each course page. Some beginner courses have no prerequisites, while advanced courses may require specific knowledge or experience."
      },
      {
        q: "Can I switch courses after enrolling?",
        a: "Yes, you can switch courses up to 7 days before the start date, subject to availability and any difference in course fees."
      }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      {
        q: "What technical requirements do I need?",
        a: "Most courses require a computer with reliable internet connection. Specific software requirements are listed on individual course pages."
      },
      {
        q: "How do I access course materials?",
        a: "Once enrolled, you'll receive login credentials to our learning platform where all course materials will be available."
      },
      {
        q: "What if I experience technical difficulties?",
        a: "Our technical support team is available 24/7. Contact us through the help desk or email support@skillxgenie.com."
      }
    ]
  },
  {
    category: "Payment & Refunds",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, PayPal, and bank transfers. Payment plans are available for select courses."
      },
      {
        q: "Do you offer refunds?",
        a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your course experience."
      },
      {
        q: "Are there any hidden fees?",
        a: "No, the course price includes all materials and access to our learning platform. Any additional costs will be clearly stated."
      }
    ]
  }
];

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const toggleQuestion = (question: string) => {
    setExpandedQuestions(prev =>
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to your questions</p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600">Chat with our support team</p>
            <button className="mt-4 text-blue-600 font-medium">Start Chat</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
            <p className="text-gray-600">Call us at +1 (555) 123-4567</p>
            <p className="mt-4 text-sm text-gray-500">Mon-Fri, 9am-5pm EST</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600">support@skillxgenie.com</p>
            <p className="mt-4 text-sm text-gray-500">24/7 Response</p>
          </motion.div>
        </div>

        <div className="space-y-6">
          {filteredFaqs.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
              >
                <h2 className="text-xl font-semibold">{category.category}</h2>
                {expandedCategory === category.category ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {expandedCategory === category.category && (
                <div className="px-6 pb-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-t">
                      <button
                        onClick={() => toggleQuestion(faq.q)}
                        className="w-full py-4 flex justify-between items-center text-left"
                      >
                        <h3 className="font-medium pr-8">{faq.q}</h3>
                        {expandedQuestions.includes(faq.q) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {expandedQuestions.includes(faq.q) && (
                        <p className="text-gray-600 pb-4">{faq.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;