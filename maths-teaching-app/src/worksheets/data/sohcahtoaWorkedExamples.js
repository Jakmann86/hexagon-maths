// src/worksheets/data/sohcahtoaWorkedExamples.js
// Static data for SOHCAHTOA worked examples worksheet
//
// 3 examples: Finding a side using Sin, Cos, and Tan
// Each includes visualization config, working steps, and LaTeX formulas

export const SOHCAHTOA_WORKED_EXAMPLES = [
  // ============================================================
  // EXAMPLE 1: Using SINE to find the opposite side
  // ============================================================
  {
    number: 1,
    title: 'Using Sine to Find the Opposite',
    questionText: 'Find the length of side x (opposite) in the right-angled triangle. Give your answer to 1 decimal place.',
    
    // Visualization config for RightTriangleSVG
    visualization: {
      type: 'right-triangle',
      base: null,           // Adjacent - not labeled with value
      height: null,         // Opposite - this is x (unknown)
      hypotenuse: 12,
      angle: 35,
      showAngle: true,
      anglePosition: 'bottom-right',  // Angle at base end
      unknownSide: 'height',
      labels: {
        base: 'adj',
        height: 'x',
        hypotenuse: '12 cm'
      },
      showRightAngle: true,
      orientation: 'default'
    },
    
    // Working steps with both display formula and LaTeX
    working: [
      {
        step: 1,
        explanation: 'Identify: we have hyp, want opp → use SIN',
        formula: 'sin(θ) = opp/hyp',
        latex: '\\sin(\\theta) = \\frac{\\text{opp}}{\\text{hyp}}'
      },
      {
        step: 2,
        explanation: 'Substitute the known values',
        formula: 'sin(35°) = x/12',
        latex: '\\sin(35°) = \\frac{x}{12}'
      },
      {
        step: 3,
        explanation: 'Multiply both sides by 12',
        formula: 'x = 12 × sin(35°)',
        latex: 'x = 12 \\times \\sin(35°)'
      },
      {
        step: 4,
        explanation: 'Calculate using calculator',
        formula: 'x = 12 × 0.5736...',
        latex: 'x = 12 \\times 0.5736...'
      },
      {
        step: 5,
        explanation: 'Round to 1 decimal place',
        formula: 'x = 6.9 cm',
        latex: 'x = 6.9 \\text{ cm}'
      }
    ],
    
    calculatorMethod: 'sin(35) × 12 =',
    calculatorLatex: '\\sin(35) \\times 12 =',
    answer: '6.9 cm'
  },

  // ============================================================
  // EXAMPLE 2: Using COSINE to find the adjacent side
  // ============================================================
  {
    number: 2,
    title: 'Using Cosine to Find the Adjacent',
    questionText: 'Find the length of side x (adjacent) in the right-angled triangle. Give your answer to 1 decimal place.',
    
    visualization: {
      type: 'right-triangle',
      base: null,           // Adjacent - this is x (unknown)
      height: null,         // Opposite - not labeled with value
      hypotenuse: 15,
      angle: 42,
      showAngle: true,
      anglePosition: 'bottom-right',
      unknownSide: 'base',
      labels: {
        base: 'x',
        height: 'opp',
        hypotenuse: '15 cm'
      },
      showRightAngle: true,
      orientation: 'default'
    },
    
    working: [
      {
        step: 1,
        explanation: 'Identify: we have hyp, want adj → use COS',
        formula: 'cos(θ) = adj/hyp',
        latex: '\\cos(\\theta) = \\frac{\\text{adj}}{\\text{hyp}}'
      },
      {
        step: 2,
        explanation: 'Substitute the known values',
        formula: 'cos(42°) = x/15',
        latex: '\\cos(42°) = \\frac{x}{15}'
      },
      {
        step: 3,
        explanation: 'Multiply both sides by 15',
        formula: 'x = 15 × cos(42°)',
        latex: 'x = 15 \\times \\cos(42°)'
      },
      {
        step: 4,
        explanation: 'Calculate using calculator',
        formula: 'x = 15 × 0.7431...',
        latex: 'x = 15 \\times 0.7431...'
      },
      {
        step: 5,
        explanation: 'Round to 1 decimal place',
        formula: 'x = 11.1 cm',
        latex: 'x = 11.1 \\text{ cm}'
      }
    ],
    
    calculatorMethod: 'cos(42) × 15 =',
    calculatorLatex: '\\cos(42) \\times 15 =',
    answer: '11.1 cm'
  },

  // ============================================================
  // EXAMPLE 3: Using TANGENT to find the opposite side
  // ============================================================
  {
    number: 3,
    title: 'Using Tangent to Find the Opposite',
    questionText: 'Find the length of side x (opposite) in the right-angled triangle. Give your answer to 1 decimal place.',
    
    visualization: {
      type: 'right-triangle',
      base: 8,              // Adjacent - known
      height: null,         // Opposite - this is x (unknown)
      hypotenuse: null,     // Not needed for tan
      angle: 58,
      showAngle: true,
      anglePosition: 'bottom-right',
      unknownSide: 'height',
      labels: {
        base: '8 cm',
        height: 'x',
        hypotenuse: 'hyp'
      },
      showRightAngle: true,
      orientation: 'default'
    },
    
    working: [
      {
        step: 1,
        explanation: 'Identify: we have adj, want opp → use TAN',
        formula: 'tan(θ) = opp/adj',
        latex: '\\tan(\\theta) = \\frac{\\text{opp}}{\\text{adj}}'
      },
      {
        step: 2,
        explanation: 'Substitute the known values',
        formula: 'tan(58°) = x/8',
        latex: '\\tan(58°) = \\frac{x}{8}'
      },
      {
        step: 3,
        explanation: 'Multiply both sides by 8',
        formula: 'x = 8 × tan(58°)',
        latex: 'x = 8 \\times \\tan(58°)'
      },
      {
        step: 4,
        explanation: 'Calculate using calculator',
        formula: 'x = 8 × 1.6003...',
        latex: 'x = 8 \\times 1.6003...'
      },
      {
        step: 5,
        explanation: 'Round to 1 decimal place',
        formula: 'x = 12.8 cm',
        latex: 'x = 12.8 \\text{ cm}'
      }
    ],
    
    calculatorMethod: 'tan(58) × 8 =',
    calculatorLatex: '\\tan(58) \\times 8 =',
    answer: '12.8 cm'
  }
];

export default SOHCAHTOA_WORKED_EXAMPLES;