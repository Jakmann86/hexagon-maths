// src/content/topics/trigonometry-i/sohcahtoa2/ExamplesSection.jsx
// SOHCAHTOA 2 Examples Section - V2.0
// Finding Angles using inverse trig
// Uses ExamplesSectionBase with RightTriangleSVG
// Three tabs: Using sin⁻¹ → Mixed Inverse Ratios → Choosing the Right Function

import React from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import sohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';

// ============================================================
// TABS CONFIGURATION
// ============================================================

const TABS = [
  { id: 1, label: '1', title: 'Using sin⁻¹' },
  { id: 2, label: '2', title: 'Mixed Inverse Functions' },
  { id: 3, label: '3', title: 'Angles of Elevation/Depression' }
];

// ============================================================
// TEACHING NOTES (varies by tab)
// ============================================================

const getTeachingNotes = (activeTab) => {
  const notes = {
    1: {
      howToUse: [
        'Emphasise: we know O and H, so we use SOH',
        'Show the ratio: sin(θ) = O/H',
        'Rearrange: θ = sin⁻¹(O/H)',
        'Calculate the decimal first: O ÷ H',
        'Then use sin⁻¹ button on calculator (often SHIFT+sin)'
      ],
      keyPoints: [
        'sin⁻¹ is the INVERSE of sin (not 1/sin)',
        'sin⁻¹ takes a ratio and gives you the angle',
        'sin⁻¹(0.5) = 30°',
        'Always check calculator is in DEGREE mode',
        'O/H gives a decimal between 0 and 1'
      ],
      discussionQuestions: [
        'What does sin⁻¹ mean in words? ("inverse sine" or "angle whose sine is...")',
        'If sin(30°) = 0.5, what is sin⁻¹(0.5)?',
        'Why must O/H always be less than 1?'
      ],
      commonMisconceptions: [
        'Thinking sin⁻¹(x) = 1/sin(x)',
        'Using sin instead of sin⁻¹',
        'Calculator in radian mode',
        'Not dividing O by H before using sin⁻¹'
      ],
      extensionIdeas: [
        'What angles give a sine of exactly 0.5?',
        'Why can\'t you find sin⁻¹(1.5)?'
      ]
    },
    2: {
      howToUse: [
        'First: identify which two sides you have',
        'Second: choose the matching inverse function (sin⁻¹, cos⁻¹, or tan⁻¹)',
        'Third: calculate the ratio',
        'Finally: apply the inverse function'
      ],
      keyPoints: [
        'sin⁻¹ when you have O and H',
        'cos⁻¹ when you have A and H',
        'tan⁻¹ when you have O and A',
        'All give you the angle',
        'The ratio you calculate is NOT the angle'
      ],
      discussionQuestions: [
        'How do you decide which inverse function to use?',
        'Could you use two different methods to find the same angle?',
        'What if you only know one side - can you find the angle?'
      ],
      commonMisconceptions: [
        'Mixing up which inverse function to use',
        'Thinking the ratio IS the angle',
        'Forgetting to use the inverse button',
        'Using the wrong sides in the ratio'
      ],
      extensionIdeas: [
        'Find the angle using two different methods and compare',
        'What happens if you swap O and A in tan⁻¹?'
      ]
    },
    3: {
      howToUse: [
        'Read the real-world context carefully',
        'Ask: "Are we looking UP (elevation) or DOWN (depression)?"',
        'Have students sketch the situation',
        'Identify which measurements are given',
        'Work through finding the angle step-by-step',
        'Discuss: Does the answer make sense in this context?'
      ],
      keyPoints: [
        'Angle of ELEVATION = looking upwards from horizontal',
        'Angle of DEPRESSION = looking downwards from horizontal',
        'Draw the triangle first to visualise the problem',
        'Identify opposite (vertical) and adjacent (horizontal)',
        'Usually use tan⁻¹ since we have O and A',
        'Check answer is reasonable (between 0° and 90°)'
      ],
      discussionQuestions: [
        'What\'s the difference between elevation and depression?',
        'If you moved closer to the building, what happens to the angle?',
        'How would you measure these angles in real life?',
        'What professions use angles of elevation/depression?'
      ],
      commonMisconceptions: [
        'Confusing elevation (up) with depression (down)',
        'Not drawing a diagram first',
        'Mixing up opposite and adjacent',
        'Forgetting that angles are measured from horizontal'
      ],
      extensionIdeas: [
        'What if you wanted to find the height instead?',
        'Create a similar problem using your school building',
        'Research how pilots use glide slope angles'
      ]
    }
  };

  return notes[activeTab] || notes[1];
};

// ============================================================
// EXAMPLE GENERATOR
// ============================================================

const generateExample = (tabId) => {
  switch (tabId) {
    case 1:
      // Tab 1: sin⁻¹ only
      return sohcahtoaGenerators.generateFindAngle({
        difficulty: 'medium',
        ratio: 'sin',
        units: 'cm'
      });

    case 2:
      // Tab 2: Mixed inverse ratios (random sin⁻¹/cos⁻¹/tan⁻¹)
      return sohcahtoaGenerators.generateFindAngle({
        difficulty: 'medium',
        units: 'cm'
      });

    case 3:
      // Tab 3: Angles of elevation/depression
      return sohcahtoaGenerators.generateAngleOfElevationDepression({
        type: 'random',
        difficulty: 'medium',
        units: 'm'
      });

    default:
      return sohcahtoaGenerators.generateFindAngle({ difficulty: 'medium' });
  }
};

// ============================================================
// VISUALIZATION RENDERER
// ============================================================

const renderVisualization = (example, showAnswer) => {
  if (!example?.visualization) return null;

  const viz = example.visualization;

  // Right triangle visualization
  if (viz.type === 'right-triangle') {
    // For angle of elevation/depression examples, show context indicator
    const isElevationDepression = example.context === 'elevation' || example.context === 'depression';

    return (
      <div className="flex flex-col items-center">
        {/* Context indicator for elevation/depression */}
        {isElevationDepression && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
            example.context === 'elevation'
              ? 'bg-blue-100 text-blue-800 border border-blue-300'
              : 'bg-purple-100 text-purple-800 border border-purple-300'
          }`}>
            {example.context === 'elevation' ? '📐 Looking UP ⬆️' : '📐 Looking DOWN ⬇️'}
          </div>
        )}

        {/* Triangle */}
        <div className="flex justify-center items-center h-full">
          <RightTriangleSVG
            config={{
              base: viz.base,
              height: viz.height,
              hypotenuse: viz.hypotenuse,
              angle: viz.angle,
              showAngle: showAnswer && viz.showAngle !== false,
              anglePosition: viz.anglePosition || 'bottom-right',
              unknownSide: viz.unknownSide,
              unknownAngle: !showAnswer && viz.unknownAngle,
              labels: showAnswer ? {
                ...viz.labels,
                angle: viz.angle ? `${viz.angle}°` : viz.labels?.angle
              } : {
                // Only show labels for the two known sides
                base: viz.labels?.base,
                height: viz.labels?.height,
                hypotenuse: viz.labels?.hypotenuse,
                angle: '?'
              },
              showRightAngle: viz.showRightAngle !== false,
              orientation: viz.orientation || 'default',
              units: viz.units || 'cm'
            }}
            showAnswer={showAnswer}
            className="transform scale-125"
          />
        </div>
      </div>
    );
  }

  return null;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  return (
    <ExamplesSectionBase
      tabs={TABS}
      generateExample={generateExample}
      renderVisualization={renderVisualization}
      teachingNotes={getTeachingNotes}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
    />
  );
};

export default ExamplesSection;
