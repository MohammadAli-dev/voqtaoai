import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, FileAudio, AlertCircle, Link as LinkIcon, FileVideo, X, Play, Music, Video, Sparkles } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUrlSelect: (url: string) => void;
  selectedFile: { name: string; type: string } | null;
  onRemove: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  onUrlSelect, 
  selectedFile, 
  onRemove, 
  onAnalyze,
  isAnalyzing 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'link'>('upload');
  const [urlInput, setUrlInput] = useState('');
  
  // Loading state management
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const loadingMessages = [
    "Uploading media securely...",
    "Extracting audio data...",
    "Transcribing conversation...",
    "Identifying speakers (Diarization)...",
    "Analyzing sentiment patterns...",
    "Detecting sales objections...",
    "Generating coaching insights...",
    "Finalizing analysis report..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setLoadingMsgIndex(0);
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 2500); // Change message every 2.5s
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check MIME type or extension
    const validMimeTypes = [
      'audio/', 'video/', // Broad categories
    ];
    
    // Explicit extensions to support cases where browser doesn't detect MIME type correctly (e.g. m4a)
    const validExtensions = ['.mp3', '.wav', '.m4a', '.mp4', '.mov', '.aac', '.flac', '.ogg', '.webm'];
    
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = file.type.startsWith('audio/') || 
                        file.type.startsWith('video/') || 
                        validExtensions.includes(fileExtension);

    if (!isValidType) {
      setError("Please upload a valid audio (MP3, WAV, M4A, AAC) or video (MP4, MOV) file.");
      return;
    }

    // Limit to approx 200MB for this demo (browser constraint)
    if (file.size > 200 * 1024 * 1024) {
      setError("File size exceeds 200MB limit.");
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    try {
        new URL(urlInput);
        onUrlSelect(urlInput);
    } catch {
        setError("Please enter a valid URL.");
    }
  };

  // Render "Selected File" View
  if (selectedFile) {
    const isVideo = selectedFile.type.startsWith('video/') || selectedFile.name.endsWith('.mp4') || selectedFile.name.endsWith('.mov');
    
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 px-4 animate-fade-in">
        <style>{`
          @keyframes indeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-indeterminate {
            animation: indeterminate 1.5s infinite linear;
          }
        `}</style>
        
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden min-h-[320px] flex flex-col justify-center transition-all duration-300">
          
          {isAnalyzing ? (
            <div className="p-8 flex flex-col items-center text-center">
              {/* Animation Container */}
              <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                 {/* Pulsing Background */}
                 <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-75"></div>
                 
                 {/* Spinning Ring */}
                 <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                 
                 {/* Icon */}
                 <div className="relative bg-white rounded-full p-4 shadow-sm z-10">
                   <Sparkles className="text-primary-600" size={32} />
                 </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Analyzing Conversation
              </h3>
              
              <div className="h-6 overflow-hidden relative w-full">
                 <p key={loadingMsgIndex} className="text-primary-600 font-medium animate-fade-in absolute w-full left-0 top-0">
                   {loadingMessages[loadingMsgIndex]}
                 </p>
              </div>

              {/* Indeterminate Progress Bar */}
              <div className="w-full max-w-xs h-1.5 bg-gray-100 rounded-full mt-8 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-transparent via-primary-500 to-transparent w-1/2 h-full animate-indeterminate rounded-full"></div>
              </div>
              
              <p className="text-xs text-gray-400 mt-4">
                This may take up to a minute depending on call length.
              </p>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center text-center">
              <div className={`
                w-20 h-20 rounded-2xl flex items-center justify-center mb-6
                ${isVideo ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}
              `}>
                {isVideo ? <Video size={40} /> : <Music size={40} />}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 break-all max-w-full">
                {selectedFile.name}
              </h3>
              <p className="text-gray-500 mb-8">Ready to analyze</p>

              <div className="flex gap-4 w-full max-w-md">
                <button
                  onClick={onRemove}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <X size={18} />
                  Remove
                </button>
                <button
                  onClick={onAnalyze}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30"
                >
                  <Play size={18} fill="currentColor" />
                  Analyze
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render "Upload/Link" View
  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex">
          <button
            onClick={() => { setMode('upload'); setError(null); }}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'upload' 
                ? 'bg-primary-100 text-primary-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => { setMode('link'); setError(null); }}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'link' 
                ? 'bg-primary-100 text-primary-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Paste Link
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <>
          <div 
            className={`
              relative flex flex-col items-center justify-center w-full h-80 
              rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer
              ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-primary-400'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
          >
            <div className="flex flex-col items-center text-center p-6 pointer-events-none">
              <div className="bg-primary-100 p-4 rounded-full mb-4 text-primary-600">
                <UploadCloud size={48} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Sales Recording
              </h3>
              
              <p className="text-gray-500 mb-6 max-w-sm">
                Drag and drop audio (mp3, m4a, wav) or video (mp4, mov) here, or click to browse.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="audio/*,video/*,.m4a,.mp3,.wav,.aac,.ogg,.flac,.mp4,.mov,.webm"
                onChange={handleChange}
              />
              
              <div
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl shadow-sm flex items-center gap-2"
              >
                <FileVideo size={18} />
                Select Media File
              </div>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">
            Supports M4A, MP3, WAV, AAC, MP4, MOV. Max 200MB.
          </p>
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 h-80 flex flex-col justify-center items-center shadow-sm">
            <div className="bg-primary-100 p-4 rounded-full mb-4 text-primary-600">
                <LinkIcon size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyze from URL</h3>
            <p className="text-gray-500 mb-6 text-center max-w-sm">
              Paste a direct link to an audio or video file. <br/>
              <span className="text-xs text-gray-400">(Note: YouTube links are not supported in this demo)</span>
            </p>
            
            <form onSubmit={handleUrlSubmit} className="w-full max-w-md flex gap-2">
                <input 
                  type="url" 
                  placeholder="https://example.com/recording.mp4"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Next
                </button>
            </form>
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg justify-center animate-fade-in">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};