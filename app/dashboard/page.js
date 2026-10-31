"use client";
import { useState, useRef, useEffect } from "react";

export default function DashboardPage() {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [splits, setSplits] = useState([]);
  const [savedClips, setSavedClips] = useState([]);

  useEffect(() => {
    fetchClips();
  }, []);

  const fetchClips = async () => {
    const res = await fetch("/api/clips");
    const data = await res.json();
    if (data.success) setSavedClips(data.data);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setVideoSrc(URL.createObjectURL(file));
  };

  const handleSplit = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setSplits((prev) => [...prev, currentTime].sort((a, b) => a - b));
    }
  };

  const saveClipToDB = async (start, end) => {
    const title = prompt("Enter clip title:", "Viral Highlight");
    if (!title) return;
    const res = await fetch("/api/clips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, startTime: start, endTime: end, caption: "Check out this clip! #viral #omniclip", scheduledDate: new Date() }),
    });
    const data = await res.json();
    if (data.success) fetchClips();
  };

  const exportSegment = (startTime, endTime) => {
    const video = videoRef.current;
    video.currentTime = startTime;
    const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clip-${Math.floor(startTime)}-${Math.floor(endTime)}.webm`;
      a.click();
    };

    mediaRecorder.start();
    video.play();

    const checkTime = () => {
      if (video.currentTime >= endTime) {
        video.pause();
        mediaRecorder.stop();
        video.removeEventListener("timeupdate", checkTime);
      }
    };
    video.addEventListener("timeupdate", checkTime);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold">OmniClip Studio Dashboard</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
        <h2 className="text-xl font-semibold">1. Upload & Split Video</h2>
        <input type="file" accept="video/*" onChange={handleFileUpload} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" />
        
        {videoSrc && (
          <div className="space-y-4">
            <video ref={videoRef} src={videoSrc} controls className="w-full max-h-[400px] rounded bg-black" />
            <button onClick={handleSplit} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded font-semibold transition">
              ✂️ Split at Current Timestamp ({videoRef.current ? Math.floor(videoRef.current.currentTime) : 0}s)
            </button>
          </div>
        )}
      </div>

      {splits.length > 0 && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
          <h2 className="text-xl font-semibold">2. Generated Segments</h2>
          <div className="grid gap-4">
            {splits.map((splitTime, idx) => {
              const startTime = idx === 0 ? 0 : splits[idx - 1];
              const endTime = splitTime;
              return (
                <div key={idx} className="flex justify-between items-center bg-gray-800 p-4 rounded border border-gray-700">
                  <div>
                    <p className="font-semibold">Segment {idx + 1}</p>
                    <p className="text-sm text-gray-400">{Math.floor(startTime)}s - {Math.floor(endTime)}s</p>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => exportSegment(startTime, endTime)} className="bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded text-sm font-semibold">Download WebM</button>
                    <button onClick={() => saveClipToDB(startTime, endTime)} className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-sm font-semibold">Save to Calendar</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
        <h2 className="text-xl font-semibold">3. Content Calendar & Saved Clips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedClips.map((clip) => (
            <div key={clip._id} className="bg-gray-800 p-4 rounded border border-gray-700">
              <h3 className="font-bold text-lg">{clip.title}</h3>
              <p className="text-sm text-gray-400">Time: {Math.floor(clip.startTime)}s - {Math.floor(clip.endTime)}s</p>
              <p className="text-xs text-blue-400 mt-2">{clip.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}