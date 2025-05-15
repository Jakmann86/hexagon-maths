// src/generators/adapters/examplesAdapter.js
import React from 'react';

/**
 * ExamplesAdapter - Converts raw questions into the format expected by ExamplesSectionBase
 * Updated to preserve triangle sizes and avoid unwanted enhancements
 */
export const ExamplesAdapter = {
  /**
   * Adapts a question for use in the Examples section
   * 
   * @param {Object} question - Raw question object from a generator
   * @param {Object} options - Adaptation options
   * @returns {Object} Adapted question compatible with ExamplesSectionBase
   */
  adaptQuestion: (question, options = {}) => {
    if (!question) {
      console.warn('Attempted to adapt a null or undefined question');
      return null;
    }

    // Merge options with defaults
    const adaptOptions = {
      customTitle: null,
      containerHeight: 250,
      enhanceVisualization: false, // Default changed to FALSE to preserve sizes
      ...options
    };

    // Create standardized steps from question's solution or steps property
    const standardizedSteps = question.solution || question.steps || [];

    // Enhance visualization ONLY if explicitly requested
    // This prevents unwanted modification of the visualization
    const visualization = adaptOptions.enhanceVisualization 
      ? enhanceVisualization(question.visualization, adaptOptions) 
      : question.visualization;

    // Build the adapted example
    return {
      title: adaptOptions.customTitle || question.title || 'Worked Example',
      question: question.questionText || question.problemText || question.question || '',
      visualization: visualization,
      steps: standardizedSteps.map(step => {
        // Standardize step format
        return {
          explanation: step.explanation || step.text || '',
          formula: step.formula || step.math || '',
          // Pass through any special properties for interactive examples
          ...step
        };
      })
    };
  },

  /**
   * Batch adapt multiple questions
   * 
   * @param {Array} questions - Array of raw questions
   * @param {Object} options - Adaptation options
   * @returns {Array} Array of adapted questions
   */
  adaptQuestions: (questions, options = {}) => {
    if (!Array.isArray(questions)) {
      console.warn('Expected an array of questions to adapt');
      return [];
    }

    return questions.map(question => 
      ExamplesAdapter.adaptQuestion(question, options)
    );
  }
};

/**
 * Enhances a visualization component with standard properties and wrapper
 * Only used when enhanceVisualization option is true
 * 
 * @param {React.ReactNode} visualization - Original visualization component
 * @param {Object} options - Enhancement options
 * @returns {React.ReactNode} Enhanced visualization
 */
const enhanceVisualization = (visualization, options = {}) => {
  // If no visualization, return null
  if (!visualization) return null;

  // If visualization is already a React element, consider enhancing it
  if (React.isValidElement(visualization)) {
    // Extract component props
    const componentProps = visualization.props || {};
    
    // Set standard height if it's a shape component and a height is specified
    if (
      typeof visualization.type === 'function' && 
      (
        visualization.type.name?.includes('Triangle') || 
        visualization.type.name?.includes('Square') ||
        visualization.type.name?.includes('Shape')
      ) &&
      options.containerHeight
    ) {
      // Clone with container height but preserve all other props
      // This ensures dimensions and other educational parameters are kept
      return React.cloneElement(visualization, {
        ...componentProps,
        containerHeight: options.containerHeight,
        // Don't override any specific styling from original
        style: componentProps.style || {}
      });
    }
    
    // For other React elements, just return as is
    return visualization;
  }
  
  // Return the visualization as is if it's not a React element
  return visualization;
};

export default ExamplesAdapter;