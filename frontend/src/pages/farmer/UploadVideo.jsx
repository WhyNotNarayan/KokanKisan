import { useState, useRef } from 'react';
import { Video, Camera, Upload } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export default function UploadVideo() {
  const user = useAuthStore((s) => s.user);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      toast.error('Camera access denied. Please allow camera access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!videoUrl) return;
    setUploading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Farm video uploaded! Your trust score will improve.');
      setVideoUrl(null);
    } catch (err) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Upload Farm Video</h1>
      <p className="text-gray-500 mb-6">Record a weekly video of your farm to build buyer trust. Each upload earns +2 trust score points.</p>

      <div className="card">
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 relative">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />

          {!recording && !videoUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <Camera className="w-16 h-16 mb-4" />
              <p>Click "Start Recording" to begin</p>
            </div>
          )}

          {recording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              REC
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!recording && !videoUrl && (
            <button onClick={startRecording} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Video className="w-5 h-5" /> Start Recording
            </button>
          )}

          {recording && (
            <button onClick={stopRecording} className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex-1">
              Stop Recording
            </button>
          )}

          {videoUrl && (
            <>
              <button onClick={() => { setVideoUrl(null); }} className="btn-outline flex-1">
                Record Again
              </button>
              <button onClick={handleUpload} className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={uploading}>
                <Upload className="w-5 h-5" /> {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="font-semibold mb-3">Video Guidelines</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Show your actual farm and crops</li>
          <li>• Keep videos between 30 seconds to 2 minutes</li>
          <li>• Speak naturally about what you're growing</li>
          <li>• No editing or filters — authenticity matters</li>
          <li>• Upload at least once a week for maximum trust score</li>
        </ul>
      </div>
    </div>
  );
}
