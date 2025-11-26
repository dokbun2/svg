# SVG 변환기 (SVG Converter)

클라이언트 측에서 PNG와 SVG 이미지를 상호 변환하는 웹 애플리케이션입니다. 모든 파일 처리는 사용자의 브라우저에서 직접 이루어지므로, 파일이 서버에 업로드되지 않아 개인 정보가 보호됩니다.

실행주소1 : https://svg-converter-three.vercel.app/

실행주소2 : https://dev-canvas-pi.vercel.app/


## ✨ 주요 기능

*   **PNG ↔ SVG 변환**: PNG 이미지를 SVG로, SVG 이미지를 PNG로 변환합니다.
*   **100% 클라이언트 측 처리**: 모든 변환 과정이 브라우저 내에서 안전하게 처리됩니다. 서버 업로드가 필요 없습니다.
*   **일괄 처리**: 여러 파일을 동시에 업로드하고 한 번에 변환할 수 있습니다.
*   **드래그 앤 드롭**: 간편한 파일 업로드를 위한 드래그 앤 드롭 인터페이스를 지원합니다.
*   **ZIP으로 다운로드**: 변환된 모든 파일을 한 번에 ZIP 아카이브로 다운로드할 수 있습니다.
*   **반응형 디자인**: 데스크톱, 태블릿, 모바일 등 다양한 기기에서 원활하게 작동합니다.

## ⚙️ 작동 방식

### PNG → SVG 변환
이 과정은 PNG 이미지를 벡터 그래픽으로 추적(tracing)하는 것이 아닙니다. 대신, 원본 PNG 이미지를 `<image>` 태그를 사용하여 SVG 파일 내에 포함(embedding)시킵니다. 따라서 결과물은 벡터가 아닌 래스터 이미지를 포함한 SVG가 됩니다.

```xml
<svg width="..." height="..." ...>
  <image href="data:image/png;base64,..." ... />
</svg>
```

### SVG → PNG 변환
SVG 파일은 보이지 않는 HTML5 `<canvas>` 요소에 렌더링됩니다. 그런 다음 캔버스의 내용을 PNG 형식의 데이터 URL로 내보내어 다운로드할 수 있도록 합니다.

## 🛠️ 기술 스택

*   **프레임워크**: [React](https://reactjs.org/)
*   **언어**: [TypeScript](https://www.typescriptlang.org/)
*   **스타일링**: [Tailwind CSS](https://tailwindcss.com/)
*   **압축**: [JSZip](https://stuk.github.io/jszip/) (모두 다운로드 기능용)
*   **빌드 도구**: 별도의 빌드 과정 없이 브라우저에서 직접 ES 모듈을 사용합니다.

## 🚀 사용 방법

1.  **파일 업로드**: 변환할 PNG 또는 SVG 파일을 드래그 앤 드롭 영역으로 끌어다 놓거나, '파일 찾아보기' 버튼을 클릭하여 선택합니다.
2.  **변환 시작**: 업로드된 파일 목록이 표시됩니다. '대기중인 파일 변환' 버튼을 클릭하여 변환을 시작합니다.
3.  **상태 확인**: 각 파일의 변환 상태(대기중, 변환중, 완료, 오류)를 실시간으로 확인할 수 있습니다.
4.  **다운로드**: 변환이 완료되면 각 파일 옆의 다운로드 버튼을 클릭하거나, '모두 다운로드' 버튼을 클릭하여 모든 결과물을 ZIP 파일로 한 번에 받을 수 있습니다.
5.  **초기화**: '모두 지우기' 버튼을 클릭하여 목록을 비우고 새로 시작할 수 있습니다.

## 📂 프로젝트 구조

```
/
├── components/         # React 컴포넌트
│   ├── BatchProcessor.tsx
│   ├── Button.tsx
│   ├── FileUploader.tsx
│   ├── Header.tsx
│   ├── Icons.tsx
│   └── Spinner.tsx
├── services/           # 이미지 변환 로जिक
│   └── conversionService.ts
├── App.tsx             # 메인 애플리케이션 컴포넌트
├── index.html          # HTML 진입점
├── index.tsx           # React 앱 마운트 스크립트
├── metadata.json       # 앱 메타데이터
├── types.ts            # TypeScript 타입 정의
└── README.md           # 프로젝트 설명 파일
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스에 따라 배포됩니다.
