import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Upload } from 'lucide-react';
import axios from 'axios';

const Recorder = ({ onResult }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const fileInputRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                await uploadAudio(audioBlob, 'voice.webm');
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing mic:", err);
            alert("Microphone access denied or error occurred.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await uploadAudio(file, file.name);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            await uploadAudio(file, file.name);
        } else {
            alert("Please drop a valid audio file.");
        }
    };

    const uploadAudio = async (blob, filename) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', blob, filename);

        try {
            const response = await axios.post('http://localhost:8000/process-voice', formData);
            onResult(response.data);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to process voice input.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 py-4">
            {/* Intake Options Segmented (Informational) */}
            <div className="flex justify-center items-center gap-10 opacity-40">
                <div className="flex items-center gap-2">
                    <Mic size={14} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Live Stream</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className="flex items-center gap-2">
                    <Upload size={14} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">File Intake</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-10">
                <div className="relative">
                    <div className={`btn-record ${isRecording ? 'recording' : ''} disabled:opacity-50 !m-0`}>
                        <div className="voice-wave" />
                        <div className="voice-wave" />
                        <div className="voice-wave" />

                        <button
                            className="w-full h-full rounded-full flex justify-center items-center transition-transform active:scale-90"
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin text-white" size={36} /> :
                                isRecording ? <Square size={36} className="text-white fill-white" /> : <Mic size={36} className="text-white" />}
                        </button>
                    </div>
                </div>

                <div
                    className={`drop-zone group ${isDragging ? 'active' : ''} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <div className="drop-zone-icon">
                        <Upload size={24} />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                            {isLoading ? 'Decrypting Protocol...' : 'Intel Deployment (Drag & Drop)'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            Or tap to select audio from archives
                        </p>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <div className="flex justify-center items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                            {isRecording ? 'Recording Live Feed' : 'Encrypted Input Ready'}
                        </p>
                    </div>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="audio/*"
                onChange={handleFileUpload}
            />
        </div>
    );
};

export default Recorder;
