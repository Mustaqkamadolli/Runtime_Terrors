import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { VisionResult, AccessibilitySettings } from '../types';
import { ocrService } from '../services/ocrService';
import { demoEngine } from '../services/demoEngine';
import { speechService } from '../services/speechService';
import { ImageInputSection } from './ImageInputSection';
import { ResultCard } from './ResultCard';
import { ImagePreprocessor } from './ImagePreprocessor';
import { PreprocessOptions } from '../services/ocrService';
import { useAriaAnnouncer } from './AriaLiveAnnouncer';

interface OcrWorkspaceProps {
  settings: AccessibilitySettings;
  onResultGenerated: (result: VisionResult) => void;
  onBackToHome: () => void;
}

export const OcrWorkspace: React.FC<OcrWorkspaceProps> = ({
  settings,
  onResultGenerated,
  onBackToHome
}) => {
  const { announcePolite, announceAssertive } = useAriaAnnouncer();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<VisionResult | null>(null);

  // Optional image enhancements
  const [preprocessOptions, setPreprocessOptions] = useState<PreprocessOptions>({
    rotation: 0,
    grayscale: false,
    contrast: 0
  });
  const [processedCanvas, setProcessedCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleImageSelected = (file: File) => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
    setCurrentResult(null);
    setErrorMessage(null);
    setPreprocessOptions({ rotation: 0, grayscale: false, contrast: 0 });
    setProcessedCanvas(null);
  };

  const handleImageCleared = () => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setCurrentResult(null);
    setErrorMessage(null);
    setProgressPercent(0);
    setProgressStatus('');
    setProcessedCanvas(null);
  };

  // Run Real OCR with Tesseract.js
  const handleExtractText = async () => {
    if (!imagePreviewUrl) {
      announceAssertive('Please provide an image or take a photo first.');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(10);
    setProgressStatus('Initializing local OCR engine...');
    setErrorMessage(null);
    announcePolite('Extracting text from image...');

    try {
      const source = processedCanvas || imagePreviewUrl;

      const ocrData = await ocrService.recognize(source, 'eng', (progress, status) => {
        setProgressPercent(Math.round(progress));
        setProgressStatus(status);
      });

      const text = ocrData.text.trim();
      const isEmpty = text.length === 0;

      const result: VisionResult = {
        id: `ocr-${Date.now()}`,
        mode: 'ocr',
        title: `OCR Text: ${selectedFile ? selectedFile.name : 'Document'}`,
        summary: isEmpty
          ? 'No readable text was detected in this image.'
          : `Extracted ${ocrData.lines.length} lines of text with ${ocrData.confidence}% confidence.`,
        rawOcrText: text,
        visibleText: text,
        confidence: ocrData.confidence,
        limitations: isEmpty
          ? 'The image may be rotated, blurry, low contrast, or poorly lit. Try rotating the image or adjusting contrast using the Image Enhancements below.'
          : 'Live OCR result. Extracted verbatim by on-device Tesseract.js without AI rewriting or guessing.',
        sourceType: 'user-upload',
        processingMethod: 'live-ocr',
        createdAt: new Date().toISOString(),
        imagePreview: imagePreviewUrl
      };

      setCurrentResult(result);
      onResultGenerated(result);
      setIsProcessing(false);
      setProgressStatus('');

      const spokenContent = isEmpty
        ? 'No readable text detected. The sign may be blurry or rotated.'
        : text;

      announcePolite(isEmpty ? 'No text detected' : `OCR finished: ${text}`);
      speechService.speak(spokenContent, settings);
    } catch (err) {
      console.error('OCR Error:', err);
      setIsProcessing(false);
      setProgressStatus('');
      const msg = `OCR could not process this image (${err instanceof Error ? err.message : String(err)}). Try another photo or test with a sample sign.`;
      setErrorMessage(msg);
      announceAssertive(msg);
    }
  };

  // Sample Demonstration Sign
  const handleTrySampleSign = () => {
    const scenario = demoEngine.getScenario('campus-notice') || demoEngine.getAllScenarios()[0];
    const result = demoEngine.generateSampleOcr(scenario.id);

    setCurrentResult(result);
    onResultGenerated(result);
    announcePolite(`Loaded sample sign: ${result.visibleText}`);
    speechService.speak(result.visibleText || result.summary, settings);
  };

  return (
    <section aria-labelledby="ocr-heading" style={{ marginTop: '1.5rem' }}>
      {/* Back button */}
      <button
        type="button"
        onClick={onBackToHome}
        className="btn btn-secondary"
        style={{ marginBottom: '1.25rem', minHeight: 44 }}
        aria-label="Back to main options"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        <span>Back to Home</span>
      </button>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2
          id="ocr-heading"
          style={{ fontSize: 'var(--font-title-md)', fontWeight: 800, marginBottom: '0.4rem' }}
        >
          Read a Sign or Document (Local OCR)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Extract printed words from signs, menus, notices, labels, and receipts using real on-device optical character recognition.
        </p>
      </div>

      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '1.5rem' }}>
        {/* Left Column: Image Input & OCR trigger */}
        <div>
          <ImageInputSection
            onImageSelected={handleImageSelected}
            onImageCleared={handleImageCleared}
            selectedFile={selectedFile}
            imagePreviewUrl={imagePreviewUrl}
            actionButtonLabel="Extract Text from Document"
            onExecuteAction={handleExtractText}
            isProcessing={isProcessing}
            sampleButton={
              <button
                type="button"
                onClick={handleTrySampleSign}
                className="btn btn-accent"
                style={{ width: '100%', minHeight: 48, fontSize: '0.95rem' }}
                aria-label="Test with a sample campus notice document"
              >
                <Sparkles size={18} aria-hidden="true" />
                <span>Try Sample Document Demonstration</span>
              </button>
            }
          />

          {/* OCR Progress indicator */}
          {isProcessing && (
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1rem'
              }}
              role="status"
              aria-live="polite"
            >
              <div
                style={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'var(--bg-secondary)',
                  overflow: 'hidden',
                  marginBottom: '0.5rem'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    backgroundColor: 'var(--success-color)',
                    transition: 'width 0.2s ease'
                  }}
                />
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', textAlign: 'center' }}>
                {progressStatus || `Processing OCR: ${progressPercent}%`}
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: 'var(--error-bg)',
                color: 'var(--error-color)',
                border: '1px solid var(--error-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              role="alert"
            >
              <AlertCircle size={20} aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Optional Preprocessing (Rotate, Grayscale, Contrast) */}
          {imagePreviewUrl && (
            <ImagePreprocessor
              imageSrc={imagePreviewUrl}
              options={preprocessOptions}
              onChangeOptions={setPreprocessOptions}
              onProcessedCanvasReady={(canvas) => setProcessedCanvas(canvas)}
            />
          )}
        </div>

        {/* Right Column: Extracted Text Result Card */}
        <div>
          {currentResult ? (
            <ResultCard
              result={currentResult}
              settings={settings}
              onClear={() => setCurrentResult(null)}
            />
          ) : (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '3.5rem 2rem',
                color: 'var(--color-slate)',
                backgroundColor: 'var(--color-fog)',
                border: '1px dashed var(--border-hairline)',
                borderRadius: 'var(--radius-asymmetric-card)'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-polysans)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--color-graphite)', marginBottom: '0.5rem' }}>
                No Text Extracted Yet
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--color-steel)', maxWidth: 360, margin: '0 auto 1.5rem auto' }}>
                Capture or select an image of a sign, notice, label, or menu, then press "Extract Text from Document".
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
