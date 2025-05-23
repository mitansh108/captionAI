import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import uploadingAnimation from "/public/lottie/uploading.json";

export default function UploadContent() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function handleFileChange(e) {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      console.log("Selected file:", file);

      setIsUploading(true);
      const res = await axios.postForm("/api/upload", { file });
      setIsUploading(false);
      const newName = res.data.newName;
      router.push(`/${newName}`);
      console.log(res.data);
    }
  }

  return (
    <>
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 text-white">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Lottie animationData={uploadingAnimation} loop={true} style={{ width: 200, height: 200 }} />
          <p className="text-lg font-semibold text-center">Your File is Uploading to our Database...</p>
        </div>
      </div>
      
      )}
      <section className="flex flex-col md:flex-row justify-center items-stretch gap-6 px-4 pb-20">
        {/* Local file card */}
        <div className="bg-gray-100 dark:bg-[#1f232b] shadow-lg rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">Transcribe a local file</h3>
          <div className="border-dashed border-2 border-gray-400 dark:border-gray-600 rounded-md p-6 text-center mb-4">
            <label
              htmlFor="file-upload"
              className="text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Click to upload or drag and drop
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".txt, .doc, .docx, .pdf, .mp3, .mp4, .wav"
              onChange={handleFileChange}
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Try FREE Transcription
          </button>
        </div>

        {/* Online file card */}
        <div className="bg-gray-100 dark:bg-[#1f232b] shadow-lg rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">Transcribe an online file</h3>
          <input
            type="text"
            placeholder="youtube.com | facebook.com | tiktok.com..."
            className="w-full bg-white dark:bg-[#2a2f3a] border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md px-3 py-2 mb-4"
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Try FREE Transcription
          </button>
        </div>
      </section>
    </>
  );
}
