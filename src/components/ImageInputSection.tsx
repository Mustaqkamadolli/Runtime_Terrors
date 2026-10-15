import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, X, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { CameraCapture } from './CameraCapture';
import { useAriaAnnouncer } from './AriaLiveAnnouncer';

interface ImageInputSectionProps {
  onImageSelected: (file: File) => void;
  onImageCleared: () => void;
  selectedFile: File | null;
  imagePreviewUrl: string | null;
  actionButtonLabel: string;
  onExecuteAction: () => void;
  isProcessing: boolean;
  sampleButton?: React.ReactNode;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageInputSection: React.FC<ImageInputSectionProps> = ({
  onImageSelected,
  onImageCleared,
  selectedFile,
  imagePreviewUrl,
  actionButtonLabel,
  onExecuteAction,
  isProcessing,
  sampleButton
}) => {
  const { announcePolite, announceAssertive } = useAriaAnnouncer();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validate file
  const validateAndHandleFile = (file: File) => {
    setErrorMessage(null);

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const err = `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 10 MB limit. Please select a smaller image.`;
      setErrorMessage(err);
      announceAssertive(err);
      return;
    }

    // Validate type
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isValidType =
      ALLOWED_MIME_TYPES.includes(file.type) ||
      (ext && ALLOWED_EXTENSIONS.includes(ext));

    if (!isValidType) {
      const err = `Unsupported file format (${file.type || ext}). Please select a JPG, JPEG, PNG, or WebP image.`;
      setErrorMessage(err);
      announceAssertive(err);
      return;
    }

    setIsCameraActive(false);
    onImageSelected(file);
    announcePolite(`Selected image: ${file.name}, ${(file.size / 1024).toFixed(0)} kilobytes.`);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageCleared();
    announcePolite('Image removed.');
  };

  return (
    <div
      className="card"
      style={{
        backgroundColor: 'var(--color-ash)',
        borderRadius: 'var(--radius-asymmetric-card)',
        border: '1px solid var(--border-hairline)',
        padding: '2rem',
        marginBottom: '1.5rem'
      }}
      role="region"
      aria-label="Image Selection & Camera Area"
    >
      {/* If camera mode is open, render CameraCapture */}
      {isCameraActive ? (
        <CameraCapture
          onPhotoConfirmed={(file) => {
            validateAndHandleFile(file);
            setIsCameraActive(false);
          }}
          onCancel={() => setIsCameraActive(false)}
        />
      ) : (
        <div>
          {/* Main Action Buttons: Take a Photo or Select Image */}
          {!selectedFile ? (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}
              >
                {/* 1. Take a Photo Button */}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setIsCameraActive(true);
                  }}
                  className="btn btn-primary"
                  style={{
                    minHeight: 56,
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}
                  aria-label="Take a photo with your device camera"
                >
                  <Camera size={22} aria-hidden="true" />
                  <span>Take a Photo</span>
                </button>

                {/* 2. Select Image File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{
                    minHeight: 56,
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}
                  aria-label="Select an image file from your device"
                >
                  <Upload size={22} aria-hidden="true" />
                  <span>Select Image</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                aria-hidden="true"
              />

              {/* Optional Sample button for testing */}
              {sampleButton && (
                <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                  {sampleButton}
                </div>
              )}
            </div>
          ) : (
            /* Selected Image Preview & Operations */
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}
              >
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    margin: 0
                  }}
                >
                  Image Ready for Analysis
                </h3>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-secondary"
                  style={{ minHeight: 40, padding: '0.35rem 0.8rem', fontSize: '0.9rem' }}
                  aria-label="Remove currently selected image"
                >
                  <X size={16} aria-hidden="true" />
                  <span>Remove Image</span>
                </button>
              </div>

              {/* Image Preview Box */}
              {imagePreviewUrl && (
                <div
                  style={{
                    backgroundColor: '#000000',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    maxHeight: 320,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={imagePreviewUrl}
                    alt="Preview of currently selected visual image"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 320,
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              {/* File details info */}
              <div
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <span>
                  <strong>File:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{ minHeight: 38, padding: '0.3rem 0.75rem', fontSize: '0.85rem' }}
                  aria-label="Choose a different image file"
                >
                  <RefreshCw size={14} aria-hidden="true" />
                  <span>Select Another Image</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                aria-hidden="true"
              />

              {/* Primary Action Button ("Describe Surroundings" or "Extract Text") */}
              <button
                type="button"
                onClick={onExecuteAction}
                disabled={isProcessing}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  minHeight: 56,
                  fontSize: '1.15rem',
                  fontWeight: 800
                }}
                aria-label={actionButtonLabel}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" aria-hidden="true" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{actionButtonLabel}</span>
                )}
              </button>
            </div>
          )}

          {/* Error Message Announcement */}
          {errorMessage && (
            <div
              style={{
                marginTop: '1rem',
                backgroundColor: 'var(--error-bg)',
                color: 'var(--error-color)',
                border: '1px solid var(--error-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
              role="alert"
            >
              <AlertCircle size={20} aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
