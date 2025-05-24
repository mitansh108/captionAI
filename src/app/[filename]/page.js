'use client';
import Lottie from "lottie-react";
import { useEffect, useState, useRef } from "react";
import transcribingAnimation from "/public/lottie/transcribing.json";
import fetchingAnimation from "/public/lottie/fetching.json";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import axios from "axios";
import { useParams } from "next/navigation";
import { clearTranscriptionItems } from "../components/libs/awsTranscriptionHelpers";



export default function Filepage() {
  const params = useParams();
  const filename = params.filename;
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);
  const videoRef = useRef(null);




  // Add state to hold your ffmpeg instance
  const [ffmpeg, setFfmpeg] = useState(null);

  useEffect(() => {
    // Dynamically import and initialize ffmpeg on client side only
    async function loadFFmpeg() {
      const { createFFmpeg } = await import('@ffmpeg/ffmpeg');
      const ffmpegInstance = createFFmpeg({ log: true });
      await ffmpegInstance.load();
      setFfmpeg(ffmpegInstance);
    }
    loadFFmpeg();
  }, []);

  useEffect(() => {
    getTranscription();
  }, [filename]);
  

  useEffect(() => {
    getTranscription();
  }, [filename]);

  function getTranscription() {
    setIsFetchingInfo(true);
    axios
      .get("/api/transcribe?filename=" + filename)
      .then((response) => {
        const status = response.data?.status;
        const transcription = response.data?.transcription;

        if (status === "IN_PROGRESS") {
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

  function updateItem(index, key, value) {
    const newItems = [...awsTranscriptionItems];
    newItems[index][key] = value;
    setAwsTranscriptionItems(newItems);
  }

  function toVttTimestamp(seconds) {
    const sec = parseFloat(seconds);
    if (isNaN(sec)) return "00:00:00.000";
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const secs = Math.floor(sec % 60);
    const milliseconds = Math.floor((sec - Math.floor(sec)) * 1000);
    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(secs).padStart(2, "0") +
      "." +
      String(milliseconds).padStart(3, "0")
    );
  }

  function generateVtt() {
    let vtt = "WEBVTT\n\n";
    awsTranscriptionItems.forEach((item, index) => {
      const start = toVttTimestamp(item.start_time);
      const end = toVttTimestamp(item.end_time);
      const content = item.content.replace(/\n/g, " ");
      vtt += `${index + 1}\n${start} --> ${end}\n${content}\n\n`;
    });
    return vtt;
  }

  function handleGenerateCaptions() {
    if (!videoRef.current) return;
    const oldTrack = videoRef.current.querySelector("track");
    if (oldTrack) {
      videoRef.current.removeChild(oldTrack);
    }

    const vttContent = generateVtt();
    const blob = new Blob([vttContent], { type: "text/vtt" });
    const blobUrl = URL.createObjectURL(blob);

    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = "English";
    track.srclang = "en";
    track.src = blobUrl;
    track.default = true;

    videoRef.current.appendChild(track);

    track.addEventListener("load", () => {
      videoRef.current.textTracks[0].mode = "showing";
    });

    alert("Captions generated and applied to video.");
  }

  function handleDownloadCaptions() {
    const vttContent = generateVtt();
    const blob = new Blob([vttContent], { type: "text/vtt" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.vtt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (isTranscribing) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <Lottie animationData={transcribingAnimation} loop style={{ width: 500, height: 500 }} />
        <div className="text-center text-gray-600 dark:text-gray-300 text-lg font-semibold animate-pulse mt-4">
          Transcribing...
        </div>
      </div>
    );
  }

  if (isFetchingInfo) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <Lottie animationData={fetchingAnimation} loop style={{ width: 100, height: 100 }} />
        <div className="text-center text-gray-600 dark:text-gray-300 text-lg font-semibold animate-pulse mt-4">
          Fetching Information...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {awsTranscriptionItems.length > 0 ? (
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl mb-5">Transcriptions</h2>
            <div className="flex gap-1 px-2 font-semibold text-sm text-gray-700 dark:text-gray-200 sticky top-0 bg-white dark:bg-gray-900">
              <div className="w-24">From</div>
              <div className="w-6" />
              <div className="w-24">End</div>
              <div className="w-48">Content</div>
            </div>

            {awsTranscriptionItems.map((item, index) => (
              <TranscriptionItemEditable
                key={index}
                item={item}
                handleStartTimeChange={(ev) => updateItem(index, "start_time", ev.target.value)}
                handleEndTimeChange={(ev) => updateItem(index, "end_time", ev.target.value)}
                handleContentChange={(ev) => updateItem(index, "content", ev.target.value)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No transcription data available.
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-2xl mb-5">Results</h2>
          <div className="flex gap-4 mb-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleGenerateCaptions}
            >
              Generate Captions
            </button>
           
          </div>

          <video
            ref={videoRef}
            controls
            className="w-100"
            src={`https://s3.us-east-2.amazonaws.com/quickcaption.ai/${filename}`}
          />
        </div>
      </div>
    </div>
  );
}

function TranscriptionItemEditable({
  item,
  handleStartTimeChange,
  handleEndTimeChange,
  handleContentChange,
}) {
  return (
    <div className="rounded-md shadow-md flex flex-col md:flex-row items-start md:items-center gap-1 p-2">
      <input
        type="text"
        value={item.start_time}
        onChange={handleStartTimeChange}
        className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
      />
      <div className="w-6 text-center">-</div>
      <input
        type="text"
        value={item.end_time}
        onChange={handleEndTimeChange}
        className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
      />
      <input
        type="text"
        value={item.content}
        onChange={handleContentChange}
        className="rounded px-2 py-1 text-sm w-48"
      />
    </div>
  );
}