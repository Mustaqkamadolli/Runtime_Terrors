import React, { useEffect, useState } from 'react';
import { X, Volume2, Type, Eye, Sparkles, Check, RotateCcw } from 'lucide-react';
import { AccessibilitySettings, TextSize, ThemeMode } from '../types';
import { speechService } from '../services/speechService';
import { DEFAULT_SETTINGS } from '../services/storageService';
import { useAriaAnnouncer } from './AriaLiveAnnouncer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onSaveSettings: (settings: AccessibilitySettings) => void;
  onOpenShortcuts: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onOpenShortcuts
}) => {
  const { announcePolite } = useAriaAnnouncer();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [testSpeaking, setTestSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVoices(speechService.getAvailableVoices());
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    val: AccessibilitySettings[K]
  ) => {
    const updated = { ...settings, [key]: val };
    onSaveSettings(updated);
  };

  const handleTestVoice = () => {
    setTestSpeaking(true);
    speechService.speak(
      'This is a sample voice test from SeeAble AI. Your surroundings, explained.',
      settings
    );
    setTimeout(() => setTestSpeaking(false), 2000);
  };

  const handleResetDefaults = () => {
    onSaveSettings({ ...DEFAULT_SETTINGS });
    announcePolite('Accessibility settings restored to defaults.');
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content" tabIndex={-1}>
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Eye size={22} color="var(--color-ember-orange)" aria-hidden="true" />
            <h2 id="settings-dialog-title" style={{ fontSize: '1.4rem', fontFamily: 'var(--font-polysans)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--color-graphite)' }}>
              Accessibility &amp; Voice Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.6rem', minHeight: 40 }}
            aria-label="Close settings dialog (Escape)"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Section 1: Typography & Visual Appearance */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-polysans)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '0.75rem', color: 'var(--color-graphite)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Type size={18} color="var(--color-ember-orange)" aria-hidden="true" />
            Visual &amp; Display Appearance
          </h3>

          {/* Text Size */}
          <div className="form-group">
            <label className="form-label">Text &amp; Font Size:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {(['standard', 'large', 'extra-large'] as TextSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateSetting('textSize', size)}
                  className={`btn ${settings.textSize === size ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minHeight: 44, textTransform: 'capitalize', fontSize: '0.9rem' }}
                  aria-pressed={settings.textSize === size}
                >
                  {size.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Contrast & Motion Toggles */}
          <div className="grid-2" style={{ gap: '0.75rem', marginTop: '1rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                border: '1px solid var(--border-color)'
              }}
            >
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                style={{ width: 20, height: 20 }}
              />
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>High Contrast Mode</span>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                border: '1px solid var(--border-color)'
              }}
            >
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                style={{ width: 20, height: 20 }}
              />
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Reduced Motion</span>
            </label>
          </div>

          {/* Theme Mode */}
          <div style={{ marginTop: '1rem' }}>
            <label className="form-label">Theme Mode:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => updateSetting('theme', 'dark')}
                className={`btn ${settings.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ minHeight: 44 }}
                aria-pressed={settings.theme === 'dark'}
              >
                Dark Navy (Default)
              </button>
              <button
                type="button"
                onClick={() => updateSetting('theme', 'light')}
                className={`btn ${settings.theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ minHeight: 44 }}
                aria-pressed={settings.theme === 'light'}
              >
                Light High-Clarity
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Speech & Spoken Reading */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--light-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={18} aria-hidden="true" />
            Speech &amp; Reading Feedback
          </h3>

          {/* Auto-Speak Toggle */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              marginBottom: '1rem'
            }}
          >
            <input
              type="checkbox"
              checked={settings.autoSpeak}
              onChange={(e) => updateSetting('autoSpeak', e.target.checked)}
              style={{ width: 20, height: 20 }}
            />
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block' }}>
                Auto-read results aloud
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Automatically speaks descriptions and extracted OCR text immediately after processing.
              </span>
            </div>
          </label>

          {/* Preferred Voice Selector */}
          {voices.length > 0 && (
            <div className="form-group">
              <label htmlFor="voice-select" className="form-label">
                Preferred Spoken Voice:
              </label>
              <select
                id="voice-select"
                className="form-select"
                value={settings.preferredVoiceURI}
                onChange={(e) => updateSetting('preferredVoiceURI', e.target.value)}
              >
                <option value="">Browser Default Voice</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Speech Rate Slider */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label htmlFor="speech-rate-slider" className="form-label" style={{ margin: 0 }}>
                Speech Rate (Speed):
              </label>
              <span style={{ fontWeight: 700, color: 'var(--light-blue)' }}>
                {settings.speechRate.toFixed(1)}x
              </span>
            </div>
            <input
              id="speech-rate-slider"
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.speechRate}
              onChange={(e) => updateSetting('speechRate', parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
              aria-label="Speech speed rate"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>0.5x Slow</span>
              <span>1.0x Normal</span>
              <span>2.0x Fast</span>
            </div>
          </div>

          {/* Test Voice Button */}
          <div style={{ marginTop: '1rem' }}>
            <button
              type="button"
              onClick={handleTestVoice}
              disabled={testSpeaking}
              className="btn btn-secondary"
              style={{ width: '100%', minHeight: 44, fontSize: '0.9rem' }}
              aria-label="Test voice and speech settings"
            >
              <Volume2 size={16} aria-hidden="true" />
              <span>{testSpeaking ? 'Playing Voice Sample...' : 'Test Speech Sample'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleResetDefaults}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenShortcuts();
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
            >
              Keyboard Shortcuts
            </button>
          </div>

          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.5rem', minHeight: 44 }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
