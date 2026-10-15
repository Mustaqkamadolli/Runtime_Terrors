import React, { useState, useEffect } from 'react';
import { ActiveWorkspace, AccessibilitySettings, VisionResult } from './types';
import { StorageService } from './services/storageService';
import { speechService } from './services/speechService';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SurroundingsWorkspace } from './components/SurroundingsWorkspace';
import { OcrWorkspace } from './components/OcrWorkspace';
import { SettingsModal } from './components/SettingsModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { AriaAnnouncerProvider, useAriaAnnouncer } from './components/AriaLiveAnnouncer';

const AppContent: React.FC = () => {
  const { announcePolite } = useAriaAnnouncer();
  const [activeTab, setActiveTab] = useState<ActiveWorkspace>('home');
  const [settings, setSettings] = useState<AccessibilitySettings>(() => StorageService.getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [lastResult, setLastResult] = useState<VisionResult | null>(null);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');

  // Sync settings with root HTML element for global styling
  useEffect(() => {
    const root = document.documentElement;

    // Font size classes
    root.classList.remove('text-large', 'text-extra-large');
    if (settings.textSize === 'large') root.classList.add('text-large');
    if (settings.textSize === 'extra-large') root.classList.add('text-extra-large');

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Theme mode
    if (settings.theme === 'light') {
      root.classList.add('theme-light');
    } else {
      root.classList.remove('theme-light');
    }

    StorageService.saveSettings(settings);
  }, [settings]);

  // Keep lastSpokenText updated from speechService
  useEffect(() => {
    const unsub = speechService.subscribe((_, text) => {
      if (text) setLastSpokenText(text);
    });
    return () => unsub();
  }, []);

  // Global Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing inside an input or textarea
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');
      if (isInput) return;

      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          setActiveTab('home');
          announcePolite('Navigated to Home');
        } else if (e.key === '2') {
          e.preventDefault();
          setActiveTab('describe');
          announcePolite('Navigated to Describe My Surroundings');
        } else if (e.key === '3') {
          e.preventDefault();
          setActiveTab('ocr');
          announcePolite('Navigated to Read Sign or Document OCR');
        } else if (e.key === '4') {
          e.preventDefault();
          setActiveTab('scenarios');
          announcePolite('Navigated to Demonstration Scenarios Library');
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          if (lastResult) {
            const textToSpeak = lastResult.mode === 'ocr' ? lastResult.rawOcrText || lastResult.summary : `${lastResult.title}. ${lastResult.summary}`;
            speechService.speak(textToSpeak, settings);
            announcePolite('Reading current result aloud');
          } else {
            speechService.repeatLastAnswer(settings);
          }
        } else if (e.key.toLowerCase() === 'x') {
          e.preventDefault();
          speechService.stop();
          announcePolite('Speech playback stopped');
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          speechService.repeatLastAnswer(settings);
        } else if (e.key.toLowerCase() === 'a') {
          e.preventDefault();
          setIsSettingsOpen((prev) => !prev);
        } else if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          setIsShortcutsOpen((prev) => !prev);
        }
      } else if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastResult, settings, announcePolite]);

  const handleResultGenerated = (res: VisionResult) => {
    setLastResult(res);
    const spoken = res.mode === 'ocr' ? res.rawOcrText || res.summary : `${res.title}. ${res.summary}`;
    setLastSpokenText(spoken);
  };

  return (
    <div>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content (Alt + S for Spoken Assist)
      </a>

      {/* Global Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          announcePolite(`Switched to ${tab} section`);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="app-container" tabIndex={-1}>
        {activeTab === 'home' && (
          <HeroSection
            onSelectTab={(tab) => {
              setActiveTab(tab);
              announcePolite(`Switched to ${tab} section`);
            }}
            lastSpokenText={lastSpokenText}
          />
        )}

        {activeTab === 'describe' && (
          <SurroundingsWorkspace
            settings={settings}
            onResultGenerated={handleResultGenerated}
            onBackToHome={() => {
              setActiveTab('home');
              announcePolite('Returned to Home');
            }}
          />
        )}

        {activeTab === 'ocr' && (
          <OcrWorkspace
            settings={settings}
            onResultGenerated={handleResultGenerated}
            onBackToHome={() => {
              setActiveTab('home');
              announcePolite('Returned to Home');
            }}
          />
        )}
      </main>

      {/* Accessible Footer — Ventriloc Editorial Tone */}
      <footer
        style={{
          borderTop: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--color-ash)',
          padding: '2.5rem 1.25rem',
          color: 'var(--color-steel)',
          fontSize: '0.9rem'
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div>
            <p style={{ fontFamily: 'var(--font-polysans)', fontSize: '1.15rem', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--color-graphite)', marginBottom: '0.2rem' }}>
              SeeAble AI &bull; Your surroundings, explained.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-steel)', margin: 0 }}>
              Assistive multimodal platform for blind and visually impaired users &bull; 100% On-Device &bull; Zero External AI APIs
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', minHeight: 36 }}
            >
              Shortcuts (Press ?)
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', minHeight: 36 }}
            >
              Accessibility Options
            </button>
          </div>
        </div>
      </footer>

      {/* Dialog Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AriaAnnouncerProvider>
      <AppContent />
    </AriaAnnouncerProvider>
  );
};

export default App;
