// src/content/topics/trigonometry-i/sohcahtoa1/StarterSection.jsx
// SOHCAHTOA 1 Starter Section - V2.1
// Uses V2 generators directly - no manual JSX wrapping needed

import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import { triangleGenerators } from '../../../../generators/geometry/triangleGenerators';
import { numberPuzzleGenerators } from '../../../../generators/puzzles/numberPuzzles';

const questionGenerators = [
  // Last Lesson: Pythagoras - find the hypotenuse
  () => {
    const { questionText, ...rest } = pythagorasGenerators.generateFindHypotenuse({ difficulty: 'easy', units: 'cm' });
    return { question: questionText, ...rest, visualization: { ...rest.visualization, orientation: 'default' } };
  },

  // Last Week: Pythagoras - find a missing side
  () => {
    const { questionText, ...rest } = pythagorasGenerators.generateFindMissingSide({ difficulty: 'easy', units: 'cm' });
    return { question: questionText, ...rest, visualization: { ...rest.visualization, orientation: 'default' } };
  },

  // Last Topic: Triangle - find side length from area (Geometry I)
  () => {
    const q = triangleGenerators.triangleLengthFromArea({ units: 'cm' });
    return { ...q, visualization: { ...q.visualization, orientation: 'default' } };
  },

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
    lastLesson: 'Pythagoras: Find Hypotenuse',
    lastWeek: 'Pythagoras: Find Missing Side',
    lastTopic: 'Triangle Area',
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
