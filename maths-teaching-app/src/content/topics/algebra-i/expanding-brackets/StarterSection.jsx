// src/content/topics/algebra-i/expanding-brackets/StarterSection.jsx
// Updated with 3D Pythagoras questions in the Last Lesson rotation

import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import Cuboid3D from '../../../../components/math/shapes/3d/Cuboid3D';
import SohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';
import PythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';
import pythagoras3DGenerators from '../../../../generators/geometry/pythagoras3DGenerators';
import { expressionsGenerators } from '../../../../generators/algebra/expressionsGenerator';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import _ from 'lodash';

/**
 * Generate a mixed SOHCAHTOA / 3D Pythagoras question for "Last Lesson"
 * Includes: finding sides, finding angles, AND 3D diagonals
 * 
 * Distribution:
 * - 40% Find missing side (trig)
 * - 30% Find missing angle (trig)
 * - 30% 3D Pythagoras (base or space diagonal)
 */
const generateMixedSohcahtoaQuestion = () => {
  const randomChoice = Math.random();
  
  if (randomChoice > 0.6) {
    // Find missing side (40%)
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
  } else if (randomChoice > 0.3) {
    // Find missing angle (30%)
    const generatedQuestion = SohcahtoaGenerators.generateFindMissingAngleTrig({
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
    // 3D Pythagoras (30%)
    const diagonalType = Math.random() > 0.5 ? 'base' : 'space';
    const generatedQuestion = pythagoras3DGenerators.generateFind3DDiagonal({
      sectionType: 'starter',
      difficulty: 'easy',
      diagonalType
    });
    
    return {
      question: generatedQuestion.questionText || generatedQuestion.question,
      answer: generatedQuestion.answer,
      visualizationHeight: '200px', // Taller container for 3D shape
      visualization: (
        <Cuboid3D 
          {...generatedQuestion.visualization}
          style={{
            scale: 38, // Slightly larger scale for starter section
            maxHeight: '200px',
            labelSize: 18, // Larger labels for starter boxes
            vertexLabelSize: 20 // Even larger vertex labels
          }}
        />
      ),
      workingOut: generatedQuestion.workingOut
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
    // Last Lesson: Mixed SOHCAHTOA + 3D Pythagoras questions
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