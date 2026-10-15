import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Check, Download, AlertTriangle, Info, CheckCircle2, RefreshCw } from 'lucide-react';
import { VisionResult, AccessibilitySettings } from '../types';
import { speechService } from '../services/speechService';
import { useAriaAnnouncer } from './AriaLiveAnnouncer';

interface ResultCardProps {
  result: VisionResult;
  settings: AccessibilitySettings;
  onClear?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  settings,
  onClear
}) => {
  const { announcePolite } = useAriaAnnouncer();
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeakingThis, setIsSpeakingThis] = useState<boolean>(false);

  useEffect(() => {
    const unsub = speechService.subscribe((speaking, text) => {
      if (!speaking) {
        setIsSpeakingThis(false);
      } else {
        const matches = text.includes(result.summary) || (result.visibleText && text.includes(result.visibleText));
        setIsSpeakingThis(Boolean(matches));
      }
    });
    return () => unsub();
  }, [result]);

  const getTextToSpeak = (): string => {
    if (result.mode === 'ocr') {
      return result.rawOcrText || result.visibleText || result.summary;
    }
    const parts = [result.title, result.summary];
    if (result.details) parts.push(result.details);
    if (result.visibleObjects && result.visibleObjects.length > 0) {
      parts.push(`Visible items: ${result.visibleObjects.join(', ')}.`);
    }
    return parts.join(' ');
  };

  const handleSpeak = () => {
    const text = getTextToSpeak();
    announcePolite(`Reading result aloud: ${result.title}`);
    speechService.speak(text, settings);
  };

  const handleStop = () => {
    announcePolite('Speech stopped');
    speechService.stop();
  };

  const handleCopy = async () => {
    const fullText = result.rawOcrText || getTextToSpeak();
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      announcePolite('Text copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Failed to copy to clipboard:', e);
    }
  };

  const handleDownload = () => {
    const content = result.rawOcrText || getTextToSpeak();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seeable-${result.mode}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    announcePolite('Downloaded text file.');
  };

  const renderBadge = () => {
    switch (result.processingMethod) {
      case 'live-ocr':
        return (
          <span className="badge badge-ember">
            <CheckCircle2 size={13} aria-hidden="true" />
            Live OCR Result
          </span>
        );
      case 'demo-intelligence':
        return (
          <span className="badge badge-ash">
            <Info size={13} aria-hidden="true" />
            Sample Demonstration Result
          </span>
        );
      case 'unsupported':
      default:
        return (
          <span className="badge badge-brass">
            <AlertTriangle size={13} aria-hidden="true" />
            Local Model Unavailable
          </span>
        );
    }
  };

  return (
    <article
      className="card"
      style={{
        backgroundColor: 'var(--color-ash)',
        border: '1px solid var(--border-hairline)',
        marginBottom: '2rem'
      }}
      aria-labelledby={`result-title-${result.id}`}
    >
      {/* Header with Title and Processing Method Badge */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border-hairline)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <h3
            id={`result-title-${result.id}`}
            style={{
              fontSize: '1.35rem',
              fontFamily: 'var(--font-polysans)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--color-graphite)',
              marginBottom: '0.2rem'
            }}
          >
            {result.title}
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>
            Captured: {new Date(result.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div>{renderBadge()}</div>
      </div>

      {/* Primary Result Summary */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-steel)', marginBottom: '0.35rem', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>
          Summary
        </h4>
        <p style={{ fontSize: '1.15rem', color: 'var(--color-graphite)', lineHeight: 1.5, fontFamily: 'var(--font-inter)' }}>
          {result.summary}
        </p>
      </div>

      {/* Detailed Description if Available */}
      {result.details && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-steel)', marginBottom: '0.35rem', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>
            Detailed Explanation
          </h4>
          <p style={{ fontSize: '1rem', color: 'var(--color-steel)', lineHeight: 1.6, fontFamily: 'var(--font-inter)' }}>
            {result.details}
          </p>
        </div>
      )}

      {/* Visible Objects List */}
      {result.visibleObjects && result.visibleObjects.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-steel)', marginBottom: '0.5rem', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>
            Detected Elements
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {result.visibleObjects.map((obj, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: 'var(--color-canvas-white)',
                  color: 'var(--color-graphite)',
                  border: '1px solid var(--border-hairline)',
                  padding: '4px 10px',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-inter)'
                }}
              >
                &bull; {obj}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Raw Extracted Text / Verbatim OCR Text */}
      {(result.rawOcrText || (result.mode === 'ocr' && result.visibleText)) && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-graphite)', fontWeight: 600 }}>
              {result.mode === 'ocr' ? 'Extracted Text (Verbatim)' : 'Visible Text on Scene'}
            </h4>
            {result.confidence !== undefined && (
              <span style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>
                Confidence: {result.confidence}%
              </span>
            )}
          </div>
          <pre
            style={{
              backgroundColor: 'var(--color-canvas-white)',
              border: '1px solid var(--border-hairline)',
              padding: '1.25rem',
              color: 'var(--color-graphite)',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: 280,
              overflowY: 'auto'
            }}
          >
            {result.rawOcrText || result.visibleText}
          </pre>
        </div>
      )}

      {/* Ventriloc Warm Ivory Limitations Callout */}
      <div
        className="card-ivory"
        style={{
          borderLeft: '4px solid var(--color-brass)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}
        role="note"
      >
        <AlertTriangle size={18} color="var(--color-brass)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <div style={{ fontSize: '0.9rem', color: 'var(--color-steel)', lineHeight: 1.5 }}>
          <strong>Limitations &amp; Safety:</strong> {result.limitations}
        </div>
      </div>

      {/* Controls & Actions Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Speech Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {isSpeakingThis ? (
            <button
              onClick={handleStop}
              className="btn btn-danger"
              style={{ minHeight: 48, fontSize: '0.95rem' }}
              aria-label="Stop audio output immediately"
            >
              <VolumeX size={18} aria-hidden="true" />
              <span>Stop Speaking</span>
            </button>
          ) : (
            <button
              onClick={handleSpeak}
              className="btn btn-primary"
              style={{ minHeight: 48, fontSize: '0.95rem' }}
              aria-label={result.mode === 'ocr' ? 'Speak extracted text aloud' : 'Speak description aloud'}
            >
              <Volume2 size={18} aria-hidden="true" />
              <span>{result.mode === 'ocr' ? 'Speak Extracted Text' : 'Speak Answer'}</span>
            </button>
          )}

          <button
            onClick={handleSpeak}
            className="btn btn-secondary"
            style={{ minHeight: 48, fontSize: '0.95rem' }}
            aria-label={result.mode === 'ocr' ? 'Repeat extracted text' : 'Repeat answer'}
          >
            <RefreshCw size={16} aria-hidden="true" />
            <span>{result.mode === 'ocr' ? 'Repeat Text' : 'Repeat Answer'}</span>
          </button>
        </div>

        {/* Copy, Download & Try Again Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ minHeight: 48, fontSize: '0.95rem' }}
            aria-label="Copy text to clipboard"
          >
            {copied ? <Check size={16} color="var(--color-ember-orange)" /> : <Copy size={16} />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-secondary"
            style={{ minHeight: 48, fontSize: '0.95rem' }}
            aria-label="Download plain text file"
          >
            <Download size={16} aria-hidden="true" />
            <span>Download .txt</span>
          </button>

          {onClear && (
            <button
              onClick={onClear}
              className="btn btn-secondary"
              style={{ minHeight: 48, fontSize: '0.95rem' }}
              aria-label="Clear current result and try another image"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
