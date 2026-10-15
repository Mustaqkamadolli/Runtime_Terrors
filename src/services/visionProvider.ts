import { DescriptionStyle, VisionProvider, VisionResult } from '../types';
import { demoEngine } from './demoEngine';

/**
 * Deterministic Demonstration Vision Provider
 * Uses curated scenario data, structured outputs, and reusable templates.
 */
export class DemoVisionProvider implements VisionProvider {
  public name = 'Demo Intelligence Provider';

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  public async describeImage(
    imageDataUrl: string,
    style: DescriptionStyle = 'quick'
  ): Promise<VisionResult> {
    // If the image is tied to a known demo scenario, find it
    const scenarios = demoEngine.getAllScenarios();
    const matched = scenarios.find((s) => s.svgDataUri === imageDataUrl);

    if (matched) {
      return demoEngine.generateDescription(matched.id, style);
    }

    // Default to the first scenario if matching by reference or fallback
    const fallbackScenario = scenarios[0];
    return demoEngine.generateDescription(fallbackScenario.id, style);
  }

  public async extractText(
    imageDataUrl: string
  ): Promise<{ text: string; confidence?: number }> {
    const scenarios = demoEngine.getAllScenarios();
    const matched = scenarios.find((s) => s.svgDataUri === imageDataUrl);

    if (matched) {
      return {
        text: matched.sampleOcrText,
        confidence: 98
      };
    }

    return {
      text: scenarios[0].sampleOcrText,
      confidence: 95
    };
  }
}

/**
 * Local Model Provider Interface
 * Designed to cleanly interface with a local WebGPU / ONNX / WebLLM model runtime
 * if installed on the host system. Cleanly reports unavailable if no weights exist.
 */
export class LocalModelProvider implements VisionProvider {
  public name = 'Local On-Device Vision Model';

  public async isAvailable(): Promise<boolean> {
    // Check if WebGPU and local weights are initialized
    if (typeof window === 'undefined') return false;
    // We strictly adhere to Honest AI behavior: No local weights are bundled in this prototype
    return false;
  }

  public async describeImage(
    _imageDataUrl: string,
    _style: DescriptionStyle
  ): Promise<VisionResult> {
    throw new Error(
      'Local vision-language model runtime is not installed. Live image understanding is disabled. Use sample scenarios or run live OCR.'
    );
  }

  public async extractText(
    _imageDataUrl: string,
    _language?: string
  ): Promise<{ text: string; confidence?: number }> {
    throw new Error('Local VLM text extraction not available. Use Path A (Tesseract.js OCR).');
  }
}

export const demoVisionProvider = new DemoVisionProvider();
export const localModelProvider = new LocalModelProvider();
