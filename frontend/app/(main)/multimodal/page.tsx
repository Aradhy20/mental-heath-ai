"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Video, Type, Play, Square, Loader2, BrainCircuit } from "lucide-react";
import { toast } from "react-hot-toast";

export default function MultimodalInputPage() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [result, setResult] = useState<any>(null);

  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Behavioral metrics
  const typingStartTime = useRef<number | null>(null);
  const charCount = useRef(0);
  const lastActiveTime = useRef<number>(Date.now());
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [inactivitySec, setInactivitySec] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const inactive = (Date.now() - lastActiveTime.current) / 1000;
      setInactivitySec(Math.round(inactive));
      
      if (typingStartTime.current && charCount.current > 0) {
        const mins = (Date.now() - typingStartTime.current) / 60000;
        const words = charCount.current / 5;
        setTypingSpeed(Math.round(words / mins));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!typingStartTime.current) typingStartTime.current = Date.now();
    lastActiveTime.current = Date.now();
    charCount.current = val.length;
    setText(val);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      toast.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureImage = (): string | null => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return null;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      return canvasRef.current.toDataURL("image/jpeg");
    }
    return null;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          submitFusion(base64Audio);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecordingAndSubmit = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    } else {
      // If not recording voice, just submit text and face
      submitFusion(null);
    }
  };

  const submitFusion = async (audioBase64: string | null) => {
    setIsProcessing(true);
    try {
      const imageBase64 = captureImage();
      
      const payload = {
        text: text,
        audio_base64: audioBase64,
        image_base64: imageBase64,
        typing_speed_wpm: typingSpeed,
        inactivity_sec: inactivitySec,
        session_duration_sec: 60, // Mock session duration
      };

      const res = await fetch("http://localhost:8000/api/v1/input/fusion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Fusion processing failed");
      const data = await res.json();
      setResult(data);
      setText("");
      typingStartTime.current = null;
      charCount.current = 0;
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex justify-center items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-primary" />
          Multimodal Emotional Input
        </h1>
        <p className="text-muted-foreground">
          Combines Text, Voice, Facial Expressions, and Typing Behavior.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Col: Inputs */}
        <div className="space-y-4">
          <div className="bg-card border rounded-2xl p-4 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-500" /> Camera Input
            </h2>
            <div className="aspect-video bg-muted rounded-xl overflow-hidden relative flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`} />
              <canvas ref={canvasRef} className="hidden" />
              {!isCameraActive && <span className="text-muted-foreground">Camera Off</span>}
            </div>
            <button
              onClick={isCameraActive ? stopCamera : startCamera}
              className="w-full py-2 rounded-xl border bg-secondary/50 hover:bg-secondary transition"
            >
              {isCameraActive ? "Stop Camera" : "Start Camera"}
            </button>
          </div>

          <div className="bg-card border rounded-2xl p-4 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Type className="w-5 h-5 text-green-500" /> Text & Behavior
            </h2>
            <textarea
              className="w-full bg-background border rounded-xl p-3 focus:ring-2 outline-none resize-none h-24"
              placeholder="Type how you are feeling..."
              value={text}
              onChange={handleTextChange}
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Typing Speed: {typingSpeed} WPM</span>
              <span>Inactivity: {inactivitySec}s</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={isRecording ? stopRecordingAndSubmit : startRecording}
              disabled={isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition ${
                isRecording 
                  ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20" 
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {isRecording ? (
                <><Square className="w-5 h-5" /> Stop & Process</>
              ) : (
                <><Mic className="w-5 h-5" /> Start Voice Input</>
              )}
            </button>
            {!isRecording && (
              <button
                onClick={stopRecordingAndSubmit}
                disabled={isProcessing || (!text && !isCameraActive)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-secondary hover:bg-secondary/80 transition"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Process Now"}
              </button>
            )}
          </div>
        </div>

        {/* Right Col: Output */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Fusion Analysis Engine</h2>
          {result ? (
            <div className="space-y-6 flex-1">
              <div className="text-center p-6 bg-secondary/30 rounded-2xl border">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Final Emotion</p>
                <p className="text-4xl font-bold capitalize text-primary">{result.final_emotion}</p>
                <p className="text-xs text-muted-foreground mt-2">Confidence: {(result.confidence_score * 100).toFixed(1)}%</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Component Analysis</p>
                {["text", "voice", "face", "behavior"].map((comp) => {
                  const scores = result.component_scores[comp];
                  const topEmotion = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
                  return (
                    <div key={comp} className="flex items-center justify-between bg-background border p-2 px-3 rounded-lg text-sm">
                      <span className="capitalize font-medium text-muted-foreground">{comp}</span>
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{topEmotion}</span>
                        <span className="text-xs text-muted-foreground w-10 text-right">
                          {(scores[topEmotion] * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-sm font-semibold text-primary mb-1">AI Response</p>
                <p className="text-sm leading-relaxed">{result.reply}</p>
                <p className="text-xs text-muted-foreground mt-3 italic">{result.reasoning}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4">
              <BrainCircuit className="w-16 h-16" />
              <p>Waiting for multimodal input...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
