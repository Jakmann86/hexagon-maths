// src/content/providers/geometry/PythagorasExamplesProvider.js
import { PythagorasGenerators } from '../../../generators/geometry/pythagorasGenerators';
import { ExamplesAdapter } from '../../../generators/adapters/examplesAdapter';

/**
 * Pythagoras Examples Content Provider
 * 
 * This module connects the Pythagoras generators and the Examples UI,
 * providing curriculum-appropriate examples and rendering logic for
 * the Pythagoras topic in the Examples section.
 */
const PythagorasExamplesProvider = {
  /**
   * Generate a standard set of examples for the Pythagoras lesson
   * Ensures one of each required type: hypotenuse, missing side, isosceles area
   * 
   * @param {Object} options - Configuration options
   * @returns {Array} Array of examples ready for the ExamplesSectionBase
   */
  generateExamples: (options = {}) => {
    // Define the required example types
    const exampleTypes = [
      {
        type: 'findHypotenuse',
        generator: PythagorasGenerators.findHypotenuse,
        title: "Finding the Hypotenuse",
        adapterOptions: { containerHeight: 300 }
      },
      {
        type: 'findMissingSide',
        generator: PythagorasGenerators.findMissingSide,
        title: "Finding a Missing Side",
        adapterOptions: { containerHeight: 300 }
      },
      {
        type: 'isoscelesArea',
        generator: PythagorasGenerators.isoscelesArea,
        title: "Finding the Area of an Isosceles Triangle",
        adapterOptions: { containerHeight: 300 }
      }
    ];

    try {
      // Generate one of each example type
      const examples = exampleTypes.map(exampleType => {
        // Generate the raw question using the appropriate generator
        const question = exampleType.generator({
          difficulty: options.difficulty || 'medium',
          sectionType: 'examples'
        });

        // Adapt the question for the Examples section
        return ExamplesAdapter.adaptQuestion(question, {
          customTitle: exampleType.title,
          ...exampleType.adapterOptions
        });
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
   * @param {Object} example - The adapted example object
   * @returns {Object} Configuration for rendering the example
   */
  getExampleContentConfig: (example) => {
    if (!example) return null;

    // Return configuration for rendering
    return {
      question: example.question,
      visualization: example.visualization,
      // Any other data needed for rendering
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
   * Useful when you need a particular kind of example
   * 
   * @param {string} type - The type of example to generate
   * @param {Object} options - Configuration options
   * @returns {Object} An adapted example ready for ExamplesSectionBase
   */
  generateSpecificExample: (type, options = {}) => {
    try {
      // Map type strings to generator functions
      const generatorMap = {
        'findHypotenuse': PythagorasGenerators.findHypotenuse,
        'findMissingSide': PythagorasGenerators.findMissingSide,
        'isoscelesArea': PythagorasGenerators.isoscelesArea
      };

      // Get the appropriate generator
      const generator = generatorMap[type];
      if (!generator) {
        console.warn(`Unknown example type: ${type}`);
        return null;
      }

      // Generate the raw question
      const question = generator({
        difficulty: options.difficulty || 'medium',
        sectionType: 'examples'
      });

      // Adapt it for the Examples section
      return ExamplesAdapter.adaptQuestion(question, options);
    } catch (error) {
      console.error("Error in generateSpecificExample:", error);
      return null;
    }
  }
};

export default PythagorasExamplesProvider;