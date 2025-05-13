import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, Shield, Info } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">Last updated: February 20, 2024</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Cookie className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Cookie Usage</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Settings className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Cookie Settings</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Data Protection</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Info className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Your Choices</h3>
          </motion.div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Remembering your preferences</li>
                <li>Keeping you signed in</li>
                <li>Understanding how you use our site</li>
                <li>Improving our services</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Types of Cookies We Use</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-600">
                    Required for the website to function properly. These cannot be disabled.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Performance Cookies</h3>
                  <p className="text-gray-600">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Functionality Cookies</h3>
                  <p className="text-gray-600">
                    Remember your preferences and personalize your experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                  <p className="text-gray-600">
                    Track your activity across websites to deliver targeted advertising.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. Managing Cookies</h2>
              <p className="text-gray-600 mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Browser settings to block or delete cookies</li>
                <li>Our cookie preference center</li>
                <li>Third-party opt-out tools</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-600 mb-4">
                Some cookies are placed by third-party services that appear on our pages. We do not control these cookies and they are subject to the third party's privacy policy.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Cookie Consent</h2>
              <p className="text-gray-600 mb-4">
                When you first visit our site, you will be asked to consent to our use of cookies. You can change your preferences at any time through our cookie settings.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Updates to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">If you have questions about our Cookie Policy, contact us at:</p>
                <p className="text-gray-600">Email: privacy@skillxgenie.com</p>
                <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;