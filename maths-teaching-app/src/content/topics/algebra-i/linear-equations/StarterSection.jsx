// src/content/topics/algebra-i/linear-equations/StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import SymbolPuzzleDisplay from '../../../../components/math/puzzles/SymbolPuzzleDisplay';
import { expressionsGenerators } from '../../../../generators/algebra/expressionsGenerator';
import SohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';
import PythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';
import * as symbolPuzzleGenerators from '../../../../generators/puzzles/symbolPuzzleGenerators';
import _ from 'lodash';

/**
 * Generate expanding double brackets question for "Last Lesson"
 * Uses the unified expressions generator for double bracket expansion
 */
const generateExpandingDoubleBracketsQuestion = () => {
  return expressionsGenerators.generateExpandingDoubleBrackets({
    sectionType: 'starter',
    difficulty: 'easy'
  });
};

/**
 * Generate mixed SOHCAHTOA question for "Last Week"
 * Mix of finding sides and angles from trigonometry
 */
const generateMixedSohcahtoaQuestion = () => {
  const questionTypes = ['findSide', 'findAngle', 'calculator'];
  const selectedType = _.sample(questionTypes);
  
  switch (selectedType) {
    case 'findSide':
      const sideQuestion = SohcahtoaGenerators.generateFindMissingSideTrig({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      return {
        question: sideQuestion.questionText || sideQuestion.question,
        answer: sideQuestion.answer,
        visualization: (
          <RightTriangle 
            {...sideQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        )
      };
      
    case 'findAngle':
      const angleQuestion = SohcahtoaGenerators.generateFindMissingAngleTrig({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      return {
        question: angleQuestion.questionText || angleQuestion.question,
        answer: angleQuestion.answer,
        visualization: (
          <RightTriangle 
            {...angleQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        )
      };
      
    case 'calculator':
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
 * Generate mixed Pythagoras question for "Last Topic"
 * Including isosceles triangle area calculations and basic Pythagoras
 */
const generateMixedPythagorasQuestion = () => {
  const questionTypes = ['hypotenuse', 'side', 'isoscelesArea'];
  const selectedType = _.sample(questionTypes);
  
  switch (selectedType) {
    case 'hypotenuse':
      const hypotenuseQuestion = PythagorasGenerators.generateFindHypotenuse({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      return {
        question: hypotenuseQuestion.questionText || hypotenuseQuestion.question,
        answer: hypotenuseQuestion.answer,
        visualization: (
          <RightTriangle 
            {...hypotenuseQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        )
      };
      
    case 'side':
      const sideQuestion = PythagorasGenerators.generateFindMissingSide({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      return {
        question: sideQuestion.questionText || sideQuestion.question,
        answer: sideQuestion.answer,
        visualization: (
          <RightTriangle 
            {...sideQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        )
      };
      
    case 'isoscelesArea':
    default:
      const isoscelesQuestion = PythagorasGenerators.generateIsoscelesArea({
        sectionType: 'starter',
        difficulty: 'easy'
      });
      
      return {
        question: isoscelesQuestion.question,
        answer: isoscelesQuestion.answer,
        visualization: isoscelesQuestion.visualization ? (
          <RightTriangle 
            {...isoscelesQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        ) : null
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
 * StarterSection component for Solving Equations with Unknown on Both Sides
 * Uses Pattern 2 architecture with unified generators
 * 
 * Progressive Structure:
 * - LL (Last Lesson): Expanding double brackets
 * - LW (Last Week): Mixed SOHCAHTOA (sides and angles)
 * - LT (Last Topic): Mixed Pythagoras (including isosceles triangles)
 * - LY (Last Year): Solve emoji symbol puzzles
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Define the question generators for each progressive level
  const questionGenerators = [
    // Last Lesson: Expanding double brackets
    generateExpandingDoubleBracketsQuestion,
    
    // Last Week: Mixed SOHCAHTOA questions (sides and angles)
    generateMixedSohcahtoaQuestion,
    
    // Last Topic: Mixed Pythagoras questions (including isosceles area)
    generateMixedPythagorasQuestion,
    
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