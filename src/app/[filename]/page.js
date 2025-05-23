'use client';
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import transcribingAnimation from "/public/lottie/transcribing.json";
import fetchingAnimation from "/public/lottie/fetching.json";

import axios from "axios";
import { useParams } from "next/navigation";
import { clearTranscriptionItems } from "../components/libs/awsTranscriptionHelpers";

function TranscriptionItemEditable({ item }) {
  const [startSeconds, setStartSeconds] = useState(item.start_time);
  const [endSeconds, setEndSeconds] = useState(item.end_time);
  const [content, setContent] = useState(item.content);

  return (
    <div className="rounded-md shadow-md flex flex-col md:flex-row items-start md:items-center gap-1 p-2 ">
      <input
        type="text"
        value={startSeconds}
        onChange={(ev) => setStartSeconds(ev.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
      />
      <div className="w-6 text-center">-</div>
      <input
        type="text"
        value={endSeconds}
        onChange={(ev) => setEndSeconds(ev.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
      />
      <input
        type="text"
        value={content}
        onChange={(ev) => setContent(ev.target.value)}
        className=" rounded px-2 py-1 text-sm w-24"
      />
    </div>
  );
}

export default function Filepage() {
  const params = useParams();
  const filename = params.filename;
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);

  useEffect(() => {
    getTranscription();
  }, [filename]);

  function getTranscription() {
    setIsFetchingInfo(true);

    axios
      .get('/api/transcribe?filename=' + filename)
      .then((response) => {
        const status = response.data?.status;
        const transcription = response.data?.transcription;

        if (status === 'IN_PROGRESS') {
          setIsTranscribing(true);
          setTimeout(getTranscription, 3000);
        } else {
          setIsTranscribing(false);
          const cleaned = clearTranscriptionItems(transcription.results.items);
          setAwsTranscriptionItems(cleaned);
        }
      })
      .catch((error) => {
        console.error("Error fetching transcription:", error);
      })
      .finally(() => {
        setIsFetchingInfo(false);
      });
  }

  if (isTranscribing) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <Lottie animationData={transcribingAnimation} loop={true} style={{ width: 500, height: 500 }} />
        <div className="text-center text-gray-600 dark:text-gray-300 text-lg font-semibold animate-pulse mt-4">
          Transcribing...
        </div>
      </div>
    );
  }

  if (isFetchingInfo) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <Lottie animationData={fetchingAnimation} loop={true} style={{ width: 100, height: 100 }} />
        <div className="text-center text-gray-600 dark:text-gray-300 text-lg font-semibold animate-pulse mt-4">
          Fetching Information...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-16">
        {/* Left column: Transcriptions */}
        {awsTranscriptionItems.length > 0 ? (
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl mb-5">Transcriptions</h2>
            <div className="flex gap-1 px-2 font-semibold text-sm text-gray-700 dark:text-gray-200 sticky top-0">
              <div className="w-24">From</div>
              <div className="w-6" />
              <div className="w-24">End</div>
              <div className="w-24">Content</div>
            </div>
  
            {awsTranscriptionItems.map((item, index) => (
              <TranscriptionItemEditable key={index} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No transcription data available.
          </div>
        )}
  
        {/* Right column: Results */}
        <div className="mt-6">
          <h2 className="text-2xl mb-5">Results</h2>
          <button
    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    onClick={() => {
      // Your generate captions logic here
      console.log("Generate captions clicked");
    }}
  >
    Generate Captions
  </button>

          <video 
          controls
          src={"https://mitansh-cap.s3.amazonaws.com/" + filename}></video>
         
        </div>
      </div>
    </div>
  );
  
}
