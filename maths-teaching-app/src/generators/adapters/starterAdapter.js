// src/generators/adapters/starterAdapter.js
import React from 'react';

/**
 * StarterAdapter - Converts raw questions into the format expected by StarterSectionBase
 * This adapter standardizes questions from different generators to work with the Starter UI
 */
export const StarterAdapter = {
  /**
   * Adapts a question for use in the Starter section
   * 
   * @param {Object} question - Raw question object from a generator
   * @param {Object} options - Adaptation options
   * @returns {Object} Adapted question compatible with StarterSectionBase
   */
  adaptQuestion: (question, options = {}) => {
    if (!question) {
      console.warn('Attempted to adapt a null or undefined question');
      return null;
    }

    // Merge options with defaults
    const adaptOptions = {
      enhanceVisualization: true,
      ...options
    };

    // Enhance visualization if requested
    const enhancedVisualization = adaptOptions.enhanceVisualization 
      ? enhanceVisualization(question.visualization, 'starter') 
      : question.visualization;

    // Build the adapted question
    return {
      question: question.question,
      answer: question.answer,
      visualization: enhancedVisualization,
      difficulty: question.difficulty || 'standard'
    };
  },

  /**
   * Batch adapt multiple questions
   * 
   * @param {Object} questions - Object with categorized questions (lastLesson, lastWeek, etc.)
   * @param {Object} options - Adaptation options
   * @returns {Object} Object with adapted questions
   */
  adaptQuestions: (questions, options = {}) => {
    if (!questions || typeof questions !== 'object') {
      console.warn('Expected an object of questions to adapt');
      return {};
    }

    const adapted = {};
    
    // Process each category
    for (const [category, question] of Object.entries(questions)) {
      adapted[category] = StarterAdapter.adaptQuestion(question, options);
    }
    
    return adapted;
  }
};

/**
 * Enhances a visualization component for the starter section
 * 
 * @param {React.ReactNode} visualization - Original visualization component
 * @param {string} sectionType - Section type for configuration
 * @returns {React.ReactNode} Enhanced visualization
 */
function enhanceVisualization(visualization, sectionType = 'starter') {
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
        containerHeight: 140, // Smaller height for starter section
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

export default StarterAdapter;