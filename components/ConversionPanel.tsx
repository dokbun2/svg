import React from 'react';
import { AppStatus, ConversionType } from '../types';
import Button from './Button';
import Spinner from './Spinner';
import { DownloadIcon, FileCodeIcon, FileImageIcon, RepeatIcon, AlertTriangleIcon } from './Icons';

interface ConversionPanelProps {
  status: AppStatus;
  inputFileData: { file: File; previewUrl: string; width: number, height: number } | null;
  outputPreviewUrl: string | null;
  conversionType: ConversionType | null;
  onConvert: () => void;
  onReset: () => void;
}

const fileTypeLabels = {
  [ConversionType.PNG_TO_SVG]: { original: 'PNG', converted: 'SVG', icon: <FileImageIcon className="w-6 h-6" /> },
  [ConversionType.SVG_TO_PNG]: { original: 'SVG', converted: 'PNG', icon: <FileCodeIcon className="w-6 h-6" /> },
};

const ConversionPanel: React.FC<ConversionPanelProps> = ({
  status,
  inputFileData,
  outputPreviewUrl,
  conversionType,
  onConvert,
  onReset,
}) => {
  if (!inputFileData || !conversionType) return null;

  const { file, previewUrl, width, height } = inputFileData;
  const labels = fileTypeLabels[conversionType];
  const isConverting = status === AppStatus.PROCESSING;
  const isConverted = status === AppStatus.DONE;

  const getDownloadFileName = () => {
    const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
    const newExt = conversionType === ConversionType.PNG_TO_SVG ? 'svg' : 'png';
    return `${nameWithoutExt}-converted.${newExt}`;
  };
  
  const renderOutputCardContent = () => {
    if (isConverting) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner />
          <p className="mt-4 text-text-secondary">변환 중...</p>
        </div>
      );
    }
    if (isConverted && outputPreviewUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <img src={outputPreviewUrl} alt="Converted" className="max-w-full max-h-full object-contain" />
        </div>
      );
    }
    return (
       <div className="flex flex-col items-center justify-center h-full text-text-secondary">
          <p>변환 준비 완료</p>
        </div>
    );
  };
  
  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Input Card */}
          <div className="bg-base-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="p-4 bg-base-300/50 border-b border-base-300 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">{labels.icon} 원본 ({labels.original})</h3>
            </div>
            <div className="aspect-w-1 aspect-h-1 flex-grow flex items-center justify-center p-4 min-h-[300px]">
                <img src={previewUrl} alt="Original input" className="max-w-full max-h-full object-contain"/>
            </div>
             <div className="p-4 bg-base-300/50 border-t border-base-300 text-sm text-text-secondary">
                {file.name} &bull; {width}x{height}px
            </div>
          </div>
          
          {/* Output Card */}
          <div className="bg-base-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="p-4 bg-base-300/50 border-b border-base-300 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">{conversionType === ConversionType.PNG_TO_SVG ? <FileCodeIcon className="w-6 h-6" /> : <FileImageIcon className="w-6 h-6"/>} 변환됨 ({labels.converted})</h3>
            </div>
             <div className="aspect-w-1 aspect-h-1 flex-grow flex items-center justify-center min-h-[300px]">
                {renderOutputCardContent()}
            </div>
            <div className="p-4 bg-base-300/50 border-t border-base-300 text-sm text-text-secondary flex items-center">
              {conversionType === ConversionType.PNG_TO_SVG && isConverted && outputPreviewUrl &&
                <div className="flex items-center gap-2 text-yellow-400">
                    <AlertTriangleIcon className="w-4 h-4" />
                    <p>참고: PNG가 포함되었으며, 벡터화(트레이싱)된 것이 아닙니다.</p>
                </div>
              }
              <span className="flex-grow">&nbsp;</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button onClick={onReset} variant="secondary">
                <RepeatIcon className="w-5 h-5 mr-2" />
                다른 파일 변환하기
            </Button>
            {isConverted && outputPreviewUrl ? (
                <Button onClick={() => {}} variant="primary" as="a" href={outputPreviewUrl} download={getDownloadFileName()}>
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    {labels.converted} 다운로드
                </Button>
            ) : (
                <Button onClick={onConvert} disabled={isConverting} variant="primary">
                    {isConverting ? <Spinner size="sm" /> : <RepeatIcon className="w-5 h-5 mr-2" />}
                    {isConverting ? '변환 중...' : `${labels.converted}(으)로 변환`}
                </Button>
            )}
        </div>
    </div>
  );
};

export default ConversionPanel;