'use client'; // Ensuring this is a client-side component

import { useState } from "react";
import { motion } from "framer-motion"; // Importing framer-motion

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here, you can implement logic to send the form data (e.g., using an API or email service)

    // Simulate form submission success
    setFormStatus("Message sent successfully!");

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="py-20 px-6">
      <motion.h1
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Contact Us
      </motion.h1>
      <p className="text-lg text-gray-600 mb-8">We'd love to hear from you!</p>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label
            htmlFor="name"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#2a2f3a] dark:text-white"
          />
        </motion.div>

        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label
            htmlFor="email"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#2a2f3a] dark:text-white"
          />
        </motion.div>

        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label
            htmlFor="message"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#2a2f3a] dark:text-white"
          ></textarea>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Send Message
          </button>
        </motion.div>

        {formStatus && (
          <motion.div
            className="mt-4 text-center text-green-500 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {formStatus}
          </motion.div>
        )}
      </form>

      {/* Email and Phone Section */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <p className="text-lg font-semibold">Email us at: </p>
        <a href="mailto:quickcaptionai@gmail.com" className="text-blue-600">
          quickcaptionai@gmail.com
        </a>
        <p className="mt-4 text-lg font-semibold">Call us at: </p>
        <a href="tel:+11222229990" className="text-blue-600">
          +1 1222229990
        </a>
      </motion.div>
    </div>
  );
};

export default Contact;
