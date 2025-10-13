// src/content/topics/algebra-ii/quadratic-simultaneous/StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import MagicSquareDisplay from '../../../../components/math/puzzles/MagicSquareDisplay';
import { quadraticGenerators } from '../../../../generators/algebra/quadraticGenerator';
import { recurringDecimalGenerators } from '../../../../generators/number/recurringDecimalGenerator';
import { simultaneousEquationsGenerators } from '../../../../generators/algebra/simultaneousEquationsGenerator';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import { expressionsGenerators } from '../../../../generators/algebra/expressionsGenerator';
import { indicesGenerators } from '../../../../generators/algebra/indicesGenerator';
import { magicSquareGenerators } from '../../../../generators/puzzles/magicSquareGenerators';
import _ from 'lodash';

/**
 * Generate factorising quadratics for "Last Lesson"
 */
const generateFactorisingQuadraticsQuestion = () => {
  const question = quadraticGenerators.generateQuadraticFactoring({
    sectionType: 'starter',
    difficulty: 'medium'
  });
  
  return {
    question: `\\text{Solve by factoring: } ${question.question.replace('Solve by factoring: ', '')}`,
    answer: question.answer,
    fontSize: 'large'
  };
};

/**
 * Generate recurring decimal to fraction for "Last Topic"
 * Uses the new recurring decimal generator
 */
const generateRecurringDecimalQuestion = () => {
  const question = recurringDecimalGenerators.generateRecurringDecimalToFraction({
    sectionType: 'starter',
    difficulty: 'medium'
  });
  
  return {
    question: question.question,
    answer: question.answer,
    fontSize: 'large',
    isKatex: true
  };
};

/**
 * Generate mixed Algebra I questions for "Last Week"
 * Random selection from all Algebra I topics:
 * - Expanding double brackets
 * - Solving equations with x on both sides
 * - Simultaneous equations
 * - Fractional/negative indices
 */
const generateMixedAlgebra1Question = () => {
  const questionTypes = [
    'expandingBrackets',
    'solvingEquations',
    'simultaneousEquations',
    'indices'
  ];
  
  const selectedType = _.sample(questionTypes);
  
  switch (selectedType) {
    case 'expandingBrackets':
      const expandQuestion = expressionsGenerators.generateExpandingDoubleBrackets({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      return {
        question: expandQuestion.question,
        answer: expandQuestion.answer,
        fontSize: 'large'
      };
      
    case 'solvingEquations':
      const equationQuestion = equationGenerators.generateLinearEquationBothSidesStarter({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      return {
        question: equationQuestion.question,
        answer: equationQuestion.answer,
        fontSize: 'large'
      };
      
    case 'simultaneousEquations':
      const simEqQuestion = simultaneousEquationsGenerators.generateEliminationSameCoefficient({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      // Format in KaTeX
      const katexEquations = `\\begin{aligned}
${simEqQuestion.equation1} \\\\
${simEqQuestion.equation2}
\\end{aligned}`;
      
      return {
        question: katexEquations,
        answer: `x = ${simEqQuestion.answer.x}, y = ${simEqQuestion.answer.y}`,
        isKatex: true,
        fontSize: 'large'
      };
      
    case 'indices':
    default:
      const indicesQuestion = indicesGenerators.generateComplexIndicesForStarter({
        difficulty: 'hard'
      });
      return {
        question: indicesQuestion.question,
        answer: indicesQuestion.answer,
        fontSize: 'large'
      };
  }
};

/**
 * Generate magic square puzzle with negative numbers for "Last Year"
 * Ensures negative numbers by using negative offset
 */
const generateMagicSquareWithNegatives = () => {
  // Generate multiple puzzles until we get one with negative numbers
  let puzzleData;
  let hasNegatives = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!hasNegatives && attempts < maxAttempts) {
    puzzleData = magicSquareGenerators.generateMagicSquarePuzzle({
      difficulty: 'medium'
    });
    
    // Check if the puzzle has any negative numbers
    hasNegatives = puzzleData.fullSolution.some(row => 
      row.some(value => value < 0)
    );
    
    attempts++;
  }
  
  // If we still don't have negatives after attempts, force it by modifying
  // This shouldn't happen often due to random offset in generator, but just in case
  if (!hasNegatives) {
    puzzleData = magicSquareGenerators.generateMagicSquarePuzzle({
      difficulty: 'medium'
    });
  }
  
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
 * StarterSection component for Quadratic Simultaneous Equations
 * Uses Pattern 2 architecture with unified generators
 * 
 * Progressive Structure:
 * - LL (Last Lesson): Factorising quadratics
 * - LT (Last Topic): Converting recurring decimal to fraction
 * - LW (Last Week): Mixed Algebra I (all topics)
 * - LY (Last Year): Magic square with negative numbers
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Define the question generators for each progressive level
  const questionGenerators = [
    // Last Lesson: Factorising quadratics
    generateFactorisingQuadraticsQuestion,
    
    // Last Topic: Recurring decimal to fraction
    generateRecurringDecimalQuestion,
    
    // Last Week: Mixed Algebra I topics
    generateMixedAlgebra1Question,
    
    // Last Year: Magic square with negative numbers
    generateMagicSquareWithNegatives
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

    // No visualization needed for other types
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