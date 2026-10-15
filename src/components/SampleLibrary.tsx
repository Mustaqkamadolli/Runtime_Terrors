import React, { useState } from 'react';
import { Sparkles, FileText, Eye, Volume2, ArrowLeft, ShieldCheck, Check } from 'lucide-react';
import { Scenario, DescriptionStyle, VisionResult, AccessibilitySettings } from '../types';
import { demoEngine } from '../services/demoEngine';
import { speechService } from '../services/speechService';
import { ResultCard } from './ResultCard';
import { useAriaAnnouncer } from './AriaLiveAnnouncer';

interface SampleLibraryProps {
  settings: AccessibilitySettings;
  onResultGenerated: (result: VisionResult) => void;
}

export const SampleLibrary: React.FC<SampleLibraryProps> = ({
  settings,
  onResultGenerated
}) => {
  const { announcePolite } = useAriaAnnouncer();
  const scenarios = demoEngine.getAllScenarios();

  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [activeMode, setActiveMode] = useState<'describe' | 'ocr'>('describe');
  const [descriptionStyle, setDescriptionStyle] = useState<DescriptionStyle>('quick');
  const [currentResult, setCurrentResult] = useState<VisionResult | null>(null);

  const handleSelectScenario = (scenario: Scenario, mode: 'describe' | 'ocr' = 'describe') => {
    setSelectedScenario(scenario);
    setActiveMode(mode);
    generateResultForScenario(scenario, mode, descriptionStyle);
    announcePolite(`Selected demonstration scenario: ${scenario.title}`);
  };

  const generateResultForScenario = (
    scenario: Scenario,
    mode: 'describe' | 'ocr',
    style: DescriptionStyle
  ) => {
    let result: VisionResult;
    if (mode === 'describe') {
      result = demoEngine.generateDescription(scenario.id, style);
    } else {
      result = demoEngine.generateSampleOcr(scenario.id);
    }

    setCurrentResult(result);
    onResultGenerated(result);

    if (settings.autoSpeak) {
      const textToSpeak = mode === 'ocr' ? result.visibleText || result.summary : `${result.title}. ${result.summary}`;
      speechService.speak(textToSpeak, settings);
    }
  };

  const handleStyleChange = (style: DescriptionStyle) => {
    setDescriptionStyle(style);
    if (selectedScenario && activeMode === 'describe') {
      generateResultForScenario(selectedScenario, 'describe', style);
    }
  };

  const handleModeChange = (mode: 'describe' | 'ocr') => {
    setActiveMode(mode);
    if (selectedScenario) {
      generateResultForScenario(selectedScenario, mode, descriptionStyle);
    }
  };

  return (
    <section aria-labelledby="sample-library-heading" style={{ marginTop: '1.5rem' }}>
      {/* Title & Description */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <h2
            id="sample-library-heading"
            style={{ fontSize: 'var(--font-title-md)', fontWeight: 800 }}
          >
            Demonstration Scenario Library
          </h2>
          <span className="badge badge-demo">8 Curated Scenes</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Explore deterministic assistive technology interactions without calling external AI APIs. Guaranteed fast, reproducible, and private.
        </p>
      </div>

      {selectedScenario ? (
        /* Single Scenario Inspector View */
        <div>
          <button
            onClick={() => {
              setSelectedScenario(null);
              setCurrentResult(null);
              speechService.stop();
              announcePolite('Returned to scenario library.');
            }}
            className="btn btn-secondary"
            style={{ marginBottom: '1.5rem', padding: '0.4rem 0.9rem', fontSize: '0.9rem' }}
            aria-label="Back to scenario catalog"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>&larr; Back to All Scenarios</span>
          </button>

          <div className="grid-2" style={{ alignItems: 'flex-start', gap: '1.5rem' }}>
            {/* Left: Graphic and Scenario Controls */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-demo">{selectedScenario.category}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ID: {selectedScenario.id}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {selectedScenario.title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {selectedScenario.description}
              </p>

              {/* Graphic Display */}
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#000000',
                  marginBottom: '1.25rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                <img
                  src={selectedScenario.svgDataUri}
                  alt={`Illustrative graphic for ${selectedScenario.title}`}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              {/* Interaction Mode Toggle */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.9rem' }}>
                  Select Demonstration Interaction:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleModeChange('describe')}
                    className={`btn ${activeMode === 'describe' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, minHeight: 42, fontSize: '0.9rem' }}
                    aria-pressed={activeMode === 'describe'}
                  >
                    <Eye size={16} aria-hidden="true" />
                    <span>Scene Description</span>
                  </button>
                  <button
                    onClick={() => handleModeChange('ocr')}
                    className={`btn ${activeMode === 'ocr' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, minHeight: 42, fontSize: '0.9rem' }}
                    aria-pressed={activeMode === 'ocr'}
                  >
                    <FileText size={16} aria-hidden="true" />
                    <span>Document Reading</span>
                  </button>
                </div>
              </div>

              {/* Description Style Options (when in describe mode) */}
              {activeMode === 'describe' && (
                <div>
                  <label htmlFor="scenario-style-select" className="form-label" style={{ fontSize: '0.9rem' }}>
                    Description Style:
                  </label>
                  <select
                    id="scenario-style-select"
                    className="form-select"
                    value={descriptionStyle}
                    onChange={(e) => handleStyleChange(e.target.value as DescriptionStyle)}
                  >
                    <option value="quick">Quick Overview</option>
                    <option value="detailed">Detailed Description</option>
                    <option value="objects">Objects &amp; Visible Text</option>
                    <option value="simple">Simple Language</option>
                    <option value="educational">Educational Explanation</option>
                  </select>
                </div>
              )}
            </div>

            {/* Right: Structured Result Card */}
            <div>
              {currentResult && (
                <ResultCard
                  result={currentResult}
                  settings={settings}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Scenario Catalog Grid */
        <div className="grid-3" role="region" aria-label="Catalog of 8 curated demonstration scenarios">
          {scenarios.map((scenario) => (
            <article
              key={scenario.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem',
                gap: '1rem',
                transition: 'border-color 0.15s ease, transform 0.15s ease'
              }}
            >
              <div>
                {/* SVG Graphic Thumbnail */}
                <div
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#000000',
                    marginBottom: '0.85rem'
                  }}
                >
                  <img
                    src={scenario.svgDataUri}
                    alt={`Thumbnail of ${scenario.title}`}
                    style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span className="badge badge-demo" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                    {scenario.tag}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {scenario.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {scenario.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {scenario.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => handleSelectScenario(scenario, 'describe')}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.4rem 0.7rem', minHeight: 40, fontSize: '0.85rem' }}
                  aria-label={`Describe ${scenario.title}`}
                >
                  <Eye size={15} aria-hidden="true" />
                  <span>Describe</span>
                </button>

                <button
                  onClick={() => handleSelectScenario(scenario, 'ocr')}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.4rem 0.7rem', minHeight: 40, fontSize: '0.85rem' }}
                  aria-label={`Read text from ${scenario.title}`}
                >
                  <FileText size={15} aria-hidden="true" />
                  <span>Read OCR</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
