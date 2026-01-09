// src/worksheets/data/pythagorasWorkedExamples.js
// V1.1 - Static worked examples with LaTeX formulas for KaTeX rendering
// 
// Each step now has both:
// - formula: Unicode fallback for plain text
// - latex: LaTeX string for KaTeX rendering
//
// Place this file in: src/worksheets/data/pythagorasWorkedExamples.js

/**
 * Example 1: Find Hypotenuse (Integer Answer)
 * Uses 9-12-15 triple (scaled 3-4-5)
 */
export const example1_findHypotenuse = {
  number: 1,
  questionText: 'Find the hypotenuse of a right-angled triangle with sides 9 cm and 12 cm.',
  answer: '15 cm',
  visualization: {
    type: 'right-triangle',
    base: 12,
    height: 9,
    labels: {
      base: '12 cm',
      height: '9 cm',
      hypotenuse: 'x',
    },
  },
  working: [
    { 
      step: 1, 
      explanation: "Write Pythagoras' theorem", 
      formula: 'a² + b² = c²',
      latex: 'a^2 + b^2 = c^2'
    },
    { 
      step: 2, 
      explanation: 'Substitute the known values', 
      formula: '9² + 12² = c²',
      latex: '9^2 + 12^2 = c^2'
    },
    { 
      step: 3, 
      explanation: 'Calculate the squares', 
      formula: '81 + 144 = c²',
      latex: '81 + 144 = c^2'
    },
    { 
      step: 4, 
      explanation: 'Add', 
      formula: '225 = c²',
      latex: '225 = c^2'
    },
    { 
      step: 5, 
      explanation: 'Square root both sides', 
      formula: 'c = √225 = 15 cm',
      latex: 'c = \\sqrt{225} = 15 \\text{ cm}'
    },
  ],
  calculatorMethod: '√(9² + 12²) = 15 cm',
  calculatorLatex: '\\sqrt{9^2 + 12^2} = 15 \\text{ cm}',
};

/**
 * Example 2: Find Shorter Side (Decimal Answer, 1 d.p.)
 * Hypotenuse 12, base 7 → height = √(144-49) = √95 ≈ 9.7
 */
export const example2_findShorterSide = {
  number: 2,
  questionText: 'Find the height of a right-angled triangle with hypotenuse 12 cm and base 7 cm. Give your answer to 1 decimal place.',
  answer: '9.7 cm',
  visualization: {
    type: 'right-triangle',
    base: 7,
    height: 9.7,
    labels: {
      base: '7 cm',
      height: 'x',
      hypotenuse: '12 cm',
    },
  },
  working: [
    { 
      step: 1, 
      explanation: "Write Pythagoras' theorem", 
      formula: 'a² + b² = c²',
      latex: 'a^2 + b^2 = c^2'
    },
    { 
      step: 2, 
      explanation: 'Rearrange to find unknown side', 
      formula: 'a² = c² − b²',
      latex: 'a^2 = c^2 - b^2'
    },
    { 
      step: 3, 
      explanation: 'Substitute known values', 
      formula: 'a² = 12² − 7²',
      latex: 'a^2 = 12^2 - 7^2'
    },
    { 
      step: 4, 
      explanation: 'Calculate', 
      formula: 'a² = 144 − 49 = 95',
      latex: 'a^2 = 144 - 49 = 95'
    },
    { 
      step: 5, 
      explanation: 'Square root both sides', 
      formula: 'a = √95 = 9.7 cm (1 d.p.)',
      latex: 'a = \\sqrt{95} = 9.7 \\text{ cm (1 d.p.)}'
    },
  ],
  calculatorMethod: '√(12² − 7²) = 9.7 cm',
  calculatorLatex: '\\sqrt{12^2 - 7^2} = 9.7 \\text{ cm}',
};

/**
 * Example 3: Isosceles Triangle Area (Integer Answer)
 * Base 10, equal sides 13 → half base 5, height = √(169-25) = √144 = 12
 * Area = ½ × 10 × 12 = 60 cm²
 */
export const example3_isoscelesArea = {
  number: 3,
  questionText: 'Find the area of an isosceles triangle with base 10 cm and equal sides 13 cm.',
  answer: '60 cm²',
  visualization: {
    type: 'isosceles',
    base: 10,
    equalSide: 13,
    height: 12,
    labels: {
      base: '10 cm',
      equalSide: '13 cm',
      // height label removed as requested
    },
  },
  working: [
    { 
      step: 1, 
      explanation: 'Split triangle in half', 
      formula: 'Half base = 10 ÷ 2 = 5 cm',
      latex: '\\text{Half base} = 10 \\div 2 = 5 \\text{ cm}'
    },
    { 
      step: 2, 
      explanation: 'Use Pythagoras to find height', 
      formula: 'h² + 5² = 13²',
      latex: 'h^2 + 5^2 = 13^2'
    },
    { 
      step: 3, 
      explanation: 'Rearrange and calculate', 
      formula: 'h² = 169 − 25 = 144',
      latex: 'h^2 = 169 - 25 = 144'
    },
    { 
      step: 4, 
      explanation: 'Find height', 
      formula: 'h = √144 = 12 cm',
      latex: 'h = \\sqrt{144} = 12 \\text{ cm}'
    },
    { 
      step: 5, 
      explanation: 'Calculate area', 
      formula: 'Area = ½ × 10 × 12 = 60 cm²',
      latex: '\\text{Area} = \\frac{1}{2} \\times 10 \\times 12 = 60 \\text{ cm}^2'
    },
  ],
  calculatorMethod: '0.5 × 10 × √(13² − 5²) = 60 cm²',
  calculatorLatex: '0.5 \\times 10 \\times \\sqrt{13^2 - 5^2} = 60 \\text{ cm}^2',
};

/**
 * All static worked examples in order
 */
export const PYTHAGORAS_WORKED_EXAMPLES = [
  example1_findHypotenuse,
  example2_findShorterSide,
  example3_isoscelesArea,
];

export default PYTHAGORAS_WORKED_EXAMPLES;