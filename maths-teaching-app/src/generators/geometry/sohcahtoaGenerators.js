// src/generators/geometry/sohcahtoaGenerators.js
import _ from 'lodash';
import { createRightTriangle } from '../../factories/triangleFactory';


/**
 * Generate a basic trig calculator usage question
 * For diagnostic assessment of calculator skills - FIXED for KaTeX consistency
 */
const generateTrigCalculatorQuestion = (options = {}) => {
  const {
    sectionType = 'diagnostic'
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

  // Select random function and angle
  const func = _.sample(['sine', 'cosine', 'tangent']);
  const angle = _.sample(['30°', '45°', '60°']);

  // Get correct value with some rounding for display
  const exactValue = trigValues[func][angle];
  const correctAnswer = Math.round(exactValue * 10000) / 10000;

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

  // Convert function name for display
  const funcSymbol = {
    'sine': '\\sin',
    'cosine': '\\cos',
    'tangent': '\\tan'
  }[func];

  return {
    questionDisplay: {
      text: `Use your calculator to find ${func} of `,
      math: `${angle}`
    },
    // FIXED: Format answer consistently with proper rounding
    correctAnswer: `${correctAnswer}`,
    // FIXED: Format all options consistently  
    options: [
      `${correctAnswer}`,
      ...incorrectOptions.slice(0, 3).map(val => `${val}`)
    ].sort(() => Math.random() - 0.5),
    explanation: `Using a calculator: ${func}(${angle}) = ${correctAnswer}`
  };
};

/**
 * Generate a triangle side labeling question
 * Tests understanding of opposite, adjacent, and hypotenuse relative to an angle
 */
const generateTriangleLabelingQuestion = (options = {}) => {
  const {
    sectionType = 'diagnostic'
  } = options;

  // Use reasonable dimensions for the triangle
  const base = _.random(3, 6);
  const height = _.random(3, 6);

  // Generate a random side to identify
  const sideToIdentify = _.sample(['adjacent', 'opposite', 'hypotenuse']);

  // Create explicit labels for each side based on its relationship to angle θ
  const sideLabels = {
    adjacent: _.sample(['a', 'p', 'x']),      // Label for adjacent side
    opposite: _.sample(['b', 'q', 'y']),      // Label for opposite side
    hypotenuse: _.sample(['c', 'r', 'z'])     // Label for hypotenuse
  };

  // Create the triangle visualization config using factory pattern
  const visualization = createRightTriangle({
    base,
    height,
    labelStyle: 'custom',
    showRightAngle: true,
    showAngles: [false, true], // Keep angle at second position
    angleLabels: ['', 'θ'],
    labels: [sideLabels.opposite, sideLabels.adjacent, sideLabels.hypotenuse], // [horizontal, vertical, hypotenuse]
    units: 'cm',
    sectionType,
    autoCycle: true  // Enable orientation cycling
  });

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
};


/**
 * Generate a tangent-only example for finding missing sides
 */
const generateTangentExample = (options = {}) => {
  const {
    sectionType = 'examples',
    seed = Date.now()
  } = options;

  // Choose a clean angle
  const angles = [30, 35, 40, 45, 50, 55, 60];
  const angle = seed ? angles[seed % angles.length] : _.sample(angles);

  // Randomly choose which side we know
  const knowOpposite = seed ? (seed % 2 === 0) : (Math.random() > 0.5);

  if (knowOpposite) {
    // We know opposite, find adjacent
    const opposite = seed ? 3 + (seed % 6) : _.random(3, 8);
    const adjacent = Math.round(opposite / Math.tan(angle * Math.PI / 180) * 10) / 10;

    // Determine angle position (which corner has θ)
    const angleAtBase = seed ? ((seed + 1) % 2 === 0) : (Math.random() > 0.5);
    const showAngles = angleAtBase ? [true, false] : [false, true];
    const angleLabels = angleAtBase ? ['θ', ''] : ['', 'θ'];

    // Labels: show known opposite + unknown adjacent + hide hypotenuse
    const labels = angleAtBase ?
      [`${opposite} cm`, '? cm', null] :  // [opposite, adjacent, hypotenuse]
      ['? cm', `${opposite} cm`, null];   // [adjacent, opposite, hypotenuse] 

    const visualization = createRightTriangle({
      base: adjacent,
      height: opposite,
      showRightAngle: true,
      showAngles,
      angleLabels,
      labelStyle: "custom",
      labels,
      units: 'cm',
      sectionType,
      autoCycle: true
    });

    const solution = [
      {
        explanation: `Identify what we know: angle θ = ${angle}°, opposite side = ${opposite} cm`,
        formula: `\\theta = ${angle}°, \\text{ opposite } = ${opposite}\\text{ cm}`
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
        formula: `\\text{adjacent} = \\frac{${opposite}}{\\tan(${angle}°)}`
      },
      {
        explanation: "Calculate using a calculator",
        formula: `\\text{adjacent} = ${adjacent}\\text{ cm}`
      }
    ];

    return {
      title: "Finding a Missing Side Using Tangent",
      questionText: "Find the missing side length in this right-angled triangle.",
      visualization,
      solution
    };

  } else {
    // We know adjacent, find opposite
    const adjacent = seed ? 3 + (seed % 6) : _.random(3, 8);
    const opposite = Math.round(adjacent * Math.tan(angle * Math.PI / 180) * 10) / 10;

    // Determine angle position
    const angleAtBase = seed ? ((seed + 1) % 2 === 0) : (Math.random() > 0.5);
    const showAngles = angleAtBase ? [true, false] : [false, true];
    const angleLabels = angleAtBase ? ['θ', ''] : ['', 'θ'];

    // Labels: show known adjacent + unknown opposite + hide hypotenuse
    const labels = angleAtBase ?
      ['? cm', `${adjacent} cm`, null] :  // [opposite, adjacent, hypotenuse]
      [`${adjacent} cm`, '? cm', null];   // [adjacent, opposite, hypotenuse]

    const visualization = createRightTriangle({
      base: adjacent,
      height: opposite,
      showRightAngle: true,
      showAngles,
      angleLabels,
      labelStyle: "custom",
      labels,
      units: 'cm',
      sectionType,
      autoCycle: true
    });

    const solution = [
      {
        explanation: `Identify what we know: angle θ = ${angle}°, adjacent side = ${adjacent} cm`,
        formula: `\\theta = ${angle}°, \\text{ adjacent } = ${adjacent}\\text{ cm}`
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
        formula: `\\text{opposite} = ${adjacent} \\times \\tan(${angle}°)`
      },
      {
        explanation: "Calculate using a calculator",
        formula: `\\text{opposite} = ${opposite}\\text{ cm}`
      }
    ];

    return {
      title: "Finding a Missing Side Using Tangent",
      questionText: "Find the missing side length in this right-angled triangle.",
      visualization,
      solution
    };
  }
};

/**
 * Generate a mixed trig example using sine, cosine, or tangent
 */
const generateMixedTrigExample = (options = {}) => {
  const {
    sectionType = 'examples',
    seed = Date.now()
  } = options;

  // Choose which trig ratio to use
  const trigRatios = ['sine', 'cosine', 'tangent'];
  const trigRatio = seed ? trigRatios[seed % 3] : _.sample(trigRatios);

  const angles = [30, 35, 40, 45, 50, 55, 60];
  const angle = seed ? angles[seed % angles.length] : _.sample(angles);

  // Determine angle position (which corner has θ)
  const angleAtBase = seed ? ((seed + 2) % 2 === 0) : (Math.random() > 0.5);
  const showAngles = angleAtBase ? [true, false] : [false, true];
  const angleLabels = angleAtBase ? ['θ', ''] : ['', 'θ'];

  let base, height, labels, solution, knownSide, unknownSide;

  if (trigRatio === 'sine') {
    // sin(θ) = opposite / hypotenuse - know hypotenuse, find opposite
    const hypotenuse = seed ? 5 + (seed % 6) : _.random(5, 10);
    const opposite = Math.round(hypotenuse * Math.sin(angle * Math.PI / 180) * 10) / 10;
    const adjacent = Math.round(Math.sqrt(hypotenuse * hypotenuse - opposite * opposite) * 10) / 10;

    base = adjacent;
    height = opposite;
    knownSide = hypotenuse;
    unknownSide = opposite;

    // Labels: show hypotenuse + unknown opposite + hide adjacent
    labels = angleAtBase ?
      ['? cm', null, `${hypotenuse} cm`] :  // [opposite, adjacent, hypotenuse]
      [null, '? cm', `${hypotenuse} cm`];   // [adjacent, opposite, hypotenuse]

    solution = [
      {
        explanation: `Identify what we know: angle θ = ${angle}°, hypotenuse = ${hypotenuse} cm`,
        formula: `\\theta = ${angle}°, \\text{ hypotenuse } = ${hypotenuse}\\text{ cm}`
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
        formula: `\\text{opposite} = ${hypotenuse} \\times \\sin(${angle}°)`
      },
      {
        explanation: "Calculate using a calculator",
        formula: `\\text{opposite} = ${opposite}\\text{ cm}`
      }
    ];

  } else if (trigRatio === 'cosine') {
    // cos(θ) = adjacent / hypotenuse - know hypotenuse, find adjacent
    const hypotenuse = seed ? 5 + (seed % 6) : _.random(5, 10);
    const adjacent = Math.round(hypotenuse * Math.cos(angle * Math.PI / 180) * 10) / 10;
    const opposite = Math.round(Math.sqrt(hypotenuse * hypotenuse - adjacent * adjacent) * 10) / 10;

    base = adjacent;
    height = opposite;
    knownSide = hypotenuse;
    unknownSide = adjacent;

    // Labels: show hypotenuse + unknown adjacent + hide opposite
    labels = angleAtBase ?
      [null, '? cm', `${hypotenuse} cm`] :  // [opposite, adjacent, hypotenuse]
      ['? cm', null, `${hypotenuse} cm`];   // [adjacent, opposite, hypotenuse]

    solution = [
      {
        explanation: `Identify what we know: angle θ = ${angle}°, hypotenuse = ${hypotenuse} cm`,
        formula: `\\theta = ${angle}°, \\text{ hypotenuse } = ${hypotenuse}\\text{ cm}`
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
        formula: `\\text{adjacent} = ${hypotenuse} \\times \\cos(${angle}°)`
      },
      {
        explanation: "Calculate using a calculator",
        formula: `\\text{adjacent} = ${adjacent}\\text{ cm}`
      }
    ];

  } else {
    // tangent - similar to example 1 but mixed in with other ratios
    const knowOpposite = seed ? ((seed + 3) % 2 === 0) : (Math.random() > 0.5);

    if (knowOpposite) {
      const opposite = seed ? 3 + (seed % 6) : _.random(3, 8);
      const adjacent = Math.round(opposite / Math.tan(angle * Math.PI / 180) * 10) / 10;

      base = adjacent;
      height = opposite;
      knownSide = opposite;
      unknownSide = adjacent;

      labels = angleAtBase ?
        [`${opposite} cm`, '? cm', null] :
        ['? cm', `${opposite} cm`, null];

      solution = [
        {
          explanation: `Identify what we know: angle θ = ${angle}°, opposite side = ${opposite} cm`,
          formula: `\\theta = ${angle}°, \\text{ opposite } = ${opposite}\\text{ cm}`
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
          formula: `\\text{adjacent} = \\frac{${opposite}}{\\tan(${angle}°)}`
        },
        {
          explanation: "Calculate using a calculator",
          formula: `\\text{adjacent} = ${adjacent}\\text{ cm}`
        }
      ];
    } else {
      const adjacent = seed ? 3 + (seed % 6) : _.random(3, 8);
      const opposite = Math.round(adjacent * Math.tan(angle * Math.PI / 180) * 10) / 10;

      base = adjacent;
      height = opposite;
      knownSide = adjacent;
      unknownSide = opposite;

      labels = angleAtBase ?
        ['? cm', `${adjacent} cm`, null] :
        [`${adjacent} cm`, '? cm', null];

      solution = [
        {
          explanation: `Identify what we know: angle θ = ${angle}°, adjacent side = ${adjacent} cm`,
          formula: `\\theta = ${angle}°, \\text{ adjacent } = ${adjacent}\\text{ cm}`
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
          formula: `\\text{opposite} = ${adjacent} \\times \\tan(${angle}°)`
        },
        {
          explanation: "Calculate using a calculator",
          formula: `\\text{opposite} = ${opposite}\\text{ cm}`
        }
      ];
    }
  }

  const visualization = createRightTriangle({
    base,
    height,
    showRightAngle: true,
    showAngles,
    angleLabels,
    labelStyle: "custom",
    labels,
    units: 'cm',
    sectionType,
    autoCycle: true
  });

  return {
    title: `Using ${trigRatio} to find a missing side`,
    questionText: "Find the missing side length in this right-angled triangle.",
    visualization,
    solution
  };
};



/**
 * Generate special right triangle examples for exact trig values
 */
const generateSpecialTriangleExample = (options = {}) => {
  const {
    sectionType = 'examples',
    seed = Date.now()
  } = options;

  // Choose which special triangle and which trig function
  const triangleTypes = ['45-45-90', '30-60-90'];
  const triangleType = seed ? triangleTypes[seed % 2] : _.sample(triangleTypes);

  if (triangleType === '45-45-90') {
    // 45-45-90 triangle: sides in ratio 1:1:√2
    const leg = 2; // Use simple value for clarity
    const hypotenuse = Math.round(leg * Math.sqrt(2) * 100) / 100;

    // Choose which trig function to find
    const trigFunctions = ['sin', 'cos', 'tan'];
    const trigFunc = seed ? trigFunctions[seed % 3] : _.sample(trigFunctions);

    const visualization = createRightTriangle({
      base: leg,
      height: leg,
      showRightAngle: true,
      showAngles: [true, true], // Show both 45° angles
      angleLabels: ['45°', '45°'],
      labelStyle: "custom",
      labels: [`${leg} cm`, `${leg} cm`, `${leg}√2 cm`], // Show exact values
      units: 'cm',
      sectionType,
      autoCycle: true
    });

    let exactValue, solution;

    if (trigFunc === 'sin') {
      exactValue = `\\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}`;
      solution = [
        {
          explanation: "In a 45-45-90 triangle, both legs are equal and each acute angle is 45°",
          formula: `\\text{legs} = ${leg}\\text{ cm}, \\text{ hypotenuse} = ${leg}\\sqrt{2}\\text{ cm}`
        },
        {
          explanation: "To find sin(45°), we use the ratio opposite/hypotenuse",
          formula: `\\sin(45°) = \\frac{\\text{opposite}}{\\text{hypotenuse}}`
        },
        {
          explanation: "Substitute the values from our triangle",
          formula: `\\sin(45°) = \\frac{${leg}}{${leg}\\sqrt{2}}`
        },
        {
          explanation: "Simplify the fraction",
          formula: `\\sin(45°) = \\frac{1}{\\sqrt{2}}`
        },
        {
          explanation: "Rationalize the denominator",
          formula: `\\sin(45°) = \\frac{1}{\\sqrt{2}} \\times \\frac{\\sqrt{2}}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}`
        }
      ];
    } else if (trigFunc === 'cos') {
      exactValue = `\\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}`;
      solution = [
        {
          explanation: "In a 45-45-90 triangle, both legs are equal and each acute angle is 45°",
          formula: `\\text{legs} = ${leg}\\text{ cm}, \\text{ hypotenuse} = ${leg}\\sqrt{2}\\text{ cm}`
        },
        {
          explanation: "To find cos(45°), we use the ratio adjacent/hypotenuse",
          formula: `\\cos(45°) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}`
        },
        {
          explanation: "Substitute the values from our triangle",
          formula: `\\cos(45°) = \\frac{${leg}}{${leg}\\sqrt{2}}`
        },
        {
          explanation: "Simplify the fraction",
          formula: `\\cos(45°) = \\frac{1}{\\sqrt{2}}`
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
          formula: `\\tan(45°) = \\frac{\\text{opposite}}{\\text{adjacent}}`
        },
        {
          explanation: "Substitute the values from our triangle",
          formula: `\\tan(45°) = \\frac{${leg}}{${leg}}`
        },
        {
          explanation: "Simplify the fraction",
          formula: `\\tan(45°) = 1`
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
    // 30-60-90 triangle: sides in ratio 1:√3:2
    const shortLeg = 1; // Use 1 for simplicity
    const longLeg = Math.round(shortLeg * Math.sqrt(3) * 100) / 100;
    const hypotenuse = 2;

    // Choose angle (30° or 60°) and trig function
    const angles = [30, 60];
    const chosenAngle = seed ? angles[seed % 2] : _.sample(angles);
    const trigFunctions = ['sin', 'cos'];
    const trigFunc = seed ? trigFunctions[(seed + 1) % 2] : _.sample(trigFunctions);

    const visualization = createRightTriangle({
      base: shortLeg,
      height: longLeg,
      showRightAngle: true,
      showAngles: [true, true],
      angleLabels: ['30°', '60°'],
      labelStyle: "custom",
      labels: [`√3 cm`, `1 cm`, `2 cm`], // Show exact values
      units: 'cm',
      sectionType,
      autoCycle: true
    });

    let exactValue, solution;

    if (chosenAngle === 30) {
      if (trigFunc === 'sin') {
        exactValue = `\\frac{1}{2}`;
        solution = [
          {
            explanation: "In a 30-60-90 triangle, the sides are in the ratio 1:√3:2",
            formula: `\\text{short leg} = 1, \\text{ long leg} = \\sqrt{3}, \\text{ hypotenuse} = 2`
          },
          {
            explanation: "For sin(30°), we need opposite/hypotenuse. The side opposite to 30° is the short leg",
            formula: `\\sin(30°) = \\frac{\\text{opposite}}{\\text{hypotenuse}}`
          },
          {
            explanation: "Substitute the values",
            formula: `\\sin(30°) = \\frac{1}{2}`
          }
        ];
      } else {
        exactValue = `\\frac{\\sqrt{3}}{2}`;
        solution = [
          {
            explanation: "In a 30-60-90 triangle, the sides are in the ratio 1:√3:2",
            formula: `\\text{short leg} = 1, \\text{ long leg} = \\sqrt{3}, \\text{ hypotenuse} = 2`
          },
          {
            explanation: "For cos(30°), we need adjacent/hypotenuse. The side adjacent to 30° is the long leg",
            formula: `\\cos(30°) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}`
          },
          {
            explanation: "Substitute the values",
            formula: `\\cos(30°) = \\frac{\\sqrt{3}}{2}`
          }
        ];
      }
    } else {
      if (trigFunc === 'sin') {
        exactValue = `\\frac{\\sqrt{3}}{2}`;
        solution = [
          {
            explanation: "In a 30-60-90 triangle, the sides are in the ratio 1:√3:2",
            formula: `\\text{short leg} = 1, \\text{ long leg} = \\sqrt{3}, \\text{ hypotenuse} = 2`
          },
          {
            explanation: "For sin(60°), we need opposite/hypotenuse. The side opposite to 60° is the long leg",
            formula: `\\sin(60°) = \\frac{\\text{opposite}}{\\text{hypotenuse}}`
          },
          {
            explanation: "Substitute the values",
            formula: `\\sin(60°) = \\frac{\\sqrt{3}}{2}`
          }
        ];
      } else {
        exactValue = `\\frac{1}{2}`;
        solution = [
          {
            explanation: "In a 30-60-90 triangle, the sides are in the ratio 1:√3:2",
            formula: `\\text{short leg} = 1, \\text{ long leg} = \\sqrt{3}, \\text{ hypotenuse} = 2`
          },
          {
            explanation: "For cos(60°), we need adjacent/hypotenuse. The side adjacent to 60° is the short leg",
            formula: `\\cos(60°) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}`
          },
          {
            explanation: "Substitute the values",
            formula: `\\cos(60°) = \\frac{1}{2}`
          }
        ];
      }
    }

    return {
      title: `Exact Value: ${trigFunc}(${chosenAngle}°)`,
      questionText: `Find the exact value of ${trigFunc}(${chosenAngle}°) using this special right triangle.`,
      visualization,
      solution
    };
  }
};

// Main object export with all generators
const SohcahtoaGenerators = {
  generateTangentExample,
  generateMixedTrigExample,
  generateSpecialTriangleExample,
  generateTrigCalculatorQuestion,
  generateTriangleLabelingQuestion,
  
  // Helper to generate all examples
  generateExampleQuestions: () => {
    const seed = Date.now();
    
    return [
      generateTangentExample({ seed }),
      generateMixedTrigExample({ seed: seed + 1000 }),
      generateSpecialTriangleExample({ seed: seed + 2000 })
    ];
  }
};

export default SohcahtoaGenerators;