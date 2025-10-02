// src/content/topics/algebra-ii/recurring-decimals/StarterSection.jsx
import React from 'react';
import _ from 'lodash';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import MagicSquareDisplay from '../../../../components/math/puzzles/MagicSquareDisplay';
import { indicesGenerators } from '../../../../generators/algebra/indicesGenerator';
import { expressionsGenerators } from '../../../../generators/algebra/expressionsGenerator';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import PythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';
import SohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';
import { magicSquareGenerators } from '../../../../generators/puzzles/magicSquareGenerators';

/**
 * Generate complex indices question for "Last Lesson"
 * Difficult fractional powers with algebra, coefficients, and negative fractional powers
 */
const generateComplexIndicesQuestion = () => {
  return indicesGenerators.generateComplexIndicesForStarter({
    difficulty: 'hard'
  });
};

/**
 * Generate mixed Week 2 Algebra question for "Last Week"
 * Randomly selects from existing generators - NO wrapper needed
 */
const generateMixedWeek2AlgebraQuestion = () => {
  const generators = [
    // Expanding double brackets
    () => expressionsGenerators.generateExpandingDoubleBrackets({
      sectionType: 'starter',
      difficulty: 'easy'
    }),
    
    // Expanding triple brackets
    () => expressionsGenerators.generateExpandingTripleBrackets({
      sectionType: 'starter',
      difficulty: 'easy'
    }),
    
    // Solving equations with x on both sides
    () => equationGenerators.generateLinearEquationBothSidesStarter({
      sectionType: 'starter',
      difficulty: 'easy'
    })
  ];
  
  // Randomly pick one and execute it
  const selectedGenerator = _.sample(generators);
  return selectedGenerator();
};

/**
 * Generate no-calculator trig question for "Last Topic"
 * Uses Pythagorean triples only - no calculator needed
 */
const generateNoCalculatorTrigQuestion = () => {
  // Randomly choose between Pythagoras or SOHCAHTOA
  const questionTypes = ['pythagoras', 'sohcahtoa'];
  const selectedType = _.sample(questionTypes);
  
  if (selectedType === 'pythagoras') {
    // Use Pythagorean triple questions (3-4-5, 5-12-13, etc.)
    const questionType = _.sample(['hypotenuse', 'side']);
    
    if (questionType === 'hypotenuse') {
      const question = PythagorasGenerators.generateFindHypotenuse({
        sectionType: 'starter',
        difficulty: 'easy',
        usePythagoreanTriples: true // Ensure no calculator needed
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
      const question = PythagorasGenerators.generateFindMissingSide({
        sectionType: 'starter',
        difficulty: 'easy',
        usePythagoreanTriples: true
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
  } else {
    // SOHCAHTOA with nice values (no decimals)
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
 * Generate magic square puzzle for "Last Year"
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
 * StarterSection component for Converting Recurring Decimals to Fractions
 * 
 * Progressive Structure:
 * - LL (Last Lesson): Complex indices with fractional/negative powers
 * - LW (Last Week): Mixed Week 2 Algebra (expanding brackets, equations)
 * - LT (Last Topic): No-calculator Trig (Pythagorean triples only)
 * - LY (Last Year): Magic Square puzzle
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Define the question generators for each progressive level
  const questionGenerators = [
    // Last Lesson: Complex indices
    generateComplexIndicesQuestion,
    
    // Last Week: Mixed Week 2 Algebra (random selection in the function)
    generateMixedWeek2AlgebraQuestion,
    
    // Last Topic: No-calculator Trig (Pythagorean triples)
    generateNoCalculatorTrigQuestion,
    
    // Last Year: Magic Square puzzle
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