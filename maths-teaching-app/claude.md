# Maths Teaching App - Claude Code Instructions

## Critical: Read First

**You MUST ask for clarification before proceeding if:**
- The architectural pattern is unclear
- The section type being worked on is ambiguous
- Visualization requirements are not specified
- You're unsure whether to use SVG components or JSXGraph
- The generator output format doesn't match the expected pattern

**Never guess.** This project has strict architectural patterns that MUST be followed for consistency.

---

## Project Identity

This is a **React-based IGCSE maths teaching application** for UK secondary school teachers to use on interactive whiteboards (IWBs). The app follows the Edexcel 9-1 specification and provides structured lessons with interactive visualizations.

### Target Users
- **Primary**: Secondary school maths teachers in the UK
- **Context**: Displayed on large IWB screens, teacher controls the pace
- **Key principle**: Teacher-first UI, not student self-study

---

## Technology Stack

```javascript
// Framework
- React 18+ (functional components with hooks only)
- React Context API (UIContext for global showAnswers state)

// Styling
- Tailwind CSS (utility-first, NO custom CSS files)

// Math & Visualization
- KaTeX (via MathDisplay component for all math rendering)
- JSXGraph (interactive diagrams in Learn sections)
- Custom SVG components (static shapes in Starter/Diagnostic/Examples)

// Utilities
- Lodash (for randomization and array operations)

// Icons
- Lucide React
```

---

## Lesson Structure (Always 5 Sections)

Every lesson MUST have exactly these 5 sections in this order:

| Order | Section | Color | Purpose | Grid Layout |
|-------|---------|-------|---------|-------------|
| 1 | **Starter** | `blue-500` | Warm-up, mixed topics | 2×2 grid (4 boxes) |
| 2 | **Diagnostic** | `purple-500` | Check prerequisites | MCQ with navigation |
| 3 | **Learn** | `green-500` | Interactive teaching | Full-width interactive |
| 4 | **Examples** | `orange-500` | Worked solutions | Tabs with 2-col layout |
| 5 | **Challenge** | `red-500` | Extension problems | Single hard question |

**Navigation**: Users access sections via sidebar or top nav. The `showAnswers` toggle affects ALL sections globally.

---

## V2 Architecture: The Golden Rule

### Core Principle
**Generators return DATA objects. Sections render them as COMPONENTS.**

```
┌─────────────────┐     ┌──────────────────┐
│  Generator      │────▶│  Section         │
│  (Math Logic)   │     │  (React UI)      │
│                 │     │                  │
│  Returns:       │     │  Converts to:    │
│  - Config obj   │     │  - JSX components│
│  - LaTeX string │     │  - MathDisplay   │
│  - Solution []  │     │  - SVG shapes    │
└─────────────────┘     └──────────────────┘
```

**Critical Rules:**
1. ❌ Generators NEVER return JSX or React components
2. ✅ Generators return plain JavaScript objects with config data
3. ✅ Section components convert configs to visual components
4. ✅ Use `sectionType` parameter to adjust generator output

---

## Generator Output Formats (By Section)

### 1. Starter Section Output

```javascript
// Generator returns this:
{
  question: "Find the area of this triangle...",  // Plain text
  answer: "12\\text{ cm}^2",                      // LaTeX string
  visualization: {                                 // Config object (NOT component)
    type: 'triangle',
    base: 6,
    height: 4,
    unknownSide: null,
    showRightAngle: true,
    orientation: 'default',
    units: 'cm'
  }
}

// Section converts to:
<RightTriangleSVG 
  config={question.visualization}
  showAnswer={showAnswers}
/>
```

### 2. Diagnostic Section Output

```javascript
// Generator returns this:
{
  type: 'squareArea',                             // Question identifier
  title: 'Area of a Square',                      // Display title
  question: 'Find the area of this square:',     // Question text
  visualization: {                                // Config object
    type: 'square',
    sideLength: 5,
    showSide: true,
    showArea: false,
    units: 'cm'
  },
  options: [                                      // MCQ options
    { value: 25, latex: '25\\text{ cm}^2', isCorrect: true },
    { value: 20, latex: '20\\text{ cm}^2', isCorrect: false },
    { value: 10, latex: '10\\text{ cm}^2', isCorrect: false },
    { value: 30, latex: '30\\text{ cm}^2', isCorrect: false }
  ],
  correctValue: 25,
  explanation: '\\text{Area} = \\text{side}^2 = 5^2 = 25\\text{ cm}^2'
}

// Section converts to:
<SquareSVG 
  sideLength={viz.sideLength}
  showSide={viz.showSide}
  units={viz.units}
/>
```

### 3. Examples Section Output

```javascript
// Generator returns this:
{
  title: 'Finding the Hypotenuse',
  questionText: 'Find the length of the hypotenuse...',
  visualization: {                                // Config for component
    base: 3,
    height: 4,
    unknownSide: 'hypotenuse',
    showRightAngle: true,
    orientation: 'default',
    units: 'cm'
  },
  answer: 'c = 5\\text{ cm}',                    // Final answer (LaTeX)
  solution: [                                     // Step-by-step array
    { 
      explanation: "Write Pythagoras' theorem", 
      formula: "a^2 + b^2 = c^2" 
    },
    { 
      explanation: "Substitute values", 
      formula: "3^2 + 4^2 = c^2" 
    },
    { 
      explanation: "Calculate squares", 
      formula: "9 + 16 = c^2" 
    },
    { 
      explanation: "Add", 
      formula: "25 = c^2" 
    },
    { 
      explanation: "Square root", 
      formula: "c = \\sqrt{25} = 5\\text{ cm}" 
    }
  ]
}

// Section renders solution steps as:
{solution.map((step, i) => (
  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
    <p className="text-sm text-gray-600 mb-1">{step.explanation}</p>
    <MathDisplay math={step.formula} displayMode={true} />
  </div>
))}
```

### 4. Challenge Section Output

```javascript
// Generator returns this:
{
  title: 'Multi-Step Problem',
  questionText: 'Find the distance between points A(1,2) and B(4,6).',
  visualization: {                                // Config for coordinate grid
    type: 'coordinateGrid',
    points: [[1, 2], [4, 6]],
    showGrid: true,
    showLine: true
  },
  answer: 'd = 5\\text{ units}',
  solution: [
    { 
      explanation: "Use distance formula", 
      formula: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}" 
    },
    { 
      explanation: "Calculate differences", 
      formula: "d = \\sqrt{(4-1)^2 + (6-2)^2}" 
    },
    { 
      explanation: "Simplify", 
      formula: "d = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5" 
    }
  ],
  hints: [                                        // Progressive hints
    "Draw a right triangle using the two points",
    "The horizontal distance is the base",
    "The vertical distance is the height"
  ]
}
```

---

## LaTeX Formatting Standards

**Critical**: ALL mathematical content MUST use LaTeX via `<MathDisplay>` component.

### Units (Always use `\text{}`)

```javascript
// Correct:
`5\\text{ cm}`           // Length
`25\\text{ cm}^2`        // Area  
`125\\text{ cm}^3`       // Volume
`45^\\circ`              // Angles

// Wrong:
`5 cm`                   // Missing \text{}
`25 cm^2`                // Won't render correctly
```

### Common Patterns

```javascript
// Square roots
`\\sqrt{25} = 5`
`\\sqrt{a^2 + b^2}`

// Fractions
`\\frac{1}{2} \\times 6 \\times 4 = 12`
`\\frac{\\text{opposite}}{\\text{hypotenuse}}`

// Powers
`a^2 + b^2 = c^2`
`x^{-1} = \\frac{1}{x}`

// Trig ratios
`\\sin(\\theta) = \\frac{\\text{opp}}{\\text{hyp}}`
`\\cos(30^\\circ) = \\frac{\\sqrt{3}}{2}`

// Equations
`3x + 5 = 11`
`2(x + 3) = 4x - 1`
```

### MathDisplay Usage

```jsx
// Inline (within text)
<MathDisplay math={formula} displayMode={false} />

// Block (centered, larger)
<MathDisplay math={formula} displayMode={true} />
```

---

## Styling Standards

### Section Card Pattern (All Sections)

```jsx
<div className="border-2 border-t-4 border-{color}-500 rounded-xl bg-white shadow-md overflow-hidden">
  {/* Colored header block */}
  <div className="bg-{color}-500 text-white px-6 py-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-{color}-100 text-sm">{subtitle}</p>
      </div>
      {/* Buttons: Regenerate, Reset, etc. */}
      <button className="flex items-center gap-2 px-4 py-2 bg-{color}-600 hover:bg-{color}-700 text-white rounded-lg">
        <RefreshCw size={18} />
        <span>Regenerate</span>
      </button>
    </div>
  </div>
  
  <div className="p-6">
    {/* Section content */}
  </div>
</div>
```

### Color Palette

| Section | Primary | Light BG | Border |
|---------|---------|----------|--------|
| Starter | `blue-500` | `blue-50` | `blue-200` |
| Diagnostic | `purple-500` | `purple-50` | `purple-200` |
| Learn | `green-500` | `green-50` | `green-200` |
| Examples | `orange-500` | `orange-50` | `orange-200` |
| Challenge | `red-500` | `red-50` | `red-200` |

### Teacher Notes Pattern

**Always show when `showAnswers === true`**

```jsx
{showAnswers && (
  <div className="mt-6 border-t border-gray-200 pt-6">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Teaching Notes</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* Delivery Tips */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-800 mb-2">Delivery Tips</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Use mini whiteboards for students to work independently</li>
          <li>• Cold call after 1 minute thinking time</li>
        </ul>
      </div>

      {/* Key Points */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">Key Points</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Always identify the hypotenuse first</li>
          <li>• Check units are consistent</li>
        </ul>
      </div>

      {/* Common Misconceptions */}
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h4 className="font-medium text-amber-800 mb-2">Common Mistakes</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Confusing which side is which</li>
          <li>• Forgetting to square root at the end</li>
        </ul>
      </div>

      {/* Discussion Questions */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h4 className="font-medium text-purple-800 mb-2">Discussion Questions</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• How do you know which formula to use?</li>
          <li>• What happens if we don't have a right angle?</li>
        </ul>
      </div>

    </div>
  </div>
)}
```

---

## Visualization Guidelines

### When to Use What

| Use Case | Tool | Example |
|----------|------|---------|
| Simple static shapes | **Custom SVG components** | Triangles, squares in Starter/Diagnostic |
| Interactive manipulation | **JSXGraph** | Learn section sliders, draggable points |
| Graphs with axes | **JSXGraph** | Coordinate grids, function plots |
| Multiple shapes | **Composed SVG** | Stacked triangles, 3D shapes |

### SVG Component Props Pattern

```jsx
// RightTriangleSVG
<RightTriangleSVG
  config={{
    base: 6,
    height: 4,
    hypotenuse: 7.21,
    unknownSide: 'hypotenuse',      // 'base' | 'height' | 'hypotenuse' | null
    showRightAngle: true,
    labels: {
      base: '6 cm',
      height: '4 cm',
      hypotenuse: '?'
    },
    orientation: 'default',         // 'default' | 'rotate90' | 'rotate180' | 'rotate270' | 'flip'
    units: 'cm'
  }}
  showAnswer={showAnswers}
/>

// SquareSVG
<SquareSVG
  sideLength={5}
  showSide={true}
  showArea={false}
  areaLabel="25 cm²"
  units="cm"
  size="normal"                     // 'small' (100px) | 'normal' (140px)
/>
```

### JSXGraph Initialization Pattern

```javascript
useEffect(() => {
  if (!window.JXG) {
    console.error('JSXGraph not loaded');
    return;
  }
  
  const board = window.JXG.JSXGraph.initBoard('jsxgraph-container-id', {
    boundingbox: [-10, 10, 10, -10],
    axis: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false },
    keepAspectRatio: true
  });
  
  // Create elements (points, lines, etc.)
  const pointA = board.create('point', [0, 0], { 
    name: 'A', 
    fixed: true 
  });
  
  // Cleanup on unmount
  return () => {
    window.JXG.JSXGraph.freeBoard(board);
  };
}, [dependencies]);
```

---

## File Organization

### Lesson Content Structure

```
/src/content/topics/{topic-slug}/{lesson-slug}/
├── StarterSection.jsx       # Blue, 4-box grid
├── DiagnosticSection.jsx    # Purple, MCQ navigation
├── LearnSection.jsx         # Green, interactive visual
├── ExamplesSection.jsx      # Orange, worked examples
├── ChallengeSection.jsx     # Red, extension problem
└── index.js                 # Exports all sections
```

### Generator Files

```
/src/generators/{category}/
├── pythagorasGenerators.js
├── sohcahtoaGenerators.js
├── squareGenerators.js
├── triangleGenerators.js
└── algebraGenerators.js
```

Each generator file exports an object with named functions:

```javascript
export const pythagorasGenerators = {
  generateFindHypotenuse,
  generateFindMissingSide,
  generateIsoscelesArea,
  // ... etc
};
```

### Shared Components

```
/src/components/
├── common/
│   ├── MathDisplay.jsx          # KaTeX wrapper
│   ├── Card.jsx
│   └── Button.jsx
├── math/
│   ├── visualizations/
│   │   ├── RightTriangleSVG.jsx
│   │   ├── SquareSVG.jsx
│   │   └── CoordinateGrid.jsx
│   └── shapes/
│       ├── triangles/
│       │   ├── RightTriangle.jsx
│       │   └── IsoscelesTriangle.jsx
│       └── quadrilaterals/
│           └── Square.jsx
└── sections/
    ├── StarterSectionBase.jsx
    ├── DiagnosticSectionBase.jsx
    ├── ExamplesSectionBase.jsx
    └── ChallengeSectionBase.jsx
```

---

## Common Patterns

### Regenerate Button

```jsx
const handleRegenerate = () => {
  setKey(prev => prev + 1); // Force re-render with new questions
};

<button
  onClick={handleRegenerate}
  className="flex items-center gap-2 px-4 py-2 bg-{color}-600 hover:bg-{color}-700 text-white rounded-lg transition-colors"
>
  <RefreshCw size={18} />
  <span>Regenerate</span>
</button>
```

### MCQ Answer Feedback (Immediate)

```jsx
const handleOptionClick = (value, isCorrect) => {
  setSelectedAnswer(value);
};

const buttonClass = isSelected
  ? (isCorrect 
      ? 'bg-green-100 border-2 border-green-500 text-green-800' 
      : 'bg-red-100 border-2 border-red-500 text-red-800')
  : 'bg-gray-50 border border-gray-200 hover:border-purple-300';
```

### Two-Column Layout (Examples)

```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Left: Visualization */}
  <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center" style={{ minHeight: '280px' }}>
    <RightTriangleSVG config={example.visualization} />
  </div>
  
  {/* Right: Blank working area for IWB annotation */}
  <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6" style={{ minHeight: '280px' }}>
    {/* Teacher can write on this with IWB pen */}
  </div>
</div>
```

### Solution Steps Display

```jsx
{showAnswers && (
  <div className="mt-4 space-y-2">
    <h4 className="font-semibold text-gray-700">Solution:</h4>
    {solution.map((step, i) => (
      <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">{step.explanation}</p>
        <MathDisplay math={step.formula} displayMode={true} />
      </div>
    ))}
  </div>
)}
```

---

## UK Maths Curriculum Context

### Terminology (UK vs US)

| UK (Use This) | US (Don't Use) |
|---------------|----------------|
| Maths | Math |
| Brackets | Parentheses |
| Indices | Exponents |
| Standard form | Scientific notation |
| Factorise | Factor |
| Centre | Center |
| Anticlockwise | Counterclockwise |

### Pythagorean Triples (Use for Clean Answers)

**Starter/Diagnostic questions should use these for no-calculator answers:**

- (3, 4, 5)
- (5, 12, 13)
- (6, 8, 10) - scaled (3, 4, 5)
- (8, 15, 17)
- (7, 24, 25)
- (9, 12, 15) - scaled (3, 4, 5)

**Examples/Challenge can use decimals** (requires calculator).

### IGCSE Topics Covered

- **Trigonometry I**: Pythagoras, SOHCAHTOA, sine/cosine rules, 3D trigonometry
- **Algebra I**: Indices, expanding brackets, factorising, simultaneous equations
- **Number**: Fractions, percentages, recurring decimals, standard form
- **Geometry**: Angles, area, volume, transformations
- **Statistics**: Averages, probability, cumulative frequency

---

## Generator Function Pattern

```javascript
// File: /src/generators/geometry/pythagorasGenerators.js

import _ from 'lodash';

/**
 * Generate a "find hypotenuse" question
 * 
 * @param {Object} options - Configuration
 * @param {string} options.sectionType - 'starter' | 'diagnostic' | 'examples' | 'challenge'
 * @param {string} options.difficulty - 'easy' | 'medium' | 'hard'
 * @param {number} options.seed - Random seed for reproducibility
 * @param {string} options.units - 'cm' | 'm' | 'mm'
 * @returns {Object} Question data object
 */
export const generateFindHypotenuse = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples',
    seed = Date.now(),
    units = 'cm'
  } = options;

  // Seed random for reproducibility
  const rng = _.random.bind(_, true); // Use lodash with seed

  // Generate values based on difficulty and section
  let base, height, hypotenuse;
  
  if (sectionType === 'starter' || sectionType === 'diagnostic') {
    // Use Pythagorean triples for clean answers
    const triples = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17],
      [7, 24, 25]
    ];
    [base, height, hypotenuse] = _.sample(triples);
    
    // Optionally scale for variety
    if (difficulty === 'medium' && Math.random() > 0.5) {
      const scale = 2;
      base *= scale;
      height *= scale;
      hypotenuse *= scale;
    }
  } else {
    // Examples/Challenge: decimals allowed
    base = _.random(3, 10);
    height = _.random(3, 10);
    hypotenuse = Math.round(Math.sqrt(base*base + height*height) * 100) / 100;
  }

  // Create orientation (optional variation)
  const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];
  const orientation = sectionType === 'starter' 
    ? _.sample(orientations) 
    : 'default'; // Examples always use default

  // Return format depends on section type
  if (sectionType === 'starter') {
    return {
      question: `Find the length of the hypotenuse.`,
      answer: `${hypotenuse}\\text{ ${units}}`,
      visualization: {
        base,
        height,
        hypotenuse,
        unknownSide: 'hypotenuse',
        showRightAngle: true,
        orientation,
        units,
        labels: {
          base: `${base} ${units}`,
          height: `${height} ${units}`,
          hypotenuse: '?'
        }
      }
    };
  }
  
  if (sectionType === 'diagnostic') {
    // Generate plausible distractors
    const distractors = [
      Math.round((hypotenuse * 0.8) * 10) / 10,
      Math.round((hypotenuse * 1.2) * 10) / 10,
      base + height // Common error: adding instead of Pythagoras
    ].filter(d => d !== hypotenuse);
    
    const options = _.shuffle([
      { value: hypotenuse, latex: `${hypotenuse}\\text{ ${units}}`, isCorrect: true },
      ...distractors.slice(0, 3).map(d => ({
        value: d,
        latex: `${d}\\text{ ${units}}`,
        isCorrect: false
      }))
    ]);

    return {
      type: 'findHypotenuse',
      title: 'Find the Hypotenuse',
      question: 'Calculate the length of the hypotenuse using Pythagoras\' theorem.',
      visualization: {
        base,
        height,
        hypotenuse,
        unknownSide: 'hypotenuse',
        showRightAngle: true,
        orientation: 'default',
        units,
        labels: {
          base: `${base} ${units}`,
          height: `${height} ${units}`,
          hypotenuse: '?'
        }
      },
      options,
      correctValue: hypotenuse,
      explanation: `c = \\sqrt{${base}^2 + ${height}^2} = \\sqrt{${base*base} + ${height*height}} = \\sqrt{${base*base + height*height}} = ${hypotenuse}\\text{ ${units}}`
    };
  }
  
  if (sectionType === 'examples') {
    return {
      title: 'Finding the Hypotenuse',
      questionText: `A right-angled triangle has sides of length ${base} ${units} and ${height} ${units}. Find the length of the hypotenuse.`,
      visualization: {
        base,
        height,
        hypotenuse,
        unknownSide: 'hypotenuse',
        showRightAngle: true,
        orientation: 'default',
        units,
        labels: {
          base: `${base} ${units}`,
          height: `${height} ${units}`,
          hypotenuse: '?'
        }
      },
      answer: `c = ${hypotenuse}\\text{ ${units}}`,
      solution: [
        { 
          explanation: "Write Pythagoras' theorem", 
          formula: "a^2 + b^2 = c^2" 
        },
        { 
          explanation: "Substitute the known values", 
          formula: `${base}^2 + ${height}^2 = c^2` 
        },
        { 
          explanation: "Calculate the squares", 
          formula: `${base*base} + ${height*height} = c^2` 
        },
        { 
          explanation: "Add the values", 
          formula: `${base*base + height*height} = c^2` 
        },
        { 
          explanation: "Take the square root of both sides", 
          formula: `c = \\sqrt{${base*base + height*height}} = ${hypotenuse}\\text{ ${units}}` 
        }
      ]
    };
  }

  // Default fallback (shouldn't reach here)
  return null;
};

// Export as object with all generator functions
export const pythagorasGenerators = {
  generateFindHypotenuse,
  generateFindMissingSide,
  generateIsoscelesArea,
  // ... add more generators
};
```

---

## Section Component Pattern

### Starter Section Template

```jsx
// File: /src/content/topics/trigonometry-i/pythagoras/StarterSection.jsx

import React from 'react';
import _ from 'lodash';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import SquareSVG from '../../../../components/math/visualizations/SquareSVG';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import { squareGenerators } from '../../../../generators/geometry/squareGenerators';

/**
 * StarterSection for Pythagoras' Theorem lesson
 * Uses V2 architecture: generators return config objects, section converts to components
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  
  // Define question generators for the 4 boxes
  const questionGenerators = [
    // Q1: Last Lesson - Find hypotenuse
    () => {
      const question = pythagorasGenerators.generateFindHypotenuse({
        sectionType: 'starter',
        difficulty: 'easy',
        units: 'cm'
      });

      // Convert visualization config to component
      if (question.visualization) {
        const viz = question.visualization;
        question.visualization = (
          <RightTriangleSVG
            config={viz}
            showAnswer={false}
          />
        );
      }

      return question;
    },

    // Q2: Last Week - Square area
    () => {
      const question = squareGenerators.generateSquareArea({
        sectionType: 'starter',
        difficulty: 'easy',
        units: 'cm'
      });

      if (question.visualization) {
        const viz = question.visualization;
        question.visualization = (
          <SquareSVG
            sideLength={viz.sideLength}
            showSide={viz.showSide}
            showArea={viz.showArea}
            units={viz.units}
            size="small"
          />
        );
      }

      return question;
    },

    // Q3: Last Topic - Triangle area
    () => {
      // Similar pattern...
    },

    // Q4: Last Year - Number puzzle
    () => {
      // Similar pattern...
    }
  ];

  // Optional: Custom rendering function if needed
  const renderQuestionContent = (questionData, questionType) => {
    if (questionData.visualization && React.isValidElement(questionData.visualization)) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          {questionData.visualization}
        </div>
      );
    }
    return null;
  };

  return (
    <StarterSectionBase
      questionGenerators={questionGenerators}
      renderQuestionContent={renderQuestionContent}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
      className="mb-8"
    />
  );
};

export default StarterSection;
```

---

## Diagnostic Section Pattern

```jsx
// File: /src/content/topics/trigonometry-i/pythagoras/DiagnosticSection.jsx

import React, { useState, useMemo } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [regenerateKey, setRegenerateKey] = useState(0);

  // Generate questions using generators
  const questions = useMemo(() => {
    return [
      pythagorasGenerators.generateIdentifyHypotenuse({
        sectionType: 'diagnostic',
        difficulty: 'easy'
      }),
      pythagorasGenerators.generateFindHypotenuse({
        sectionType: 'diagnostic',
        difficulty: 'medium'
      }),
      pythagorasGenerators.generateFindMissingSide({
        sectionType: 'diagnostic',
        difficulty: 'medium'
      })
    ];
  }, [regenerateKey]);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedValue = selectedAnswers[currentQuestionIndex];

  const handleOptionClick = (value) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }));
  };

  const handleRegenerate = () => {
    setRegenerateKey(prev => prev + 1);
    setSelectedAnswers({});
  };

  return (
    <div className="border-2 border-t-4 border-purple-500 rounded-xl bg-white shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-purple-500 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Diagnostic Assessment</h2>
            <p className="text-purple-100 text-sm">Check your understanding of prerequisites</p>
          </div>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-purple-50 px-6 py-3 border-b border-purple-200">
        <div className="flex gap-2 justify-center">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                idx === currentQuestionIndex
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-purple-700 border border-purple-300 hover:bg-purple-100'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {currentQuestion.title}
        </h3>
        
        <p className="text-gray-700 mb-4">{currentQuestion.question}</p>

        {/* Visualization */}
        {currentQuestion.visualization && (
          <div className="mb-6 bg-gray-50 rounded-xl p-6 flex justify-center items-center" style={{ minHeight: '200px' }}>
            <RightTriangleSVG 
              config={currentQuestion.visualization}
              showAnswer={false}
            />
          </div>
        )}

        {/* MCQ Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedValue === option.value;
            const isCorrect = option.isCorrect;
            
            const buttonClass = isSelected
              ? (isCorrect 
                  ? 'bg-green-100 border-2 border-green-500' 
                  : 'bg-red-100 border-2 border-red-500')
              : 'bg-gray-50 border border-gray-200 hover:border-purple-300';

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option.value)}
                className={`w-full p-4 rounded-lg text-left transition-all ${buttonClass}`}
                disabled={selectedValue !== undefined}
              >
                <MathDisplay math={option.latex} displayMode={false} />
              </button>
            );
          })}
        </div>

        {/* Explanation (after selection or if showAnswers) */}
        {(selectedValue !== undefined || showAnswers) && (
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Explanation:</h4>
            <MathDisplay math={currentQuestion.explanation} displayMode={false} />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 pb-6 flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
        >
          <ChevronLeft size={18} />
          Previous
        </button>
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
          disabled={currentQuestionIndex === questions.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default DiagnosticSection;
```

---

## Critical Do's and Don'ts

### ✅ DO

1. **Always use generators to return data objects**
2. **Convert configs to components in the section**
3. **Use LaTeX for ALL math** (via `<MathDisplay>`)
4. **Include `showAnswers` toggle functionality**
5. **Make questions regeneratable** (use state with keys)
6. **Use Pythagorean triples** for Starter/Diagnostic (clean answers)
7. **Add teacher notes** to all sections
8. **Follow color theming** consistently
9. **Test on large screens** (IWB dimensions)
10. **Use UK terminology** (maths, brackets, indices)

### ❌ DON'T

1. **Never return JSX from generators** (data objects only)
2. **Never hardcode questions** (use generators)
3. **Never forget units in LaTeX** (use `\text{}`)
4. **Never use American spelling** (center → centre)
5. **Never create tiny UI elements** (IWB needs large targets)
6. **Never require scrolling** within sections
7. **Never use decimals** in Starter/Diagnostic unless necessary
8. **Never mix up section colors** (blue=Starter, purple=Diagnostic, etc.)
9. **Never forget the `sectionType` parameter** in generators
10. **Never skip the V2 architecture pattern**

---

## Pedagogical Frameworks (Reference)

This app is designed around:
- **Cognitive Load Theory**: Minimize extraneous load, manage intrinsic complexity
- **Rosenshine's Principles**: Structured, step-by-step instruction with modeling
- **Mayer's Multimedia Learning**: Visual-verbal integration (diagrams + LaTeX)
- **Concrete-Pictorial-Abstract**: Visual shapes → symbolic representation → abstract formulas
- **Metacognitive Strategies**: Teacher notes help guide student thinking
- **Spaced Practice**: Starter questions revisit prior content

Based on the **Maths Mastery** program used by Oak Academy.

---

## Example Imports Template

```javascript
// Standard section imports
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RefreshCw, RotateCcw, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import _ from 'lodash';

// Visualization imports (as needed)
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import SquareSVG from '../../../../components/math/visualizations/SquareSVG';
import IsoscelesTriangleSVG from '../../../../components/math/visualizations/IsoscelesTriangleSVG';
import CoordinateGrid from '../../../../components/math/visualizations/CoordinateGrid';

// Generator imports
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import { sohcahtoaGenerators } from '../../../../generators/geometry/sohcahtoaGenerators';
import { squareGenerators } from '../../../../generators/geometry/squareGenerators';
```

---

## Questions to Ask Claude Code BEFORE Starting

When Claude Code asks what to build, provide:

1. **Section type**: "Create a Diagnostic section" or "Build a Starter section"
2. **Topic/Lesson**: "For the SOHCAHTOA lesson in Trigonometry I"
3. **Question types**: "With 3 MCQs: finding opposite, finding adjacent, identifying ratio"
4. **Visualization needs**: "Use RightTriangleSVG with different orientations"
5. **Special requirements**: "Ensure all angles are nice values (30°, 45°, 60°)"

### If Claude Code is Unclear, It Should Ask:

- "Should this use Pythagorean triples or allow decimals?"
- "Do you want interactive JSXGraph or static SVG?"
- "Should solutions show step-by-step working?"
- "What orientation for the triangles - default or randomized?"
- "Are these questions for the current lesson or review?"

---

## Quick Reference: Section Checklist

Before considering a section complete, verify:

- [ ] Header uses correct color (`blue-500`, `purple-500`, etc.)
- [ ] Generators return data objects, NOT components
- [ ] All math uses LaTeX via `<MathDisplay>`
- [ ] Units use `\text{}` formatting
- [ ] `showAnswers` toggle works correctly
- [ ] Regenerate button included and functional
- [ ] Teacher notes appear when `showAnswers === true`
- [ ] UK terminology used throughout
- [ ] Visualizations scale appropriately for IWB
- [ ] No horizontal scrolling required
- [ ] Pythagorean triples used (if Starter/Diagnostic)
- [ ] File structure matches pattern
- [ ] Imports follow template
- [ ] Component properly exported

---

## Final Reminder

**When in doubt, ASK.** This project has strict patterns. It's better to clarify than to implement incorrectly and need to refactor.

The gold standard examples are:
- `/src/content/topics/trigonometry-i/pythagoras/` (all sections)
- `/src/content/topics/trigonometry-i/sohcahtoa1/` (all sections)

These demonstrate the V2 architecture perfectly. Study them before creating new content.
