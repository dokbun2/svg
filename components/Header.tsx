import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
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
    </header>
  );
};
