// src/content/topics/algebra-ii/factorising-quadratics/StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import MagicSquareDisplay from '../../../../components/math/puzzles/MagicSquareDisplay';
import { simultaneousEquationsGenerators } from '../../../../generators/algebra/simultaneousEquationsGenerator';
import { indicesGenerators } from '../../../../generators/algebra/indicesGenerator';
import SohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';
import { magicSquareGenerators } from '../../../../generators/puzzles/magicSquareGenerators';
import _ from 'lodash';

/**
 * Generate simultaneous equations for "Last Lesson"
 * Uses the premade generator for elimination methods
 * Formats equations in KaTeX for proper display
 */
const generateSimultaneousEquationsQuestion = () => {
  // Randomly select from different simultaneous equation types
  const questionTypes = [
    'sameCoefficient',
    'withMultiplication',
    'signVariations'
  ];
  
  const selectedType = _.sample(questionTypes);
  
  let question;
  
  switch (selectedType) {
    case 'sameCoefficient':
      question = simultaneousEquationsGenerators.generateEliminationSameCoefficient({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      break;
      
    case 'withMultiplication':
      question = simultaneousEquationsGenerators.generateEliminationWithMultiplication({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      break;
      
    case 'signVariations':
    default:
      question = simultaneousEquationsGenerators.generateEliminationSignVariations({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      break;
  }
  
  // Format the equations in KaTeX using aligned environment
  // This displays them one under the other, nicely aligned
  const katexEquations = `\\begin{aligned}
${question.equation1} \\\\
${question.equation2}
\\end{aligned}`;
  
  return {
    question: katexEquations,
    answer: `x = ${question.answer.x}, y = ${question.answer.y}`,
    isKatex: true,
    fontSize: 'large'  // Match the indices question size
  };
};

/**
 * Generate fractional/negative indices for "Last Week"
 * Uses the complex indices generator
 */
const generateIndicesQuestion = () => {
  const question = indicesGenerators.generateComplexIndicesForStarter({
    difficulty: 'hard'
  });
  
  return {
    question: question.question,
    answer: question.answer,
    fontSize: 'large'
  };
};

/**
 * Generate SOHCAHTOA questions (angle or side) for "Last Topic"
 * Mix of finding missing sides and finding missing angles
 */
const generateSohcahtoaQuestion = () => {
  // 50/50 chance of finding side or angle
  const findAngle = Math.random() > 0.5;
  
  if (findAngle) {
    // Find missing angle
    const question = SohcahtoaGenerators.generateFindMissingAngleTrig({
      sectionType: 'starter',
      difficulty: 'easy'
    });
    
    return {
      question: question.questionText || question.question,
      answer: question.answer,
      visualization: question.visualization ? (
        <RightTriangle 
          {...question.visualization} 
          sectionType="starter"
          orientation="default"
        />
      ) : null
    };
  } else {
    // Find missing side
    const question = SohcahtoaGenerators.generateFindMissingSideTrig({
      sectionType: 'starter',
      difficulty: 'easy'
    });
    
    return {
      question: question.questionText || question.question,
      answer: question.answer,
      visualization: question.visualization ? (
        <RightTriangle 
          {...question.visualization} 
          sectionType="starter"
          orientation="default"
        />
      ) : null
    };
  }
};

/**
 * Generate magic square puzzle with negative numbers for "Last Year"
 */
const generateMagicSquarePuzzle = () => {
  const puzzleData = magicSquareGenerators.generateMagicSquarePuzzle({
    difficulty: 'medium'
  });
  
  return {
    question: puzzleData.question,
    answer: puzzleData.answer,
    isMagicSquare: true,
    visualization: (
      <MagicSquareDisplay 
        puzzleData={puzzleData}
        containerHeight="240px"
      />
    )
  };
};

/**
 * StarterSection component for Factorising Quadratics
 * Uses Pattern 2 architecture with unified generators
 * 
 * Progressive Structure:
 * - LL (Last Lesson): Simultaneous equations using premade generator
 * - LW (Last Week): Laws of indices (fractional/negative)
 * - LT (Last Topic): SOHCAHTOA questions (angle or side)
 * - LY (Last Year): Magic square with negative numbers
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Define the question generators for each progressive level
  const questionGenerators = [
    // Last Lesson: Simultaneous equations
    generateSimultaneousEquationsQuestion,
    
    // Last Week: Fractional/negative indices
    generateIndicesQuestion,
    
    // Last Topic: SOHCAHTOA (angles or sides)
    generateSohcahtoaQuestion,
    
    // Last Year: Magic square puzzle with negative numbers
    generateMagicSquarePuzzle
  ];

  // Custom rendering function for different question types
  const renderQuestionContent = (questionData, questionType) => {
    // Handle magic square puzzles
    if (questionData.isMagicSquare && questionData.visualization) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          {questionData.visualization}
        </div>
      );
    }
    
    // Handle triangle visualizations
    if (questionData.visualization && React.isValidElement(questionData.visualization)) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          {questionData.visualization}
        </div>
      );
    }

    // No visualization
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