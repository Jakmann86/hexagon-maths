// src/content/topics/algebra-i/simultaneous-equations/StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import SymbolPuzzleDisplay from '../../../../components/math/puzzles/SymbolPuzzleDisplay';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import { expressionsGenerators } from '../../../../generators/algebra/expressionsGenerator';
import SohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';
import PythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';
import * as symbolPuzzleGenerators from '../../../../generators/puzzles/symbolPuzzleGenerators';
import _ from 'lodash';

/**
 * Generate solving equations with x on both sides for "Last Lesson"
 * Uses the equation generator for equations like 3x + 5 = 2x + 8
 */
const generateSolvingEquationsBothSidesQuestion = () => {
  return equationGenerators.generateLinearEquationBothSidesStarter({
    sectionType: 'starter',
    difficulty: 'easy'
  });
};

/**
 * Generate expanding double brackets question for "Last Week"
 * Uses the unified expressions generator for double bracket expansion
 */
const generateExpandingDoubleBracketsQuestion = () => {
  return expressionsGenerators.generateExpandingDoubleBrackets({
    sectionType: 'starter',
    difficulty: 'easy'
  });
};

/**
 * Generate mixed Week 1 Trigonometry question for "Last Topic"
 * Combines all Week 1 content: Pythagoras, SOHCAHTOA (sides and angles)
 */
const generateMixedWeek1TrigonometryQuestion = () => {
  // All possible question types from Week 1
  const questionTypes = [
    'pythagoras-hypotenuse',
    'pythagoras-side', 
    'pythagoras-isosceles',
    'sohcahtoa-side',
    'sohcahtoa-angle',
    'trig-calculator'
  ];
  
  const selectedType = _.sample(questionTypes);
  
  switch (selectedType) {
    case 'pythagoras-hypotenuse':
      const hypQuestion = PythagorasGenerators.generateFindHypotenuse({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      return {
        question: hypQuestion.questionText || hypQuestion.question,
        answer: hypQuestion.answer,
        visualization: hypQuestion.visualization ? (
          <RightTriangle 
            {...hypQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        ) : null
      };
      
    case 'pythagoras-side':
      const sideQuestion = PythagorasGenerators.generateFindMissingSide({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      return {
        question: sideQuestion.questionText || sideQuestion.question,
        answer: sideQuestion.answer,
        visualization: sideQuestion.visualization ? (
          <RightTriangle 
            {...sideQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        ) : null
      };
      
    case 'pythagoras-isosceles':
      const isoscelesQuestion = PythagorasGenerators.generateIsoscelesAreaQuestion({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      return {
        question: isoscelesQuestion.question,
        answer: isoscelesQuestion.answer,
        visualization: isoscelesQuestion.visualization
      };
      
    case 'sohcahtoa-side':
      const trigSideQuestion = SohcahtoaGenerators.generateFindMissingSideTrig({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      return {
        question: trigSideQuestion.questionText || trigSideQuestion.question,
        answer: trigSideQuestion.answer,
        visualization: (
          <RightTriangle 
            {...trigSideQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        )
      };
      
    case 'sohcahtoa-angle':
      const trigAngleQuestion = SohcahtoaGenerators.generateFindMissingAngleTrig({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      return {
        question: trigAngleQuestion.questionText || trigAngleQuestion.question,
        answer: trigAngleQuestion.answer,
        visualization: (
          <RightTriangle 
            {...trigAngleQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        )
      };
      
    case 'trig-calculator':
    default:
      const calculatorQuestion = SohcahtoaGenerators.generateTrigCalculator({
        sectionType: 'starter'
      });
      
      return {
        question: calculatorQuestion.question,
        answer: calculatorQuestion.answer
      };
  }
};

/**
 * Generate solve emoji symbol puzzle for "Last Year"
 * Uses the symbol puzzle generators with emoji themes
 */
const generateSolveEmojiPuzzle = () => {
  const puzzleTypes = ['productSum', 'chainSolving', 'simultaneous'];
  const selectedType = _.sample(puzzleTypes);
  
  // Choose appropriate week number for emoji theme variety
  const weekNumber = _.random(1, 20);
  
  let puzzleData;
  
  switch (selectedType) {
    case 'productSum':
      puzzleData = symbolPuzzleGenerators.generateProductSumPuzzle({
        difficulty: 'easy',
        weekNumber: weekNumber,
        safeMode: false
      });
      break;
      
    case 'chainSolving':
      puzzleData = symbolPuzzleGenerators.generateChainSolvingPuzzle({
        difficulty: 'easy',
        weekNumber: weekNumber,
        safeMode: false
      });
      break;
      
    case 'simultaneous':
    default:
      puzzleData = symbolPuzzleGenerators.generateSimultaneousPuzzle({
        difficulty: 'easy',
        weekNumber: weekNumber,
        safeMode: false
      });
      break;
  }
  
  return {
    question: puzzleData.puzzleDisplay ? 
      `Solve this emoji puzzle to find the value of ${puzzleData.puzzleDisplay.targetSymbol || 'the symbols'}:` :
      'Solve this puzzle:',
    answer: puzzleData.answer,
    isSymbolPuzzle: true,
    visualization: puzzleData.puzzleDisplay ? (
      <SymbolPuzzleDisplay 
        puzzleDisplay={puzzleData.puzzleDisplay}
        mode="question"
        containerHeight="140px"
      />
    ) : null
  };
};

/**
 * StarterSection component for Simple Linear Simultaneous Equations
 * Uses Pattern 2 architecture with unified generators
 * 
 * Progressive Structure:
 * - LL (Last Lesson): Solving equations with x on both sides
 * - LW (Last Week): Expanding double brackets
 * - LT (Last Topic): Mixed Week 1 Trigonometry (Pythagoras, SOHCAHTOA, finding angles)
 * - LY (Last Year): Solve emoji symbol puzzles
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Define the question generators for each progressive level
  const questionGenerators = [
    // Last Lesson: Solving equations with x on both sides
    generateSolvingEquationsBothSidesQuestion,
    
    // Last Week: Expanding double brackets
    generateExpandingDoubleBracketsQuestion,
    
    // Last Topic: Mixed Week 1 Trigonometry (all topics from Week 1)
    generateMixedWeek1TrigonometryQuestion,
    
    // Last Year: Solve emoji symbol puzzles
    generateSolveEmojiPuzzle
  ];

  // Custom rendering function for different question types
  const renderQuestionContent = (questionData, questionType) => {
    // Handle symbol puzzles specially
    if (questionData.isSymbolPuzzle && questionData.visualization) {
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