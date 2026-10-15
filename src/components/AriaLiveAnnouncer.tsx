import React, { createContext, useContext, useState, useCallback } from 'react';

interface AriaAnnouncerContextType {
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
}

const AriaAnnouncerContext = createContext<AriaAnnouncerContextType>({
  announcePolite: () => {},
  announceAssertive: () => {}
});

export const useAriaAnnouncer = () => useContext(AriaAnnouncerContext);

export const AriaAnnouncerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announcePolite = useCallback((message: string) => {
    setPoliteMessage('');
    setTimeout(() => setPoliteMessage(message), 50);
  }, []);

  const announceAssertive = useCallback((message: string) => {
    setAssertiveMessage('');
    setTimeout(() => setAssertiveMessage(message), 50);
  }, []);

  return (
    <AriaAnnouncerContext.Provider value={{ announcePolite, announceAssertive }}>
      {children}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        id="aria-live-polite"
      >
        {politeMessage}
      </div>
      <div
        className="sr-only"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        id="aria-live-assertive"
      >
        {assertiveMessage}
      </div>
    </AriaAnnouncerContext.Provider>
  );
};
