// src/generators/geometry/sohcahtoaGenerators.js
// SOHCAHTOA Trigonometry Question Generator - V2.0
// Following Generator Output Specification v2.0
//
// Question Types:
// 1. Find missing side using sin/cos/tan
// 2. Find missing angle using inverse trig
// 3. Calculator practice (evaluate sin/cos/tan)
// 4. Exact trig values (30°, 45°, 60°)
// 5. Triangle labeling (identify O/A/H) - for Diagnostic
// 6. Trig calculator question - for Diagnostic

import _ from 'lodash';

// ============================================================
// CONSTANTS
// ============================================================

// Common angles for nice numbers
const COMMON_ANGLES = [25, 30, 35, 40, 45, 50, 55, 60, 65];
const SPECIAL_ANGLES = [30, 45, 60]; // For exact values

// Exact trig values (no calculator needed)
const EXACT_VALUES = {
  30: { sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '\\frac{1}{\\sqrt{3}}', sinDecimal: 0.5, cosDecimal: 0.866, tanDecimal: 0.577 },
  45: { sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}', tan: '1', sinDecimal: 0.707, cosDecimal: 0.707, tanDecimal: 1 },
  60: { sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '\\sqrt{3}', sinDecimal: 0.866, cosDecimal: 0.5, tanDecimal: 1.732 }
};

// Triangle orientations for variety
const ORIENTATIONS = ['default', 'flip', 'rotate90', 'rotate270'];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const roundTo = (num, places = 1) => {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};

const toRadians = (degrees) => degrees * Math.PI / 180;

const getTrigValue = (func, angle) => {
  const rad = toRadians(angle);
  switch (func) {
    case 'sin': return Math.sin(rad);
    case 'cos': return Math.cos(rad);
    case 'tan': return Math.tan(rad);
    default: return 0;
  }
};

const getInverseTrigValue = (func, ratio) => {
  let radians;
  switch (func) {
    case 'sin': radians = Math.asin(ratio); break;
    case 'cos': radians = Math.acos(ratio); break;
    case 'tan': radians = Math.atan(ratio); break;
    default: radians = 0;
  }
  return radians * 180 / Math.PI;
};

const formatAnswer = (value, units) => {
  return units ? `${value} \\text{ ${units}}` : `${value}`;
};

// ============================================================
// DIAGNOSTIC GENERATORS
// ============================================================

/**
 * Generate a triangle labeling question (identify O/A/H)
 * For Diagnostic section - tests prerequisite knowledge
 */
const generateTriangleLabelingQuestion = (options = {}) => {
  const { sectionType = 'diagnostic', units = 'cm' } = options;
  
  // Generate triangle dimensions
  const base = _.random(5, 10);
  const height = _.random(4, 8);
  const hypotenuse = roundTo(Math.sqrt(base * base + height * height), 1);
  
  // Random angle position (which acute angle we're asking about)
  const angleAtBase = Math.random() > 0.5;
  const angle = angleAtBase 
    ? roundTo(Math.atan(height / base) * 180 / Math.PI, 0)
    : roundTo(Math.atan(base / height) * 180 / Math.PI, 0);
  
  // Determine which side is which relative to the marked angle
  // If angle is at base (bottom-right corner):
  //   - Opposite = height (vertical side)
  //   - Adjacent = base (horizontal side)
  //   - Hypotenuse = diagonal
  // If angle is at top:
  //   - Opposite = base
  //   - Adjacent = height
  //   - Hypotenuse = diagonal
  
  const opposite = angleAtBase ? height : base;
  const adjacent = angleAtBase ? base : height;
  
  // Randomly choose which side to ask about
  const askAbout = _.sample(['opposite', 'adjacent', 'hypotenuse']);
  const correctLength = askAbout === 'opposite' ? opposite 
                      : askAbout === 'adjacent' ? adjacent 
                      : hypotenuse;
  
  // Generate wrong options
  const wrongOptions = [opposite, adjacent, hypotenuse]
    .filter(v => v !== correctLength)
    .map(v => `${v} ${units}`);
  
  // Add a "none of these" style wrong answer
  wrongOptions.push(`${roundTo(correctLength * 1.5, 1)} ${units}`);
  
  const options_list = _.shuffle([
    `${correctLength} ${units}`,
    ...wrongOptions.slice(0, 3)
  ]);
  
  // Use letters for side labels (not values) to test understanding
  const letterSets = [['p', 'q', 'r'], ['x', 'y', 'z'], ['a', 'b', 'c']];
  const letters = _.sample(letterSets);
  
  // Assign letters to sides
  const baseLabel = letters[0];
  const heightLabel = letters[1];
  const hypotenuseLabel = letters[2];
  
  const oppositeLabel = angleAtBase ? heightLabel : baseLabel;
  const adjacentLabel = angleAtBase ? baseLabel : heightLabel;
  
  const correctAnswer = askAbout === 'opposite' ? oppositeLabel
                      : askAbout === 'adjacent' ? adjacentLabel
                      : hypotenuseLabel;
  
  return {
    questionDisplay: {
      text: `Looking at the angle marked θ, which side is the ${askAbout.toUpperCase()}?`,
      math: ''
    },
    correctAnswer: correctAnswer,
    options: _.shuffle([baseLabel, heightLabel, hypotenuseLabel, 'None']),
    explanation: askAbout === 'opposite' 
      ? `The opposite side is across from the angle θ. Here it's "${correctAnswer}".`
      : askAbout === 'adjacent'
      ? `The adjacent side is next to the angle θ (not the hypotenuse). Here it's "${correctAnswer}".`
      : `The hypotenuse is always the longest side, opposite the right angle. Here it's "${correctAnswer}".`,
    
    visualization: {
      type: 'right-triangle',
      base,
      height,
      hypotenuse,
      angle,
      showAngle: true,
      anglePosition: angleAtBase ? 'bottom-right' : 'top-left',
      unknownAngle: false,
      labels: {
        base: baseLabel,
        height: heightLabel,
        hypotenuse: hypotenuseLabel
      },
      showRightAngle: true,
      orientation: _.sample(['default', 'flip']),
      units,
      sectionType
    },
    
    metadata: {
      type: 'sohcahtoa',
      subType: 'triangle-labeling',
      askAbout,
      angleAtBase
    }
  };
};

/**
 * Generate a calculator trig question
 * For Diagnostic section - tests calculator skills
 */
const generateTrigCalculatorQuestion = (options = {}) => {
  const { sectionType = 'diagnostic' } = options;
  
  const func = _.sample(['sin', 'cos', 'tan']);
  const angle = _.sample(COMMON_ANGLES);
  const value = roundTo(getTrigValue(func, angle), 3);
  
  // Generate plausible wrong answers
  const wrongAnswers = [
    roundTo(value + 0.1, 3),
    roundTo(value - 0.1, 3),
    roundTo(1 - value, 3),
    roundTo(value * 2, 3)
  ].filter(v => v > 0 && v !== value);
  
  return {
    questionDisplay: {
      text: `Use your calculator to find:`,
      math: `${func}(${angle}°)`
    },
    correctAnswer: `${value}`,
    options: _.shuffle([`${value}`, ...wrongAnswers.slice(0, 3).map(v => `${v}`)]),
    explanation: `${func}(${angle}°) = ${value}. Make sure your calculator is in DEGREE mode.`,
    
    visualization: null, // No visualization for calculator questions
    
    metadata: {
      type: 'sohcahtoa',
      subType: 'calculator',
      trigFunc: func,
      angle,
      value
    }
  };
};

// ============================================================
// GENERATORS: FIND MISSING SIDE
// ============================================================

/**
 * Find missing side using trigonometry
 * Given angle and one side, find another side
 */
const generateFindSide = (options = {}) => {
  const { 
    difficulty = 'medium', 
    units = 'cm',
    ratio = null,
    trigRatio = null  // Alias for ratio
  } = options;
  
  // Select angle
  const angles = difficulty === 'easy' ? SPECIAL_ANGLES : COMMON_ANGLES;
  const angle = _.sample(angles);
  
  // Select trig ratio (support both 'ratio' and 'trigRatio' params)
  const chosenRatio = ratio || trigRatio || _.sample(['sin', 'cos', 'tan']);
  
  // Generate triangle dimensions
  let knownSide, unknownSide, knownSideName, unknownSideName;
  let opposite, adjacent, hypotenuse;
  
  if (chosenRatio === 'sin') {
    hypotenuse = _.random(8, 15);
    opposite = roundTo(hypotenuse * getTrigValue('sin', angle), 1);
    adjacent = roundTo(Math.sqrt(hypotenuse * hypotenuse - opposite * opposite), 1);
    
    knownSide = hypotenuse;
    unknownSide = opposite;
    knownSideName = 'hypotenuse';
    unknownSideName = 'opposite';
    
  } else if (chosenRatio === 'cos') {
    hypotenuse = _.random(8, 15);
    adjacent = roundTo(hypotenuse * getTrigValue('cos', angle), 1);
    opposite = roundTo(Math.sqrt(hypotenuse * hypotenuse - adjacent * adjacent), 1);
    
    knownSide = hypotenuse;
    unknownSide = adjacent;
    knownSideName = 'hypotenuse';
    unknownSideName = 'adjacent';
    
  } else {
    if (Math.random() > 0.5) {
      adjacent = _.random(5, 12);
      opposite = roundTo(adjacent * getTrigValue('tan', angle), 1);
      knownSide = adjacent;
      unknownSide = opposite;
      knownSideName = 'adjacent';
      unknownSideName = 'opposite';
    } else {
      opposite = _.random(5, 12);
      adjacent = roundTo(opposite / getTrigValue('tan', angle), 1);
      knownSide = opposite;
      unknownSide = adjacent;
      knownSideName = 'opposite';
      unknownSideName = 'adjacent';
    }
    hypotenuse = roundTo(Math.sqrt(opposite * opposite + adjacent * adjacent), 1);
  }
  
  const ratioFormula = chosenRatio === 'sin' 
    ? `\\sin(${angle}°) = \\frac{\\text{opposite}}{\\text{hypotenuse}}`
    : chosenRatio === 'cos'
    ? `\\cos(${angle}°) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}`
    : `\\tan(${angle}°) = \\frac{\\text{opposite}}{\\text{adjacent}}`;
  
  return {
    instruction: 'Find the missing side',
    questionMath: `\\theta = ${angle}°, \\quad \\text{${knownSideName}} = ${knownSide}`,
    questionText: `Find the ${unknownSideName} side of a right-angled triangle with angle ${angle}° and ${knownSideName} ${knownSide} ${units}.`,
    
    answer: formatAnswer(unknownSide, units),
    answerUnits: units,
    
    workingOut: `\\text{Using } ${chosenRatio.toUpperCase()}: ${ratioFormula} \\\\ ${unknownSideName} = ${knownSide} \\times ${chosenRatio}(${angle}°) = ${unknownSide}`,
    
    solution: [
      {
        explanation: `Identify what we have: angle = ${angle}°, ${knownSideName} = ${knownSide} ${units}`,
        formula: `\\theta = ${angle}°, \\quad \\text{${knownSideName}} = ${knownSide}`
      },
      {
        explanation: `Since we know the ${knownSideName} and need the ${unknownSideName}, use ${chosenRatio.toUpperCase()}`,
        formula: ratioFormula
      },
      {
        explanation: 'Rearrange to find the unknown side',
        formula: `\\text{${unknownSideName}} = \\text{${knownSideName}} \\times ${chosenRatio}(${angle}°)`
      },
      {
        explanation: 'Substitute and calculate',
        formula: `\\text{${unknownSideName}} = ${knownSide} \\times ${chosenRatio}(${angle}°) = ${unknownSide} \\text{ ${units}}`
      }
    ],
    
    visualization: {
      type: 'right-triangle',
      base: adjacent,
      height: opposite,
      hypotenuse,
      angle,
      showAngle: true,
      anglePosition: 'bottom-right',
      unknownSide: unknownSideName,
      // SOHCAHTOA: Only show the KNOWN side and the UNKNOWN side (as ?)
      // The third side is not labelled at all
      labels: (() => {
        // Determine which side is known, unknown, and unlabelled
        if (chosenRatio === 'sin') {
          // sin: O/H - show H (known), O (unknown ?), A unlabelled
          return {
            base: null, // adjacent - not used in sin
            height: '?', // opposite - unknown
            hypotenuse: `${hypotenuse} ${units}` // known
          };
        } else if (chosenRatio === 'cos') {
          // cos: A/H - show H (known), A (unknown ?), O unlabelled
          return {
            base: '?', // adjacent - unknown
            height: null, // opposite - not used in cos
            hypotenuse: `${hypotenuse} ${units}` // known
          };
        } else {
          // tan: O/A - show one of O or A (known), the other (?), H unlabelled
          if (knownSideName === 'adjacent') {
            return {
              base: `${adjacent} ${units}`, // adjacent - known
              height: '?', // opposite - unknown
              hypotenuse: null // not used in tan
            };
          } else {
            return {
              base: '?', // adjacent - unknown
              height: `${opposite} ${units}`, // opposite - known
              hypotenuse: null // not used in tan
            };
          }
        }
      })(),
      showRightAngle: true,
      orientation: _.sample(ORIENTATIONS),
      units
    },
    visualizationType: 'right-triangle',
    
    metadata: {
      type: 'sohcahtoa',
      subType: 'find-side',
      trigRatio: chosenRatio,
      difficulty,
      values: { angle, opposite, adjacent, hypotenuse, knownSide, unknownSide }
    },
    
    title: `Finding a Side using ${chosenRatio.toUpperCase()}`,
    keyRule: ratioFormula
  };
};

// Alias for backward compatibility
const generateFindMissingSideTrig = generateFindSide;

// ============================================================
// GENERATORS: FIND MISSING ANGLE
// ============================================================

/**
 * Find missing angle using inverse trigonometry
 */
const generateFindAngle = (options = {}) => {
  const { 
    difficulty = 'medium', 
    units = 'cm',
    ratio = null
  } = options;
  
  const targetAngles = difficulty === 'easy' ? [30, 45, 60] : COMMON_ANGLES;
  const targetAngle = _.sample(targetAngles);
  
  const chosenRatio = ratio || _.sample(['sin', 'cos', 'tan']);
  
  let side1, side2, side1Name, side2Name;
  let opposite, adjacent, hypotenuse;
  
  if (chosenRatio === 'sin') {
    hypotenuse = _.random(10, 15);
    opposite = roundTo(hypotenuse * getTrigValue('sin', targetAngle), 1);
    adjacent = roundTo(Math.sqrt(hypotenuse * hypotenuse - opposite * opposite), 1);
    
    side1 = opposite;
    side2 = hypotenuse;
    side1Name = 'opposite';
    side2Name = 'hypotenuse';
    
  } else if (chosenRatio === 'cos') {
    hypotenuse = _.random(10, 15);
    adjacent = roundTo(hypotenuse * getTrigValue('cos', targetAngle), 1);
    opposite = roundTo(Math.sqrt(hypotenuse * hypotenuse - adjacent * adjacent), 1);
    
    side1 = adjacent;
    side2 = hypotenuse;
    side1Name = 'adjacent';
    side2Name = 'hypotenuse';
    
  } else {
    adjacent = _.random(6, 12);
    opposite = roundTo(adjacent * getTrigValue('tan', targetAngle), 1);
    hypotenuse = roundTo(Math.sqrt(opposite * opposite + adjacent * adjacent), 1);
    
    side1 = opposite;
    side2 = adjacent;
    side1Name = 'opposite';
    side2Name = 'adjacent';
  }
  
  const inverseFunc = `${chosenRatio}^{-1}`;
  
  return {
    instruction: 'Find the angle',
    questionMath: `\\text{${side1Name}} = ${side1}, \\quad \\text{${side2Name}} = ${side2}`,
    questionText: `Find angle θ in a right-angled triangle with ${side1Name} ${side1} ${units} and ${side2Name} ${side2} ${units}.`,
    
    answer: `${targetAngle}°`,
    answerUnits: '°',
    
    workingOut: `${chosenRatio}(\\theta) = \\frac{${side1}}{${side2}} \\\\ \\theta = ${inverseFunc}\\left(\\frac{${side1}}{${side2}}\\right) = ${targetAngle}°`,
    
    solution: [
      {
        explanation: `Identify what we have: ${side1Name} = ${side1} ${units}, ${side2Name} = ${side2} ${units}`,
        formula: `\\text{${side1Name}} = ${side1}, \\quad \\text{${side2Name}} = ${side2}`
      },
      {
        explanation: `Since we know ${side1Name} and ${side2Name}, use ${chosenRatio.toUpperCase()}`,
        formula: `${chosenRatio}(\\theta) = \\frac{\\text{${side1Name}}}{\\text{${side2Name}}}`
      },
      {
        explanation: 'Substitute the values',
        formula: `${chosenRatio}(\\theta) = \\frac{${side1}}{${side2}}`
      },
      {
        explanation: `Use inverse ${chosenRatio} to find the angle`,
        formula: `\\theta = ${inverseFunc}\\left(\\frac{${side1}}{${side2}}\\right) = ${targetAngle}°`
      }
    ],
    
    visualization: {
      type: 'right-triangle',
      base: adjacent,
      height: opposite,
      hypotenuse,
      angle: targetAngle,
      showAngle: true,
      anglePosition: 'bottom-right',
      unknownAngle: true,
      labels: {
        base: `${adjacent} ${units}`,
        height: `${opposite} ${units}`,
        hypotenuse: `${hypotenuse} ${units}`
      },
      showRightAngle: true,
      orientation: _.sample(ORIENTATIONS),
      units
    },
    visualizationType: 'right-triangle',
    
    metadata: {
      type: 'sohcahtoa',
      subType: 'find-angle',
      trigRatio: chosenRatio,
      difficulty,
      values: { targetAngle, opposite, adjacent, hypotenuse }
    },
    
    title: `Finding an Angle using inverse ${chosenRatio.toUpperCase()}`,
    keyRule: `\\theta = ${inverseFunc}\\left(\\frac{\\text{${side1Name}}}{\\text{${side2Name}}}\\right)`
  };
};

// ============================================================
// GENERATORS: EXACT TRIG VALUES
// ============================================================

/**
 * Exact trig values from special triangles (30-60-90, 45-45-90)
 */
const generateExactValue = (options = {}) => {
  const { difficulty = 'medium' } = options;
  
  const angle = _.sample(SPECIAL_ANGLES);
  const func = _.sample(['sin', 'cos', 'tan']);
  const exactAnswer = EXACT_VALUES[angle][func];
  
  return {
    instruction: 'Find the exact value of',
    questionMath: `${func}(${angle}°)`,
    questionText: `Find the exact value of ${func}(${angle}°) without a calculator.`,
    
    answer: exactAnswer,
    
    solution: [
      {
        explanation: angle === 45 
          ? 'Use the 45-45-90 triangle with sides in ratio 1:1:√2'
          : 'Use the 30-60-90 triangle with sides in ratio 1:√3:2',
        formula: angle === 45 
          ? '\\text{sides: } 1, 1, \\sqrt{2}'
          : '\\text{sides: } 1, \\sqrt{3}, 2'
      },
      {
        explanation: `Apply the ${func.toUpperCase()} ratio`,
        formula: func === 'sin' 
          ? `\\sin(${angle}°) = \\frac{\\text{opposite}}{\\text{hypotenuse}}`
          : func === 'cos'
          ? `\\cos(${angle}°) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}`
          : `\\tan(${angle}°) = \\frac{\\text{opposite}}{\\text{adjacent}}`
      },
      {
        explanation: 'Substitute the values',
        formula: `${func}(${angle}°) = ${exactAnswer}`
      }
    ],
    
    metadata: {
      type: 'sohcahtoa',
      subType: 'exact-value',
      trigFunc: func,
      angle,
      exactAnswer
    },
    
    title: `Exact Value: ${func}(${angle}°)`
  };
};

// Alias for backward compatibility
const generateExactTrigValues = generateExactValue;

// ============================================================
// GENERATORS: CALCULATOR PRACTICE
// ============================================================

const generateCalculatorPractice = (options = {}) => {
  const { difficulty = 'easy' } = options;
  
  const func = _.sample(['sin', 'cos', 'tan']);
  const angle = _.sample(COMMON_ANGLES);
  const value = roundTo(getTrigValue(func, angle), 3);
  
  return {
    instruction: 'Use your calculator to find',
    questionMath: `${func}(${angle}°)`,
    questionText: `Use your calculator to find ${func}(${angle}°). Give your answer to 3 decimal places.`,
    
    answer: `${value}`,
    
    solution: [
      {
        explanation: 'Ensure your calculator is in degree mode (DEG)',
        formula: '\\text{Check: DEG not RAD}'
      },
      {
        explanation: `Enter ${func}(${angle}) on your calculator`,
        formula: `${func}(${angle}°) = ${value}`
      }
    ],
    
    metadata: {
      type: 'sohcahtoa',
      subType: 'calculator',
      trigFunc: func,
      angle,
      value
    },
    
    title: 'Calculator Practice'
  };
};

// ============================================================
// TAB/RANDOM GENERATORS
// ============================================================

const generateRandom = (options = {}) => {
  const { difficulty = 'medium', types = null } = options;
  
  const allTypes = types || (difficulty === 'easy'
    ? ['find-side', 'calculator']
    : ['find-side', 'find-angle', 'exact-value']
  );
  
  const type = _.sample(allTypes);
  
  switch (type) {
    case 'find-side': return generateFindSide({ difficulty });
    case 'find-angle': return generateFindAngle({ difficulty });
    case 'calculator': return generateCalculatorPractice({ difficulty });
    case 'exact-value': return generateExactValue({ difficulty });
    default: return generateFindSide({ difficulty });
  }
};

const generateForExamplesTab = (tabIndex, options = {}) => {
  switch (tabIndex) {
    case 1: return generateFindSide({ difficulty: 'medium', ratio: 'tan', ...options });
    case 2: return generateFindSide({ difficulty: 'medium', ...options });
    case 3: return generateFindAngle({ difficulty: 'medium', ...options });
    default: return generateRandom(options);
  }
};

// ============================================================
// ANGLE OF ELEVATION/DEPRESSION GENERATOR
// ============================================================

/**
 * Generate a real-world angle of elevation or depression problem
 *
 * @param {Object} options - Configuration options
 * @param {string} options.type - 'elevation' | 'depression' | 'random'
 * @param {string} options.difficulty - 'easy' | 'medium' | 'hard'
 * @param {string} options.units - 'm' | 'cm' | 'km'
 * @returns {Object} Question data object with real-world context
 */
const generateAngleOfElevationDepression = (options = {}) => {
  const {
    type = 'random',
    difficulty = 'medium',
    units = 'm'
  } = options;

  // Real-world scenarios
  const scenarios = {
    elevation: [
      {
        context: 'A person standing {distance} {units} from the base of a building looks up at the top.',
        object: 'building',
        heightRange: [20, 50],
        distanceRange: [30, 60]
      },
      {
        context: 'A drone is flying {height} {units} directly above a point on the ground. A photographer is standing {distance} {units} away from that point.',
        object: 'drone',
        heightRange: [60, 100],
        distanceRange: [50, 80]
      },
      {
        context: 'A ladder is placed {distance} {units} from the base of a wall and reaches {height} {units} up the wall.',
        object: 'ladder top',
        heightRange: [4, 8],
        distanceRange: [2, 4]
      },
      {
        context: 'A person is flying a kite. The horizontal distance from the person to the point directly below the kite is {distance} {units}. The kite is {height} {units} above the ground.',
        object: 'kite',
        heightRange: [30, 50],
        distanceRange: [25, 45]
      }
    ],
    depression: [
      {
        context: 'From the top of a {height} {units} tall lighthouse, a keeper spots a boat {distance} {units} from the base of the lighthouse.',
        object: 'boat',
        heightRange: [25, 40],
        distanceRange: [40, 60]
      },
      {
        context: 'A bird sits on top of a {height} {units} tall tree and looks down at a cat sitting {distance} {units} from the base of the tree.',
        object: 'cat',
        heightRange: [12, 20],
        distanceRange: [10, 18]
      },
      {
        context: 'From the top of a {height} {units} cliff, a hiker looks down at a tent {distance} {units} from the base of the cliff.',
        object: 'tent',
        heightRange: [35, 55],
        distanceRange: [40, 70]
      }
    ]
  };

  // Determine type
  const actualType = type === 'random' ? _.sample(['elevation', 'depression']) : type;
  const scenario = _.sample(scenarios[actualType]);

  // Generate dimensions based on difficulty
  let height, distance;

  if (difficulty === 'easy') {
    // Use nice numbers - multiples of 5
    height = _.random(scenario.heightRange[0], scenario.heightRange[1]);
    height = Math.round(height / 5) * 5;
    distance = _.random(scenario.distanceRange[0], scenario.distanceRange[1]);
    distance = Math.round(distance / 5) * 5;
  } else {
    // Any integer
    height = _.random(scenario.heightRange[0], scenario.heightRange[1]);
    distance = _.random(scenario.distanceRange[0], scenario.distanceRange[1]);
  }

  // Calculate the angle using inverse tan (we have opposite and adjacent)
  const angleRad = Math.atan(height / distance);
  const angle = roundTo(angleRad * 180 / Math.PI, 1);

  // Calculate ratio
  const ratio = roundTo(height / distance, 3);

  // Fill in the context string with actual values
  const contextText = scenario.context
    .replace('{height}', height)
    .replace('{distance}', distance)
    .replace(/{units}/g, units);

  // Build solution steps
  const solution = [
    {
      explanation: 'Draw a right-angled triangle with the given measurements',
      formula: actualType === 'elevation'
        ? '\\text{Angle of elevation is measured from horizontal upwards}'
        : '\\text{Angle of depression is measured from horizontal downwards}'
    },
    {
      explanation: `Identify the sides: opposite = ${height}\\text{ ${units}}, adjacent = ${distance}\\text{ ${units}}`,
      formula: '\\text{We have O and A, so use } \\tan'
    },
    {
      explanation: 'Write the tan ratio',
      formula: `\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{${height}}{${distance}}`
    },
    {
      explanation: 'Calculate the ratio',
      formula: `\\tan(\\theta) = ${ratio}`
    },
    {
      explanation: 'Apply the inverse tan function',
      formula: `\\theta = \\tan^{-1}(${ratio})`
    },
    {
      explanation: 'Calculate using a calculator (in degree mode)',
      formula: `\\theta = ${angle}°`
    }
  ];

  // Create hints
  const hints = [
    `Draw a diagram showing the ${actualType === 'elevation' ? 'upward' : 'downward'} angle`,
    `The vertical distance is ${height} ${units} and the horizontal distance is ${distance} ${units}`,
    'You have opposite and adjacent - which inverse trig function uses these?',
    'Remember to use tan⁻¹, not tan'
  ];

  return {
    type: 'angle-elevation-depression',
    title: `${actualType === 'elevation' ? 'Angle of Elevation' : 'Angle of Depression'}`,
    questionText: `${contextText}\n\nFind the angle of ${actualType}.`,
    visualization: {
      type: 'right-triangle',
      base: distance,
      height: height,
      hypotenuse: roundTo(Math.sqrt(height * height + distance * distance), 1),
      angle: angle,
      showAngle: false,
      unknownAngle: true,
      anglePosition: 'bottom-right',
      labels: {
        base: `${distance} ${units}`,
        height: `${height} ${units}`,
        angle: '?'
      },
      showRightAngle: true,
      orientation: 'default',
      units: units
    },
    answer: `${angle}°`,
    solution: solution,
    hints: hints,
    context: actualType, // 'elevation' or 'depression'
    scenario: scenario.object
  };
};

// ============================================================
// EXPORTS
// ============================================================

export const sohcahtoaGenerators = {
  // Main generators
  generateFindSide,
  generateFindMissingSideTrig, // Alias
  generateFindAngle,
  generateCalculatorPractice,
  generateExactValue,
  generateExactTrigValues, // Alias
  generateAngleOfElevationDepression,

  // Diagnostic generators
  generateTriangleLabelingQuestion,
  generateTrigCalculatorQuestion,

  // Utility generators
  generateRandom,
  generateForExamplesTab,

  // Constants
  COMMON_ANGLES,
  SPECIAL_ANGLES,
  EXACT_VALUES
};

export default sohcahtoaGenerators;