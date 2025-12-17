// src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx
// Pythagoras Examples Section - V3.0 (Thin Wrapper)
// Uses ExamplesSectionBase with topic-specific generators

import React from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import IsoscelesTriangleSVG from '../../../../components/math/visualizations/IsoscelesTriangleSVG';
import pythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';

// ============================================================
// TABS CONFIGURATION
// ============================================================

const TABS = [
  { id: 1, label: '1', title: 'Finding the Hypotenuse' },
  { id: 2, label: '2', title: 'Finding a Shorter Side' },
  { id: 3, label: '3', title: 'Isosceles Triangle Area' }
];

// ============================================================
// TEACHING NOTES (can vary by tab)
// ============================================================

const getTeachingNotes = (activeTab) => {
  const baseNotes = {
    1: {
      keyPoints: [
        'We are finding the longest side (opposite the right angle)',
        'ADD the squares of the two shorter sides',
        'Square root "undoes" the squaring at the end'
      ],
      discussionQuestions: [
        'Why can\'t we just add the two sides together?',
        'What does the ² symbol mean in the formula?',
        'Will the hypotenuse always be a nice whole number?'
      ],
      commonMisconceptions: [
        'Adding sides instead of squaring first',
        'Forgetting to square root at the end',
        'Not recognizing which side is the hypotenuse'
      ],
      extensionIdeas: [
        'Try with decimal answers for calculator practice',
        'What if both shorter sides are equal?',
        'Find a real-world example of this calculation'
      ]
    },
    2: {
      keyPoints: [
        'We need to REARRANGE the formula first',
        'SUBTRACT from the hypotenuse squared',
        'The unknown side must be shorter than the hypotenuse'
      ],
      discussionQuestions: [
        'Why do we subtract instead of add?',
        'How do you know which value to subtract?',
        'Can you check your answer by working backwards?'
      ],
      commonMisconceptions: [
        'Subtracting the wrong way round',
        'Forgetting the square root at the end',
        'Trying to add when we should subtract'
      ],
      extensionIdeas: [
        'Rearrange the formula algebraically',
        'Create your own question with a nice answer',
        'What if you\'re given the perimeter too?'
      ]
    },
    3: {
      keyPoints: [
        'The height line splits the isosceles into TWO right triangles',
        'The base is HALVED when finding the height',
        'Use area = ½ × base × height'
      ],
      discussionQuestions: [
        'Why does the height split the base exactly in half?',
        'Which two sides of the right triangle do we know?',
        'Could we find the area another way?'
      ],
      commonMisconceptions: [
        'Forgetting to halve the base',
        'Using the equal side as the height',
        'Forgetting the ½ in the area formula'
      ],
      extensionIdeas: [
        'What if the triangle was equilateral?',
        'Can you find the perimeter too?',
        'Link to area of any triangle: ½ × b × h'
      ]
    }
  };
  
  return baseNotes[activeTab] || baseNotes[1];
};

// ============================================================
// VISUALIZATION RENDERER
// ============================================================

const renderVisualization = (example, showAnswer) => {
  if (!example?.visualization) return null;
  
  const viz = example.visualization;
  
  // Isosceles triangle
  if (viz.type === 'isosceles-triangle') {
    return (
      <IsoscelesTriangleSVG 
        config={viz} 
        showAnswer={showAnswer} 
      />
    );
  }
  
  // Right triangle (default)
  return (
    <RightTriangleSVG 
      config={viz} 
      showAnswer={showAnswer} 
    />
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  return (
    <ExamplesSectionBase
      tabs={TABS}
      generateExample={pythagorasGenerators.generateForExamplesTab}
      renderVisualization={renderVisualization}
      teachingNotes={getTeachingNotes}
      subtitle="Step-by-step solutions to guide your working"
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
    />
  );
};

export default ExamplesSection;