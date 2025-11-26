import React from 'react';
import { ConversionFile, FileStatus, ConversionType } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Spinner from './Spinner';
import {
  Download,
  CheckCircle,
  AlertTriangle,
  X,
  ArrowRight,
  FileImage,
  FileCode,
  ImageOff,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ResultPanelProps {
  files: ConversionFile[];
  onRemoveFile: (id: string) => void;
}

const FileListItem: React.FC<{
  item: ConversionFile;
  onRemove: (id: string) => void;
}> = ({ item, onRemove }) => {
  const getDownloadFileName = () => {
    const nameWithoutExt = item.file.name.split('.').slice(0, -1).join('.');
    const newExt = item.conversionType === ConversionType.PNG_TO_SVG ? 'svg' : 'png';
    return `${nameWithoutExt}-converted.${newExt}`;
  };

  const StatusBadge = () => {
    switch (item.status) {
      case FileStatus.QUEUED:
        return <Badge variant="warning">대기</Badge>;
      case FileStatus.CONVERTING:
        return (
          <Badge variant="processing" className="gap-1">
            <Spinner size="sm" className="w-3 h-3" />
            변환중
          </Badge>
        );
      case FileStatus.CONVERTED:
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            완료
          </Badge>
        );
      case FileStatus.ERROR:
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            오류
          </Badge>
        );
    }
    return null;
  };

  const ConversionIcon = item.conversionType === ConversionType.PNG_TO_SVG ? FileCode : FileImage;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group">
      <div className="relative flex-shrink-0">
        <img
          src={item.previewUrl}
          alt="Original"
          className="w-10 h-10 object-contain bg-background rounded"
        />
        <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-background border border-border">
          <ConversionIcon className="w-2.5 h-2.5 text-primary" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate" title={item.file.name}>
          {item.file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {item.width}x{item.height}
        </p>
      </div>

      <StatusBadge />

      {item.status === FileStatus.CONVERTED ? (
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href={item.outputPreviewUrl!} download={getDownloadFileName()}>
            <Download className="w-4 h-4" />
          </a>
        </Button>
      ) : (
        <div className="w-8" />
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(item.id)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

const ResultPanel: React.FC<ResultPanelProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="p-4 rounded-2xl bg-secondary mb-4">
          <ImageOff className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">변환 결과가 여기에 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto space-y-2 pr-1">
        {files.map((file) => (
          <FileListItem key={file.id} item={file} onRemove={onRemoveFile} />
        ))}
      </div>
    </div>
  );
};

export default ResultPanel;
