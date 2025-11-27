import React, { useState, useCallback } from 'react';
import { Upload, AlertTriangle, FileImage, FileCode, FolderUp, X, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { ConversionFile, ConversionType } from '../types';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  error: string | null;
  files?: ConversionFile[];
  onRemoveFile?: (id: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, error, files = [], onRemoveFile }) => {
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
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      onFileSelect(Array.from(droppedFiles));
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      onFileSelect(Array.from(selectedFiles));
    }
    e.target.value = '';
  };

  // 파일이 없을 때: 업로드 영역만 표시
  if (files.length === 0) {
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
  }

  // 파일이 있을 때: 미리보기 그리드 + 추가 버튼
  return (
    <div className="h-full flex flex-col">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'flex-1 rounded-xl overflow-auto transition-all duration-300',
          isDragging && 'ring-2 ring-primary bg-primary/5'
        )}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2">
          {/* 파일 미리보기 */}
          {files.map((file) => (
            <div
              key={file.id}
              className="relative group aspect-square bg-secondary rounded-lg overflow-hidden border border-border"
            >
              <img
                src={file.previewUrl}
                alt={file.file.name}
                className="w-full h-full object-contain p-2"
              />
              {/* 파일 타입 뱃지 */}
              <div className="absolute bottom-1 left-1">
                <span className={cn(
                  'text-[10px] font-medium px-1.5 py-0.5 rounded',
                  file.conversionType === ConversionType.PNG_TO_SVG
                    ? 'bg-blue-500/20 text-blue-600'
                    : 'bg-green-500/20 text-green-600'
                )}>
                  {file.conversionType === ConversionType.PNG_TO_SVG ? 'PNG→SVG' : 'SVG→PNG'}
                </span>
              </div>
              {/* 삭제 버튼 */}
              {onRemoveFile && (
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* 추가 버튼 */}
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className={cn(
              'aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all',
              'border-border hover:border-primary/50 hover:bg-accent/30 text-muted-foreground hover:text-primary'
            )}
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs">추가</span>
          </button>
        </div>
      </div>

      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        onChange={handleFileChange}
        accept=".png,.svg"
        multiple
      />

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
