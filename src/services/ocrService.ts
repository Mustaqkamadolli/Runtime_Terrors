import { createWorker, Worker } from 'tesseract.js';

export interface OcrProgressCallback {
  (progress: number, status: string): void;
}

export interface OcrResultData {
  text: string;
  confidence: number;
  lines: string[];
}

export interface PreprocessOptions {
  rotation: number; // 0, 90, 180, 270
  grayscale: boolean;
  contrast: number; // -100 to 100, 0 = neutral
}

class OcrService {
  private worker: Worker | null = null;
  private isInitializing: boolean = false;
  private currentLanguage: string = 'eng';

  public async getWorker(language: string = 'eng'): Promise<Worker> {
    if (this.worker && this.currentLanguage === language) {
      return this.worker;
    }

    if (this.worker) {
      try {
        await this.worker.terminate();
      } catch (e) {
        console.warn('Error terminating old OCR worker:', e);
      }
      this.worker = null;
    }

    this.isInitializing = true;
    try {
      const worker = await createWorker(language);
      this.worker = worker;
      this.currentLanguage = language;
      this.isInitializing = false;
      return worker;
    } catch (err) {
      this.isInitializing = false;
      throw new Error(`Failed to initialize OCR engine: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  public async recognize(
    imageSource: string | HTMLCanvasElement,
    language: string = 'eng',
    onProgress?: OcrProgressCallback
  ): Promise<OcrResultData> {
    try {
      if (onProgress) {
        onProgress(5, 'Initializing OCR worker...');
      }

      const worker = await this.getWorker(language);

      if (onProgress) {
        onProgress(25, 'Analyzing image lines and glyphs...');
      }

      const res = await worker.recognize(imageSource);

      if (onProgress) {
        onProgress(100, 'OCR text extraction complete');
      }

      const text = res.data.text || '';
      const confidence = Math.round(res.data.confidence || 0);
      const lines = text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      return {
        text,
        confidence,
        lines
      };
    } catch (err) {
      console.error('OCR recognition error:', err);
      throw err;
    }
  }

  public preprocessImage(
    imgElement: HTMLImageElement,
    options: PreprocessOptions
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D canvas context');

    const { rotation, grayscale, contrast } = options;
    const isRotatedQuarter = rotation === 90 || rotation === 270;

    canvas.width = isRotatedQuarter ? imgElement.naturalHeight : imgElement.naturalWidth;
    canvas.height = isRotatedQuarter ? imgElement.naturalWidth : imgElement.naturalHeight;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(
      imgElement,
      -imgElement.naturalWidth / 2,
      -imgElement.naturalHeight / 2
    );
    ctx.restore();

    if (grayscale || contrast !== 0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (grayscale) {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          r = gray;
          g = gray;
          b = gray;
        }

        if (contrast !== 0) {
          r = factor * (r - 128) + 128;
          g = factor * (g - 128) + 128;
          b = factor * (b - 128) + 128;
        }

        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      ctx.putImageData(imageData, 0, 0);
    }

    return canvas;
  }

  public async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export const ocrService = new OcrService();
