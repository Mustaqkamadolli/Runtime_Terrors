import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw, Check, X, AlertCircle } from 'lucide-react';
import { useAriaAnnouncer } from './AriaLiveAnnouncer';

interface CameraCaptureProps {
  onPhotoConfirmed: (file: File) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoConfirmed,
  onCancel
}) => {
  const { announcePolite, announceAssertive } = useAriaAnnouncer();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedBlobUrl, setCapturedBlobUrl] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Clean up all tracks in a media stream
  const stopTracks = useCallback((mediaStream: MediaStream | null) => {
    if (mediaStream) {
      try {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (err) {
        console.warn('Error stopping camera tracks:', err);
      }
    }
  }, []);

  // Request camera stream
  const initCamera = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    // Verify browser support
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      const msg = 'Camera is not supported in this browser context (requires HTTPS or localhost). Please select an image file instead.';
      setErrorMessage(msg);
      setIsLoading(false);
      announceAssertive(msg);
      return;
    }

    try {
      // First attempt: Prefer rear-facing camera for signs and surroundings
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (idealErr) {
        // Fallback: If 'environment' constraint fails (e.g., standard webcam without environment camera)
        console.warn('Ideal environment facingMode failed, falling back to default video:', idealErr);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setStream(mediaStream);
      setIsLoading(false);
      announcePolite('Camera activated. Point your camera and press Capture Photo.');
    } catch (err) {
      setIsLoading(false);
      let userFriendlyMsg = 'Unable to access camera.';
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          userFriendlyMsg = 'Camera permission was denied. Please allow camera access in your browser settings or upload an image file instead.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          userFriendlyMsg = 'No camera device found on this system. Please upload an image file instead.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          userFriendlyMsg = 'Camera is currently in use by another application. Please close other camera apps and try again.';
        } else {
          userFriendlyMsg = `Camera error: ${err.message}. Please use file upload.`;
        }
      } else if (err instanceof Error) {
        userFriendlyMsg = err.message;
      }
      setErrorMessage(userFriendlyMsg);
      announceAssertive(userFriendlyMsg);
    }
  }, [announcePolite, announceAssertive]);

  // Start camera on mount
  useEffect(() => {
    initCamera();
    return () => {
      // Stop stream on unmount
      if (stream) {
        stopTracks(stream);
      }
    };
  }, [initCamera]);

  // Connect stream to video element whenever stream or video ref updates
  useEffect(() => {
    if (videoRef.current && stream && !capturedBlobUrl) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((playErr) => {
        console.warn('Video play interrupted or prevented:', playErr);
      });
    }
  }, [stream, capturedBlobUrl]);

  // Clean up object URLs on unmount or retake
  useEffect(() => {
    return () => {
      if (capturedBlobUrl) {
        URL.revokeObjectURL(capturedBlobUrl);
      }
    };
  }, [capturedBlobUrl]);

  // Capture video frame to canvas
  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not initialize canvas context for photo capture');
      }

      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            const err = 'Failed to capture photo frame.';
            setErrorMessage(err);
            announceAssertive(err);
            return;
          }

          const file = new File([blob], `camera-photo-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });

          const url = URL.createObjectURL(blob);
          setCapturedFile(file);
          setCapturedBlobUrl(url);

          // Stop camera hardware while user reviews the photo
          stopTracks(stream);
          setStream(null);

          announcePolite('Photo captured. Review your photo and select Use This Photo or Retake Photo.');
        },
        'image/jpeg',
        0.92
      );
    } catch (err) {
      console.error('Error during photo capture:', err);
      const msg = 'Failed to take photo. Please try again.';
      setErrorMessage(msg);
      announceAssertive(msg);
    }
  };

  // Retake photo: discard captured photo and restart camera
  const handleRetake = () => {
    if (capturedBlobUrl) {
      URL.revokeObjectURL(capturedBlobUrl);
    }
    setCapturedBlobUrl(null);
    setCapturedFile(null);
    setErrorMessage(null);
    announcePolite('Restarting camera for retake.');
    initCamera();
  };

  // Confirm photo: send to parent and clean up
  const handleConfirmPhoto = () => {
    if (capturedFile) {
      stopTracks(stream);
      announcePolite('Photo confirmed and ready for processing.');
      onPhotoConfirmed(capturedFile);
    }
  };

  // Cancel and exit camera
  const handleClose = () => {
    stopTracks(stream);
    if (capturedBlobUrl) {
      URL.revokeObjectURL(capturedBlobUrl);
    }
    announcePolite('Camera closed.');
    onCancel();
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '2px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}
      role="region"
      aria-label="Camera Capture Interface"
    >
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
            fontSize: '1.2rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            margin: 0
          }}
        >
          {capturedBlobUrl ? 'Review Captured Photo' : 'Take a Photo'}
        </h3>
        <button
          type="button"
          onClick={handleClose}
          className="btn btn-secondary"
          style={{ minHeight: 44, padding: '0.4rem 0.9rem' }}
          aria-label="Cancel and close camera"
        >
          <X size={18} aria-hidden="true" />
          <span>Close Camera</span>
        </button>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div
          style={{
            backgroundColor: 'var(--error-bg)',
            color: 'var(--error-color)',
            border: '1px solid var(--error-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}
          role="alert"
        >
          <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
          <div>
            <p style={{ fontWeight: 700, margin: '0 0 0.35rem 0' }}>Camera Unavailable</p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Camera Live Viewfinder */}
      {!capturedBlobUrl && (
        <div>
          {isLoading ? (
            <div
              style={{
                backgroundColor: '#000000',
                borderRadius: 'var(--radius-md)',
                height: 280,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                color: 'var(--text-main)'
              }}
              role="status"
            >
              <RefreshCw size={32} className="animate-spin" aria-hidden="true" />
              <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
                Requesting camera access...
              </p>
            </div>
          ) : (
            stream && (
              <div
                style={{
                  backgroundColor: '#000000',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  textAlign: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    maxHeight: 360,
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  aria-label="Live camera viewfinder. Point at signs, text, or your surroundings."
                />
              </div>
            )
          )}

          {/* Capture button */}
          {!isLoading && stream && (
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleCapture}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  minHeight: 56,
                  fontSize: '1.15rem',
                  fontWeight: 800
                }}
                aria-label="Capture photo now"
              >
                <Camera size={24} aria-hidden="true" />
                <span>Capture Photo</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Photo Preview & Retake / Use Photo controls */}
      {capturedBlobUrl && (
        <div>
          <div
            style={{
              backgroundColor: '#000000',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              textAlign: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <img
              src={capturedBlobUrl}
              alt="Preview of captured photo"
              style={{
                maxWidth: '100%',
                maxHeight: 360,
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}
          >
            <button
              type="button"
              onClick={handleRetake}
              className="btn btn-secondary"
              style={{ minHeight: 52, fontSize: '1.05rem', fontWeight: 700 }}
              aria-label="Discard photo and retake"
            >
              <RefreshCw size={20} aria-hidden="true" />
              <span>Retake Photo</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmPhoto}
              className="btn btn-primary"
              style={{
                minHeight: 52,
                fontSize: '1.05rem',
                fontWeight: 800,
                backgroundColor: 'var(--success-color)'
              }}
              aria-label="Use this photo for processing"
            >
              <Check size={20} aria-hidden="true" />
              <span>Use This Photo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
