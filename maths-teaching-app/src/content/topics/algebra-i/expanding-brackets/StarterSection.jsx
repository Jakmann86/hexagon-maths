// src/content/topics/algebra-i/expanding-brackets/StarterSection.jsx - Updated with proper generator calls
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import SohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';
import PythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';
import { expressionsGenerators } from '../../../../generators/algebra/expressionsGenerator';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import _ from 'lodash';

/**
 * Generate a mixed SOHCAHTOA question for "Last Lesson"
 * Uses existing unified generators to create both side-finding and angle questions
 */
const generateMixedSohcahtoaQuestion = () => {
  // 70% chance of finding a side, 30% chance of calculator question
  const findSide = Math.random() > 0.3;
  
  if (findSide) {
    // Use existing unified SOHCAHTOA generator for finding missing sides
    const generatedQuestion = SohcahtoaGenerators.generateFindMissingSideTrig({
      sectionType: 'starter',
      difficulty: 'easy'
    });
    
    return {
      question: generatedQuestion.questionText || generatedQuestion.question,
      answer: generatedQuestion.answer,
      visualization: (
        <RightTriangle 
          {...generatedQuestion.visualization} 
          sectionType="starter"
          orientation="default"
        />
      )
    };
  } else {
    // Use existing unified calculator question generator
    const generatedQuestion = SohcahtoaGenerators.generateTrigCalculator({
      sectionType: 'starter'
    });
    
    return {
      question: generatedQuestion.question,
      answer: generatedQuestion.answer
    };
  }
};

/**
 * Generate a mixed Pythagoras question for "Last Week"
 * Uses existing unified generators to create both hypotenuse and side-finding questions
 */
const generateMixedPythagorasQuestion = () => {
  // Randomly decide whether to find the hypotenuse or a leg
  const findHypotenuse = Math.random() > 0.5;
  
  if (findHypotenuse) {
    const generatedQuestion = PythagorasGenerators.generateFindHypotenuse({
      sectionType: 'starter',
      difficulty: 'easy'
    });
    
    return {
      question: generatedQuestion.questionText || generatedQuestion.question,
      answer: generatedQuestion.answer,
      visualization: (
        <RightTriangle 
          {...generatedQuestion.visualization} 
          sectionType="starter"
          orientation="default"
        />
      )
    };
  } else {
    const generatedQuestion = PythagorasGenerators.generateFindMissingSide({
      sectionType: 'starter',
      difficulty: 'easy'
    });
    
    return {
      question: generatedQuestion.questionText || generatedQuestion.question,
      answer: generatedQuestion.answer,
      visualization: (
        <RightTriangle 
          {...generatedQuestion.visualization} 
          sectionType="starter"
          orientation="default"
        />
      )
    };
  }
};

/**
 * Generate an expanding single brackets question for "Last Topic"
 * Uses the unified expression generator
 */
const generateExpandingBracketsQuestion = () => {
  return expressionsGenerators.generateExpandingSingleBrackets({
    sectionType: 'starter',
    difficulty: 'easy'
  });
};

/**
 * Generate a think of a number question for "Last Year"
 * Uses the unified equation generator
 */
const generateThinkOfNumberQuestion = () => {
  return equationGenerators.generateThinkOfNumberQuestion({
    sectionType: 'starter',
    difficulty: 'easy'
  });
};

/**
 * StarterSection component for Expanding Double Brackets lesson
 * Uses Pattern 2 architecture with unified generators
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Define the question generators for each section type
  const questionGenerators = [
    // Last Lesson: Mixed SOHCAHTOA questions (sides and angles)
    generateMixedSohcahtoaQuestion,
    
    // Last Week: Mixed Pythagoras questions (hypotenuse and sides)
    generateMixedPythagorasQuestion,
    
    // Last Topic: Expanding single brackets
    generateExpandingBracketsQuestion,
    
    // Last Year: Think of a number problems
    generateThinkOfNumberQuestion
  ];

  // Custom rendering function for question visualizations
  const renderQuestionContent = (questionData, questionType) => {
    // If there's no visualization data, return null
    if (!questionData.visualization) return null;

    // If the visualization is already a React element
    if (React.isValidElement(questionData.visualization)) {
      // Default rendering for components
      return (
        <div className="w-full h-full flex items-center justify-center">
          {questionData.visualization}
        </div>
      );
    }

    return null;
  };

  return (
    <StarterSectionBase
      questionGenerators={questionGenerators}
      renderQuestionContent={renderQuestionContent}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
      className="mb-8"
    />
  );
};

export default StarterSection;