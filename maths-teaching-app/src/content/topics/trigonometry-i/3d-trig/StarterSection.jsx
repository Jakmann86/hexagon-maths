// src/content/topics/trigonometry-i/3d-trig/StarterSection.jsx
// 3D Trigonometry Starter Section - V2.1
// Uses V2 generators directly - no manual JSX wrapping needed

import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import { sohcahtoaGenerators } from '../../../../generators/geometry/sohcahtoaGenerators';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import { numberPuzzleGenerators } from '../../../../generators/puzzles/numberPuzzles';

const questionGenerators = [
  // Last Lesson: SOHCAHTOA 2 - finding missing angles using inverse trig
  () => {
    const { questionText, ...rest } = sohcahtoaGenerators.generateFindAngle({ difficulty: 'easy' });
    return { question: questionText, ...rest, visualization: { ...rest.visualization, orientation: 'default' } };
  },

  // Last Week: SOHCAHTOA 1 - finding missing sides using trig ratios
  () => {
    const { questionText, ...rest } = sohcahtoaGenerators.generateFindMissingSideTrig({ difficulty: 'easy' });
    return { question: questionText, ...rest, visualization: { ...rest.visualization, orientation: 'default' } };
  },

  // Last Topic: Linear equations with unknowns on both sides (Algebra I)
  () => equationGenerators.generateLinearEquationBothSidesStarter({ sectionType: 'starter' }),

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
    lastLesson: 'SOHCAHTOA: Find the Angle',
    lastWeek: 'SOHCAHTOA: Find the Side',
    lastTopic: 'Linear Equations',
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
