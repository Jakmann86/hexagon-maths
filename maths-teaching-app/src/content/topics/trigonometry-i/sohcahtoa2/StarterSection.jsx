// src/content/topics/trigonometry-i/sohcahtoa2/StarterSection.jsx
// SOHCAHTOA 2 Starter Section - V2.1
// Uses V2 generators directly - no manual JSX wrapping needed

import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import { sohcahtoaGenerators } from '../../../../generators/geometry/sohcahtoaGenerators';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import { symbolPuzzleGenerators } from '../../../../generators/puzzles/symbolPuzzleGenerators';

const questionGenerators = [
  // Last Lesson: SOHCAHTOA 1 - find a missing side using trig ratios
  () => {
    const { questionText, ...rest } = sohcahtoaGenerators.generateFindMissingSideTrig({ difficulty: 'easy' });
    return { question: questionText, ...rest, visualization: { ...rest.visualization, orientation: 'default' } };
  },

  // Last Week: Pythagoras - mixed (hypotenuse or missing side)
  () => {
    const gen = Math.random() > 0.5
      ? pythagorasGenerators.generateFindHypotenuse
      : pythagorasGenerators.generateFindMissingSide;
    const { questionText, ...rest } = gen({ difficulty: 'easy' });
    return { question: questionText, ...rest, visualization: { ...rest.visualization, orientation: 'default' } };
  },

  // Last Topic: Pythagoras - isosceles triangle area
  () => {
    const { questionText, ...rest } = pythagorasGenerators.generateIsoscelesArea({ difficulty: 'easy' });
    return { question: questionText, ...rest, visualization: { ...rest.visualization, orientation: 'default' } };
  },

  // Last Year: Symbol chain puzzle
  () => {
    const { puzzleDisplay, answer } = symbolPuzzleGenerators.generateChainSolvingPuzzle({ sectionType: 'starter', difficulty: 'easy' });
    return {
      question: `Find the value of ${puzzleDisplay.symbols?.[2] || 'the final symbol'}:`,
      answer,
      visualization: { type: 'symbol-puzzle', puzzleDisplay }
    };
  }
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
    lastLesson: 'SOHCAHTOA: Find the Side',
    lastWeek: 'Pythagoras: Mixed',
    lastTopic: 'Pythagoras: Isosceles Area',
    lastYear: 'Symbol Chain Puzzle'
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
