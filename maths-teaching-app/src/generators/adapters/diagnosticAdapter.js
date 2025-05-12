// src/generators/adapters/diagnosticAdapter.js
import React from 'react';

/**
 * DiagnosticAdapter - Converts raw questions into the format expected by DiagnosticSectionBase
 * This adapter standardizes questions from different generators to work with the Diagnostic UI
 */
export const DiagnosticAdapter = {
  /**
   * Adapts a question for use in the Diagnostic section
   * 
   * @param {Object} question - Raw question object from a generator
   * @param {Object} options - Adaptation options
   * @returns {Object} Adapted question compatible with DiagnosticSectionBase
   */
  adaptQuestion: (question, options = {}) => {
    if (!question) {
      console.warn('Attempted to adapt a null or undefined question');
      return null;
    }

    // Merge options with defaults
    const adaptOptions = {
      enhanceVisualization: true,
      title: null,
      ...options
    };

    // Ensure questionDisplay exists (fallback to question or questionText)
    const questionDisplay = question.questionDisplay || question.question || question.questionText || '';
    
    // Ensure options array exists
    const options_ = Array.isArray(question.options) ? question.options : [];
    
    // Ensure correctAnswer exists
    const correctAnswer = question.correctAnswer || (options_.length > 0 ? options_[0] : '');

    // Enhance visualization if requested
    const enhancedVisualization = adaptOptions.enhanceVisualization 
      ? enhanceVisualization(question.visualization, 'diagnostic') 
      : question.visualization;

    // Build the adapted question
    return {
      questionDisplay,
      correctAnswer,
      options: options_,
      explanation: question.explanation || '',
      visualization: enhancedVisualization,
      title: adaptOptions.title || question.title
    };
  },

  /**
   * Batch adapt multiple diagnostic question generators
   * 
   * @param {Object} generators - Object with generator functions by type
   * @param {Object} options - Adaptation options
   * @returns {Object} Object with generator functions that produce adapted questions
   */
  adaptGenerators: (generators, options = {}) => {
    if (!generators || typeof generators !== 'object') {
      console.warn('Expected an object of generator functions');
      return {};
    }

    const adapted = {};
    
    // Process each generator
    for (const [type, generatorInfo] of Object.entries(generators)) {
      // Create adapted generator that wraps the original
      adapted[type] = {
        title: generatorInfo.title || type,
        generator: () => {
          // Call the original generator
          const question = generatorInfo.generator();
          
          // Adapt the result
          return DiagnosticAdapter.adaptQuestion(question, {
            ...options,
            title: generatorInfo.title
          });
        }
      };
    }
    
    return adapted;
  }
};

/**
 * Enhances a visualization component for the diagnostic section
 * 
 * @param {React.ReactNode} visualization - Original visualization component
 * @param {string} sectionType - Section type for configuration
 * @returns {React.ReactNode} Enhanced visualization
 */
function enhanceVisualization(visualization, sectionType = 'diagnostic') {
  // If no visualization, return null
  if (!visualization) return null;

  // If visualization is already a React element, enhance it
  if (React.isValidElement(visualization)) {
    // Extract component props
    const componentProps = visualization.props || {};
    
    // Set standard height if it's a shape component
    if (
      typeof visualization.type === 'function' && 
      (
        visualization.type.name?.includes('Triangle') || 
        visualization.type.name?.includes('Square') ||
        visualization.type.name?.includes('Shape')
      )
    ) {
      // Clone with consistent container height
      return React.cloneElement(visualization, {
        ...componentProps,
        containerHeight: 220, // Standard height for diagnostic section
        sectionType: sectionType,
        // Preserve any specific styling from original
        style: {
          ...(componentProps.style || {}),
          maxWidth: '100%'
        }
      });
    }
    
    // For other React elements, just return as is
    return visualization;
  }
  
  // Return the visualization as is if it's not a React element
  return visualization;
}

export default DiagnosticAdapter;