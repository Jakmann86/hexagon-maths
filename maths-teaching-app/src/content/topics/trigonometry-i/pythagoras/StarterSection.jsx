// src/content/topics/trigonometry-i/pythagoras/StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import ShapeDisplay from '../../../../components/math/ShapeDisplay';
import RightTriangle from '../../../../components/math/shapes/RightTriangle';
import _ from 'lodash';

/**
 * Generate a square area and perimeter question for "Last Lesson"
 */
const generateSquareAreaPerimeterQuestion = () => {
  const side = _.random(3, 8);
  const area = side * side;
  const perimeter = side * 4;

  return {
    question: `Find the area and perimeter of a square with sides ${side} cm.`,
    answer: `\\text{Area} = ${side}^2 = ${area}\\text{ cm}^2\\\\\\text{Perimeter} = 4 \\times ${side} = ${perimeter}\\text{ cm}`,
    visualization: (
      <ShapeDisplay 
        shape={{
          type: 'square',
          sideLength: side,
          showDimensions: true,
          units: 'cm',
          style: {
            fillColor: '#3498db',
            fillOpacity: 0.2
          }
        }}
      />
    )
  };
};

/**
 * Generate a triangle area question for "Last Topic"
 */
const generateTriangleAreaQuestion = () => {
  const base = _.random(4, 10);
  const height = _.random(3, 8);
  const area = (base * height) / 2;

  return {
    question: `Calculate the area of this triangle with base ${base} cm and height ${height} cm.`,
    answer: `\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height} = ${area}\\text{ cm}^2`,
    visualization: (
      <RightTriangle
        base={base}
        height={height}
        showRightAngle={true}
        labelStyle="custom"
        labels={[`${base} cm`, `${height} cm`, null]}
        units="cm"
        style={{
          fillColor: '#2ecc71',
          fillOpacity: 0.2
        }}
      />
    )
  };
};

/**
 * Static quadrilaterals question for "Last Week"
 * Fixed content rather than randomized
 */
const generateQuadrilateralsQuestion = () => {
  // Fixed content with clear definitions
  return {
    question: "Name these quadrilaterals (4-sided shapes):",
    answer: `• Square: Equal sides, all 90° angles\n• Rectangle: Opposite sides equal, all angles 90°\n• Rhombus: All sides equal, opposite angles equal\n• Parallelogram: Opposite sides parallel & equal`,
    difficulty: 'text' // Mark as text to avoid LaTeX formatting
  };
};

/**
 * Generate a number puzzle for "Last Year" with complete solution
 */
const generateNumberPuzzle = () => {
  // Start with numbers that will work for a valid solution
  let target, numbers, operations, steps;
  
  // Generate a valid puzzle by working backward from the solution
  const generateValidPuzzle = () => {
    // Pick 4 single-digit numbers
    numbers = [_.random(2, 9), _.random(2, 9), _.random(2, 9), _.random(2, 9)];
    
    // Start with the first two numbers and apply an operation
    let result1 = numbers[0] * numbers[1]; // Use multiplication as first step
    
    // Second step - addition
    let result2 = result1 + numbers[2];
    
    // Final step - use the last number to get a nice target
    // Subtraction usually gives a clean result
    target = result2 - numbers[3];
    
    // Check if target is in a good range (20-100)
    if (target < 20 || target > 100) {
      return false;
    }
    
    // Define the operations used
    operations = ['×', '+', '-'];
    
    // Define the solution steps
    steps = [
      `Step 1: ${numbers[0]} × ${numbers[1]} = ${result1}`,
      `Step 2: ${result1} + ${numbers[2]} = ${result2}`,
      `Step 3: ${result2} - ${numbers[3]} = ${target}`
    ];
    
    return true;
  };
  
  // Keep trying until we get a valid puzzle
  while (!generateValidPuzzle()) {
    // Try again until success
  }
  
  return {
    question: `Using the numbers ${numbers.join(', ')} and the operations +, -, ×, ÷, find a way to make ${target}. You can use each number only once.`,
    answer: steps.join('\n'),
    difficulty: 'puzzle'
  };
};

/**
 * StarterSection component for Pythagoras lesson
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Define the question generators for each section type
  const questionGenerators = [
    generateSquareAreaPerimeterQuestion,  // Last Lesson
    generateTriangleAreaQuestion,         // Last Topic 
    generateQuadrilateralsQuestion,       // Last Week
    generateNumberPuzzle,                 // Last Year
  ];

  return (
    <StarterSectionBase
      questionGenerators={questionGenerators}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
      className="mb-8"
    />
  );
};

export default StarterSection;