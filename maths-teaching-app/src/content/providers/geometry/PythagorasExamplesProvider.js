// src/content/providers/geometry/PythagorasExamplesProvider.js

import * as triangleFactory from '../../../factories/triangleFactory';

// Standard container height for consistent visualization
const STANDARD_CONTAINER_HEIGHT = 250;

/**
 * PythagorasExamplesProvider - Generates example content for Pythagoras lessons
 * Updated to work with the new component architecture
 */
const PythagorasExamplesProvider = {
  /**
   * Generate a standard set of examples for the Pythagoras lesson
   * 
   * @param {Object} options - Configuration options
   * @returns {Array} Array of examples ready for the ExamplesSectionBase
   */
  generateExamples: (options = {}) => {
    // Define the required example types
    const exampleTypes = [
      {
        type: 'findHypotenuse',
        title: "Finding the Hypotenuse",
        generator: (seed) => PythagorasExamplesProvider.generateSpecificExample('findHypotenuse', { seed })
      },
      {
        type: 'findMissingSide',
        title: "Finding a Missing Side",
        generator: (seed) => PythagorasExamplesProvider.generateSpecificExample('findMissingSide', { seed })
      },
      {
        type: 'isoscelesArea',
        title: "Finding the Area of an Isosceles Triangle",
        generator: (seed) => PythagorasExamplesProvider.generateSpecificExample('isoscelesArea', { seed })
      }
    ];

    try {
      // Generate one of each example type
      const examples = exampleTypes.map((exampleType, index) => {
        // Use separate seed for each example
        const seed = (options.seed || Date.now()) + (index * 1000);
        return exampleType.generator(seed);
      });

      return examples;
    } catch (error) {
      console.error("Error in generateExamples:", error);
      // Return a fallback example if generation fails
      return [{
        title: "Pythagoras' Theorem",
        question: "Calculate the hypotenuse of a right-angled triangle with sides 3 cm and 4 cm.",
        steps: [
          { explanation: "Use Pythagoras' theorem: a² + b² = c²", formula: "3^2 + 4^2 = c^2" },
          { explanation: "Calculate: 9 + 16 = c²", formula: "25 = c^2" },
          { explanation: "Take the square root: c = 5", formula: "c = 5\\text{ cm}" }
        ]
      }];
    }
  },

  /**
   * Get configuration for rendering example content
   * 
   * @param {Object} example - The example object
   * @returns {Object} Configuration for rendering the example
   */
  getExampleContentConfig: (example) => {
    if (!example) return null;

    return {
      question: example.question,
      visualization: example.visualization
    };
  },

  /**
   * Handle special step actions for interactive elements
   * 
   * @param {Object} step - The step object that was clicked
   * @param {Object} state - Current UI state
   * @returns {Object} Updated state for UI interactivity
   */
  handleStepAction: (step, state = {}) => {
    // Clone the current state
    const newState = { ...state };

    // Process special step actions
    if (step.toggleHeight) {
      newState.showHeight = true;
    }

    if (step.toggleAngle) {
      newState.showAngles = true;
    }

    if (step.reset) {
      // Reset all toggleable states
      newState.showHeight = false;
      newState.showAngles = false;
    }

    return newState;
  },

  /**
   * Generate a specific example type
   * 
   * @param {string} type - The type of example to generate ('findHypotenuse', 'findMissingSide', etc.)
   * @param {Object} options - Configuration options
   * @returns {Object} An example ready for ExamplesSectionBase
   */
  generateSpecificExample: (type, options = {}) => {
    try {
      // Use seed for deterministic randomization
      const seed = options.seed || Date.now();
      console.log(`Generating ${type} example with seed: ${seed}`);
      
      // Generate a pseudo-random number from the seed
      const getRandom = (min, max) => {
        // Simple random function with seed
        const x = Math.sin(seed + type.length) * 10000;
        const rand = x - Math.floor(x);
        return Math.floor(rand * (max - min + 1)) + min;
      };
      
      // Select a Pythagorean triple based on the seed
      const triples = triangleFactory.PYTHAGOREAN_TRIPLES;
      const tripleIndex = getRandom(0, triples.length - 1);
      const triple = triples[tripleIndex];
      
      // Select a random orientation
      const orientations = ['default', 'rotate90', 'rotate180', 'rotate270'];
      const orientationIndex = getRandom(0, orientations.length - 1);
      const orientation = orientations[orientationIndex];
      
      // Create example based on type
      switch (type) {
        case 'findHypotenuse': {
          // Create triangle props with hypotenuse as unknown
          const [a, b, c] = triple;
          const triangleProps = triangleFactory.createPythagoreanTripleTriangle({
            triple,
            unknownSide: 'hypotenuse',
            orientation,
            sectionType: 'examples'
          });
          
          // Create solution steps
          const solution = [
            {
              explanation: "Use Pythagoras' theorem: a² + b² = c²",
              formula: "a^2 + b^2 = c^2"
            },
            {
              explanation: "Substitute the known values",
              formula: `${a}^2 + ${b}^2 = c^2`
            },
            {
              explanation: "Calculate the squares",
              formula: `${a * a} + ${b * b} = c^2`
            },
            {
              explanation: "Add the values",
              formula: `${a * a + b * b} = c^2`
            },
            {
              explanation: "Take the square root of both sides",
              formula: `c = \\sqrt{${a * a + b * b}} = ${c}`
            }
          ];
          
          // Create full example object
          return {
            title: "Finding the Hypotenuse",
            question: `Find the length of the hypotenuse in this right-angled triangle with base ${a} cm and height ${b} cm.`,
            visualization: triangleProps,
            steps: solution
          };
        }
        
        case 'findMissingSide': {
          // Determine which side to find (base or height)
          const legToFind = getRandom(0, 1) === 0 ? 'base' : 'height';
          const [a, b, c] = triple;
          
          // Create triangle props
          const triangleProps = triangleFactory.createPythagoreanTripleTriangle({
            triple,
            unknownSide: legToFind,
            orientation,
            sectionType: 'examples'
          });
          
          // Create solution steps for the appropriate leg
          const solution = [
            {
              explanation: "Use Pythagoras' theorem: a² + b² = c²",
              formula: "a^2 + b^2 = c^2"
            },
            {
              explanation: "Rearrange to find the missing side",
              formula: legToFind === 'base'
                ? `a^2 = c^2 - b^2`
                : `b^2 = c^2 - a^2`
            },
            {
              explanation: "Substitute the known values",
              formula: legToFind === 'base'
                ? `a^2 = ${c}^2 - ${b}^2`
                : `b^2 = ${c}^2 - ${a}^2`
            },
            {
              explanation: "Calculate the squares",
              formula: legToFind === 'base'
                ? `a^2 = ${c * c} - ${b * b}`
                : `b^2 = ${c * c} - ${a * a}`
            },
            {
              explanation: "Subtract the values",
              formula: legToFind === 'base'
                ? `a^2 = ${c * c - b * b}`
                : `b^2 = ${c * c - a * a}`
            },
            {
              explanation: "Take the square root of both sides",
              formula: legToFind === 'base'
                ? `a = \\sqrt{${c * c - b * b}} = ${a}`
                : `b = \\sqrt{${c * c - a * a}} = ${b}`
            }
          ];
          
          // Create question text based on what's being found
          const questionText = legToFind === 'base'
            ? `Find the length of the base in this right-angled triangle with hypotenuse ${c} cm and height ${b} cm.`
            : `Find the length of the height in this right-angled triangle with hypotenuse ${c} cm and base ${a} cm.`;
          
          // Create full example object
          return {
            title: `Finding the ${legToFind === 'base' ? 'Base' : 'Height'}`,
            question: questionText,
            visualization: triangleProps,
            steps: solution
          };
        }
        
        case 'isoscelesArea': {
          // Pre-calculated triangles with nice values
          const triangles = [
            { base: 8, height: 6, leg: 10 },    // 8-6-10 triangle 
            { base: 6, height: 8, leg: 10 },    // 6-8-10 triangle
            { base: 12, height: 5, leg: 13 },   // 12-5-13 triangle
          ];
          
          // Select a triangle configuration
          const triangleIndex = getRandom(0, triangles.length - 1);
          const triangle = triangles[triangleIndex];
          
          // Create triangle props
          const triangleProps = triangleFactory.createIsoscelesTriangle({
            base: triangle.base,
            height: triangle.height,
            showHeight: false,
            showEqualSides: true,
            orientation,
            sectionType: 'examples'
          });
          
          // Calculate the area
          const area = (triangle.base * triangle.height) / 2;
          
          // Create solution steps
          const solution = [
            {
              explanation: "For an isosceles triangle, we need to find the height using Pythagoras' theorem",
              formula: "\\text{leg}^2 = \\text{height}^2 + (\\frac{\\text{base}}{2})^2",
              toggleHeight: true
            },
            {
              explanation: "Substitute the known values",
              formula: `${triangle.leg}^2 = \\text{height}^2 + (\\frac{${triangle.base}}{2})^2`
            },
            {
              explanation: "Calculate the squared terms",
              formula: `${triangle.leg * triangle.leg} = \\text{height}^2 + ${(triangle.base / 2) * (triangle.base / 2)}`
            },
            {
              explanation: "Rearrange to find height²",
              formula: `\\text{height}^2 = ${triangle.leg * triangle.leg} - ${(triangle.base / 2) * (triangle.base / 2)} = ${triangle.height * triangle.height}`
            },
            {
              explanation: "Calculate height",
              formula: `\\text{height} = \\sqrt{${triangle.height * triangle.height}} = ${triangle.height}\\text{ cm}`
            },
            {
              explanation: "Now we can find the area using the formula",
              formula: "\\text{Area} = \\frac{1}{2} × \\text{base} × \\text{height}"
            },
            {
              explanation: "Substitute the values",
              formula: `\\text{Area} = \\frac{1}{2} × ${triangle.base} × ${triangle.height}`
            },
            {
              explanation: "Calculate the result",
              formula: `\\text{Area} = \\frac{${triangle.base * triangle.height}}{2} = ${area}\\text{ cm}^2`
            }
          ];
          
          // Create full example object
          return {
            title: "Finding the Area of an Isosceles Triangle",
            question: `Find the area of this isosceles triangle with base ${triangle.base} cm and equal sides of length ${triangle.leg} cm. (First find the height using Pythagoras' theorem, then calculate the area.)`,
            visualization: triangleProps,
            steps: solution
          };
        }
        
        default:
          throw new Error(`Unknown example type: ${type}`);
      }
    } catch (error) {
      console.error("Error generating example:", error);
      return {
        title: "Error",
        question: "There was an error generating this example.",
        steps: [{ explanation: error.message }]
      };
    }
  }
};

export default PythagorasExamplesProvider;