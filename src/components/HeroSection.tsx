import React, { useEffect, useState } from 'react';
import { Eye, FileText, Volume2, VolumeX, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { ActiveWorkspace } from '../types';
import { speechService } from '../services/speechService';
import { useAriaAnnouncer } from './AriaLiveAnnouncer';

interface HeroSectionProps {
  onSelectTab: (tab: ActiveWorkspace) => void;
  lastSpokenText: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectTab,
  lastSpokenText
}) => {
  const { announcePolite } = useAriaAnnouncer();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const unsub = speechService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  const handleRepeatLast = () => {
    if (!lastSpokenText || lastSpokenText.trim() === '') {
      const msg = 'No previous response to repeat yet. Please describe a scene or read a sign first.';
      announcePolite(msg);
      speechService.speak(msg);
    } else {
      announcePolite('Repeating last response.');
      speechService.speak(lastSpokenText);
    }
  };

  const handleStopSpeaking = () => {
    speechService.stop();
    announcePolite('Speech stopped.');
  };

  return (
    <section aria-labelledby="hero-title" style={{ marginTop: '2.5rem' }}>
      {/* Ventriloc Asymmetric Ivory Card: Important Safety Notice */}
      <div
        className="card-ivory"
        style={{
          borderLeft: '4px solid var(--color-ember-orange)',
          padding: '1.5rem 1.75rem',
          marginBottom: '2.5rem',
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'flex-start'
        }}
        role="region"
        aria-label="Important Safety Notice"
      >
        <AlertTriangle
          size={24}
          color="var(--color-ember-orange)"
          style={{ flexShrink: 0, marginTop: '2px' }}
          aria-hidden="true"
        />
        <div style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--color-graphite)' }}>
          <strong style={{ display: 'block', fontFamily: 'var(--font-polysans)', fontSize: '1.1rem', fontWeight: 400, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Important Safety Notice
          </strong>
          SeeAble AI is an experimental accessibility tool. Image descriptions and OCR can be incorrect. Do not rely on this application alone to navigate, cross roads, avoid obstacles, or determine whether a route is safe. Continue using your cane, guide dog, mobility aids, and established mobility practices.
        </div>
      </div>

      {/* Hero Typographic Block — Whisper-Weight Authority */}
      <div style={{ marginBottom: '3rem', maxWidth: 880 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span className="badge badge-ember">
            &bull; Editorial Assistive Intelligence
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>
            100% Offline &bull; No External APIs
          </span>
        </div>

        <h1
          id="hero-title"
          className="display-title"
          style={{
            marginBottom: '1rem',
            color: 'var(--color-graphite)'
          }}
        >
          Your surroundings, explained.
        </h1>

        <p
          className="subheading"
          style={{
            color: 'var(--color-steel)',
            maxWidth: 680,
            marginBottom: '1.75rem',
            fontFamily: 'var(--font-inter)'
          }}
        >
          Understand visual information through accessible image descriptions, sign reading, and spoken voice feedback. Designed for blind and low-vision accessibility.
        </p>

        {/* Global Stop Speaking button if speech is currently active */}
        {isSpeaking && (
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={handleStopSpeaking}
              className="btn btn-danger"
              style={{ minHeight: 48, padding: '10px 24px', fontSize: '1.05rem' }}
              aria-label="Stop audio output immediately"
            >
              <VolumeX size={20} aria-hidden="true" />
              <span>Stop Speaking</span>
            </button>
          </div>
        )}
      </div>

      {/* 3 Primary Action Cards — Ventriloc Asymmetric Radius Cards */}
      <div
        className="grid-3"
        style={{ marginBottom: '3rem' }}
        role="region"
        aria-label="Primary Actions"
      >
        {/* Action 1: Describe My Surroundings */}
        <button
          type="button"
          onClick={() => onSelectTab('describe')}
          className="card"
          style={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem',
            cursor: 'pointer',
            padding: '2.5rem 2rem',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-graphite)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-hairline)';
          }}
        >
          <div>
            <div
              style={{
                width: 48,
                height: 48,
                backgroundColor: 'var(--color-graphite)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <Eye size={26} aria-hidden="true" />
            </div>

            <h2
              style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-polysans)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                marginBottom: '0.6rem',
                color: 'var(--color-graphite)'
              }}
            >
              1. Describe My Surroundings
            </h2>

            <p style={{ color: 'var(--color-steel)', fontSize: '1rem', lineHeight: 1.5, margin: 0 }}>
              Capture a photograph with your camera or provide an image for scene explanation.
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-graphite)',
              fontFamily: 'var(--font-polysans)',
              fontSize: '1rem',
              borderBottom: '2px solid var(--color-ember-orange)',
              paddingBottom: '2px',
              width: 'fit-content'
            }}
          >
            <span>Open Workspace</span>
            <ArrowRight size={16} aria-hidden="true" />
          </div>
        </button>

        {/* Action 2: Read a Sign or Document */}
        <button
          type="button"
          onClick={() => onSelectTab('ocr')}
          className="card"
          style={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem',
            cursor: 'pointer',
            padding: '2.5rem 2rem',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-graphite)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-hairline)';
          }}
        >
          <div>
            <div
              style={{
                width: 48,
                height: 48,
                backgroundColor: 'var(--color-graphite)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <FileText size={26} aria-hidden="true" />
            </div>

            <h2
              style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-polysans)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                marginBottom: '0.6rem',
                color: 'var(--color-graphite)'
              }}
            >
              2. Read Sign or Document
            </h2>

            <p style={{ color: 'var(--color-steel)', fontSize: '1rem', lineHeight: 1.5, margin: 0 }}>
              Extract verbatim printed words from signs, menus, notices, and product packaging using real local OCR.
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-graphite)',
              fontFamily: 'var(--font-polysans)',
              fontSize: '1rem',
              borderBottom: '2px solid var(--color-ember-orange)',
              paddingBottom: '2px',
              width: 'fit-content'
            }}
          >
            <span>Open OCR Reader</span>
            <ArrowRight size={16} aria-hidden="true" />
          </div>
        </button>

        {/* Action 3: Repeat Last Answer */}
        <button
          type="button"
          onClick={handleRepeatLast}
          className="card"
          style={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem',
            cursor: 'pointer',
            padding: '2.5rem 2rem',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-graphite)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-hairline)';
          }}
        >
          <div>
            <div
              style={{
                width: 48,
                height: 48,
                backgroundColor: 'var(--color-graphite)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <Volume2 size={26} aria-hidden="true" />
            </div>

            <h2
              style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-polysans)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                marginBottom: '0.6rem',
                color: 'var(--color-graphite)'
              }}
            >
              3. Repeat Last Answer
            </h2>

            <p style={{ color: 'var(--color-steel)', fontSize: '1rem', lineHeight: 1.5, margin: 0 }}>
              Hear your most recent description or OCR reading spoken aloud again.
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-graphite)',
              fontFamily: 'var(--font-polysans)',
              fontSize: '1rem',
              borderBottom: '2px solid var(--color-ember-orange)',
              paddingBottom: '2px',
              width: 'fit-content'
            }}
          >
            <span>{lastSpokenText ? 'Play Latest Utterance' : 'No prior answer'}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </div>
        </button>
      </div>

      {/* Ventriloc Observational Bar */}
      <div
        style={{
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: 'var(--color-slate)',
          fontSize: '0.9rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--color-ember-orange)" aria-hidden="true" />
          <span>95% Achromatic &bull; Pure On-Device Processing &bull; Native Web Speech API</span>
        </div>
        <div>
          <span>Press <kbd style={{ padding: '2px 6px', background: 'var(--color-ash)', border: '1px solid var(--border-hairline)' }}>?</kbd> for Keyboard Navigation Guide</span>
        </div>
      </div>
    </section>
  );
};
