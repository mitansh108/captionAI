"use client"; 
import { useEffect, useState } from "react";
import Image from "next/image";
import Demosection from "./components/DemoSection";
import Pageheader from "./components/Pageheader";
import UploadContent from "./components/UploadContent";



import { motion } from "framer-motion"; // Import Framer Motion


export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

 

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="bg-white text-black dark:bg-[#0f1117] dark:text-white min-h-screen transition-colors duration-300">
      {/* Header */}

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Pageheader />
      </motion.div>
    
      {/* Transcription Cards */}
      <motion.section
        className="flex flex-col md:flex-row justify-center items-stretch gap-6 px-4 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
>

<UploadContent />
</motion.div>
      </motion.section>

      {/* Demo Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <Demosection />
      </motion.div>
    </div>
  );
}
