// src/content/topics/trigonometry-i/sohcahtoa2/StarterSection.jsx
import React from 'react';
import _ from 'lodash';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import IsoscelesTriangle from '../../../../components/math/shapes/triangles/IsoscelesTriangle';
import { sohcahtoaGenerators } from '../../../../generators/geometry/sohcahtoaGenerators';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import { symbolPuzzleGenerators } from '../../../../generators/puzzles/symbolPuzzleGenerators';
import SymbolPuzzleDisplay from '../../../../components/math/puzzles/SymbolPuzzleDisplay';

/**
 * Generate a SOHCAHTOA side-finding question for "Last Lesson"
 * Mixed questions using sin/cos/tan to find sides
 */
const generateSohcahtoaSideQuestion = () => {
  // 50% chance of finding a side, 50% chance of finding angle (since this is transition to angle lesson)
  const findAngle = Math.random() > 0.5;
  
  if (findAngle) {
    // Generate angle-finding question (preview of this lesson)
    const generatedQuestion = sohcahtoaGenerators.generateFindMissingAngleTrig({
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
    // Generate side-finding question (review of last lesson)
    const generatedQuestion = sohcahtoaGenerators.generateFindMissingSideTrig({
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
        <RightTriangle 
          {...generatedQuestion.visualization} 
          sectionType="starter"
          orientation="default"
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
      <IsoscelesTriangle 
        {...generatedQuestion.visualization} 
        sectionType="starter"
        orientation="default"
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
    
    // Create a special wrapper for the puzzle to signal special handling
    return {
        // Add a special flag to indicate this is a symbol puzzle
        isSymbolPuzzle: true,
        
        // Use raw text for question to prevent ContentRenderer from processing emojis
        question: puzzle.question,
        
        // Use raw text for answer
        answer: puzzle.answer,
        
        // Keep difficulty marker
        difficulty: 'puzzle',
        
        // Store the puzzle display data directly
        puzzleDisplay: puzzle.puzzleDisplay,
        
        // Create the visualization component directly
        visualization: (
            <SymbolPuzzleDisplay 
                puzzleDisplay={puzzle.puzzleDisplay}
                containerHeight="120px"
            />
        )
    };
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
        if (questionData.isSymbolPuzzle || questionData.puzzleDisplay) {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    {/* Directly render the pre-built component or create one */}
                    {React.isValidElement(questionData.visualization) 
                        ? questionData.visualization
                        : <SymbolPuzzleDisplay 
                            puzzleDisplay={questionData.puzzleDisplay}
                            containerHeight="120px"
                          />
                    }
                </div>
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