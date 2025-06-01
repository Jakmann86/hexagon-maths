// src/content/topics/trigonometry-i/pythagoras/StarterSection.jsx
import React from 'react';
import _ from 'lodash';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import Square from '../../../../components/math/shapes/quadrilaterals/Square';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import { squareGenerators } from '../../../../generators/geometry/squareGenerators';
import { triangleGenerators } from '../../../../generators/geometry/triangleGenerators';
import { numberPuzzleGenerators } from '../../../../generators/puzzles/numberPuzzles';

/**
 * StarterSection component for Pythagoras lesson
 * Uses Pattern 2 architecture:
 * 1. Generators produce configuration objects
 * 2. Section converts configurations to components
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Create generator functions for each section type
  const questionGenerators = [
    // Last Lesson: Square area and perimeter
    () => {
      // Get configuration from generator
      const question = squareGenerators.describeSquare({ units: 'cm' });

      // Force default orientation for starter consistency + clean positioning
      question.visualization = (
        <Square
          {...question.visualization}
          sectionType="starter"
          orientation="default"  // ← Force default for starters
        />
      );

      return question;
    },

    // Last Week: Triangle area 
    () => {
      // Get configuration from generator with starter context
      const question = triangleGenerators.triangleArea({
        units: 'cm',
        sectionContext: { sectionType: 'starter' }  // Pass starter context
      });

      // Force default orientation for starter consistency + clean positioning
      question.visualization = (
        <RightTriangle
          {...question.visualization}
          sectionType="starter"
          orientation="default"  // ← Force default for starters
        />
      );

      return question;
    },

    // Last Topic: Naming quadrilaterals
    () => ({
      question: "Name all the quadrilaterals (4-sided shapes):",
      answer: `Square: Equal sides, all 90° angles
Rectangle: Opposite sides equal, all angles 90°
Rhombus: All sides equal, opposite angles equal
Parallelogram: Opposite sides parallel & equal
Trapezium/Trapezoid: Exactly one pair of parallel sides
Kite: Two pairs of adjacent sides equal`,
      difficulty: 'text'
    }),

    // Last Year: Number puzzle
    () => numberPuzzleGenerators.numberPuzzle1()
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
    />
  );
};

export default StarterSection;