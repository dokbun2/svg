import React, { useState, useCallback } from 'react';
import { Upload, AlertTriangle, FileImage, FileCode, FolderUp } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  error: string | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(Array.from(files));
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(Array.from(files));
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/50 hover:bg-accent/30'
        )}
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div
            className={cn(
              'p-4 rounded-2xl mb-6 transition-all duration-300',
              isDragging
                ? 'bg-primary/20 scale-110'
                : 'bg-secondary'
            )}
          >
            {isDragging ? (
              <FolderUp className="w-10 h-10 text-primary animate-bounce" />
            ) : (
              <Upload className="w-10 h-10 text-muted-foreground" />
            )}
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isDragging ? '여기에 놓으세요!' : '파일을 드래그하여 업로드'}
          </h3>

          <p className="text-sm text-muted-foreground mb-6">또는</p>

          <Button
            variant="default"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <FolderUp className="w-4 h-4 mr-2" />
            파일 선택
          </Button>

          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept=".png,.svg"
            multiple
          />

          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FileImage className="w-4 h-4 text-primary" />
              <span>PNG</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-primary" />
              <span>SVG</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <span className="text-sm text-destructive whitespace-pre-wrap">
              {error}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
