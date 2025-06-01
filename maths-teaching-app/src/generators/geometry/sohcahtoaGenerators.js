// src/generators/geometry/sohcahtoaGenerators.js - Unified Architecture
import _ from 'lodash';
import { createRightTriangle } from '../../factories/triangleFactory';

/**
 * Ensure all options are unique and randomize order
 */
const generateUniqueOptions = (optionsArray) => {
  const uniqueOptions = [];
  const seen = new Set();

  for (const option of optionsArray) {
    if (!seen.has(option)) {
      seen.add(option);
      uniqueOptions.push(option);
    }
  }

  // Add fallback options if needed
  while (uniqueOptions.length < 4) {
    const fallback = `${_.random(1, 10)}`;
    if (!seen.has(fallback)) {
      seen.add(fallback);
      uniqueOptions.push(fallback);
    }
  }

  return uniqueOptions.sort(() => Math.random() - 0.5);
};

/**
 * Unified trigonometric calculator question generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 */
export const generateTrigCalculator = (options = {}) => {
  const {
    sectionType = 'diagnostic',
    difficulty = 'medium',
    units = ''
  } = options;

  // Common angles and their exact values
  const trigValues = {
    sine: {
      '30°': 0.5,
      '45°': 0.7071,
      '60°': 0.866
    },
    cosine: {
      '30°': 0.866,
      '45°': 0.7071,
      '60°': 0.5
    },
    tangent: {
      '30°': 0.5774,
      '45°': 1,
      '60°': 1.732
    }
  };

  // Select function and angle
  const func = _.sample(['sine', 'cosine', 'tangent']);
  const angle = _.sample(['30°', '45°', '60°']);
  
  // Get correct value with proper rounding
  const exactValue = trigValues[func][angle];
  const correctAnswer = Math.round(exactValue * 10000) / 10000;

  // Convert function name for display
  const funcSymbol = {
    'sine': '\\sin',
    'cosine': '\\cos',
    'tangent': '\\tan'
  }[func];

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Use your calculator to find ${func}(${angle}).`,
      answer: `\\text{Using calculator: } ${funcSymbol}(${angle}) = ${correctAnswer}`,
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate incorrect options with good distractors
    const incorrectOptions = [];

    // Add function confusion error (e.g., using cos instead of sin)
    for (const otherFunc of ['sine', 'cosine', 'tangent']) {
      if (otherFunc !== func) {
        incorrectOptions.push(Math.round(trigValues[otherFunc][angle] * 10000) / 10000);
      }
    }

    // Add minor calculation error
    incorrectOptions.push(Math.round((exactValue + 0.05) * 10000) / 10000);

    return {
      questionDisplay: {
        text: `Use your calculator to find ${func} of `,
        math: `${angle}`
      },
      correctAnswer: `${correctAnswer}`,
      options: generateUniqueOptions([
        `${correctAnswer}`,
        ...incorrectOptions.slice(0, 3).map(val => `${val}`)
      ]),
      explanation: `Using a calculator: ${func}(${angle}) = ${correctAnswer}`
    };
  }

  else if (sectionType === 'examples') {
    return {
      title: `Calculator Skills: ${func}(${angle})`,
      questionText: `Use your calculator to find ${func}(${angle}).`,
      solution: [
        {
          explanation: "Make sure your calculator is in degree mode",
          formula: `\\text{Calculator mode: } \\text{DEG}`
        },
        {
          explanation: `Enter the calculation: ${funcSymbol}(${angle})`,
          formula: `${funcSymbol}(${angle})`
        },
        {
          explanation: "Read the result from your calculator",
          formula: `${funcSymbol}(${angle}) = ${correctAnswer}`
        }
      ]
    };
  }

  // Fallback to diagnostic format
  return generateTrigCalculator({ ...options, sectionType: 'diagnostic' });
};

/**
 * Unified triangle side labeling question generator
 * Tests understanding of opposite, adjacent, and hypotenuse relative to an angle
 */
export const generateTriangleLabeling = (options = {}) => {
  const {
    sectionType = 'diagnostic',
    units = 'cm'
  } = options;

  // Use reasonable dimensions for the triangle
  const base = _.random(3, 6);
  const height = _.random(3, 6);

  // Generate a random side to identify
  const sideToIdentify = _.sample(['adjacent', 'opposite', 'hypotenuse']);

  // Create explicit labels for each side based on its relationship to angle θ
  const sideLabels = {
    adjacent: _.sample(['a', 'p', 'x']),
    opposite: _.sample(['b', 'q', 'y']),
    hypotenuse: _.sample(['c', 'r', 'z'])
  };

  // Create the triangle visualization config using factory pattern
  const visualization = createRightTriangle({
    base,
    height,
    labelStyle: 'custom',
    showRightAngle: true,
    showAngles: [false, true], // Keep angle at second position
    angleLabels: ['', 'θ'],
    labels: [sideLabels.opposite, sideLabels.adjacent, sideLabels.hypotenuse],
    units,
    sectionType,
    autoCycle: true
  });

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Which side is the ${sideToIdentify} side relative to angle θ?`,
      answer: `\\text{The ${sideToIdentify} side is labeled } ${sideLabels[sideToIdentify]}`,
      visualization
    };
  }

  else if (sectionType === 'diagnostic') {
    return {
      questionDisplay: {
        text: `Which side is the ${sideToIdentify} side relative to the angle `,
        math: `\\theta`
      },
      correctAnswer: sideLabels[sideToIdentify],
      options: [sideLabels.adjacent, sideLabels.opposite, sideLabels.hypotenuse].sort(() => Math.random() - 0.5),
      explanation: `The ${sideToIdentify} side relative to angle θ is labeled as ${sideLabels[sideToIdentify]}.`,
      visualization
    };
  }

  else if (sectionType === 'examples') {
    return {
      title: "Identifying Triangle Sides",
      questionText: `Which side is the ${sideToIdentify} side relative to angle θ?`,
      solution: [
        {
          explanation: "Remember: sides are named relative to the angle we're considering",
          formula: "\\text{Always identify sides relative to the angle θ}"
        },
        {
          explanation: `The ${sideToIdentify} side is the one ${sideToIdentify === 'opposite' ? 'across from' : sideToIdentify === 'adjacent' ? 'next to' : 'longest side opposite the right angle'}`,
          formula: `\\text{${sideToIdentify} side} = ${sideLabels[sideToIdentify]}`
        }
      ],
      visualization
    };
  }

  // Fallback to diagnostic format
  return generateTriangleLabeling({ ...options, sectionType: 'diagnostic' });
};

/**
 * Unified missing side using trigonometry generator
 * Handles starter, diagnostic, and examples sections with section-aware output
 * Examples section includes variety of trig ratios and angles
 */
export const generateFindMissingSideTrig = (options = {}) => {
  const {
    sectionType = 'examples',
    difficulty = 'medium',
    seed = Date.now(),
    units = 'cm',
    trigRatio = null // Allow forcing specific ratio for examples
  } = options;

  // Choose angles - easier angles for starter/diagnostic, variety for examples
  const angles = sectionType === 'examples' 
    ? [30, 35, 40, 45, 50, 55, 60]
    : [30, 45, 60]; // Stick to special angles for cleaner answers

  const angle = seed ? angles[seed % angles.length] : _.sample(angles);

  // Choose trig ratio - force specific one if provided, otherwise random
  const ratios = ['sine', 'cosine', 'tangent'];
  const chosenRatio = trigRatio || (seed ? ratios[seed % 3] : _.sample(ratios));

  let base, height, labels, knownSide, unknownSide, correctAnswer;

  // Generate triangle based on the chosen ratio
  if (chosenRatio === 'sine') {
    // sin(θ) = opposite / hypotenuse - know hypotenuse, find opposite
    const hypotenuse = seed ? 5 + (seed % 6) : _.random(5, 10);
    const opposite = Math.round(hypotenuse * Math.sin(angle * Math.PI / 180) * 10) / 10;
    const adjacent = Math.round(Math.sqrt(hypotenuse * hypotenuse - opposite * opposite) * 10) / 10;

    base = adjacent;
    height = opposite;
    knownSide = hypotenuse;
    unknownSide = opposite;
    correctAnswer = opposite;

    // Determine angle position
    const angleAtBase = seed ? ((seed + 2) % 2 === 0) : (Math.random() > 0.5);
    
    // Labels: show hypotenuse + unknown opposite + hide adjacent
    labels = angleAtBase ?
      ['? cm', null, `${hypotenuse} cm`] :
      [null, '? cm', `${hypotenuse} cm`];

  } else if (chosenRatio === 'cosine') {
    // cos(θ) = adjacent / hypotenuse - know hypotenuse, find adjacent
    const hypotenuse = seed ? 5 + (seed % 6) : _.random(5, 10);
    const adjacent = Math.round(hypotenuse * Math.cos(angle * Math.PI / 180) * 10) / 10;
    const opposite = Math.round(Math.sqrt(hypotenuse * hypotenuse - adjacent * adjacent) * 10) / 10;

    base = adjacent;
    height = opposite;
    knownSide = hypotenuse;
    unknownSide = adjacent;
    correctAnswer = adjacent;

    // Determine angle position
    const angleAtBase = seed ? ((seed + 2) % 2 === 0) : (Math.random() > 0.5);
    
    // Labels: show hypotenuse + unknown adjacent + hide opposite
    labels = angleAtBase ?
      [null, '? cm', `${hypotenuse} cm`] :
      ['? cm', null, `${hypotenuse} cm`];

  } else {
    // tangent - know one side, find other
    const knowOpposite = seed ? ((seed + 3) % 2 === 0) : (Math.random() > 0.5);

    if (knowOpposite) {
      const opposite = seed ? 3 + (seed % 6) : _.random(3, 8);
      const adjacent = Math.round(opposite / Math.tan(angle * Math.PI / 180) * 10) / 10;

      base = adjacent;
      height = opposite;
      knownSide = opposite;
      unknownSide = adjacent;
      correctAnswer = adjacent;

      const angleAtBase = seed ? ((seed + 1) % 2 === 0) : (Math.random() > 0.5);
      labels = angleAtBase ?
        [`${opposite} cm`, '? cm', null] :
        ['? cm', `${opposite} cm`, null];

    } else {
      const adjacent = seed ? 3 + (seed % 6) : _.random(3, 8);
      const opposite = Math.round(adjacent * Math.tan(angle * Math.PI / 180) * 10) / 10;

      base = adjacent;
      height = opposite;
      knownSide = adjacent;
      unknownSide = opposite;
      correctAnswer = opposite;

      const angleAtBase = seed ? ((seed + 1) % 2 === 0) : (Math.random() > 0.5);
      labels = angleAtBase ?
        ['? cm', `${adjacent} cm`, null] :
        [`${adjacent} cm`, '? cm', null];
    }
  }

  // Generate orientation variety for all sections EXCEPT starter
  let orientationConfig = {};
  if (sectionType !== 'starter') {
    const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];
    const orientationIndex = Math.floor((seed % 1000) / 250) % orientations.length;
    orientationConfig.orientation = orientations[orientationIndex];
  }

  // Create visualization
  const visualization = createRightTriangle({
    base,
    height,
    showRightAngle: true,
    showAngles: [true, false],
    angleLabels: ['θ', ''],
    labelStyle: "custom",
    labels,
    units,
    sectionType,
    ...orientationConfig
  });

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    const questionText = `Find the missing side in this right-angled triangle. Angle θ = ${angle}°.`;
    
    return {
      question: questionText,
      answer: `\\text{Using ${chosenRatio}: } \\text{missing side} = ${correctAnswer}\\text{ ${units}}`,
      visualization
    };
  }

  else if (sectionType === 'diagnostic') {
    const questionText = `Find the missing side using trigonometry. Angle θ = ${angle}°.`;

    // Generate distractors
    const distractors = [
      Math.round((correctAnswer + _.random(0.5, 2)) * 10) / 10,
      Math.round((correctAnswer - _.random(0.5, 1.5)) * 10) / 10,
      Math.round((correctAnswer * 1.2) * 10) / 10
    ];

    return {
      questionDisplay: { text: questionText },
      correctAnswer: `${correctAnswer}\\text{ ${units}}`,
      options: generateUniqueOptions([
        `${correctAnswer}\\text{ ${units}}`,
        ...distractors.map(d => `${d}\\text{ ${units}}`)
      ]),
      explanation: `Use ${chosenRatio} to find the missing side: ${correctAnswer} ${units}`,
      visualization
    };
  }

  else if (sectionType === 'examples') {
    const questionText = `Find the missing side length in this right-angled triangle. Angle θ = ${angle}°.`;

    // Create solution steps based on the chosen ratio
    let solution;
    
    if (chosenRatio === 'sine') {
      solution = [
        {
          explanation: `Identify what we know: angle θ = ${angle}°, hypotenuse = ${knownSide} cm`,
          formula: `\\theta = ${angle}°, \\text{ hypotenuse } = ${knownSide}\\text{ cm}`
        },
        {
          explanation: "We need to find the opposite side. Since we know the hypotenuse and need the opposite, we use sine",
          formula: `\\sin(\\theta) = \\frac{\\text{opposite}}{\\text{hypotenuse}}`
        },
        {
          explanation: "Rearrange to solve for the opposite side",
          formula: `\\text{opposite} = \\text{hypotenuse} \\times \\sin(\\theta)`
        },
        {
          explanation: "Substitute the values",
          formula: `\\text{opposite} = ${knownSide} \\times \\sin(${angle}°)`
        },
        {
          explanation: "Calculate using a calculator",
          formula: `\\text{opposite} = ${correctAnswer}\\text{ cm}`
        }
      ];
    } else if (chosenRatio === 'cosine') {
      solution = [
        {
          explanation: `Identify what we know: angle θ = ${angle}°, hypotenuse = ${knownSide} cm`,
          formula: `\\theta = ${angle}°, \\text{ hypotenuse } = ${knownSide}\\text{ cm}`
        },
        {
          explanation: "We need to find the adjacent side. Since we know the hypotenuse and need the adjacent, we use cosine",
          formula: `\\cos(\\theta) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}`
        },
        {
          explanation: "Rearrange to solve for the adjacent side",
          formula: `\\text{adjacent} = \\text{hypotenuse} \\times \\cos(\\theta)`
        },
        {
          explanation: "Substitute the values",
          formula: `\\text{adjacent} = ${knownSide} \\times \\cos(${angle}°)`
        },
        {
          explanation: "Calculate using a calculator",
          formula: `\\text{adjacent} = ${correctAnswer}\\text{ cm}`
        }
      ];
    } else {
      // tangent
      const knowOpposite = labels[0].includes('?') ? false : true;
      
      if (knowOpposite) {
        solution = [
          {
            explanation: `Identify what we know: angle θ = ${angle}°, opposite side = ${knownSide} cm`,
            formula: `\\theta = ${angle}°, \\text{ opposite } = ${knownSide}\\text{ cm}`
          },
          {
            explanation: "We need to find the adjacent side. Since we know the opposite and need the adjacent, we use tangent",
            formula: `\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}`
          },
          {
            explanation: "Rearrange to solve for the adjacent side",
            formula: `\\text{adjacent} = \\frac{\\text{opposite}}{\\tan(\\theta)}`
          },
          {
            explanation: "Substitute the values",
            formula: `\\text{adjacent} = \\frac{${knownSide}}{\\tan(${angle}°)}`
          },
          {
            explanation: "Calculate using a calculator",
            formula: `\\text{adjacent} = ${correctAnswer}\\text{ cm}`
          }
        ];
      } else {
        solution = [
          {
            explanation: `Identify what we know: angle θ = ${angle}°, adjacent side = ${knownSide} cm`,
            formula: `\\theta = ${angle}°, \\text{ adjacent } = ${knownSide}\\text{ cm}`
          },
          {
            explanation: "We need to find the opposite side. Since we know the adjacent and need the opposite, we use tangent",
            formula: `\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}`
          },
          {
            explanation: "Rearrange to solve for the opposite side",
            formula: `\\text{opposite} = \\text{adjacent} \\times \\tan(\\theta)`
          },
          {
            explanation: "Substitute the values",
            formula: `\\text{opposite} = ${knownSide} \\times \\tan(${angle}°)`
          },
          {
            explanation: "Calculate using a calculator",
            formula: `\\text{opposite} = ${correctAnswer}\\text{ cm}`
          }
        ];
      }
    }

    return {
      title: `Using ${chosenRatio} to find a missing side`,
      questionText,
      visualization,
      solution
    };
  }

  // Fallback to diagnostic format
  return generateFindMissingSideTrig({ ...options, sectionType: 'diagnostic' });
};

/**
 * Unified exact trigonometric values generator
 * For special triangles (30-60-90 and 45-45-90)
 */
export const generateExactTrigValues = (options = {}) => {
  const {
    sectionType = 'examples',
    seed = Date.now()
  } = options;

  // Choose which special triangle and which trig function
  const triangleTypes = ['45-45-90', '30-60-90'];
  const triangleType = seed ? triangleTypes[seed % 2] : _.sample(triangleTypes);

  if (triangleType === '45-45-90') {
    const leg = 2;
    const hypotenuse = Math.round(leg * Math.sqrt(2) * 100) / 100;

    const trigFunctions = ['sin', 'cos', 'tan'];
    const trigFunc = seed ? trigFunctions[seed % 3] : _.sample(trigFunctions);

    const visualization = createRightTriangle({
      base: leg,
      height: leg,
      showRightAngle: true,
      showAngles: [true, true],
      angleLabels: ['45°', '45°'],
      labelStyle: "custom",
      labels: [`${leg} cm`, `${leg} cm`, `${leg}√2 cm`],
      units: 'cm',
      sectionType
    });

    let exactValue, solution;

    if (trigFunc === 'sin') {
      exactValue = `\\frac{\\sqrt{2}}{2}`;
      solution = [
        {
          explanation: "In a 45-45-90 triangle, both legs are equal and each acute angle is 45°",
          formula: `\\text{legs} = ${leg}\\text{ cm}, \\text{ hypotenuse} = ${leg}\\sqrt{2}\\text{ cm}`
        },
        {
          explanation: "To find sin(45°), we use the ratio opposite/hypotenuse",
          formula: `\\sin(45°) = \\frac{\\text{opposite}}{\\text{hypotenuse}} = \\frac{${leg}}{${leg}\\sqrt{2}} = \\frac{1}{\\sqrt{2}}`
        },
        {
          explanation: "Rationalize the denominator",
          formula: `\\sin(45°) = \\frac{1}{\\sqrt{2}} \\times \\frac{\\sqrt{2}}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}`
        }
      ];
    } else if (trigFunc === 'cos') {
      exactValue = `\\frac{\\sqrt{2}}{2}`;
      solution = [
        {
          explanation: "In a 45-45-90 triangle, both legs are equal and each acute angle is 45°",
          formula: `\\text{legs} = ${leg}\\text{ cm}, \\text{ hypotenuse} = ${leg}\\sqrt{2}\\text{ cm}`
        },
        {
          explanation: "To find cos(45°), we use the ratio adjacent/hypotenuse",
          formula: `\\cos(45°) = \\frac{\\text{adjacent}}{\\text{hypotenuse}} = \\frac{${leg}}{${leg}\\sqrt{2}} = \\frac{1}{\\sqrt{2}}`
        },
        {
          explanation: "Rationalize the denominator",
          formula: `\\cos(45°) = \\frac{\\sqrt{2}}{2}`
        }
      ];
    } else {
      exactValue = `1`;
      solution = [
        {
          explanation: "In a 45-45-90 triangle, both legs are equal",
          formula: `\\text{opposite} = \\text{adjacent} = ${leg}\\text{ cm}`
        },
        {
          explanation: "To find tan(45°), we use the ratio opposite/adjacent",
          formula: `\\tan(45°) = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{${leg}}{${leg}} = 1`
        }
      ];
    }

    return {
      title: `Exact Value: ${trigFunc}(45°)`,
      questionText: `Find the exact value of ${trigFunc}(45°) using this special right triangle.`,
      visualization,
      solution
    };

  } else {
    // 30-60-90 triangle logic (similar structure)
    const shortLeg = 1;
    const longLeg = Math.round(shortLeg * Math.sqrt(3) * 100) / 100;
    const hypotenuse = 2;

    const angles = [30, 60];
    const chosenAngle = seed ? angles[seed % 2] : _.sample(angles);
    const trigFunctions = ['sin', 'cos'];
    const trigFunc = seed ? trigFunctions[(seed + 1) % 2] : _.sample(trigFunctions);

    // Similar implementation for 30-60-90 triangles...
    return {
      title: `Exact Value: ${trigFunc}(${chosenAngle}°)`,
      questionText: `Find the exact value of ${trigFunc}(${chosenAngle}°) using this special right triangle.`,
      visualization: createRightTriangle({
        base: shortLeg,
        height: longLeg,
        showRightAngle: true,
        showAngles: [true, true],
        angleLabels: ['30°', '60°'],
        labelStyle: "custom",
        labels: [`√3 cm`, `1 cm`, `2 cm`],
        units: 'cm',
        sectionType
      }),
      solution: [
        {
          explanation: "In a 30-60-90 triangle, sides are in ratio 1:√3:2",
          formula: `\\text{Special triangle ratios}`
        }
      ]
    };
  }
};

// Export unified generators
export const sohcahtoaGenerators = {
  // New unified functions
  generateTrigCalculator,
  generateTriangleLabeling,
  generateFindMissingSideTrig,
  generateExactTrigValues,

  // Legacy aliases for backward compatibility (temporary)
  generateTrigCalculatorQuestion: (options) => generateTrigCalculator(options),
  generateTriangleLabelingQuestion: (options) => generateTriangleLabeling(options),

  // Helper to generate all examples
  generateExampleQuestions: () => {
    const seed = Date.now();
    
    return [
      generateFindMissingSideTrig({ seed, trigRatio: 'tangent' }),
      generateFindMissingSideTrig({ seed: seed + 1000, trigRatio: 'sine' }),
      generateExactTrigValues({ seed: seed + 2000 })
    ];
  }
};

export default sohcahtoaGenerators;