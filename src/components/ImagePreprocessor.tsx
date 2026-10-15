import React, { useRef, useEffect } from 'react';
import { RotateCw, Sliders, Sun, Check } from 'lucide-react';
import { PreprocessOptions, ocrService } from '../services/ocrService';

interface ImagePreprocessorProps {
  imageSrc: string;
  options: PreprocessOptions;
  onChangeOptions: (opts: PreprocessOptions) => void;
  onProcessedCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const ImagePreprocessor: React.FC<ImagePreprocessorProps> = ({
  imageSrc,
  options,
  onChangeOptions,
  onProcessedCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hiddenImgRef = useRef<HTMLImageElement | null>(null);

  const applyProcessing = () => {
    const img = hiddenImgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !img.complete || img.naturalWidth === 0) return;

    try {
      const processedCanvas = ocrService.preprocessImage(img, options);
      canvas.width = processedCanvas.width;
      canvas.height = processedCanvas.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(processedCanvas, 0, 0);
      }
      if (onProcessedCanvasReady) {
        onProcessedCanvasReady(processedCanvas);
      }
    } catch (e) {
      console.warn('Preprocessing render failed:', e);
    }
  };

  useEffect(() => {
    applyProcessing();
  }, [imageSrc, options]);

  const handleRotate = () => {
    const nextRotation = (options.rotation + 90) % 360;
    onChangeOptions({ ...options, rotation: nextRotation });
  };

  const handleToggleGrayscale = () => {
    onChangeOptions({ ...options, grayscale: !options.grayscale });
  };

  const handleContrastChange = (val: number) => {
    onChangeOptions({ ...options, contrast: val });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-ash)',
        borderRadius: 'var(--radius-asymmetric-card)',
        border: '1px solid var(--border-hairline)',
        padding: '1.25rem',
        marginTop: '1.25rem'
      }}
      aria-label="Image enhancement and preprocessing controls for OCR"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '0.75rem'
        }}
      >
        <span style={{ fontSize: '0.95rem', fontFamily: 'var(--font-polysans)', fontWeight: 400, color: 'var(--color-graphite)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={16} color="var(--color-ember-orange)" aria-hidden="true" />
          Image Enhancements (Rotation &amp; Contrast)
        </span>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleRotate}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', minHeight: 38, fontSize: '0.85rem' }}
            title="Rotate 90 degrees clockwise"
            aria-label={`Rotate image 90 degrees. Current: ${options.rotation} degrees.`}
          >
            <RotateCw size={15} aria-hidden="true" />
            <span>Rotate ({options.rotation}&deg;)</span>
          </button>

          <button
            type="button"
            onClick={handleToggleGrayscale}
            className={`btn ${options.grayscale ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.75rem', minHeight: 38, fontSize: '0.85rem' }}
            aria-pressed={options.grayscale}
            aria-label="Toggle black and white high contrast conversion"
          >
            {options.grayscale && <Check size={14} aria-hidden="true" />}
            <span>Grayscale</span>
          </button>
        </div>
      </div>

      {/* Contrast Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
        <Sun size={16} color="var(--text-muted)" aria-hidden="true" />
        <label htmlFor="contrast-slider" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minWidth: 90 }}>
          Contrast: {options.contrast > 0 ? `+${options.contrast}` : options.contrast}
        </label>
        <input
          id="contrast-slider"
          type="range"
          min="-50"
          max="80"
          step="10"
          value={options.contrast}
          onChange={(e) => handleContrastChange(Number(e.target.value))}
          style={{ flex: 1, cursor: 'pointer' }}
          aria-valuemin={-50}
          aria-valuemax={80}
          aria-valuenow={options.contrast}
          aria-label="Adjust image contrast level for clearer text reading"
        />
      </div>

      {/* Hidden Source Image */}
      <img
        ref={hiddenImgRef}
        src={imageSrc}
        alt=""
        style={{ display: 'none' }}
        onLoad={applyProcessing}
      />

      {/* Enhanced Preview Canvas */}
      <div
        style={{
          marginTop: '1rem',
          textAlign: 'center',
          backgroundColor: '#000000',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem',
          maxHeight: 280,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            maxHeight: 260,
            objectFit: 'contain',
            borderRadius: 'var(--radius-sm)'
          }}
          aria-label="Preprocessed image preview"
        />
      </div>
    </div>
  );
};
