// src/content/topics/trigonometry-i/sohcahtoa2/ChallengeSection.jsx
// SOHCAHTOA 2 Challenge Section - V2.0
// Real-world angle of elevation and depression problems
// Uses ChallengeSectionBase with RightTriangleSVG

import React from 'react';
import ChallengeSectionBase from '../../../../components/sections/ChallengeSectionBase';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import sohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  howToUse: [
    'Read the real-world context carefully with the class',
    'Ask: "Are we looking UP or DOWN?"',
    'Have students sketch the scenario before calculating',
    'Guide: "Which two measurements do we have?"',
    'Identify which inverse trig function to use',
    'Calculate the ratio first, THEN apply the inverse function',
    'Discuss whether the answer makes sense in context'
  ],
  keyPoints: [
    'Angle of ELEVATION = looking UP (from horizontal)',
    'Angle of DEPRESSION = looking DOWN (from horizontal)',
    'Both create right-angled triangles',
    'Horizontal distance = adjacent, vertical height = opposite',
    'Choose the inverse function based on which sides you know',
    'Always check: does the angle look reasonable? (should be between 0° and 90°)'
  ],
  discussionQuestions: [
    'What\'s the difference between elevation and depression?',
    'If you were standing on top of the building looking down, what would change?',
    'Could you solve this using a different trig function?',
    'What information would you need to measure this in real life?'
  ],
  commonMisconceptions: [
    'Confusing elevation (up) with depression (down)',
    'Using sin/cos/tan instead of their inverses',
    'Mixing up opposite and adjacent',
    'Not drawing a diagram first',
    'Thinking the answer is the ratio instead of the angle'
  ],
  extensionIdeas: [
    'What if you wanted to find the height instead of the angle?',
    'How would surveyors measure these angles in real life?',
    'Can you create a similar problem using your school building?',
    'What happens to the angle if you move closer/further away?'
  ],
  funFact: 'Navigation systems in aircraft use angles of depression constantly! When a pilot is approaching a runway, they need to maintain a specific "glide slope" angle (usually about 3°) to land safely. Too steep and the landing is uncomfortable; too shallow and you might overshoot the runway!'
};

// ============================================================
// GENERATOR
// ============================================================

const generateChallenge = () => {
  return sohcahtoaGenerators.generateAngleOfElevationDepression({
    type: 'random', // Randomly choose elevation or depression
    difficulty: 'medium',
    units: 'm'
  });
};

// ============================================================
// VISUALIZATION RENDERER
// ============================================================

const renderVisualization = (challenge, showAnswer) => {
  if (!challenge?.visualization) return null;

  const viz = challenge.visualization;

  return (
    <div className="flex flex-col items-center">
      {/* Context indicator */}
      <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
        challenge.context === 'elevation'
          ? 'bg-blue-100 text-blue-800 border border-blue-300'
          : 'bg-purple-100 text-purple-800 border border-purple-300'
      }`}>
        {challenge.context === 'elevation' ? '📐 Looking UP ⬆️' : '📐 Looking DOWN ⬇️'}
      </div>

      {/* Triangle */}
      <div className="flex justify-center items-center w-full" style={{ height: '280px' }}>
        <RightTriangleSVG
          config={{
            base: viz.base,
            height: viz.height,
            hypotenuse: viz.hypotenuse,
            angle: viz.angle,
            showAngle: showAnswer,
            anglePosition: viz.anglePosition,
            unknownAngle: !showAnswer,
            labels: showAnswer ? {
              ...viz.labels,
              angle: `${viz.angle}°`
            } : viz.labels,
            showRightAngle: viz.showRightAngle,
            orientation: viz.orientation,
            units: viz.units
          }}
          showAnswer={showAnswer}
          className="transform scale-110"
        />
      </div>
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
      title="Challenge: Real-World Angles"
      subtitle="Apply inverse trig to angles of elevation and depression"
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
    />
  );
};

export default ChallengeSection;
