import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Keyboard, Volume2, Monitor } from 'lucide-react';

const Accessibility = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Accessibility Statement</h1>
          <p className="text-xl text-gray-600">Making education accessible to everyone</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Eye className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Visual Accessibility</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Keyboard className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Keyboard Navigation</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Volume2 className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Audio Support</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Device Compatibility</h3>
          </motion.div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
              <p className="text-gray-600 mb-4">
                Skill X Genie is committed to providing a website that is accessible to the widest possible audience, regardless of technology or ability. We are actively working to increase the accessibility and usability of our website.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Accessibility Features</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Navigation</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Full keyboard navigation support</li>
                    <li>Skip to main content link</li>
                    <li>Consistent navigation structure</li>
                    <li>Clear heading hierarchy</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Text and Colors</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>High contrast text</li>
                    <li>Resizable text without loss of functionality</li>
                    <li>Color is not used as the sole method of conveying information</li>
                    <li>Alternative text for all images</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Media</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Closed captions for all video content</li>
                    <li>Transcripts for audio content</li>
                    <li>Audio descriptions where necessary</li>
                    <li>Pause/Stop controls for moving content</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Standards Compliance</h2>
              <p className="text-gray-600 mb-4">
                Our website strives to conform to level AA of the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines 2.1.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Assistive Technologies</h2>
              <p className="text-gray-600 mb-4">
                Our website is designed to be compatible with the following assistive technologies:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Screen readers</li>
                <li>Screen magnifiers</li>
                <li>Speech recognition software</li>
                <li>Alternative input devices</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Known Issues</h2>
              <p className="text-gray-600 mb-4">
                We are currently working to resolve the following accessibility issues:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Some older video content may lack captions</li>
                <li>Some complex data tables may not have proper headers</li>
                <li>Some PDF documents may not be fully accessible</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-4">
                  We welcome your feedback on the accessibility of our website. Please let us know if you encounter any accessibility barriers:
                </p>
                <p className="text-gray-600">Email: skillxgenie@gmail.com</p>
                <p className="text-gray-600">Phone: +91 8008615692</p>
                <p className="text-gray-600">
                  We aim to respond to accessibility feedback within 2 business days.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;