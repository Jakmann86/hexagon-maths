// src/content/topics/trigonometry-i/pythagoras/ChallengeSection.jsx
// Pythagoras Challenge Section - V4.0 (Thin Wrapper)
// Uses ChallengeSectionBase with topic-specific generator

import React from 'react';
import ChallengeSectionBase from '../../../../components/sections/ChallengeSectionBase';
import CoordinateGridSVG from '../../../../components/math/visualizations/CoordinateGridSVG';
import pythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  keyPoints: [
    'The distance formula IS Pythagoras\' Theorem!',
    'Horizontal and vertical distances form the two shorter sides',
    'The distance between points is the hypotenuse'
  ],
  discussionQuestions: [
    'Why do we draw a right triangle?',
    'What are the "legs" of this triangle?',
    'When might we need this in real life?'
  ],
  commonMisconceptions: [
    'Subtracting coordinates in wrong order (negatives)',
    'Forgetting to square the differences',
    'Adding coordinates instead of subtracting'
  ],
  extensionIdeas: [
    'What if one point was at the origin?',
    'Can you find the midpoint too?',
    '3D distance: add z² to the formula'
  ]
};

// ============================================================
// VISUALIZATION RENDERER
// ============================================================

const renderVisualization = (challenge, showAnswer) => {
  if (!challenge?.visualization) return null;
  
  return (
    <CoordinateGridSVG 
      config={{
        ...challenge.visualization,
        showRightTriangle: showAnswer
      }}
      showAnswer={showAnswer}
    />
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  return (
    <ChallengeSectionBase
      generator={pythagorasGenerators.generateCoordinateChallenge}
      renderVisualization={renderVisualization}
      teachingNotes={TEACHING_NOTES}
      title="Challenge: Coordinate Distance"
      subtitle="Apply Pythagoras' Theorem to coordinate geometry"
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
    />
  );
};

export default ChallengeSection;