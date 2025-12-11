// src/content/topics/test/TriangleTestStarter.jsx
// Test file - specifically tests SVG triangle rendering
// 
// Tests all triangle scenarios:
// - Last Lesson: Pythagoras - Find Hypotenuse (unknown side)
// - Last Week: Pythagoras - Find Missing Side (unknown side)
// - Last Topic: SOHCAHTOA - Find Side (with angle)
// - Last Year: SOHCAHTOA - Find Angle (unknown angle)

import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import { sohcahtoaGenerators } from '../../../../generators/geometry/sohcahtoaGenerators';

const questionGenerators = [
  // Last Lesson: Find Hypotenuse - tests unknown hypotenuse label
  () => pythagorasGenerators.generateFindHypotenuse({ difficulty: 'easy' }),
  
  // Last Week: Find Missing Side - tests unknown base/height label
  () => pythagorasGenerators.generateFindMissingSide({ difficulty: 'easy' }),
  
  // Last Topic: SOHCAHTOA Find Side - tests angle arc display
  () => sohcahtoaGenerators.generateFindSide({ difficulty: 'medium' }),
  
  // Last Year: SOHCAHTOA Find Angle - tests unknown angle
  () => sohcahtoaGenerators.generateFindAngle({ difficulty: 'medium' })
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
    lastLesson: 'Find Hypotenuse',
    lastWeek: 'Find Missing Side',
    lastTopic: 'SOHCAHTOA (Side)',
    lastYear: 'SOHCAHTOA (Angle)'
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