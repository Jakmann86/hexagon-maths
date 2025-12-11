// src/content/topics/trigonometry-i/pythagoras/StarterSection.jsx
// Pythagoras Starter - Lesson 1 of Trig I
// Uses pattern from original but with new SVG components

import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import SquareSVG from '../../../../components/math/visualizations/SquareSVG';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import { numberPuzzleGenerators } from '../../../../generators/puzzles/numberPuzzles';
import _ from 'lodash';

/**
 * Question generators for each starter box
 * Matches original Pythagoras starter content
 */
const questionGenerators = [
  // Last Lesson: Square area and perimeter
  () => {
    const side = _.random(3, 8);
    const area = side * side;
    const perimeter = side * 4;
    
    return {
      question: `Find the area and perimeter of a square with sides ${side} cm.`,
      answer: `\\text{Area} = ${side}^2 = ${area}\\text{ cm}^2\\\\\\text{Perimeter} = 4 \\times ${side} = ${perimeter}\\text{ cm}`,
      visualization: {
        type: 'square',
        sideLength: side,
        showSide: true,
        showArea: false,
        units: 'cm'
      }
    };
  },
  
  // Last Week: Triangle area
  () => {
    const base = _.random(4, 10);
    const height = _.random(3, 8);
    const area = (base * height) / 2;
    
    return {
      question: `Find the area of this right-angled triangle.`,
      answer: `\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height} = ${area}\\text{ cm}^2`,
      visualization: {
        type: 'right-triangle',
        base: base,
        height: height,
        showRightAngle: true,
        labels: {
          base: `${base} cm`,
          height: `${height} cm`,
          hypotenuse: null
        }
      }
    };
  },
  
  // Last Topic: Naming quadrilaterals
  () => ({
    question: "Name all the quadrilaterals (4-sided shapes):",
    answer: `Square, Rectangle, Rhombus, Parallelogram, Trapezium, Kite`,
    difficulty: 'text'
  }),
  
  // Last Year: Number puzzle
  () => numberPuzzleGenerators.numberPuzzle1()
];

/**
 * Section configuration
 */
const sectionConfig = {
  sections: ['lastLesson', 'lastWeek', 'lastTopic', 'lastYear'],
  titles: {
    lastLesson: 'Last Lesson',
    lastWeek: 'Last Week',
    lastTopic: 'Last Topic',
    lastYear: 'Last Year'
  },
  subtitles: {
    lastLesson: 'Squares',
    lastWeek: 'Triangle Area',
    lastTopic: 'Quadrilaterals',
    lastYear: 'Number Puzzle'
  }
};

/**
 * Custom rendering for visualizations
 */
const renderQuestionContent = (questionData, questionType) => {
  if (!questionData.visualization) return null;
  
  const viz = questionData.visualization;
  
  // Handle square visualization
  if (viz.type === 'square') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <SquareSVG
          sideLength={viz.sideLength}
          showSide={viz.showSide}
          showArea={viz.showArea}
          areaLabel={viz.areaLabel}
          units={viz.units}
          size="small"
        />
      </div>
    );
  }
  
  // Handle right triangle visualization
  if (viz.type === 'right-triangle') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <RightTriangleSVG
          config={viz}
          showAnswer={false}
        />
      </div>
    );
  }
  
  return null;
};

/**
 * StarterSection component
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  return (
    <StarterSectionBase
      questionGenerators={questionGenerators}
      renderQuestionContent={renderQuestionContent}
      sectionConfig={sectionConfig}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
      className="mb-8"
    />
  );
};

export default StarterSection;