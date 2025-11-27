import React from 'react';
import { Menu, Trash2, Archive, Play } from 'lucide-react';
import { Button } from './ui/button';
import Spinner from './Spinner';

interface HeaderProps {
  onToggleSidebar?: () => void;
  filesCount?: number;
  isProcessing?: boolean;
  isZipping?: boolean;
  canConvert?: boolean;
  onReset?: () => void;
  onDownloadAll?: () => void;
  onConvertAll?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  filesCount = 0,
  isProcessing = false,
  isZipping = false,
  canConvert = false,
  onReset,
  onDownloadAll,
  onConvertAll,
}) => {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onToggleSidebar}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="툴비 로고" className="w-8 h-8 object-contain" />
        <h1 className="text-lg font-bold text-foreground">
          툴비의 <span className="text-primary">SVG변환기</span>
        </h1>
      </div>

      {/* 액션 버튼들 */}
      {filesCount > 0 && (
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">새로고침</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadAll}
            disabled={isZipping}
          >
            {isZipping ? (
              <Spinner size="sm" className="mr-1" />
            ) : (
              <Archive className="w-4 h-4 mr-1" />
            )}
            <span className="hidden sm:inline">{isZipping ? '압축중...' : 'ZIP 다운로드'}</span>
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
            <span className="hidden sm:inline">{isProcessing ? '변환중...' : '변환하기'}</span>
          </Button>
        </div>
      )}
    </header>
  );
};
