import React, { useState, useCallback, useMemo } from 'react';
import { AppStatus, ConversionType, ConversionFile, FileStatus } from './types';
import FileUploader from './components/FileUploader';
import ResultPanel from './components/ResultPanel';
import ActionBar from './components/ActionBar';
import { convertSvgToPng, convertPngToSvg } from './services/conversionService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import JSZip from 'jszip';

const App: React.FC = () => {
  const [appStatus, setAppStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [files, setFiles] = useState<ConversionFile[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    setGlobalError(null);
    const newConversionFiles: Promise<ConversionFile>[] = Array.from(selectedFiles).map(file => {
      return new Promise((resolve, reject) => {
        const fileType = file.type;
        if (fileType !== 'image/svg+xml' && fileType !== 'image/png') {
          return reject(`${file.name}: 잘못된 파일 형식입니다.`);
        }

        const conversionType = fileType === 'image/svg+xml' ? ConversionType.SVG_TO_PNG : ConversionType.PNG_TO_SVG;
        const reader = new FileReader();

        reader.onload = (e) => {
          const url = e.target?.result as string;
          const image = new Image();
          image.onload = () => {
            resolve({
              id: crypto.randomUUID(),
              file,
              status: FileStatus.QUEUED,
              previewUrl: url,
              width: image.width,
              height: image.height,
              outputPreviewUrl: null,
              conversionType,
              error: null,
            });
          };
          image.onerror = () => reject(`${file.name}: 이미지 크기를 불러올 수 없습니다.`);
          image.src = url;
        };
        reader.onerror = () => reject(`${file.name}: 파일을 읽는데 실패했습니다.`);
        reader.readAsDataURL(file);
      });
    });

    Promise.allSettled(newConversionFiles).then(results => {
      const successfulFiles = results
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<ConversionFile>).value);

      const failedFiles = results
        .filter(r => r.status === 'rejected')
        .map(r => (r as PromiseRejectedResult).reason);

      if (failedFiles.length > 0) {
        setGlobalError(failedFiles.join('\n'));
      }

      if(successfulFiles.length > 0) {
        setFiles(prev => [...prev, ...successfulFiles]);
        setAppStatus(AppStatus.LOADED);
      } else if (files.length === 0) {
        setAppStatus(AppStatus.IDLE);
      }
    });
  }, [files]);

  const updateFileState = (id: string, updates: Partial<ConversionFile>) => {
    setFiles(prevFiles => prevFiles.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleConvertAll = useCallback(async () => {
    setAppStatus(AppStatus.PROCESSING);

    const queue = files.filter(f => f.status === FileStatus.QUEUED);

    for (const fileToConvert of queue) {
      updateFileState(fileToConvert.id, { status: FileStatus.CONVERTING });
      try {
        let resultUrl: string;
        const { file, width, height, conversionType, previewUrl } = fileToConvert;

        if (conversionType === ConversionType.SVG_TO_PNG) {
          const svgContent = await file.text();
          resultUrl = await convertSvgToPng(svgContent, width, height);
        } else {
          resultUrl = await convertPngToSvg(previewUrl, width, height);
        }

        updateFileState(fileToConvert.id, { status: FileStatus.CONVERTED, outputPreviewUrl: resultUrl });
      } catch (err) {
        const message = err instanceof Error ? err.message : '알 수 없는 변환 오류';
        updateFileState(fileToConvert.id, { status: FileStatus.ERROR, error: message });
      }
    }
    setAppStatus(AppStatus.DONE);
  }, [files]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setAppStatus(AppStatus.IDLE);
    setGlobalError(null);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== id);
      if(newFiles.length === 0) {
        setAppStatus(AppStatus.IDLE);
      }
      return newFiles;
    });
  }, []);

  const handleDownloadAll = useCallback(async () => {
    const convertedFiles = files.filter(
      (f) => f.status === FileStatus.CONVERTED && f.outputPreviewUrl
    );
    if (convertedFiles.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();

      const getDownloadFileName = (item: ConversionFile) => {
        const nameWithoutExt = item.file.name.split('.').slice(0, -1).join('.');
        const newExt = item.conversionType === ConversionType.PNG_TO_SVG ? 'svg' : 'png';
        return `${nameWithoutExt}-converted.${newExt}`;
      };

      for (const file of convertedFiles) {
        const response = await fetch(file.outputPreviewUrl!);
        const blob = await response.blob();
        zip.file(getDownloadFileName(file), blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted-images-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP 파일 생성에 실패했습니다.', err);
    } finally {
      setIsZipping(false);
    }
  }, [files]);

  const handleAddMore = useCallback(() => {
    document.getElementById('file-upload')?.click();
  }, []);

  const canConvert = useMemo(() => {
    return files.some(f => f.status === FileStatus.QUEUED);
  }, [files]);

  const queuedFilesCount = useMemo(
    () => files.filter((f) => f.status === FileStatus.QUEUED).length,
    [files]
  );

  const convertedFilesCount = useMemo(
    () => files.filter((f) => f.status === FileStatus.CONVERTED).length,
    [files]
  );

  const isProcessing = appStatus === AppStatus.PROCESSING;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <Header onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* 사이드바 */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 p-4 lg:p-6 overflow-hidden">
            <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* 업로드 패널 */}
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col min-h-[300px]">
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  파일 업로드
                </h2>
                <div className="flex-1">
                  <FileUploader onFileSelect={handleFileSelect} error={globalError} />
                </div>
              </div>

              {/* 결과 패널 */}
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col min-h-[300px]">
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  변환 결과
                </h2>
                <div className="flex-1 overflow-hidden">
                  <ResultPanel files={files} onRemoveFile={handleRemoveFile} />
                </div>
              </div>
            </div>
          </main>

          {/* 액션바 (파일이 있을 때만 표시) */}
          {files.length > 0 && (
            <ActionBar
              filesCount={files.length}
              queuedCount={queuedFilesCount}
              convertedCount={convertedFilesCount}
              isProcessing={isProcessing}
              isZipping={isZipping}
              canConvert={canConvert}
              onConvertAll={handleConvertAll}
              onReset={handleReset}
              onDownloadAll={handleDownloadAll}
              onAddMore={handleAddMore}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
