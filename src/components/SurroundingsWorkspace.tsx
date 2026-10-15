import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { VisionResult, AccessibilitySettings } from '../types';
import { demoEngine } from '../services/demoEngine';
import { speechService } from '../services/speechService';
import { ImageInputSection } from './ImageInputSection';
import { ResultCard } from './ResultCard';
import { useAriaAnnouncer } from './AriaLiveAnnouncer';

interface SurroundingsWorkspaceProps {
  settings: AccessibilitySettings;
  onResultGenerated: (result: VisionResult) => void;
  onBackToHome: () => void;
}

export const SurroundingsWorkspace: React.FC<SurroundingsWorkspaceProps> = ({
  settings,
  onResultGenerated,
  onBackToHome
}) => {
  const { announcePolite, announceAssertive } = useAriaAnnouncer();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<VisionResult | null>(null);

  // Clean up preview object URL on unmount or file change
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
  };

  const handleImageCleared = () => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setCurrentResult(null);
  };

  // Honest analysis: Discloses that live arbitrary VLM is not installed
  const handleDescribe = () => {
    if (!selectedFile) {
      announceAssertive('Please select an image or take a photo first.');
      return;
    }

    setIsProcessing(true);
    announcePolite('Processing image...');

    setTimeout(() => {
      const result: VisionResult = {
        id: `describe-${Date.now()}`,
        mode: 'describe',
        title: `Selected Image: ${selectedFile.name}`,
        summary: 'Live image understanding is not available in this version. You can use Read a Sign or Document to extract visible text, or try a sample demonstration.',
        details: 'SeeAble AI operates 100% offline without external paid cloud AI APIs. To experience deterministic scene descriptions, try one of our curated demonstration scenes below. To read real text from your photo, switch to the Read a Sign or Document tool.',
        limitations: 'Honest AI Notice: General-purpose computer vision is disabled in this prototype. No external AI APIs or hallucinated descriptions are generated.',
        sourceType: 'user-upload',
        processingMethod: 'unsupported',
        createdAt: new Date().toISOString(),
        imagePreview: imagePreviewUrl || undefined
      };

      setCurrentResult(result);
      onResultGenerated(result);
      setIsProcessing(false);

      announcePolite(result.summary);
      speechService.speak(result.summary, settings);
    }, 400);
  };

  // Quick demonstration sample
  const handleTrySample = () => {
    const scenario = demoEngine.getScenario('campus-notice') || demoEngine.getAllScenarios()[0];
    const result = demoEngine.generateDescription(scenario.id, 'quick');

    setCurrentResult(result);
    onResultGenerated(result);
    announcePolite(`Loaded sample demonstration: ${result.title}. ${result.summary}`);
    speechService.speak(`${result.title}. ${result.summary}`, settings);
  };

  return (
    <section aria-labelledby="describe-heading" style={{ marginTop: '1.5rem' }}>
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
          id="describe-heading"
          style={{ fontSize: 'var(--font-title-md)', fontWeight: 800, marginBottom: '0.4rem' }}
        >
          Describe My Surroundings
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Take a photo or select an image to inspect your environment, or test with a sample demonstration scene.
        </p>
      </div>

      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '1.5rem' }}>
        {/* Left Column: Image Input */}
        <div>
          <ImageInputSection
            onImageSelected={handleImageSelected}
            onImageCleared={handleImageCleared}
            selectedFile={selectedFile}
            imagePreviewUrl={imagePreviewUrl}
            actionButtonLabel="Describe This Image"
            onExecuteAction={handleDescribe}
            isProcessing={isProcessing}
            sampleButton={
              <button
                type="button"
                onClick={handleTrySample}
                className="btn btn-accent"
                style={{ width: '100%', minHeight: 48, fontSize: '0.95rem' }}
                aria-label="Test with a sample campus notice demonstration"
              >
                <Sparkles size={18} aria-hidden="true" />
                <span>Try Sample Demonstration Scene</span>
              </button>
            }
          />
        </div>

        {/* Right Column: Result Card */}
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
                No Description Yet
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--color-steel)', maxWidth: 360, margin: '0 auto 1.5rem auto' }}>
                Take a photo or choose an image file on the left, or select "Try Sample Demonstration Scene".
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
