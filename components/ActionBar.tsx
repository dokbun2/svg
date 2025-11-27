import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Spinner from './Spinner';
import { Play, Trash2, Archive, Plus } from 'lucide-react';

interface ActionBarProps {
  filesCount: number;
  queuedCount: number;
  convertedCount: number;
  isProcessing: boolean;
  isZipping: boolean;
  canConvert: boolean;
  onConvertAll: () => void;
  onReset: () => void;
  onDownloadAll: () => void;
  onAddMore: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  filesCount,
  queuedCount,
  convertedCount,
  isProcessing,
  isZipping,
  canConvert,
  onConvertAll,
  onReset,
  onDownloadAll,
  onAddMore,
}) => {
  return (
    <div className="h-16 border-t border-border bg-card px-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          파일 <Badge variant="secondary">{filesCount}</Badge>
        </span>
        {queuedCount > 0 && (
          <span className="text-sm text-muted-foreground">
            대기 <Badge variant="warning">{queuedCount}</Badge>
          </span>
        )}
        {convertedCount > 0 && (
          <span className="text-sm text-muted-foreground">
            완료 <Badge variant="success">{convertedCount}</Badge>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onAddMore}>
          <Plus className="w-4 h-4 mr-1" />
          추가
        </Button>

        <Button variant="outline" size="sm" onClick={onReset}>
          <Trash2 className="w-4 h-4 mr-1" />
          새로고침
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadAll}
          disabled={isZipping || convertedCount === 0}
        >
          {isZipping ? (
            <Spinner size="sm" className="mr-1" />
          ) : (
            <Archive className="w-4 h-4 mr-1" />
          )}
          {isZipping ? '압축중...' : 'ZIP 다운로드'}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onConvertAll}
          disabled={isProcessing || !canConvert}
        >
          {isProcessing ? (
            <Spinner size="sm" className="mr-1" />
          ) : (
            <Play className="w-4 h-4 mr-1" />
          )}
          {isProcessing ? '변환중...' : '변환하기'}
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
