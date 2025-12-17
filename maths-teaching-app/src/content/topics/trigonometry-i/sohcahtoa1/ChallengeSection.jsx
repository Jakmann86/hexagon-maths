// src/content/topics/trigonometry-i/sohcahtoa1/ChallengeSection.jsx
// SOHCAHTOA Challenge Section - V1.0
// Multi-step problems combining Pythagoras and Trigonometry
// Uses StackedTrianglesSVG for visualization

import React from 'react';
import ChallengeSectionBase from '../../../../components/sections/ChallengeSectionBase';
import StackedTrianglesSVG from '../../../../components/math/visualizations/StackedTrianglesSVG';
import stackedTriangleGenerators from '../../../../generators/geometry/stackedTriangleGenerators';

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  howToUse: [
    'Present the problem and ask: "How many steps will this take?"',
    'Have students identify WHICH triangle to solve first',
    'Ask: "What method will you use for each triangle?"',
    'Work through step 1, then reveal the shared side value',
    'Complete step 2 with the new information',
    'Discuss: "Could we have done this in a different order?"'
  ],
  keyPoints: [
    'Multi-step problems require planning before calculating',
    'The "shared side" connects the two triangles',
    'Choose Pythagoras when you have 2 sides and need the 3rd',
    'Choose Trig when you have an angle + 1 side',
    'Always check: does my intermediate answer make sense?'
  ],
  discussionQuestions: [
    'How do you decide which triangle to solve first?',
    'What clues tell you whether to use Pythagoras or Trig?',
    'If you got the first step wrong, how would it affect the final answer?',
    'Could you solve this using a different combination of methods?'
  ],
  commonMisconceptions: [
    'Trying to solve both triangles at once',
    'Using the wrong side as the "shared" connection',
    'Forgetting to use the calculated value in step 2',
    'Rounding too early (keep precision until the final answer)'
  ],
  extensionIdeas: [
    'What if there were THREE triangles stacked?',
    'Create your own stacked triangle problem',
    'Find a real-world example of stacked triangles (roof, bridge, etc.)'
  ],
  funFact: 'Surveyors and architects use stacked triangle calculations constantly! When measuring the height of a building, they often need to account for uneven ground - creating a multi-triangle problem just like this one.'
};

// ============================================================
// GENERATOR
// ============================================================

const generateChallenge = () => {
  return stackedTriangleGenerators.generateForSohcahtoaChallenge({
    units: 'cm',
    difficulty: 'medium'
  });
};

// ============================================================
// VISUALIZATION RENDERER
// ============================================================

const renderVisualization = (challenge, showAnswer) => {
  if (!challenge?.visualization) return null;
  
  const viz = challenge.visualization;
  
  return (
    <div className="flex justify-center items-center h-full">
      <StackedTrianglesSVG
        config={{
          arrangement: viz.arrangement || 'vertical',
          triangle1: {
            ...viz.triangle1,
            // Show calculated values when answers revealed
            labels: showAnswer ? {
              ...viz.triangle1.labels,
              height: viz.triangle1.labels.height || `${viz.triangle1.height} cm`
            } : viz.triangle1.labels
          },
          triangle2: {
            ...viz.triangle2,
            // Show final answer when revealed
            labels: showAnswer ? {
              base: viz.triangle2.labels.base === 'x' ? `${challenge.finalAnswer} cm` : viz.triangle2.labels.base,
              height: viz.triangle2.labels.height === 'x' ? `${challenge.finalAnswer} cm` : viz.triangle2.labels.height,
              hypotenuse: viz.triangle2.labels.hypotenuse === 'x' ? `${challenge.finalAnswer} cm` : viz.triangle2.labels.hypotenuse
            } : viz.triangle2.labels
          },
          sharedSide: {
            ...viz.sharedSide,
            showLabel: showAnswer // Only show shared side label when answers revealed
          },
          units: viz.units || 'cm',
          showRightAngles: true,
          scale: 1.1
        }}
        showAnswer={showAnswer}
        showStep={0}
      />
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  return (
    <ChallengeSectionBase
      generator={generateChallenge}
      renderVisualization={renderVisualization}
      teachingNotes={TEACHING_NOTES}
      title="Challenge: Multi-Step Problem"
      subtitle="Combine Pythagoras and Trigonometry"
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
    />
  );
};

export default ChallengeSection;