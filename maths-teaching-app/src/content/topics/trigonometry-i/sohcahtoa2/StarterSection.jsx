// src/content/topics/trigonometry-i/sohcahtoa2/StarterSection.jsx
// V2.0 - Uses SVG components for visualizations
import React from 'react';
import _ from 'lodash';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import IsoscelesTriangleSVG from '../../../../components/math/visualizations/IsoscelesTriangleSVG';
import { sohcahtoaGenerators } from '../../../../generators/geometry/sohcahtoaGenerators';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import { symbolPuzzleGenerators } from '../../../../generators/puzzles/symbolPuzzleGenerators';
import SymbolPuzzleDisplay from '../../../../components/math/puzzles/SymbolPuzzleDisplay';

/**
 * Generate a SOHCAHTOA side-finding question for "Last Lesson"
 * Only side-finding questions (students haven't learned angles yet)
 */
const generateSohcahtoaSideQuestion = () => {
  // Generate side-finding question (review of last lesson)
  const generatedQuestion = sohcahtoaGenerators.generateFindMissingSideTrig({
    sectionType: 'starter',
    difficulty: 'easy'
  });

  return {
    question: generatedQuestion.questionText || generatedQuestion.question,
    answer: generatedQuestion.answer,
    visualization: (
      <RightTriangleSVG
        config={{
          ...generatedQuestion.visualization,
          orientation: 'default' // Keep orientation consistent in starter
        }}
        showAnswer={false}
      />
    )
  };
};

/**
 * Generate a mixed Pythagoras question for "Last Week"
 * Uses existing unified generators to create both hypotenuse and side-finding questions
 */
const generateMixedPythagorasQuestion = () => {
  // Randomly decide whether to find the hypotenuse or a leg
  const findHypotenuse = Math.random() > 0.5;

  if (findHypotenuse) {
    const generatedQuestion = pythagorasGenerators.generateFindHypotenuse({
      sectionType: 'starter',
      difficulty: 'easy'
    });

    return {
      question: generatedQuestion.questionText || generatedQuestion.question,
      answer: generatedQuestion.answer,
      visualization: (
        <RightTriangleSVG
          config={{
            ...generatedQuestion.visualization,
            orientation: 'default' // Keep orientation consistent in starter
          }}
          showAnswer={false}
        />
      )
    };
  } else {
    const generatedQuestion = pythagorasGenerators.generateFindMissingSide({
      sectionType: 'starter',
      difficulty: 'easy'
    });

    return {
      question: generatedQuestion.questionText || generatedQuestion.question,
      answer: generatedQuestion.answer,
      visualization: (
        <RightTriangleSVG
          config={{
            ...generatedQuestion.visualization,
            orientation: 'default' // Keep orientation consistent in starter
          }}
          showAnswer={false}
        />
      )
    };
  }
};

/**
 * Generate isosceles triangle area question for "Last Topic"
 * Uses Pythagoras to find height, then calculates area
 */
const generateIsoscelesAreaQuestion = () => {
  const generatedQuestion = pythagorasGenerators.generateIsoscelesArea({
    sectionType: 'starter',
    difficulty: 'easy'
  });

  return {
    question: generatedQuestion.questionText || generatedQuestion.question,
    answer: generatedQuestion.answer,
    visualization: (
      <IsoscelesTriangleSVG
        config={{
          ...generatedQuestion.visualization,
          orientation: 'default' // Keep orientation consistent in starter
        }}
        showAnswer={false}
      />
    )
  };
};

/**
 * Generate a Type 2 Chain Solving symbol puzzle for "Last Year"
 * Modified to properly handle emoji rendering
 */
const generateSymbolChainPuzzle = () => {
    const puzzle = symbolPuzzleGenerators.generateChainSolvingPuzzle({
        sectionType: 'starter',
        difficulty: 'easy'
    });
    
    // Return the puzzle data directly - no need to modify question or build visualization
    return puzzle;
};

/**
 * StarterSection component for SOHCAHTOA 2 lesson (Finding Angles)
 * Uses Pattern 2 architecture with unified generators
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
    // Define the question generators for each section type
    const questionGenerators = [
        // Last Lesson: Find side using SOHCAHTOA
        generateSohcahtoaSideQuestion,

        // Last Week: Mixed Pythagoras questions (hypotenuse and sides)
        generateMixedPythagorasQuestion,

        // Last Topic: Find area of isosceles triangle using Pythagoras
        generateIsoscelesAreaQuestion,

        // Last Year: Symbol chain puzzle
        generateSymbolChainPuzzle
    ];

    // Enhanced custom rendering function for question visualizations
    const renderQuestionContent = (questionData, questionType) => {
        // Special handling for symbol puzzles
        if (questionData.isSymbolPuzzle && questionData.puzzleDisplay) {
            return (
                <SymbolPuzzleDisplay 
                    puzzleDisplay={questionData.puzzleDisplay}
                    mode="visualization"
                    containerHeight="120px"
                />
            );
        }
        
        // Standard rendering for other visualization types
        if (!questionData.visualization) return null;

        // If the visualization is already a React element (Pattern 2 conversion)
        if (React.isValidElement(questionData.visualization)) {
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
        />
    );
};

export default StarterSection;