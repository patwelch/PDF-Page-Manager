
import React, { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  isPrimary: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, isPrimary }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesChange(Array.from(event.target.files));
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);
  
  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Fix: Explicitly type `file` as `File` to resolve TypeScript inference issue.
      const pdfFiles = Array.from(e.dataTransfer.files).filter((file: File) => file.type === 'application/pdf');
      if(pdfFiles.length !== e.dataTransfer.files.length) {
        alert("Only PDF files are accepted. Non-PDF files have been ignored.");
      }
      if (pdfFiles.length > 0) {
        onFilesChange(pdfFiles);
      }
      e.dataTransfer.clearData();
    }
  }, [onFilesChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  }

  if (!isPrimary) {
    return (
      <>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="application/pdf"
        />
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add More Files
        </button>
      </>
    );
  }

  return (
    <div 
      className={`flex-grow flex items-center justify-center p-8 w-full `}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div 
        onClick={handleClick}
        className={`relative w-full max-w-2xl p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-400 bg-slate-50 hover:bg-slate-200'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="application/pdf"
        />
        <svg className="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-2 text-lg font-semibold text-slate-700">Click to upload or drag & drop</p>
        <p className="mt-1 text-sm text-slate-500">PDF files only</p>
      </div>
    </div>
  );
};

export default FileUpload;