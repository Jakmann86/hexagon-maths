// src/content/topics/trigonometry-i/pythagoras/StarterSection.jsx
// Pythagoras Starter Section - V2.1
// Uses V2 generators directly - no manual JSX wrapping needed

import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import { squareGenerators } from '../../../../generators/geometry/squareGenerators';
import { triangleGenerators } from '../../../../generators/geometry/triangleGenerators';
import { numberPuzzleGenerators } from '../../../../generators/puzzles/numberPuzzles';

const questionGenerators = [
  // Last Lesson: Square area and perimeter
  () => squareGenerators.describeSquare({ units: 'cm' }),
  
  // Last Week: Triangle area
  () => triangleGenerators.triangleArea({ 
    units: 'cm',
    sectionContext: { sectionType: 'starter' }
  }),
  
  // Last Topic: Naming quadrilaterals
  () => ({
    question: "Name all the quadrilaterals (4-sided shapes):",
    answer: "Square, Rectangle, Rhombus, Parallelogram, Trapezium, Kite",
    difficulty: 'text'
  }),
  
  // Last Year: Number puzzle
  () => numberPuzzleGenerators.numberPuzzle1()
];

const sectionConfig = {
  sections: ['lastLesson', 'lastWeek', 'lastTopic', 'lastYear'],
  titles: {
    lastLesson: 'Last Lesson',
    lastWeek: 'Last Week',
    lastTopic: 'Last Topic',
    lastYear: 'Last Year'
  },
  subtitles: {
    lastLesson: 'Square Properties',
    lastWeek: 'Triangle Area',
    lastTopic: 'Quadrilaterals',
    lastYear: 'Number Puzzle'
  }
};

const StarterSection = ({ currentTopic, currentLessonId }) => {
  return (
    <StarterSectionBase
      questionGenerators={questionGenerators}
      sectionConfig={sectionConfig}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
      className="mb-8"
    />
  );
};

export default StarterSection;