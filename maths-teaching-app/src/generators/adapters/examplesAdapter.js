// maths-teaching-app/src/generators/adapters/examplesAdapter.js

/**
 * Examples Adapter
 * 
 * This adapter transforms question objects from concept generators
 * into formats optimized for the Examples section UI. It enhances
 * question objects with section-specific properties and formatting.
 */

/**
 * Adapt a question for the Examples section display
 * 
 * @param {Object} question - The question object from a concept generator
 * @param {Object} options - Additional configuration options
 * @returns {Object} A question object formatted for the Examples section
 */
export const adaptForExamples = (question, options = {}) => {
  // Extract core properties from the question
  const {
    type,
    conceptKey,
    questionText,
    correctAnswer,
    visualization,
    solution = [],
    difficulty = 'medium',
    curriculum = {}
  } = question;
  
  // Set defaults for configurations
  const {
    containerHeight = 300,       // Larger visualization for examples
    stepDelay = 500,             // Millisecond delay between steps (if animated)
    includeHints = true,         // Whether to include hints in steps
    customTitle = null,          // Optional custom title
    autoShowSteps = false        // Whether to automatically advance through steps
  } = options;
  
  // Generate a title based on question type if not provided
  const title = customTitle || generateTitleFromType(type, conceptKey);
  
  // Process solution steps for stepped navigation
  const processedSteps = processSolutionSteps(solution, includeHints);
  
  // Configure visualization with example-specific styling
  const enhancedVisualization = enhanceVisualization(visualization, {
    containerHeight,
    sectionType: 'examples'
  });
  
  // Return the adapted example object
  return {
    title,
    question: questionText,
    visualization: enhancedVisualization,
    steps: processedSteps,
    correctAnswer,
    type,
    difficulty,
    conceptKey,
    curriculum,
    stepDelay,
    autoShowSteps
  };
};

/**
 * Generate a human-readable title based on question type
 */
const generateTitleFromType = (type, conceptKey) => {
  // Default titles based on common types
  const typeTitles = {
    findHypotenuse: "Finding the Hypotenuse",
    findLeg: "Finding a Missing Side",
    findMissingSide: "Finding a Missing Side",
    isoscelesArea: "Finding the Area of an Isosceles Triangle",
    triangleArea: "Finding Triangle Area",
    squareArea: "Finding Square Area",
    squarePerimeter: "Finding Square Perimeter"
  };
  
  // Concept-specific title mapping for more specific titles
  const conceptTitles = {
    pythagoras: {
      findHypotenuse: "Using Pythagoras' Theorem to Find the Hypotenuse",
      findLeg: "Using Pythagoras' Theorem to Find a Missing Side"
    },
    triangleArea: {
      isoscelesArea: "Finding the Area of an Isosceles Triangle",
      rightTriangleArea: "Finding the Area of a Right Triangle"
    }
  };
  
  // Try to get the most specific title possible
  if (conceptKey && conceptTitles[conceptKey] && conceptTitles[conceptKey][type]) {
    return conceptTitles[conceptKey][type];
  }
  
  return typeTitles[type] || "Worked Example";
};

/**
 * Process solution steps to ensure they have consistent structure
 * and appropriate properties for the Examples section UI
 */
const processSolutionSteps = (steps, includeHints) => {
  if (!steps || !Array.isArray(steps)) {
    return [];
  }
  
  return steps.map((step, index) => {
    // Handle string steps or steps with minimal properties
    if (typeof step === 'string') {
      return { explanation: step };
    }
    
    // Extract step properties
    const { explanation, formula, toggleHeight, toggleAngle, reset, hint } = step;
    
    // Create a processed step with consistent structure
    const processedStep = {
      explanation,
      formula,
      toggleHeight,
      toggleAngle,
      reset,
      // Only include hints if explicitly requested
      hint: includeHints ? hint : undefined
    };
    
    // Add step number for reference
    processedStep.stepNumber = index + 1;
    
    // Add "final step" flag for UI treatment
    if (index === steps.length - 1) {
      processedStep.isFinalStep = true;
    }
    
    return processedStep;
  });
};

/**
 * Enhance the visualization for the Examples section
 */
const enhanceVisualization = (visualization, options = {}) => {
  if (!visualization) return null;

  // For JSX Elements, clone with new props
  if (React.isValidElement(visualization)) {
    // Extract existing props
    const existingProps = visualization.props || {};
    
    // Create new props by merging existing with section-specific ones
    const newProps = {
      ...existingProps,
      containerHeight: options.containerHeight || existingProps.containerHeight || 300,
      sectionType: options.sectionType || existingProps.sectionType || 'examples'
    };
    
    // Clone the element with the new props
    return React.cloneElement(visualization, newProps);
  }
  
  // For non-JSX visualizations (like configuration objects)
  return {
    ...visualization,
    containerHeight: options.containerHeight || visualization.containerHeight || 300,
    sectionType: options.sectionType || visualization.sectionType || 'examples'
  };
};

/**
 * Generate a set of examples for a specific concept
 * 
 * @param {Function} generatorFunction - Function that generates question objects
 * @param {number} count - Number of examples to generate
 * @param {Object} options - Options for both generator and adapter
 * @returns {Array} Array of adapted examples
 */
export const generateExamplesSet = (generatorFunction, count = 3, options = {}) => {
  // Extract options for generator and adapter
  const { generatorOptions = {}, adapterOptions = {} } = options;
  
  // Generate the raw questions using the provided generator function
  const questions = Array(count).fill().map(() => 
    generatorFunction({
      ...generatorOptions,
      sectionType: 'examples'
    })
  );
  
  // Adapt each question for the Examples section
  return questions.map(question => 
    adaptForExamples(question, adapterOptions)
  );
};

/**
 * Export a unified interface for the Examples adapter
 */
export const ExamplesAdapter = {
  adaptQuestion: adaptForExamples,
  generateSet: generateExamplesSet
};

export default ExamplesAdapter;