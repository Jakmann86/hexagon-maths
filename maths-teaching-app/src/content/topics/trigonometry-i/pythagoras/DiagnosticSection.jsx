// src/content/topics/trigonometry-i/pythagoras/DiagnosticSection.jsx
// Pythagoras Diagnostic Section - V4.0 (Thin Wrapper)
// Uses DiagnosticSectionBase with topic-specific generators

import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import SquareSVG from '../../../../components/math/visualizations/SquareSVG';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import { squareGenerators } from '../../../../generators/geometry/squareGenerators';
import pythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';

// ============================================================
// QUESTION TYPES CONFIGURATION
// ============================================================

const QUESTION_TYPES = [
  { 
    id: 'squareArea', 
    label: '1', 
    title: 'Find Square Area',
    generator: () => squareGenerators.generateSquareArea({ 
      sectionType: 'diagnostic', 
      units: 'cm' 
    })
  },
  { 
    id: 'squareRoot', 
    label: '2', 
    title: 'Find Side Length',
    generator: () => squareGenerators.generateSquareSideLength({ 
      sectionType: 'diagnostic', 
      units: 'cm' 
    })
  },
  { 
    id: 'identifyHypotenuse', 
    label: '3', 
    title: 'Identify Hypotenuse',
    generator: () => pythagorasGenerators.identifyHypotenuse()
  }
];

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  keyPoints: [
    'Square area = side × side (side²)',
    'Finding a side from area requires square root',
    'The hypotenuse is always opposite the right angle'
  ],
  discussionQuestions: [
    'Why do we need to know squares and square roots for Pythagoras?',
    'How can you quickly identify the hypotenuse?',
    'What happens if you forget to square root at the end?'
  ],
  commonMisconceptions: [
    'Confusing area with perimeter',
    'Thinking any side can be the hypotenuse',
    'Forgetting that the hypotenuse is always the longest side'
  ],
  extensionIdeas: [
    'What if the area was a decimal - can you still find the side?',
    'Can a square have an irrational side length?',
    'How would you check if a triangle is right-angled?'
  ]
};

// ============================================================
// VISUALIZATION RENDERER
// ============================================================

const renderVisualization = (question) => {
  if (!question?.visualization) return null;
  
  const viz = question.visualization;
  
  // Square visualization
  if (viz.type === 'square' || viz.sideLength !== undefined) {
    return (
      <SquareSVG
        sideLength={viz.sideLength}
        showSide={viz.showDimensions !== false && !viz.showArea}
        showArea={viz.showArea || false}
        areaLabel={viz.areaLabel}
        units={viz.units || 'cm'}
      />
    );
  }
  
  // Right triangle visualization
  if (viz.type === 'right-triangle' || viz.base !== undefined) {
    return (
      <RightTriangleSVG
        config={viz}
      />
    );
  }
  
  return null;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
  return (
    <DiagnosticSectionBase
      questionTypes={QUESTION_TYPES}
      renderVisualization={renderVisualization}
      teachingNotes={TEACHING_NOTES}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
    />
  );
};

export default DiagnosticSection;