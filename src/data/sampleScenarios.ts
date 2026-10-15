import { Scenario } from '../types';

// Helper to create crisp inline SVG illustrations
function createSvgDataUri(svgContent: string): string {
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">${svgContent}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
}

export const SAMPLE_SCENARIOS: Scenario[] = [
  {
    id: 'campus-notice',
    title: 'College Campus Notice',
    category: 'Education & Notices',
    tag: 'Notice Board',
    description: 'A blue-and-white university flyer announcing the Annual AI in Healthcare Symposium.',
    recommendedDocType: 'notice',
    limitations: 'Demonstration scenario with predetermined contents. Event details are illustrative and not affiliated with an actual institution.',
    svgDataUri: createSvgDataUri(`
      <rect width="600" height="400" fill="#0F172A" rx="16"/>
      <rect x="30" y="30" width="540" height="340" fill="#1E293B" rx="12" stroke="#3478F6" stroke-width="2"/>
      <rect x="50" y="50" width="500" height="60" fill="#3478F6" rx="8"/>
      <text x="300" y="88" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" text-anchor="middle">CAMPUS ANNOUNCEMENT: AI SYMPOSIUM</text>
      
      <text x="70" y="145" fill="#8BB8FF" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">TOPIC:</text>
      <text x="140" y="145" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16">Annual Healthcare &amp; Assistive Tech Meet</text>
      
      <text x="70" y="185" fill="#8BB8FF" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">DATE &amp; TIME:</text>
      <text x="180" y="185" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16">Friday, November 14 &bull; 10:00 AM – 3:00 PM</text>
      
      <text x="70" y="225" fill="#8BB8FF" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">VENUE:</text>
      <text x="140" y="225" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16">Auditorium Hall B, Science Complex 2nd Floor</text>
      
      <rect x="70" y="260" width="460" height="70" fill="#081426" rx="8" stroke="#334155"/>
      <text x="90" y="290" fill="#34D399" font-family="system-ui, sans-serif" font-size="15" font-weight="bold">REGISTRATION DETAILS:</text>
      <text x="90" y="315" fill="#D3DCEB" font-family="system-ui, sans-serif" font-size="14">Free admission for all enrolled students. RSVP at desk B-12 before Wed.</text>
    `),
    descriptions: {
      quick: {
        summary: 'A university campus notice board announcing an upcoming AI in Healthcare Symposium.',
        details: 'The poster specifies the event date (Friday, Nov 14, 10 AM to 3 PM) at Auditorium Hall B on the second floor of the Science Complex. Registration is free for students.',
        objects: ['Blue notice banner', 'Printed schedule block', 'Auditorium location tag', 'Registration instruction box'],
        limitations: 'Demonstration data. This is a synthetic campus notice created for testing.'
      },
      detailed: {
        summary: 'A structured university flyer announcing the Annual Healthcare & Assistive Tech Symposium in Auditorium Hall B.',
        details: 'The document contains a prominent blue header labeled "CAMPUS ANNOUNCEMENT: AI SYMPOSIUM". Underneath, clearly marked fields specify: Topic: Annual Healthcare & Assistive Tech Meet; Date & Time: Friday, November 14 from 10:00 AM to 3:00 PM; Venue: Auditorium Hall B, Science Complex 2nd Floor. At the bottom, a highlighted dark card provides Registration Details indicating free admission for enrolled students and requesting an RSVP at desk B-12 before Wednesday.',
        objects: ['Prominent title header', 'Topic specification section', 'Date and timestamp entry', 'Location descriptor', 'RSVP box'],
        limitations: 'Predefined demonstration scenario. Does not reflect live calendar events.'
      },
      objects: {
        summary: 'Campus poster with 4 distinct structured text blocks and a dark accent card.',
        details: 'Identified elements: 1 header bar (AI Symposium), 3 metadata lines (Topic, Date & Time, Venue), and 1 bottom callout box containing registration guidance.',
        objects: ['Title banner', 'Event topic', 'Date & time block', 'Room location', 'RSVP registration banner'],
        limitations: 'Demonstration visual catalog.'
      },
      simple: {
        summary: 'A sign about a school meeting on AI and health.',
        details: 'It happens on Friday, November 14, from 10 in the morning until 3 in the afternoon. It is located in Auditorium Hall B on the 2nd floor. It is free for students.',
        objects: ['School sign', 'Date information', 'Room number'],
        limitations: 'Sample information for demonstration.'
      },
      educational: {
        summary: 'An illustrative university announcement demonstrating structured public bulletin formatting.',
        details: 'Public campus notices utilize hierarchical typographical layouts: high-contrast headers catch the eye from afar, followed by key logistical data points (Who, When, Where), culminating in an actionable directive (RSVP instructions).',
        objects: ['Hierarchical header', 'Structured metadata', 'Call-to-action panel'],
        limitations: 'Demonstration scenario used for accessible document analysis.'
      }
    },
    sampleOcrText: `CAMPUS ANNOUNCEMENT: AI SYMPOSIUM
TOPIC: Annual Healthcare & Assistive Tech Meet
DATE & TIME: Friday, November 14 • 10:00 AM – 3:00 PM
VENUE: Auditorium Hall B, Science Complex 2nd Floor
REGISTRATION DETAILS:
Free admission for all enrolled students. RSVP at desk B-12 before Wed.`
  },

  {
    id: 'bus-stop',
    title: 'Bus Stop Information Sign',
    category: 'Transit & Navigation',
    tag: 'Public Sign',
    description: 'A yellow and black transit stop sign indicating Route 42 towards Central Station.',
    recommendedDocType: 'sign',
    limitations: 'Illustrative sample transit data. This is not live GPS or timetable transit data and must not be relied upon for actual navigation.',
    svgDataUri: createSvgDataUri(`
      <rect width="600" height="400" fill="#0B132B" rx="16"/>
      <rect x="40" y="30" width="520" height="340" fill="#1C2541" rx="12" stroke="#F59E0B" stroke-width="3"/>
      
      <circle cx="110" cy="110" r="45" fill="#F59E0B"/>
      <text x="110" y="125" fill="#0B132B" font-family="system-ui, sans-serif" font-size="44" font-weight="900" text-anchor="middle">42</text>
      
      <text x="180" y="95" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">METRO BUS STOP #108</text>
      <text x="180" y="130" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="18">DIRECTION: Central Station via Civic Plaza</text>
      
      <line x1="70" y1="180" x2="530" y2="180" stroke="#3A506B" stroke-width="2"/>
      
      <text x="70" y="220" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">NEXT DEPARTURES (SCHEDULED):</text>
      <text x="70" y="255" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16">&bull; 10:15 AM &bull; 10:35 AM &bull; 10:55 AM &bull; 11:15 AM</text>
      
      <rect x="70" y="285" width="460" height="55" fill="#0B132B" rx="8" stroke="#F59E0B" stroke-dasharray="4"/>
      <text x="90" y="318" fill="#FDE047" font-family="system-ui, sans-serif" font-size="14">&bull; Accessible Low-Floor Bus &bull; Wheelchair Ramp Available</text>
    `),
    descriptions: {
      quick: {
        summary: 'A public transit stop sign for Route 42 traveling toward Central Station.',
        details: 'Stop #108 shows Route 42 heading to Central Station via Civic Plaza, with departures every 20 minutes starting at 10:15 AM. Wheelchair ramp accessible.',
        objects: ['Route number 42 circle', 'Stop number identifier', 'Destination label', 'Scheduled departure times', 'Accessibility indicator'],
        limitations: 'Illustrative transit display. Not connected to real-time city dispatch.'
      },
      detailed: {
        summary: 'A high-contrast transit sign showing Route 42 stopping at Metro Stop #108.',
        details: 'The sign features a bright yellow circular badge containing the route number "42" in heavy black typography. Alongside it is the stop identifier "METRO BUS STOP #108" and direction "Central Station via Civic Plaza". Scheduled departure times listed are 10:15 AM, 10:35 AM, 10:55 AM, and 11:15 AM. A bottom callout highlights accessible low-floor boarding with a wheelchair ramp.',
        objects: ['Route 42 emblem', 'Stop identifier', 'Route destination', 'Timetable row', 'Wheelchair accessibility note'],
        limitations: 'Demonstration scenario. Do not use for real transit navigation.'
      },
      objects: {
        summary: 'Transit signboard with circular route badge, destination text, departure times, and accessibility icon.',
        details: 'Main elements: 1 circular route badge (#42), 1 stop tag (#108), 1 route line, 4 scheduled departure timestamps, 1 accessibility notice.',
        objects: ['Route badge 42', 'Stop title', 'Departure list', 'Accessibility ramp indicator'],
        limitations: 'Demonstration catalog.'
      },
      simple: {
        summary: 'A bus stop sign for bus number 42.',
        details: 'It goes to Central Station. Buses come at 10:15, 10:35, 10:55, and 11:15. The bus has a ramp for wheelchairs.',
        objects: ['Bus number 42', 'Bus times', 'Wheelchair ramp note'],
        limitations: 'Sample transit sign.'
      },
      educational: {
        summary: 'An illustrative urban mobility sign demonstrating transit information hierarchy.',
        details: 'Transit signs prioritize route numbers using distinct circular high-contrast badges for rapid recognition from distance, followed by terminus names and schedule frequencies to aid accessibility.',
        objects: ['Route badge', 'Destination corridor', 'Accessible boarding note'],
        limitations: 'Demonstration scenario.'
      }
    },
    sampleOcrText: `42
METRO BUS STOP #108
DIRECTION: Central Station via Civic Plaza
NEXT DEPARTURES (SCHEDULED):
• 10:15 AM • 10:35 AM • 10:55 AM • 11:15 AM
• Accessible Low-Floor Bus • Wheelchair Ramp Available`
  },

  {
    id: 'classroom-whiteboard',
    title: 'Classroom Whiteboard',
    category: 'Education & Notices',
    tag: 'Classroom',
    description: 'A classroom whiteboard containing handwritten physics notes and a foundational equation.',
    recommendedDocType: 'general',
    limitations: 'Demonstration educational content. Mathematical notations are illustrative.',
    svgDataUri: createSvgDataUri(`
      <rect width="600" height="400" fill="#E2E8F0" rx="16"/>
      <rect x="25" y="25" width="550" height="350" fill="#FFFFFF" rx="8" stroke="#94A3B8" stroke-width="4"/>
      
      <text x="50" y="70" fill="#1E293B" font-family="'Comic Sans MS', cursive, sans-serif" font-size="22" font-weight="bold">Physics 101: Newton's Second Law</text>
      <line x1="50" y1="85" x2="420" y2="85" stroke="#3B82F6" stroke-width="3"/>
      
      <text x="50" y="130" fill="#334155" font-family="sans-serif" font-size="16">&bull; Net Force equals mass times acceleration: F = m &times; a</text>
      <text x="50" y="165" fill="#334155" font-family="sans-serif" font-size="16">&bull; Units: Force in Newtons (N), Mass in kg, Accel in m/s&sup2;</text>
      <text x="50" y="200" fill="#334155" font-family="sans-serif" font-size="16">&bull; Example: If m = 10 kg and a = 2 m/s&sup2;, then F = 20 N</text>
      
      <rect x="50" y="235" width="500" height="90" fill="#F8FAFC" rx="8" stroke="#CBD5E1"/>
      <text x="70" y="270" fill="#DC2626" font-family="sans-serif" font-size="16" font-weight="bold">Homework Assignment for Thursday:</text>
      <text x="70" y="300" fill="#1E293B" font-family="sans-serif" font-size="15">Read Chapter 4 (pages 82-95) &bull; Complete exercises 1, 3, and 7.</text>
    `),
    descriptions: {
      quick: {
        summary: 'A classroom whiteboard with Physics 101 lecture notes on Newton\'s Second Law.',
        details: 'The board lists the formula F = m * a, units (Newtons, kg, m/s²), a calculation example (10kg * 2m/s² = 20N), and homework from Chapter 4 for Thursday.',
        objects: ['Physics heading', 'Newtonian equation', 'Units summary', 'Example problem', 'Homework box'],
        limitations: 'Demonstration educational whiteboard.'
      },
      detailed: {
        summary: 'A white surface classroom board titled "Physics 101: Newton\'s Second Law" with bulleted formulas and homework.',
        details: 'The top line reads "Physics 101: Newton\'s Second Law" with a blue underline. Three main bullet points describe the formula F = m * a, specify units (Force in Newtons, Mass in kg, Acceleration in m/s²), and provide a worked example where m = 10 kg and a = 2 m/s² resulting in F = 20 N. A highlighted box at the bottom outlines homework for Thursday: Read Chapter 4 (pages 82-95) and complete exercises 1, 3, and 7.',
        objects: ['Title header', 'Formula definition', 'Unit breakdown', 'Calculation example', 'Homework section'],
        limitations: 'Predefined classroom board data.'
      },
      objects: {
        summary: 'Classroom whiteboard with heading, 3 physics bullets, and 1 assignment box.',
        details: 'Key items: Physics 101 title, formula F = m * a, unit definitions, worked mathematical example, Thursday homework assignment.',
        objects: ['Title', 'Formula text', 'Mathematical units', 'Worked calculation', 'Homework panel'],
        limitations: 'Demonstration catalog.'
      },
      simple: {
        summary: 'A school board with science notes.',
        details: 'It explains the formula Force equals mass times acceleration (F = m times a). It gives homework for Thursday: read chapter 4 and do questions 1, 3, and 7.',
        objects: ['Science notes', 'Math formula', 'Homework reminder'],
        limitations: 'Sample school board.'
      },
      educational: {
        summary: 'An illustrative classroom instruction surface demonstrating academic board work.',
        details: 'Educational presentation integrates theory (Newton\'s 2nd law), dimensional analysis (units in N, kg, m/s²), concrete calculation, and immediate assignment reinforcement.',
        objects: ['Pedagogical notes', 'Formal equation', 'Homework instruction'],
        limitations: 'Demonstration whiteboard.'
      }
    },
    sampleOcrText: `Physics 101: Newton's Second Law
• Net Force equals mass times acceleration: F = m × a
• Units: Force in Newtons (N), Mass in kg, Accel in m/s²
• Example: If m = 10 kg and a = 2 m/s², then F = 20 N
Homework Assignment for Thursday:
Read Chapter 4 (pages 82-95) • Complete exercises 1, 3, and 7.`
  },

  {
    id: 'product-label',
    title: 'Food Packaging Product Label',
    category: 'Consumer & Retail',
    tag: 'Product Label',
    description: 'A packaging label for Organic Rolled Oats showing dietary facts, ingredients, and best-before date.',
    recommendedDocType: 'receipt',
    limitations: 'Fictional product packaging. Do not use for medical, allergen, or clinical nutritional management.',
    svgDataUri: createSvgDataUri(`
      <rect width="600" height="400" fill="#064E3B" rx="16"/>
      <rect x="30" y="30" width="540" height="340" fill="#065F46" rx="12" stroke="#10B981" stroke-width="2"/>
      
      <rect x="50" y="50" width="160" height="36" fill="#10B981" rx="6"/>
      <text x="130" y="74" fill="#064E3B" font-family="sans-serif" font-size="14" font-weight="900" text-anchor="middle">100% CERTIFIED</text>
      
      <text x="50" y="125" fill="#FFFFFF" font-family="sans-serif" font-size="28" font-weight="bold">Pure Harvest Organic Rolled Oats</text>
      <text x="50" y="155" fill="#A7F3D0" font-family="sans-serif" font-size="16">Whole Grain &bull; Gluten Free &bull; High Dietary Fiber</text>
      
      <line x1="50" y1="180" x2="550" y2="180" stroke="#047857" stroke-width="2"/>
      
      <text x="50" y="215" fill="#FFFFFF" font-family="sans-serif" font-size="15" font-weight="bold">NET WEIGHT: 500g (17.6 oz)</text>
      <text x="50" y="245" fill="#FFFFFF" font-family="sans-serif" font-size="15" font-weight="bold">BEST BEFORE: 28 OCT 2027</text>
      <text x="50" y="275" fill="#D1FAE5" font-family="sans-serif" font-size="14">INGREDIENTS: 100% Organic Whole Grain Oats.</text>
      
      <rect x="50" y="300" width="500" height="50" fill="#022C22" rx="8"/>
      <text x="70" y="332" fill="#FDE047" font-family="sans-serif" font-size="13">&bull; Allergen Notice: Processed in a dedicated peanut-free facility.</text>
    `),
    descriptions: {
      quick: {
        summary: 'Packaging label for Pure Harvest Organic Rolled Oats (500g).',
        details: 'The label highlights 100% Organic Rolled Oats, Gluten Free, Net Weight 500g, Best Before date of 28 OCT 2027, and notes a peanut-free facility.',
        objects: ['Certification badge', 'Product brand name', 'Weight indication', 'Best before date', 'Allergen statement'],
        limitations: 'Demonstration retail label. Not medical or allergen advice.'
      },
      detailed: {
        summary: 'A green organic food package label for "Pure Harvest Organic Rolled Oats" with expiration and dietary data.',
        details: 'The top features a green badge reading "100% CERTIFIED". Below it is the product name "Pure Harvest Organic Rolled Oats" with descriptors "Whole Grain • Gluten Free • High Dietary Fiber". Specifications indicate a Net Weight of 500g (17.6 oz) and a Best Before expiration date of 28 OCT 2027. Ingredients are listed as 100% Organic Whole Grain Oats, followed by an allergen note confirming processing in a dedicated peanut-free facility.',
        objects: ['Product title', 'Weight measure', 'Expiration timestamp', 'Ingredients line', 'Allergen note'],
        limitations: 'Illustrative label data.'
      },
      objects: {
        summary: 'Food packaging label with brand title, dietary badges, net weight, expiration date, and allergen statement.',
        details: 'Recognized fields: Brand (Pure Harvest), Product (Organic Rolled Oats), Weight (500g), Expiry (28 OCT 2027), Ingredients, Allergen info.',
        objects: ['Brand badge', 'Product title', 'Weight', 'Expiry date', 'Allergen panel'],
        limitations: 'Sample product label.'
      },
      simple: {
        summary: 'A box of organic oats.',
        details: 'The product is Pure Harvest Organic Rolled Oats, 500 grams. The best before date is October 28, 2027. It is gluten-free and peanut-free.',
        objects: ['Oat box', 'Expiration date', 'Weight'],
        limitations: 'Demonstration food box.'
      },
      educational: {
        summary: 'An illustrative consumer packaging document showing standard food regulatory labeling.',
        details: 'Consumer packaging features mandatory regulatory declarations: explicit net weight, ingredients list ordered by predominance, best-before date, and facility allergen disclosure.',
        objects: ['Brand header', 'Net quantity', 'Durability date', 'Allergen advisory'],
        limitations: 'Demonstration product scenario.'
      }
    },
    sampleOcrText: `100% CERTIFIED
Pure Harvest Organic Rolled Oats
Whole Grain • Gluten Free • High Dietary Fiber
NET WEIGHT: 500g (17.6 oz)
BEST BEFORE: 28 OCT 2027
INGREDIENTS: 100% Organic Whole Grain Oats.
• Allergen Notice: Processed in a dedicated peanut-free facility.`
  },

  {
    id: 'restaurant-menu',
    title: 'Cafe & Bistro Lunch Menu',
    category: 'Hospitality & Dining',
    tag: 'Restaurant Menu',
    description: 'A cafe menu board with categories, meal descriptions, and pricing.',
    recommendedDocType: 'menu',
    limitations: 'Fictional demonstration menu. Prices and availability are illustrative only.',
    svgDataUri: createSvgDataUri(`
      <rect width="600" height="400" fill="#18181B" rx="16"/>
      <rect x="25" y="25" width="550" height="350" fill="#27272A" rx="12" stroke="#F43F5E" stroke-width="2"/>
      
      <text x="300" y="65" fill="#FB7185" font-family="'Georgia', serif" font-size="24" font-weight="bold" text-anchor="middle">THE CORNER BISTRO &bull; LUNCH MENU</text>
      <line x1="100" y1="80" x2="500" y2="80" stroke="#71717A" stroke-width="1"/>
      
      <text x="50" y="115" fill="#FDA4AF" font-family="sans-serif" font-size="16" font-weight="bold">SANDWICHES &amp; BOWLS</text>
      <text x="50" y="145" fill="#FFFFFF" font-family="sans-serif" font-size="15">Artisan Avocado Toast (Sourdough, Radish, Lemon)</text>
      <text x="510" y="145" fill="#34D399" font-family="sans-serif" font-size="15" font-weight="bold">$12.50</text>
      
      <text x="50" y="180" fill="#FFFFFF" font-family="sans-serif" font-size="15">Mediterranean Quinoa Bowl (Chickpeas, Olives, Feta)</text>
      <text x="510" y="180" fill="#34D399" font-family="sans-serif" font-size="15" font-weight="bold">$14.00</text>
      
      <text x="50" y="225" fill="#FDA4AF" font-family="sans-serif" font-size="16" font-weight="bold">HOT DRINKS</text>
      <text x="50" y="255" fill="#FFFFFF" font-family="sans-serif" font-size="15">Oat Milk Vanilla Latte (Double Shot)</text>
      <text x="510" y="255" fill="#34D399" font-family="sans-serif" font-size="15" font-weight="bold">$5.50</text>
      
      <text x="50" y="290" fill="#FFFFFF" font-family="sans-serif" font-size="15">Organic Chamomile Herbal Tea</text>
      <text x="510" y="290" fill="#34D399" font-family="sans-serif" font-size="15" font-weight="bold">$4.00</text>
      
      <rect x="50" y="315" width="500" height="40" fill="#18181B" rx="6"/>
      <text x="300" y="340" fill="#A1A1AA" font-family="sans-serif" font-size="13" text-anchor="middle">Vegan (VG) and Gluten-Free (GF) substitutes available upon request.</text>
    `),
    descriptions: {
      quick: {
        summary: 'A lunch menu for The Corner Bistro with sandwiches, bowls, and hot drinks.',
        details: 'Features Avocado Toast ($12.50), Mediterranean Quinoa Bowl ($14.00), Oat Milk Latte ($5.50), and Chamomile Tea ($4.00). Vegan and gluten-free substitutes available.',
        objects: ['Bistro header', 'Sandwiches category', 'Drinks category', 'Itemized prices', 'Dietary options note'],
        limitations: 'Demonstration menu data.'
      },
      detailed: {
        summary: 'A structured dining menu for "The Corner Bistro" listing lunch options and prices.',
        details: 'The menu is organized into two primary sections: "SANDWICHES & BOWLS" and "HOT DRINKS". Items listed with right-aligned pricing include: Artisan Avocado Toast on sourdough for $12.50; Mediterranean Quinoa Bowl with chickpeas, olives, and feta for $14.00; Oat Milk Vanilla Latte double shot for $5.50; and Organic Chamomile Herbal Tea for $4.00. The footer notes that vegan and gluten-free substitutions are available upon request.',
        objects: ['Restaurant banner', 'Menu section headers', 'Dishes with descriptions', 'Price list', 'Dietary note'],
        limitations: 'Fictional menu created for testing OCR and reading assistance.'
      },
      objects: {
        summary: 'Bistro menu card containing two categorized sections and 4 priced menu offerings.',
        details: 'Elements: Header (The Corner Bistro), Section 1 (Sandwiches & Bowls), Section 2 (Hot Drinks), 4 distinct prices in green, bottom dietary note.',
        objects: ['Header title', '2 category titles', '4 dish entries', '4 price values', 'Footnote'],
        limitations: 'Demonstration scenario.'
      },
      simple: {
        summary: 'A lunch menu for The Corner Bistro.',
        details: 'Avocado Toast is $12.50. Quinoa Bowl is $14.00. Vanilla Latte is $5.50. Chamomile Tea is $4.00. You can ask for vegan or gluten-free options.',
        objects: ['Food menu', 'Prices', 'Drink options'],
        limitations: 'Demonstration menu.'
      },
      educational: {
        summary: 'An illustrative hospitality document demonstrating menu tabular structure.',
        details: 'Restaurant menus employ dual-column visual alignments: food descriptions aligned to the left with right-justified pricing, separated by conceptual groupings (Mains vs Beverages).',
        objects: ['Menu header', 'Section categorization', 'Right-justified prices'],
        limitations: 'Demonstration menu.'
      }
    },
    sampleOcrText: `THE CORNER BISTRO • LUNCH MENU
SANDWICHES & BOWLS
Artisan Avocado Toast (Sourdough, Radish, Lemon) $12.50
Mediterranean Quinoa Bowl (Chickpeas, Olives, Feta) $14.00
HOT DRINKS
Oat Milk Vanilla Latte (Double Shot) $5.50
Organic Chamomile Herbal Tea $4.00
Vegan (VG) and Gluten-Free (GF) substitutes available upon request.`
  },

  {
    id: 'building-sign',
    title: 'Public Building Directional Sign',
    category: 'Transit & Navigation',
    tag: 'Wayfinding Sign',
    description: 'An indoor directory sign for City Civic Center Level 2.',
    recommendedDocType: 'sign',
    limitations: 'Sample building signage. Does not establish or verify physical safety or emergency egress routes.',
    svgDataUri: createSvgDataUri(`
      <rect width="600" height="400" fill="#0F172A" rx="16"/>
      <rect x="25" y="25" width="550" height="350" fill="#1E293B" rx="12" stroke="#64748B" stroke-width="2"/>
      
      <rect x="45" y="45" width="510" height="50" fill="#3B82F6" rx="6"/>
      <text x="300" y="78" fill="#FFFFFF" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">CITY CIVIC CENTER &bull; LEVEL 2 DIRECTORY</text>
      
      <text x="60" y="140" fill="#38BDF8" font-family="sans-serif" font-size="18" font-weight="bold">&rarr; ROOMS 201 - 215</text>
      <text x="60" y="170" fill="#CBD5E1" font-family="sans-serif" font-size="15">Permits Office, Public Records &amp; Licensing</text>
      
      <line x1="60" y1="195" x2="540" y2="195" stroke="#334155" stroke-width="1"/>
      
      <text x="60" y="235" fill="#38BDF8" font-family="sans-serif" font-size="18" font-weight="bold">&larr; ROOMS 216 - 230</text>
      <text x="60" y="265" fill="#CBD5E1" font-family="sans-serif" font-size="15">Community Meeting Hall &amp; Hearing Chambers</text>
      
      <rect x="60" y="295" width="480" height="50" fill="#0F172A" rx="8" stroke="#38BDF8"/>
      <text x="80" y="326" fill="#F8FAFC" font-family="sans-serif" font-size="14" font-weight="bold">&uarr; ELEVATORS, ACCESSIBLE RESTROOMS &amp; INFO DESK</text>
    `),
    descriptions: {
      quick: {
        summary: 'A building directional sign for City Civic Center Level 2.',
        details: 'Right arrow points to Rooms 201-215 (Permits & Records). Left arrow points to Rooms 216-230 (Meeting Hall & Chambers). Straight ahead points to Elevators, Accessible Restrooms, and Info Desk.',
        objects: ['Building header', 'Right arrow guidance', 'Left arrow guidance', 'Straight arrow facilities badge'],
        limitations: 'Demonstration sign. Do not use for emergency exit or navigation guidance.'
      },
      detailed: {
        summary: 'A public municipal directory sign indicating department locations and amenities on Level 2.',
        details: 'The blue header identifies the location as "CITY CIVIC CENTER • LEVEL 2 DIRECTORY". Directional arrows indicate: to the right (→) are Rooms 201 through 215, containing the Permits Office, Public Records, and Licensing; to the left (←) are Rooms 216 through 230, containing the Community Meeting Hall and Hearing Chambers; straight ahead (↑) leads to elevators, accessible restrooms, and the information desk.',
        objects: ['Civic Center title', 'Right arrow with department listings', 'Left arrow with council halls', 'Upward arrow for accessible amenities'],
        limitations: 'Demonstration directional sign.'
      },
      objects: {
        summary: 'Civic directory board featuring directional arrows, room numbers, and facility names.',
        details: 'Identified: 3 directional markers (right, left, straight), room clusters (201-215, 216-230), and amenity designations.',
        objects: ['Directory banner', 'Right directional block', 'Left directional block', 'Straight ahead amenity block'],
        limitations: 'Demonstration wayfinding sign.'
      },
      simple: {
        summary: 'A sign inside City Civic Center on Level 2.',
        details: 'Turn right for Rooms 201 to 215 (Permits and Records). Turn left for Rooms 216 to 230 (Meeting Hall). Walk straight for elevators, accessible bathrooms, and the info desk.',
        objects: ['Building sign', 'Room numbers', 'Arrows'],
        limitations: 'Sample indoor sign.'
      },
      educational: {
        summary: 'An illustrative wayfinding document demonstrating civic indoor signage standards.',
        details: 'Effective architectural wayfinding separates traffic by directional glyphs paired with room-number ranges and plain-language functional descriptions to streamline public facility navigation.',
        objects: ['Wayfinding header', 'Directional arrows', 'Functional zone tags'],
        limitations: 'Demonstration signage.'
      }
    },
    sampleOcrText: `CITY CIVIC CENTER • LEVEL 2 DIRECTORY
→ ROOMS 201 - 215
Permits Office, Public Records & Licensing
← ROOMS 216 - 230
Community Meeting Hall & Hearing Chambers
↑ ELEVATORS, ACCESSIBLE RESTROOMS & INFO DESK`
  },

  {
    id: 'recycling-instructions',
    title: 'Smart Waste Sorting & Recycling Guide',
    category: 'Sustainability & Civic',
    tag: 'Sustainability Guide',
    description: 'A 4-stream recycling and waste sorting guide connecting accessibility with ecological action.',
    recommendedDocType: 'sign',
    limitations: 'Demonstration sorting guide. Local municipality waste sorting rules may differ.',
    svgDataUri: createSvgDataUri(`
      <rect width="600" height="400" fill="#064E3B" rx="16"/>
      <rect x="25" y="25" width="550" height="350" fill="#022C22" rx="12" stroke="#10B981" stroke-width="2"/>
      
      <text x="300" y="65" fill="#34D399" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle">ZERO WASTE: HOW TO SORT YOUR ITEMS</text>
      
      <!-- 4 Columns -->
      <rect x="40" y="90" width="115" height="220" fill="#1E3A8A" rx="8"/>
      <text x="97" y="120" fill="#93C5FD" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">BLUE BIN</text>
      <text x="97" y="145" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">PAPER</text>
      <text x="97" y="175" fill="#DBEAFE" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Newspapers</text>
      <text x="97" y="200" fill="#DBEAFE" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Cardboard</text>
      <text x="97" y="225" fill="#DBEAFE" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Clean mail</text>
      <text x="97" y="260" fill="#FCA5A5" font-family="sans-serif" font-size="10" text-anchor="middle">NO wet food box</text>
      
      <rect x="170" y="90" width="115" height="220" fill="#065F46" rx="8"/>
      <text x="227" y="120" fill="#6EE7B7" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">GREEN BIN</text>
      <text x="227" y="145" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">COMPOST</text>
      <text x="227" y="175" fill="#D1FAE5" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Food scraps</text>
      <text x="227" y="200" fill="#D1FAE5" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Coffee grounds</text>
      <text x="227" y="225" fill="#D1FAE5" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Fruit peels</text>
      <text x="227" y="260" fill="#FCA5A5" font-family="sans-serif" font-size="10" text-anchor="middle">NO plastic bags</text>
      
      <rect x="300" y="90" width="115" height="220" fill="#854D0E" rx="8"/>
      <text x="357" y="120" fill="#FDE047" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">YELLOW BIN</text>
      <text x="357" y="145" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">CONTAINERS</text>
      <text x="357" y="175" fill="#FEF08A" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Plastic bottles</text>
      <text x="357" y="200" fill="#FEF08A" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Aluminum cans</text>
      <text x="357" y="225" fill="#FEF08A" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Glass jars</text>
      <text x="357" y="260" fill="#FDE047" font-family="sans-serif" font-size="10" text-anchor="middle">Rinse containers</text>
      
      <rect x="430" y="90" width="115" height="220" fill="#374151" rx="8"/>
      <text x="487" y="120" fill="#D1D5DB" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">BLACK BIN</text>
      <text x="487" y="145" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">LANDFILL</text>
      <text x="487" y="175" fill="#E5E7EB" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Snack wrappers</text>
      <text x="487" y="200" fill="#E5E7EB" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Styrofoam</text>
      <text x="487" y="225" fill="#E5E7EB" font-family="sans-serif" font-size="11" text-anchor="middle">&bull; Broken ceramics</text>
      <text x="487" y="260" fill="#9CA3AF" font-family="sans-serif" font-size="10" text-anchor="middle">Last resort only</text>
      
      <text x="300" y="340" fill="#A7F3D0" font-family="sans-serif" font-size="13" text-anchor="middle">Accessibility helps protect the planet: Sort properly to prevent contamination.</text>
    `),
    descriptions: {
      quick: {
        summary: 'A 4-category waste and recycling sorting sign.',
        details: 'Blue bin for Paper (cardboard, clean mail). Green bin for Compost (food scraps, peels). Yellow bin for Containers (bottles, cans, jars). Black bin for Landfill (wrappers, styrofoam).',
        objects: ['Blue bin column (Paper)', 'Green bin column (Compost)', 'Yellow bin column (Containers)', 'Black bin column (Landfill)'],
        limitations: 'Demonstration waste sorting guide. Check municipal guidelines.'
      },
      detailed: {
        summary: 'A color-coded 4-stream ecological recycling and waste disposal sign.',
        details: 'The sign is titled "ZERO WASTE: HOW TO SORT YOUR ITEMS" and divides sorting into four colored columns: 1) Blue Bin for Paper: includes newspapers, cardboard, clean mail; exclude greasy food boxes. 2) Green Bin for Compost: food scraps, coffee grounds, and fruit peels; no plastic bags. 3) Yellow Bin for Containers: plastic bottles, aluminum cans, glass jars (rinse before depositing). 4) Black Bin for Landfill: snack wrappers, styrofoam, and broken ceramics. A reminder states that proper sorting prevents recycling stream contamination.',
        objects: ['Title banner', 'Blue Paper bin', 'Green Compost bin', 'Yellow Containers bin', 'Black Landfill bin', 'Sustainability motto'],
        limitations: 'Demonstration scenario highlighting assistive tech for sustainability.'
      },
      objects: {
        summary: 'Sorting matrix with 4 color-coded waste streams and itemized examples.',
        details: 'Elements: Title, Blue column (Paper), Green column (Compost), Yellow column (Containers), Black column (Landfill), eco-footer.',
        objects: ['Title', 'Blue stream', 'Green stream', 'Yellow stream', 'Black stream', 'Footer note'],
        limitations: 'Demonstration scenario.'
      },
      simple: {
        summary: 'A guide showing where to throw your trash and recycling.',
        details: 'Put paper in the Blue bin. Put food scraps in the Green bin. Put bottles and cans in the Yellow bin. Put wrappers in the Black bin.',
        objects: ['Trash guide', '4 colored bins', 'Recycling rules'],
        limitations: 'Demonstration sorting sign.'
      },
      educational: {
        summary: 'An illustrative environmental sustainability sign demonstrating accessible waste diversion.',
        details: 'Environmental sustainability requires accessible information: when blind and low-vision individuals can independently identify waste streams, community contamination rates decrease significantly.',
        objects: ['Environmental guide', 'Multi-stream diversion layout', 'Contamination prevention note'],
        limitations: 'Demonstration scenario.'
      }
    },
    sampleOcrText: `ZERO WASTE: HOW TO SORT YOUR ITEMS
BLUE BIN - PAPER: Newspapers, Cardboard, Clean mail. NO wet food box.
GREEN BIN - COMPOST: Food scraps, Coffee grounds, Fruit peels. NO plastic bags.
YELLOW BIN - CONTAINERS: Plastic bottles, Aluminum cans, Glass jars. Rinse containers.
BLACK BIN - LANDFILL: Snack wrappers, Styrofoam, Broken ceramics. Last resort only.
Accessibility helps protect the planet: Sort properly to prevent contamination.`
  },

  {
    id: 'library-info',
    title: 'Public Library Information Board',
    category: 'Education & Notices',
    tag: 'Information Desk',
    description: 'A quiet library entrance board detailing weekly operating hours, self-service book return, and accessibility services.',
    recommendedDocType: 'notice',
    limitations: 'Demonstration library notice. Hours and policies are illustrative.',
    svgDataUri: createSvgDataUri(`
      <rect width="600" height="400" fill="#1E1B4B" rx="16"/>
      <rect x="25" y="25" width="550" height="350" fill="#312E81" rx="12" stroke="#818CF8" stroke-width="2"/>
      
      <text x="300" y="70" fill="#E0E7FF" font-family="'Georgia', serif" font-size="22" font-weight="bold" text-anchor="middle">COMMUNITY PUBLIC LIBRARY</text>
      <text x="300" y="95" fill="#A5B4FC" font-family="sans-serif" font-size="14" text-anchor="middle">Central Branch &bull; Main Entrance Information</text>
      
      <rect x="50" y="115" width="500" height="90" fill="#1E1B4B" rx="8"/>
      <text x="70" y="145" fill="#818CF8" font-family="sans-serif" font-size="15" font-weight="bold">WEEKLY OPERATING HOURS:</text>
      <text x="70" y="172" fill="#FFFFFF" font-family="sans-serif" font-size="14">Monday – Thursday: 9:00 AM – 8:00 PM</text>
      <text x="70" y="193" fill="#FFFFFF" font-family="sans-serif" font-size="14">Friday – Saturday: 10:00 AM – 5:00 PM &bull; Sunday: Closed</text>
      
      <text x="50" y="235" fill="#C7D2FE" font-family="sans-serif" font-size="14" font-weight="bold">&bull; BOOK RETURNS:</text>
      <text x="180" y="235" fill="#FFFFFF" font-family="sans-serif" font-size="14">External drop-box open 24/7 beside main doors.</text>
      
      <text x="50" y="265" fill="#C7D2FE" font-family="sans-serif" font-size="14" font-weight="bold">&bull; ACCESSIBLE TECH:</text>
      <text x="195" y="265" fill="#FFFFFF" font-family="sans-serif" font-size="14">Screen readers &amp; braille displays on 1st floor.</text>
      
      <rect x="50" y="290" width="500" height="50" fill="#4338CA" rx="6"/>
      <text x="70" y="320" fill="#FEF08A" font-family="sans-serif" font-size="14" font-weight="bold">NEED ASSISTANCE? Visit the Help Desk or dial extension 410.</text>
    `),
    descriptions: {
      quick: {
        summary: 'Information board for Community Public Library Central Branch.',
        details: 'Hours: Mon-Thu 9 AM-8 PM, Fri-Sat 10 AM-5 PM, Sun Closed. 24/7 book return drop box outside. Accessible tech (screen readers and braille displays) available on 1st floor.',
        objects: ['Library title', 'Hours of operation schedule', 'Book return notice', 'Assistive technology note', 'Help desk banner'],
        limitations: 'Demonstration library board.'
      },
      detailed: {
        summary: 'A public notice board for the Community Public Library detailing operating schedules and accessibility services.',
        details: 'The top reads "COMMUNITY PUBLIC LIBRARY - Central Branch Main Entrance Information". Operating hours are Mon-Thu 9:00 AM to 8:00 PM, Fri-Sat 10:00 AM to 5:00 PM, and Sunday Closed. Below, two bullet points explain that the external book return drop-box is open 24/7 beside the main entrance, and accessible workstations with screen readers and braille displays are located on the 1st floor. A bright footer banner instructs visitors to visit the Help Desk or dial extension 410 for assistance.',
        objects: ['Library title', 'Weekly schedule card', '24/7 book drop info', 'Accessible tech station notice', 'Help desk contact prompt'],
        limitations: 'Demonstration library information scenario.'
      },
      objects: {
        summary: 'Library entrance directory containing hours schedule, 2 policy bullets, and help desk contact box.',
        details: 'Fields: Library name, branch name, operating hours (Mon-Thu, Fri-Sat, Sun), 24/7 book return, accessible equipment availability, extension 410.',
        objects: ['Title', 'Hours box', 'Return policy line', 'Accessible station note', 'Contact banner'],
        limitations: 'Demonstration library board.'
      },
      simple: {
        summary: 'A sign at the public library.',
        details: 'Open Monday to Thursday 9am to 8pm. Open Friday and Saturday 10am to 5pm. Closed Sunday. You can return books anytime outside. Computers with screen readers are on the 1st floor.',
        objects: ['Library hours', 'Book return box', 'Screen reader computers'],
        limitations: 'Demonstration library sign.'
      },
      educational: {
        summary: 'An illustrative civic institution notice demonstrating public accessibility disclosures.',
        details: 'Modern public libraries serve as assistive hubs; prominently displaying assistive hardware availability (screen readers, braille displays) at primary building thresholds ensures inclusive access.',
        objects: ['Institution title', 'Operational availability', 'Accessibility resources banner'],
        limitations: 'Demonstration notice.'
      }
    },
    sampleOcrText: `COMMUNITY PUBLIC LIBRARY
Central Branch • Main Entrance Information
WEEKLY OPERATING HOURS:
Monday – Thursday: 9:00 AM – 8:00 PM
Friday – Saturday: 10:00 AM – 5:00 PM • Sunday: Closed
• BOOK RETURNS: External drop-box open 24/7 beside main doors.
• ACCESSIBLE TECH: Screen readers & braille displays on 1st floor.
NEED ASSISTANCE? Visit the Help Desk or dial extension 410.`
  }
];
