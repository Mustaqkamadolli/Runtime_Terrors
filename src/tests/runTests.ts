import { demoEngine } from '../services/demoEngine';
import { demoVisionProvider, localModelProvider } from '../services/visionProvider';
import { speechService } from '../services/speechService';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { DescriptionStyle } from '../types';

declare const process: any;

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${msg}`);
    failed++;
  }
}

console.log('====================================================');
console.log('🧪 RUNNING SEEABLE AI COMPREHENSIVE TEST SUITE');
console.log('====================================================\n');

// TEST SUITE 1: Sample Scenario Library Integrity
console.log('--- TEST SUITE 1: Sample Scenarios Catalog ---');
assert(SAMPLE_SCENARIOS.length >= 8, `Expected at least 8 curated scenarios, found ${SAMPLE_SCENARIOS.length}`);

const requiredScenarios = [
  'campus-notice',
  'bus-stop',
  'classroom-whiteboard',
  'product-label',
  'restaurant-menu',
  'building-sign',
  'recycling-instructions',
  'library-info'
];

requiredScenarios.forEach((id) => {
  const scenario = demoEngine.getScenario(id);
  assert(!!scenario, `Scenario "${id}" exists in demonstration library`);
  if (scenario) {
    assert(scenario.svgDataUri.startsWith('data:image/svg+xml'), `Scenario "${id}" has inline SVG data URI`);
    assert(scenario.sampleOcrText.length > 10, `Scenario "${id}" has non-empty sample OCR text`);
    assert(!!scenario.limitations, `Scenario "${id}" discloses limitations`);
  }
});

// TEST SUITE 2: Demo Engine Multi-Style Description Generation
console.log('\n--- TEST SUITE 2: Description Styles & Determinism ---');
const styles: DescriptionStyle[] = ['quick', 'detailed', 'objects', 'simple', 'educational'];

styles.forEach((style) => {
  const res = demoEngine.generateDescription('campus-notice', style);
  assert(res.mode === 'describe', `Style "${style}" mode is "describe"`);
  assert(res.processingMethod === 'demo-intelligence', `Style "${style}" method is demo-intelligence`);
  assert(res.sourceType === 'demo-scenario', `Style "${style}" sourceType is demo-scenario`);
  assert(res.summary.length > 5, `Style "${style}" produces valid summary: "${res.summary.slice(0, 30)}..."`);
  assert(Array.isArray(res.visibleObjects), `Style "${style}" contains visibleObjects array`);
});

// TEST SUITE 3: Honest AI Behavior & Negative Test Cases
console.log('\n--- TEST SUITE 3: Honest AI Behavior & Error Handling ---');
try {
  demoEngine.generateDescription('non-existent-scenario-id');
  assert(false, 'Should throw error on invalid scenario ID');
} catch (e) {
  assert(true, 'Throws informative error when scenario ID is invalid');
}

// Uploaded arbitrary photo fallback
const fallback = demoEngine.createHonestUploadFallback('sample-photo.jpg', 2.4);
assert(fallback.processingMethod === 'unsupported', 'Uploaded photo fallback processingMethod is "unsupported"');
assert(fallback.summary.includes('Live general-purpose image understanding is not enabled'), 'Honest summary disclosure is present');
assert(fallback.limitations.includes('Honest AI disclosure'), 'Transparent limitation callout present');

// TEST SUITE 4: Vision Provider Interface
console.log('\n--- TEST SUITE 4: Vision Provider Architecture ---');
async function testProviders() {
  const demoAvail = await demoVisionProvider.isAvailable();
  assert(demoAvail === true, 'DemoVisionProvider reports available = true');

  const localAvail = await localModelProvider.isAvailable();
  assert(localAvail === false, 'LocalModelProvider transparently reports available = false');

  try {
    await localModelProvider.describeImage('fake', 'quick');
    assert(false, 'LocalModelProvider should throw when weights are missing');
  } catch (e) {
    assert(true, 'LocalModelProvider throws clear explanation when weights unavailable');
  }
}

// TEST SUITE 5: Speech Service Bounds & Safeguards
console.log('\n--- TEST SUITE 5: Speech Service Safeguards ---');
assert(typeof speechService.isSupported === 'function', 'speechService.isSupported is defined');
assert(typeof speechService.stop === 'function', 'speechService.stop is callable');
assert(typeof speechService.repeatLastAnswer === 'function', 'speechService.repeatLastAnswer is callable');

testProviders().then(() => {
  console.log('\n====================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
});
