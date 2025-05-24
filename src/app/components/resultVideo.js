import { useEffect, useState, useRef } from "react";
import { FFmpeg  } from "@ffmpeg/ffmpeg";
import {toBlobURL,fetchFile } from "@ffmpeg/util";


export default function ResultVideo({ filename , transcriptionItems}) {
    const videoUrl = "https://s3.us-east-2.amazonaws.com/quickcaption.ai/" + filename;
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);

    useEffect(() =>{
        videoRef.current.src = videoUrl
        load();
    }, []);

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current;
       


        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile(filename, await fetchFile(videoUrl));
        console.log(transcriptionItems);

        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        await ffmpeg.exec(['-i', filename, 'output.mp4']);
        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    }


    if (!filename) {
      return <div>No video filename provided</div>;
    }

    return (
      <>
        <div className="mt-6">
          <h2 className="text-2xl mb-5">Results</h2>
          <button
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={transcode}
          >
            Generate Captions
          </button>
  
          <video
          
          ref={ videoRef}
            controls
            className="w-100"
            
          />
        </div>
      </>
    );
  }
  