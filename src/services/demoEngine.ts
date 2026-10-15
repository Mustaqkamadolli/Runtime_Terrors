import { DescriptionStyle, Scenario, VisionResult } from '../types';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';

export class DemoEngine {
  private scenarios: Map<string, Scenario> = new Map();

  constructor() {
    SAMPLE_SCENARIOS.forEach((s) => this.scenarios.set(s.id, s));
  }

  public getAllScenarios(): Scenario[] {
    return Array.from(this.scenarios.values());
  }

  public getScenario(id: string): Scenario | undefined {
    return this.scenarios.get(id);
  }

  public generateDescription(
    scenarioId: string,
    style: DescriptionStyle = 'quick'
  ): VisionResult {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario with ID "${scenarioId}" not found in demonstration library.`);
    }

    const styleContent = scenario.descriptions[style] || scenario.descriptions.quick;

    return {
      id: `demo-${scenario.id}-${style}-${Date.now()}`,
      mode: 'describe',
      title: `${scenario.title} (${this.getStyleLabel(style)})`,
      summary: styleContent.summary,
      details: styleContent.details,
      visibleObjects: styleContent.objects,
      visibleText: scenario.sampleOcrText,
      limitations: `${scenario.limitations} Style applied: ${this.getStyleLabel(style)}. No external AI API called.`,
      sourceType: 'demo-scenario',
      processingMethod: 'demo-intelligence',
      scenarioId: scenario.id,
      createdAt: new Date().toISOString(),
      style,
      imagePreview: scenario.svgDataUri
    };
  }

  public generateSampleOcr(scenarioId: string): VisionResult {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario with ID "${scenarioId}" not found in demonstration library.`);
    }

    return {
      id: `demo-ocr-${scenario.id}-${Date.now()}`,
      mode: 'ocr',
      title: `Sample Document: ${scenario.title}`,
      summary: `Predefined text extracted from the ${scenario.title} demonstration sign.`,
      rawOcrText: scenario.sampleOcrText,
      visibleText: scenario.sampleOcrText,
      confidence: 98,
      limitations: 'Sample demonstration result. Curated deterministic text used for testing reading and speech features without running OCR.',
      sourceType: 'demo-scenario',
      processingMethod: 'demo-intelligence',
      scenarioId: scenario.id,
      documentType: scenario.recommendedDocType || 'general',
      createdAt: new Date().toISOString(),
      imagePreview: scenario.svgDataUri
    };
  }

  public createHonestUploadFallback(
    fileName: string,
    fileSizeMb: number
  ): VisionResult {
    return {
      id: `upload-fallback-${Date.now()}`,
      mode: 'describe',
      title: `Uploaded Image: ${fileName} (${fileSizeMb.toFixed(2)} MB)`,
      summary: 'Live general-purpose image understanding is not enabled in this prototype.',
      details: 'This hackathon build operates strictly offline without paid external cloud AI APIs (Gemini/OpenAI/Anthropic). To experience scene descriptions, please explore one of the 8 curated Demonstration Scenarios. Alternatively, to read real text from your uploaded image, switch to the "Read a Sign or Document" workspace to run live browser-based OCR.',
      visibleObjects: ['User-uploaded photograph/graphic file'],
      limitations: 'Honest AI disclosure: No local vision-language model is currently installed in this browser environment. Uploaded images are preserved locally and can be processed with live OCR.',
      sourceType: 'user-upload',
      processingMethod: 'unsupported',
      createdAt: new Date().toISOString()
    };
  }

  private getStyleLabel(style: DescriptionStyle): string {
    switch (style) {
      case 'quick':
        return 'Quick Overview';
      case 'detailed':
        return 'Detailed Description';
      case 'objects':
        return 'Objects & Visible Text';
      case 'simple':
        return 'Simple Plain Language';
      case 'educational':
        return 'Educational Explanation';
    }
  }
}

export const demoEngine = new DemoEngine();
