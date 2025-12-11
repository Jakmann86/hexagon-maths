// src/content/topics/algebra-ii/quadratic-simultaneous/StarterSection.jsx
// Example StarterSection using standardised generators
// Clean, minimal - generators do all the heavy lifting

import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import { factorisingQuadraticsGenerators } from '../../../../generators/algebra/factorisingQuadraticsGenerator';
import { recurringDecimalsGenerators } from '../../../../generators/algebra/recurringDecimalsGenerator';
import { magicSquareGenerators } from '../../../../generators/puzzles/magicSquareGenerator';

// ============================================================
// TRIGONOMETRY GENERATOR (temporary - until trig generator built)
// Returns standardised format
// ============================================================

const generateTrigQuestion = () => {
  const questions = [
    {
      instruction: 'Find the exact value of',
      questionMath: '\\sin 60° \\times \\cos 30° + \\sin 30° \\times \\cos 60°',
      answer: '1',
      workingOut: '\\frac{\\sqrt{3}}{2} \\times \\frac{\\sqrt{3}}{2} + \\frac{1}{2} \\times \\frac{1}{2} = \\frac{3}{4} + \\frac{1}{4} = 1'
    },
    {
      instruction: 'Solve for',
      questionMath: '2\\sin x = \\sqrt{3}, \\quad 0° \\leq x \\leq 360°',
      answer: 'x = 60°, 120°',
      workingOut: '\\sin x = \\frac{\\sqrt{3}}{2} \\\\ x = 60° \\text{ or } x = 180° - 60° = 120°'
    },
    {
      instruction: 'Find AC given',
      questionMath: 'AB = 8, BC = 6, \\angle ABC = 60°',
      answer: '7.21',
      answerUnits: 'cm',
      workingOut: 'AC^2 = 8^2 + 6^2 - 2(8)(6)\\cos 60° = 52 \\\\ AC = \\sqrt{52} = 7.21'
    },
    {
      instruction: 'Given',
      questionMath: '\\tan x = \\frac{3}{4} \\text{ (acute)}, \\text{ find } \\sin x',
      answer: '\\frac{3}{5}',
      workingOut: '\\text{Hyp} = \\sqrt{3^2 + 4^2} = 5 \\\\ \\sin x = \\frac{3}{5}'
    }
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
};

// ============================================================
// QUESTION GENERATORS
// Each just calls the standardised generator
// ============================================================

const questionGenerators = [
  // Last Lesson: Factorising Quadratics
  () => factorisingQuadraticsGenerators.generateRandom({ 
    difficulty: 'medium',
    types: ['simple', 'difference'] 
  }),
  
  // Last Week: Recurring Decimals OR Factorising
  () => {
    const generators = [
      () => recurringDecimalsGenerators.generateSingleDigitRecurring(),
      () => recurringDecimalsGenerators.generateTwoDigitRecurring(),
      () => factorisingQuadraticsGenerators.generateSimpleQuadratic({ difficulty: 'easy' })
    ];
    return generators[Math.floor(Math.random() * generators.length)]();
  },
  
  // Last Topic: Trigonometry
  () => generateTrigQuestion(),
  
  // Last Year: Magic Square
  () => magicSquareGenerators.generateRandom({ 
    includeNegatives: false,  // Set to true for harder version
    size: 3 
  })
];

// ============================================================
// COMPONENT
// ============================================================

const StarterSection = ({ currentTopic, currentLessonId }) => {
  const sectionConfig = {
    sections: ['lastLesson', 'lastWeek', 'lastTopic', 'lastYear'],
    titles: {
      lastLesson: 'Last Lesson',
      lastWeek: 'Last Week',
      lastTopic: 'Last Topic',
      lastYear: 'Last Year'
    },
    subtitles: {
      lastLesson: 'Factorising Quadratics',
      lastWeek: 'Recurring Decimals & Factorising',
      lastTopic: 'Trigonometry',
      lastYear: 'Magic Square'
    }
  };

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