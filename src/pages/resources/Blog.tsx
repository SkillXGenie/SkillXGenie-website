import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, X, Heart } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "🤖 The Future of Robotics Engineering in 2025",
    excerpt: "Explore the emerging trends in robotics engineering and how they're shaping the future of automation and AI integration.",
    author: "Dr. Sarah Chen",
    date: "February 15, 2024",
    readTime: "15 min read",
    image: "/future-of-robotics-engeneering-image.jpg",
    content: `Robotics engineering is advancing rapidly, and with AI integration, robots are becoming more autonomous and intelligent.

🚀 Key Trends in Robotics:
- 🤖 Collaborative Robots (Cobots): Robots working alongside humans in various industries.
- 🏬 Humanoid Robots: AI-powered robots are being designed for social interactions, customer service, and even elderly care.
- 🔬 Soft Robotics: More flexible and adaptable robots are being developed for handling delicate objects and tasks.
- 🏥 AI-Powered Prosthetics: Intelligent prosthetics are allowing amputees to regain movement with more natural control.

🌍 Applications of Robotics:
- 🏭 Manufacturing Automation: Robots are reducing human workload, increasing precision, and speeding up production lines.
- 🏥 Healthcare & Surgeries: AI-assisted robotic arms are performing complex surgeries with higher accuracy.
- 🚗 Autonomous Vehicles: Self-driving cars are becoming more advanced, reducing accidents and improving transportation efficiency.

🛡 Ethical Concerns & Future of Robotics:
- ⚖️ Regulatory Frameworks: As AI-driven robots become more widespread, ethical guidelines and safety regulations are crucial.
- 🚀 The Next Decade: Robotics is expected to play a significant role in space exploration, personal assistance, and even creative industries.
`
  },
  {
    id: 2,
    title: "📈 Breaking into Tech Leadership: A Comprehensive Guide",
    excerpt: "Learn the essential skills and strategies needed to transition into a technology leadership role.",
    author: "Michael Rodriguez",
    date: "February 12, 2024",
    readTime: "18 min read",
    image: "/tech-leadership-image.jpg",
    content: `Becoming a tech leader requires more than just technical skills. It demands vision, strategic thinking, and the ability to manage people effectively. Whether you’re an aspiring CTO or a team lead, understanding the essentials of leadership in tech is key.

🔑 Essential Leadership Skills:
- 🗣️ Effective Communication: Leaders must convey complex ideas clearly to teams and stakeholders.
- 🎯 Strategic Thinking: Decision-making should be backed by data, foresight, and industry trends.
- 🏆 Innovation & Problem-Solving: Great leaders foster innovation, encourage new ideas, and solve problems creatively.

🚀 Transitioning into a Leadership Role:
- 🏗 Building a Strong Network: Connect with industry experts, mentors, and professionals.
- 📚 Continuous Learning: Stay updated on emerging technologies like AI, blockchain, and quantum computing.
- 💼 Leading by Example: A strong leader motivates teams by setting an example of dedication and integrity.

🔮 Challenges & Future Prospects:
- 📈 Balancing Business & Tech: Understanding both the technical and business aspects of a company is key.
- 🌎 Global Leadership: Managing diverse teams across multiple locations requires adaptability and cultural awareness.
`
  },
  {
    id: 3,
    title: "🛡️ Cybersecurity Best Practices for 2025",
    excerpt: "Stay ahead of cyber threats with these updated security practices and emerging protection strategies.",
    author: "Lisa Thompson",
    date: "February 10, 2024",
    readTime: "20 min read",
    image: "/cybersecurity-image.jpg",
    content: `Cybersecurity is more critical than ever as digital threats evolve. With businesses and individuals relying more on online systems, staying ahead of cybercriminals requires constant vigilance.

🔥 Best Practices for Cybersecurity:
- 🔐 Multi-Factor Authentication (MFA): Adding an extra layer of security helps prevent unauthorized access.
- 🚪 Zero-Trust Security Models: No system should assume implicit trust—every access request should be verified.
- 🤖 AI-Powered Threat Detection: Machine learning models are being used to predict and prevent cyberattacks in real time.

⚠️ Emerging Cyber Threats:
- 🎭 Social Engineering Attacks: Phishing scams and deception techniques are on the rise.
- 💻 Ransomware Epidemics: Attackers lock and encrypt data, demanding payment for its release.
- 🏦 Financial & Banking Frauds: AI-driven fraud detection systems are crucial for protecting sensitive financial information.

🔮 Future of Cybersecurity:
- 📡 Quantum Computing Security: As quantum computing advances, new encryption methods will be needed.
- 🏢 Enterprise Cyber Hygiene: Employee training is essential to reduce human-related security breaches.
- 🌍 Global Regulations: Governments are enacting stricter cybersecurity policies to protect citizens and businesses.
`
  },
  {
    id: 4,
    title: "📊 Data Science: The Power of Predictive Analytics",
    excerpt: "Discover how data science is transforming industries through predictive analytics and AI-driven insights.",
    author: "Emily Carter",
    date: "March 1, 2024",
    readTime: "17 min read",
    image: '/datascience-image.jpg',
    content: `Data science is transforming industries by leveraging AI and machine learning to make accurate predictions and informed decisions. Businesses that harness data effectively gain a significant advantage.

🔍 Key Applications of Data Science:
- 📈 Predictive Analytics: Businesses use historical data to forecast trends, from stock markets to customer behavior.
- 🧠 AI & Machine Learning: Automating data processing leads to real-time decision-making and optimization.
- 🏦 Financial Analytics: Banks use AI to assess risks, detect fraud, and personalize customer experiences.

🚀 The Role of Data in Business:
- 🔬 Research & Development: Companies leverage data to innovate and create new products.
- 🛍 E-commerce Optimization: Personalized recommendations enhance customer experience and drive sales.
- 🌍 Smart Cities: Urban planning relies on big data to optimize traffic, energy use, and safety.

📡 The Future of Data Science:
- 💾 Ethical AI: Ensuring AI-driven decisions remain fair and unbiased.
- ☁️ Cloud Computing & Big Data: Storing and analyzing vast amounts of data efficiently.
- 🔮 AI-Powered Decision Making: Businesses will increasingly rely on AI for strategic planning.
`
  },
  {
    id: 5,
    title: "🌍 The Impact of AI in Environmental Sustainability",
    excerpt: "Learn how AI is being used to tackle environmental challenges and drive sustainable solutions.",
    author: "James Anderson",
    date: "March 5, 2024",
    readTime: "16 min read",
    image: '/ai-and-environmentalsustainability-image.jpg',
    content: `AI is playing a crucial role in tackling climate change and promoting sustainability. From energy conservation to wildlife protection, AI-driven solutions are shaping a greener future.

🌱 AI-Powered Sustainability Efforts:
- 🚜 Precision Agriculture: AI helps farmers optimize irrigation, reduce pesticide use, and increase yield.
- 💡 Smart Energy Systems: AI enhances efficiency by predicting power consumption patterns.
- 🌊 Climate Change Predictions: Machine learning models analyze environmental data to forecast natural disasters.

🏭 Industrial & Urban Sustainability:
- 🏙️ Smart Cities: AI-driven traffic control systems reduce congestion and emissions.
- ♻️ Waste Management: AI improves recycling processes and minimizes waste production.
- 🚢 Ocean Monitoring: AI-powered sensors track pollution and help preserve marine life.

🔮 The Future of AI in Sustainability:
- 🌞 Renewable Energy Optimization: AI improves efficiency in wind and solar energy generation.
- 🚀 Global Climate Initiatives: AI will be at the forefront of new sustainability policies and strategies.
`
  },
  {
    id: 6,
    title: "🛰️ Space Exploration: The Role of Robotics & AI",
    excerpt: "Explore how robotics and AI are transforming space missions and deep space exploration.",
    author: "Sophia Martinez",
    date: "March 10, 2024",
    readTime: "19 min read",
    image: '/space-exploration-image.jpg',
    content: `Space agencies are increasingly relying on AI and robotics for deep space missions. From Mars rovers to AI-assisted astronauts, space exploration is becoming more autonomous.

🚀 Key Innovations in Space Tech:
- 🤖 Autonomous Rovers: AI-driven rovers like Perseverance explore planets without human intervention.
- 🛰 Satellite AI Systems: Smart satellites process climate data in real time.
- 🌌 Deep Space AI Navigation: Spacecraft use AI to adapt to new environments and make autonomous decisions.

🔭 The Future of Space Exploration:
- 🚀 AI Astronaut Assistants: Robots will aid human astronauts in deep space missions.
- 🌍 Terraforming Research: AI is helping scientists explore the possibility of making other planets habitable.
- 🛸 Interstellar Travel: AI could be key in designing spacecraft for future interstellar missions.
`
  },
  {
    id: 7,
    title: "⚛️ Quantum Computing: The Next Tech Revolution",
    excerpt: "Understand how quantum computing is set to revolutionize problem-solving and data encryption.",
    author: "Daniel Foster",
    date: "March 15, 2024",
    readTime: "22 min read",
    image: '/The-Quantum-Computing-Revolution-image.jpg',
    content: `Quantum computing is pushing the limits of what traditional computers can do. This revolutionary technology has the potential to transform problem-solving and data security.

🔬 Key Advancements in Quantum Computing:
- 🔗 Quantum Entanglement: Enables secure, instant communication across vast distances.
- 💽 Quantum Cryptography: A game-changer for cybersecurity, making data encryption virtually unbreakable.
- 🚀 Breakthroughs in Quantum AI: Quantum algorithms are set to enhance deep learning models.

🖥 How Quantum Computing Will Change Industries:
- 🏦 Financial Markets: Quantum computers can optimize trading strategies and risk assessments.
- 🔬 Scientific Research: Simulating molecules for drug discovery at an unprecedented speed.
- 🌎 Weather Prediction: Advanced climate modeling to predict natural disasters more accurately.

🔮 The Road Ahead for Quantum Computing:
- 🏗 Developing Scalable Quantum Chips: Making quantum computers practical for widespread use.
- 🔍 Ethical Concerns: Ensuring that quantum power isn't misused for malicious purposes.
- ⚡ Mass Adoption: Governments and corporations are heavily investing in this future-defining technology.
`
  },
  {
    id: 8,
    title: "🧑‍💻 The Rise of Ethical Hacking in Cybersecurity",
    excerpt: "Learn how ethical hackers help organizations stay secure by identifying vulnerabilities before attackers do.",
    author: "Nathan Williams",
    date: "March 20, 2024",
    readTime: "14 min read",
    image: '/ethical-hacking-image.jpeg',
    content: `Ethical hacking plays a vital role in modern cybersecurity. Ethical hackers, also known as white-hat hackers, help organizations identify vulnerabilities before cybercriminals exploit them.

🛡️ How Ethical Hackers Protect Systems:
- 🔎 Penetration Testing: Simulating real-world attacks to discover weaknesses in security systems.
- 🔐 Security Audits: Ensuring organizations follow best cybersecurity practices.
- 🏦 Financial Security Assessments: Helping banks and financial institutions defend against cyber threats.

🚨 Rising Demand for Ethical Hackers:
- 📈 Growing Cyber Threats: More businesses are hiring ethical hackers to stay ahead of cybercriminals.
- 🏢 Government Cybersecurity: Nations are employing ethical hackers to secure critical infrastructure.
- 🛡️ Ethical Hacking Certifications: CEH and OSCP certifications are becoming industry standards.

🔮 The Future of Ethical Hacking:
- 🚀 AI-Assisted Ethical Hacking: Using machine learning to detect vulnerabilities faster.
- 🌍 Global Cyber Defense Networks: Collaborative hacking communities sharing security intelligence.
- ⚖️ Ethical Concerns: Striking the right balance between security and privacy in an increasingly digital world.
`
  },
  {
    id: 9,
    title: "🤝 Human-AI Collaboration: The Future of Work",
    excerpt: "Discover how AI is augmenting human capabilities and reshaping the workforce.",
    author: "Sophia Lee",
    date: "March 25, 2024",
    readTime: "18 min read",
    image: '/human-ai-collaboration-image.jpg',
    content: `AI is not replacing humans—it’s empowering them. The future of work involves a strong partnership between human intelligence and artificial intelligence.

🏢 How AI is Enhancing Human Work:
- 🖥 AI-Powered Assistants: Virtual assistants help automate repetitive tasks, freeing up time for creative work.
- 🎨 Creative AI: AI is enhancing industries like graphic design, music composition, and content creation.
- 🔍 AI-Augmented Decision Making: AI tools are improving efficiency in healthcare, finance, and law.

🚀 Real-World Applications:
- 📊 AI in Business Strategy: Companies use AI to make data-driven decisions.
- 🏥 AI in Medicine: Doctors use AI for diagnostics, personalized treatments, and robotic-assisted surgeries.
- 🏗 AI in Construction: AI-driven designs and automation are improving efficiency in building infrastructure.

🔮 The Future of Human-AI Collaboration:
- 🤝 AI & Emotional Intelligence: AI is being developed to better understand human emotions.
- 🏆 Reskilling & Adaptation: Employees will need to learn how to work alongside AI systems.
- 🌍 Ethical AI Development: Ensuring AI remains a tool for empowerment rather than control.
`
  }
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<null | typeof blogPosts[0]>(null);
  const [likes, setLikes] = useState<Record<number, number>>(() => {
    const savedLikes = localStorage.getItem("blogLikes");
    return savedLikes ? JSON.parse(savedLikes) : {};
  });

  useEffect(() => {
    localStorage.setItem("blogLikes", JSON.stringify(likes));
  }, [likes]);

  const handleLike = (id: number) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: prevLikes[id] ? prevLikes[id] - 1 : 1,
    }));
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Skill X Genie Blog</h1>
          <p className="text-xl text-gray-600">Latest insights, trends, and educational resources</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.article key={post.id} whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer" onClick={() => setSelectedPost(post)}>
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 hover:text-blue-600 transition-colors">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button onClick={(e) => { e.stopPropagation(); handleLike(post.id); }} className={`flex items-center ${likes[post.id] ? 'text-red-500' : 'text-gray-500'} hover:text-red-600`}>
                  <Heart className="h-5 w-5 mr-1" fill={likes[post.id] ? "#ef4444" : "none"} /> {likes[post.id] || 0}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-24 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-lg relative">
            <button onClick={() => setSelectedPost(null)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-64 object-cover rounded mb-4" />
            <p className="text-gray-700 whitespace-pre-line">{selectedPost.content}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Blog;
