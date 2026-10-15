import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Alt + 1', desc: 'Navigate to Home Overview' },
    { key: 'Alt + 2', desc: 'Open Describe My Surroundings workspace' },
    { key: 'Alt + 3', desc: 'Open Read a Sign or Document (OCR) workspace' },
    { key: 'Alt + 4', desc: 'Open Demonstration Scenario Library' },
    { key: 'Alt + S', desc: 'Speak / Read current result aloud' },
    { key: 'Alt + X', desc: 'Stop speech playback immediately' },
    { key: 'Alt + R', desc: 'Repeat last spoken response' },
    { key: 'Alt + A', desc: 'Open Accessibility & Voice Settings' },
    { key: 'Alt + K or ?', desc: 'Open this Keyboard Shortcuts Guide' },
    { key: 'Escape', desc: 'Close any open dialog or modal' },
    { key: 'Tab / Shift+Tab', desc: 'Move focus sequentially between interactive controls' },
    { key: 'Enter / Space', desc: 'Activate selected button or interactive card' }
  ];

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content" tabIndex={-1}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-hairline)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Keyboard size={22} color="var(--color-ember-orange)" aria-hidden="true" />
            <h2 id="shortcuts-dialog-title" style={{ fontSize: '1.4rem', fontFamily: 'var(--font-polysans)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--color-graphite)' }}>
              Keyboard Shortcuts Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.6rem', minHeight: 36 }}
            aria-label="Close shortcuts guide (Escape)"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
          SeeAble AI is engineered for complete keyboard-first accessibility without requiring a mouse. Use these shortcuts from anywhere in the application:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.9rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)'
              }}
            >
              <span style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{sc.desc}</span>
              <kbd
                style={{
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--light-blue)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  padding: '0.2rem 0.6rem',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ minHeight: 44, padding: '0.5rem 1.5rem' }}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
