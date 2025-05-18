// Simplified StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import Square from '../../../../components/math/shapes/quadrilaterals/Square';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import { squareGenerators } from '../../../../generators/geometry/squareGenerators';
import { triangleGenerators } from '../../../../generators/geometry/triangleGenerators';
import { numberPuzzleGenerators } from '../../../../generators/puzzles/numberPuzzles';

/**
 * StarterSection component for Pythagoras lesson
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Create generator functions for each section type
  const questionGenerators = [
    // Last Lesson: Square area and perimeter
    () => {
      const question = squareGenerators.describeSquare({ units: 'cm' });
      // Convert config object to React element if needed
      if (question.visualization && !React.isValidElement(question.visualization)) {
        question.visualization = <Square {...question.visualization} />;
      }
      return question;
    },
    
    // Last Week: Triangle area 
    () => {
      const question = triangleGenerators.triangleArea({ units: 'cm' });
      // Convert config object to React element if needed
      if (question.visualization && !React.isValidElement(question.visualization)) {
        question.visualization = <RightTriangle {...question.visualization} />;
      }
      return question;
    },
    
    // Last Topic: Naming quadrilaterals
    () => ({
      question: "Name all the quadrilaterals (4-sided shapes):",
      answer: `• Square: Equal sides, all 90° angles
- Rectangle: Opposite sides equal, all angles 90°
- Rhombus: All sides equal, opposite angles equal
- Parallelogram: Opposite sides parallel & equal
- Trapezium/Trapezoid: Exactly one pair of parallel sides
- Kite: Two pairs of adjacent sides equal`,
      difficulty: 'text'
    }),
    
    // Last Year: Number puzzle
    () => numberPuzzleGenerators.numberPuzzle1()
  ];

  return (
    <div className="border-2 border-t-4 border-blue-500 rounded-lg shadow-md bg-white overflow-hidden">
      <StarterSectionBase
        questionGenerators={questionGenerators}
        currentTopic={currentTopic}
        currentLessonId={currentLessonId}
      />
    </div>
  );
};

export default StarterSection;