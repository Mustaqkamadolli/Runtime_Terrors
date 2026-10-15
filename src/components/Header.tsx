import React, { useEffect, useState } from 'react';
import { Eye, VolumeX, Settings, Keyboard, FileText, Home } from 'lucide-react';
import { ActiveWorkspace } from '../types';
import { speechService } from '../services/speechService';
import { useAriaAnnouncer } from './AriaLiveAnnouncer';

interface HeaderProps {
  activeTab: ActiveWorkspace;
  onSelectTab: (tab: ActiveWorkspace) => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings,
  onOpenShortcuts
}) => {
  const { announcePolite } = useAriaAnnouncer();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const unsub = speechService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  const handleStopSpeaking = () => {
    speechService.stop();
    announcePolite('Speech stopped.');
  };

  return (
    <header
      role="banner"
      style={{
        backgroundColor: 'var(--color-canvas-white)',
        borderBottom: '1px solid var(--border-hairline)',
        padding: '1.25rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Brand identity: Ventriloc Editorial Tone */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.2rem'
          }}
          aria-label="SeeAble AI Home - Your surroundings, explained"
        >
          {/* Brand mark with Ember Orange accent dot */}
          <div
            style={{
              width: 44,
              height: 44,
              backgroundColor: 'var(--color-graphite)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Eye size={24} aria-hidden="true" />
            <div
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: 'var(--color-ember-orange)'
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <span
              style={{
                fontFamily: 'var(--font-polysans)',
                fontSize: '1.45rem',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: 'var(--color-graphite)',
                display: 'block',
                lineHeight: 1.1
              }}
            >
              SeeAble AI
            </span>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
                color: 'var(--color-steel)'
              }}
            >
              Your surroundings, explained.
            </span>
          </div>
        </button>

        {/* Central Navigation: Ventriloc Capsule Nav Pill Container */}
        <nav
          role="navigation"
          aria-label="Main application sections"
          className="nav-pill-container"
        >
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`nav-pill-item ${activeTab === 'home' ? 'active' : ''}`}
            aria-current={activeTab === 'home' ? 'page' : undefined}
          >
            <Home size={16} aria-hidden="true" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('describe')}
            className={`nav-pill-item ${activeTab === 'describe' ? 'active' : ''}`}
            aria-current={activeTab === 'describe' ? 'page' : undefined}
          >
            <Eye size={16} aria-hidden="true" />
            <span>Describe</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('ocr')}
            className={`nav-pill-item ${activeTab === 'ocr' ? 'active' : ''}`}
            aria-current={activeTab === 'ocr' ? 'page' : undefined}
          >
            <FileText size={16} aria-hidden="true" />
            <span>Read Sign</span>
          </button>
        </nav>

        {/* Right side controls: Stop Speaking, Settings, Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Prominent Stop Speaking button when speaking */}
          {isSpeaking && (
            <button
              type="button"
              onClick={handleStopSpeaking}
              className="btn btn-danger"
              style={{ minHeight: 44, padding: '8px 18px' }}
              aria-label="Stop audio output immediately"
            >
              <VolumeX size={18} aria-hidden="true" />
              <span>Stop Speaking</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            className="btn btn-secondary"
            style={{ minHeight: 44, padding: '8px 16px', fontSize: '0.9rem' }}
            aria-label="Open Accessibility Settings"
          >
            <Settings size={17} aria-hidden="true" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={onOpenShortcuts}
            className="btn btn-secondary"
            style={{ minHeight: 44, padding: '8px 16px', fontSize: '0.9rem' }}
            aria-label="Keyboard shortcuts guide"
          >
            <Keyboard size={17} aria-hidden="true" />
            <span>Shortcuts</span>
          </button>
        </div>
      </div>
    </header>
  );
};
