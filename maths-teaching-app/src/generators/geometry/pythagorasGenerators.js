// maths-teaching-app/src/generators/geometry/pythagorasGenerators.js


import BaseGenerator from '../core/baseGenerators';
import { 
  createPythagoreanTriangle,
  createPythagoreanTripleTriangle,
  createIsoscelesTriangle,
  PYTHAGOREAN_TRIPLES
} from '../../factories/triangleFactories';

/**
 * Common Pythagorean triple management
 */
const pythagoreanTriplesUtil = {
  // Filter triples based on difficulty
  getTriplesByDifficulty: (difficulty) => {
    switch (difficulty) {
      case 'easy':
        // Simple triples with small numbers
        return PYTHAGOREAN_TRIPLES.slice(0, 3); // e.g., [3,4,5], [5,12,13], etc.
      case 'hard':
        // More complex triples with larger numbers
        return PYTHAGOREAN_TRIPLES.slice(3);
      case 'medium':
      default:
        return PYTHAGOREAN_TRIPLES;
    }
  },

  // Select a random triple based on difficulty
  selectTriple: (difficulty = 'medium') => {
    const triples = pythagoreanTriplesUtil.getTriplesByDifficulty(difficulty);
    return BaseGenerator.random.choice(triples);
  }
};

/**
 * Generate solution steps for Pythagoras questions
 */
const generatePythagorasSolution = (triple, missingValue) => {
  const [a, b, c] = triple;
  const steps = [];

  steps.push(BaseGenerator.solution.createStep(
    "Use Pythagoras' theorem: a² + b² = c²",
    "a^2 + b^2 = c^2"
  ));

  if (missingValue === 'hypotenuse') {
    steps.push(BaseGenerator.solution.createStep(
      "Substitute the known values",
      `${a}^2 + ${b}^2 = c^2`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Calculate the squares",
      `${a * a} + ${b * b} = c^2`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Add the values",
      `${a * a + b * b} = c^2`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Take the square root of both sides",
      `c = \\sqrt{${a * a + b * b}} = ${c}`
    ));

    // Add calculator method
    steps.push(BaseGenerator.solution.createStep(
      "Quick calculator method:",
      `c = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${c}`
    ));
  } else if (missingValue === 'base') {
    steps.push(BaseGenerator.solution.createStep(
      "Substitute the known values",
      `a^2 + ${b}^2 = ${c}^2`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Rearrange to find a²",
      `a^2 = ${c}^2 - ${b}^2`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Calculate the squares",
      `a^2 = ${c * c} - ${b * b}`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Subtract the values",
      `a^2 = ${c * c - b * b}`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Take the square root of both sides",
      `a = \\sqrt{${c * c - b * b}} = ${a}`
    ));
  } else if (missingValue === 'height') {
    steps.push(BaseGenerator.solution.createStep(
      "Substitute the known values",
      `${a}^2 + b^2 = ${c}^2`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Rearrange to find b²",
      `b^2 = ${c}^2 - ${a}^2`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Calculate the squares",
      `b^2 = ${c * c} - ${a * a}`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Subtract the values",
      `b^2 = ${c * c - a * a}`
    ));

    steps.push(BaseGenerator.solution.createStep(
      "Take the square root of both sides",
      `b = \\sqrt{${c * c - a * a}} = ${b}`
    ));
  }

  return steps;
};

/**
 * Generate distractors (wrong answers) for Pythagoras problems
 */
const generatePythagorasDistractors = (correctAnswer, triple) => {
  const [a, b, c] = triple;
  const distractors = new Set();

  // Common mistake: adding instead of using Pythagoras
  distractors.add(a + b);

  // Common mistake: subtracting squares instead of adding
  distractors.add(Math.round(Math.sqrt(Math.abs(a * a - b * b))));

  // Close but incorrect values
  distractors.add(correctAnswer + BaseGenerator.random.integer(1, 2));
  distractors.add(Math.max(1, correctAnswer - BaseGenerator.random.integer(1, 2)));

  // Return array of unique distractors
  return Array.from(distractors).slice(0, 3);
};

/**
 * Core Pythagoras question generator function
 */
const generatePythagorasQuestion = (config = {}) => {
  const {
    type = 'findHypotenuse',
    difficulty = 'medium',
    units = 'cm',
    orientation = BaseGenerator.random.choice(['default', 'rotate90', 'rotate180', 'rotate270']),
    sectionType = 'examples'
  } = config;

  // Select appropriate triple based on difficulty
  const triple = config.triple || pythagoreanTriplesUtil.selectTriple(difficulty);
  const [a, b, c] = triple;

  // Determine what to ask for
  let missingValue, correctAnswer, questionText;

  if (type === 'findHypotenuse') {
    missingValue = 'hypotenuse';
    correctAnswer = c;
    questionText = `Find the length of the hypotenuse in this right-angled triangle.`;
  } else {
    // For findLeg, randomly choose which leg to find
    const legToFind = config.legToFind || BaseGenerator.random.choice(['base', 'height']);
    missingValue = legToFind;
    correctAnswer = legToFind === 'base' ? a : b;
    questionText = `Find the length of the missing side in this right-angled triangle.`;
  }

  // Generate solution steps
  const solution = generatePythagorasSolution(triple, missingValue);

  // Generate visualization using triangle factory
  const visualization = createPythagoreanTripleTriangle({
    triple,
    unknownSide: missingValue,
    orientation,
    units,
    sectionType
  });

  // Generate multiple choice options if needed
  let options = [];
  if (config.multipleChoice) {
    const distractors = generatePythagorasDistractors(correctAnswer, triple);
    options = _.shuffle([correctAnswer, ...distractors]);
  }

  // Create complete question object
  return BaseGenerator.createQuestion({
    type,
    difficulty,
    conceptKey: 'pythagoras',
    questionText,
    correctAnswer,
    options,
    visualization,
    solution,
    explanation: `Using the Pythagorean theorem: ${a}² + ${b}² = ${c}²`,
    tags: ['pythagoras', 'right-triangle', missingValue],
    curriculum: { topic: 'Trigonometry I', lesson: 'Pythagoras' }
  });
};

/**
 * Generate solution steps for triangle area problems
 */
const generateTriangleAreaSolution = (base, height, isIsosceles = true) => {
  const area = BaseGenerator.math.triangleArea(base, height);
  
  const steps = [];
  
  if (isIsosceles) {
    steps.push(BaseGenerator.solution.createStep(
      "For an isosceles triangle, we can use the formula: Area = ½ × base × height",
      "\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}"
    ));
  } else {
    steps.push(BaseGenerator.solution.createStep(
      "For a triangle, we can use the formula: Area = ½ × base × height",
      "\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}"
    ));
  }
  
  steps.push(BaseGenerator.solution.createStep(
    "Substitute the values",
    `\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height}`
  ));
  
  steps.push(BaseGenerator.solution.createStep(
    "Calculate",
    `\\text{Area} = \\frac{1}{2} \\times ${base * height} = ${area} \\text{ units}^2`
  ));
  
  return steps;
};

/**
 * Generate an isosceles triangle area question
 */
const generateIsoscelesAreaQuestion = (config = {}) => {
  const {
    difficulty = 'medium',
    units = 'cm',
    sectionType = 'examples'
  } = config;
  
  // Define ranges based on difficulty
  const diffConfig = BaseGenerator.difficulty[difficulty];
  
  // Generate appropriate dimensions
  const base = BaseGenerator.random.integer(
    diffConfig.numberRange.min,
    diffConfig.numberRange.max
  );
  
  const height = BaseGenerator.random.integer(
    diffConfig.numberRange.min,
    diffConfig.numberRange.max
  );
  
  // Calculate area
  const area = BaseGenerator.math.triangleArea(base, height);
  
  // Question text
  const questionText = `Find the area of this isosceles triangle with base ${base} ${units} and height ${height} ${units}.`;
  
  // Generate solution steps
  const solution = generateTriangleAreaSolution(base, height, true);
  
  // Create visualization using triangle factory
  // Note: You'll need to create an isosceles triangle factory similar to your other factories
  const visualization = createIsoscelesTriangle({
    base,
    height,
    units,
    sectionType
  });
  
  // Create complete question object
  return BaseGenerator.createQuestion({
    type: 'isoscelesArea',
    difficulty,
    conceptKey: 'triangleArea',
    questionText,
    correctAnswer: `${area} ${units}²`,
    visualization,
    solution,
    explanation: `Area of a triangle = ½ × base × height = ½ × ${base} × ${height} = ${area} ${units}²`,
    tags: ['area', 'isosceles', 'triangle'],
    curriculum: { topic: 'Geometry', lesson: 'Triangle Area' }
  });
};

/**
 * Export the Pythagoras question generators
 */
export const PythagorasGenerators = {
  // Core generator function
  generate: generatePythagorasQuestion,
  
  // Specialized question generators
  findHypotenuse: (config = {}) => {
    return generatePythagorasQuestion({
      type: 'findHypotenuse',
      ...config
    });
  },
  
  findMissingSide: (config = {}) => {
    return generatePythagorasQuestion({
      type: 'findLeg',
      ...config
    });
  },
  
  // Triangle area calculations
  isoscelesArea: (config = {}) => {
    return generateIsoscelesAreaQuestion(config);
  },
  
  // Utility functions
  selectTriple: pythagoreanTriplesUtil.selectTriple,
  
  // Generate a set of examples (useful for Examples section)
  generateExamples: (count = 3, config = {}) => {
    const examples = [];
    
    // Add one of each type to ensure variety
    examples.push(PythagorasGenerators.findHypotenuse({ sectionType: 'examples', ...config }));
    examples.push(PythagorasGenerators.findMissingSide({ sectionType: 'examples', ...config }));
    
    if (count > 2) {
      examples.push(PythagorasGenerators.isoscelesArea({ sectionType: 'examples', ...config }));
    }
    
    // Fill any remaining slots with random examples
    for (let i = examples.length; i < count; i++) {
      const type = BaseGenerator.random.choice(['findHypotenuse', 'findMissingSide']);
      if (type === 'findHypotenuse') {
        examples.push(PythagorasGenerators.findHypotenuse({ sectionType: 'examples', ...config }));
      } else {
        examples.push(PythagorasGenerators.findMissingSide({ sectionType: 'examples', ...config }));
      }
    }
    
    return examples;
  }
};
// Export the Pythagorean generators for use in other modules
export default PythagorasGenerators;