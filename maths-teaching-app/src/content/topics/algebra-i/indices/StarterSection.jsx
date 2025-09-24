// src/content/topics/algebra-i/indices/StarterSection.jsx
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
 * Generate expanding triple brackets question for "Last Week"
 * Uses the unified expressions generator for triple bracket expansion
 */
const generateExpandingTripleBracketsQuestion = () => {
  return expressionsGenerators.generateExpandingTripleBrackets({
    sectionType: 'starter',
    difficulty: 'easy'
  });
};

/**
 * Generate mixed trigonometry question for "Last Topic"
 * Weighted toward SOHCAHTOA (finding sides and angles) with less Pythagoras
 */
const generateMixedTrigonometryQuestion = () => {
  // Weighted array: more SOHCAHTOA, less Pythagoras
  const questionTypes = [
    'sohcahtoa-side',
    'sohcahtoa-side',      // Added duplicate for higher probability
    'sohcahtoa-angle',
    'sohcahtoa-angle',     // Added duplicate for higher probability
    'pythagoras-side'      // Only one Pythagoras option
  ];
  
  const selectedType = _.sample(questionTypes);
  
  switch (selectedType) {
    case 'pythagoras-side':
      // Could be hypotenuse or another side
      const pythagType = _.sample(['hypotenuse', 'side']);
      
      if (pythagType === 'hypotenuse') {
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
      } else {
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
      }
      
    case 'sohcahtoa-side':
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
      
    case 'sohcahtoa-angle':
    default:
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
  }
};

/**
 * Generate emoji symbol puzzle for "Last Year"
 * Creates simple algebraic puzzles with emoji symbols
 */
const generateSolveEmojiPuzzle = () => {
  const puzzleData = symbolPuzzleGenerators.generateSymbolPuzzle({
    difficulty: 'easy',
    sectionType: 'starter'
  });
  
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
 * StarterSection component for Negative and Fractional Indices
 * Uses Pattern 2 architecture with unified generators
 * 
 * Progressive Structure:
 * - LL (Last Lesson): Solving equations with x on both sides
 * - LW (Last Week): Expanding triple brackets
 * - LT (Last Topic): Mixed Trigonometry (Pythagoras side, SOHCAHTOA side, SOHCAHTOA angle)
 * - LY (Last Year): Solve emoji symbol puzzles
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Define the question generators for each progressive level
  const questionGenerators = [
    // Last Lesson: Solving equations with x on both sides
    generateSolvingEquationsBothSidesQuestion,
    
    // Last Week: Expanding triple brackets
    generateExpandingTripleBracketsQuestion,
    
    // Last Topic: Mixed Trigonometry (all types)
    generateMixedTrigonometryQuestion,
    
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