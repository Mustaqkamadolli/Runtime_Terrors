import { AccessibilitySettings } from '../types';

export interface SpeechStatusListener {
  (speaking: boolean, text: string): void;
}

class SpeechService {
  private lastSpokenText: string = '';
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private listeners: Set<SpeechStatusListener> = new Set();
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.voices = window.speechSynthesis.getVoices();
      } catch (err) {
        console.warn('Failed to get speechSynthesis voices:', err);
      }
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
    }
    return this.voices;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public subscribe(listener: SpeechStatusListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(speaking: boolean, text: string) {
    this.isSpeaking = speaking;
    this.listeners.forEach((listener) => {
      try {
        listener(speaking, text);
      } catch (err) {
        console.error('Error in speech listener:', err);
      }
    });
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.error('Error cancelling speech synthesis:', err);
      }
    }
    this.currentUtterance = null;
    this.notify(false, '');
  }

  public speak(text: string, settings?: Partial<AccessibilitySettings>): boolean {
    if (!this.isSupported()) {
      this.notify(false, '');
      return false;
    }

    if (!text || text.trim() === '') {
      return false;
    }

    // Immediately stop any ongoing utterance to avoid overlap
    this.stop();

    try {
      // Chrome workaround: resume before speak in case speech synthesis was paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      this.lastSpokenText = text;

      if (settings) {
        if (settings.speechRate !== undefined) {
          utterance.rate = Math.max(0.5, Math.min(2.0, settings.speechRate));
        }
        if (settings.speechPitch !== undefined) {
          utterance.pitch = Math.max(0.5, Math.min(1.5, settings.speechPitch));
        }
        if (settings.speechVolume !== undefined) {
          utterance.volume = Math.max(0, Math.min(1.0, settings.speechVolume));
        }

        if (settings.preferredVoiceURI) {
          const matchedVoice = this.voices.find((v) => v.voiceURI === settings.preferredVoiceURI);
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }
        }
      }

      utterance.onstart = () => {
        this.notify(true, text);
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.notify(false, '');
      };

      utterance.onerror = (e) => {
        // 'interrupted' or 'canceled' are expected when user stops speech
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('SpeechSynthesis error:', e.error);
        }
        this.currentUtterance = null;
        this.notify(false, '');
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('Failed to speak utterance:', err);
      this.currentUtterance = null;
      this.notify(false, '');
      return false;
    }
  }

  public repeatLastAnswer(settings?: Partial<AccessibilitySettings>): boolean {
    if (!this.lastSpokenText || this.lastSpokenText.trim() === '') {
      const msg = 'No previous response to repeat. Please describe a scene or read a document first.';
      this.speak(msg, settings);
      return false;
    }
    return this.speak(this.lastSpokenText, settings);
  }

  public setLastSpokenText(text: string): void {
    if (text && text.trim()) {
      this.lastSpokenText = text.trim();
    }
  }

  public getLastSpokenText(): string {
    return this.lastSpokenText;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();
