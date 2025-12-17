// src/content/topics/trigonometry-i/sohcahtoa1/ExamplesSection.jsx
// SOHCAHTOA Examples Section - V2.0
// Uses ExamplesSectionBase with RightTriangleSVG
// Three tabs: Tangent Only → Mixed Ratios → Exact Values

import React from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import sohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';

// ============================================================
// TABS CONFIGURATION
// ============================================================

const TABS = [
  { id: 1, label: '1', title: 'Using Tangent' },
  { id: 2, label: '2', title: 'Mixed Ratios' },
  { id: 3, label: '3', title: 'Exact Values' }
];

// ============================================================
// TEACHING NOTES (varies by tab)
// ============================================================

const getTeachingNotes = (activeTab) => {
  const notes = {
    1: {
      howToUse: [
        'Work through the tangent example step by step',
        'Emphasize identifying O and A relative to the angle',
        'Show rearrangement: if tan = O/A, then O = A × tan(θ)',
        'Use calculator to find tan value, then multiply'
      ],
      keyPoints: [
        'TAN = Opposite ÷ Adjacent (TOA)',
        'Use tan when you have/want O and A (no hypotenuse)',
        'Rearrange formula based on what you\'re finding',
        'Always check: does my answer make sense?'
      ],
      discussionQuestions: [
        'Why is tangent useful when we don\'t know the hypotenuse?',
        'What would happen if the angle was 45°?',
        'How do we know which side is opposite vs adjacent?'
      ],
      commonMisconceptions: [
        'Using the wrong sides (e.g., using hypotenuse with tan)',
        'Forgetting to rearrange the formula',
        'Calculator in wrong mode (radians vs degrees)'
      ],
      extensionIdeas: [
        'What if we had the opposite and needed the adjacent?',
        'Can tan ever be greater than 1? When?'
      ]
    },
    2: {
      howToUse: [
        'First identify which sides are involved',
        'Use the "SOHCAHTOA picker" - which ratio uses these sides?',
        'Set up the equation, rearrange, solve',
        'Encourage students to write out the mnemonic'
      ],
      keyPoints: [
        'Choose ratio based on which sides you have/need',
        'SOH: sin = O/H (when you have O and H)',
        'CAH: cos = A/H (when you have A and H)',
        'TOA: tan = O/A (when you have O and A)'
      ],
      discussionQuestions: [
        'If I know the hypotenuse and want the opposite, which ratio?',
        'Could you use two different ratios to solve the same problem?',
        'What\'s the quickest way to identify O, A, H?'
      ],
      commonMisconceptions: [
        'Always using sin (it\'s the "default")',
        'Mixing up which formula to use',
        'Forgetting that O/A/H are relative to YOUR angle'
      ],
      extensionIdeas: [
        'Solve the same triangle using a different ratio',
        'What if you used the other acute angle instead?'
      ]
    },
    3: {
      howToUse: [
        'Draw the special triangles (30-60-90 or 45-45-90)',
        'Label the sides with their exact ratios',
        'Show how the exact value comes from the triangle',
        'Connect to calculator values (0.5 = 1/2, etc.)'
      ],
      keyPoints: [
        '30-60-90 triangle: sides 1, √3, 2',
        '45-45-90 triangle: sides 1, 1, √2',
        'sin(30°) = 1/2, cos(60°) = 1/2',
        'sin(45°) = cos(45°) = √2/2',
        'tan(45°) = 1'
      ],
      discussionQuestions: [
        'Why are these called "exact" values?',
        'How can we remember the 30-60-90 triangle?',
        'Why is sin(30°) = cos(60°)?'
      ],
      commonMisconceptions: [
        'Thinking √2/2 and 1/√2 are different values',
        'Confusing which angle gives which value',
        'Not recognizing when to use exact vs calculator'
      ],
      extensionIdeas: [
        'Derive tan(30°) and tan(60°) from the triangle',
        'What is sin(0°)? sin(90°)?',
        'Can you construct a 15° angle using these triangles?'
      ],
      funFact: 'The exact trig values for 30°, 45°, and 60° were known to ancient Greek mathematicians like Hipparchus (190-120 BC), who created the first trigonometric tables!'
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
      // Tab 1: Tangent only
      return sohcahtoaGenerators.generateFindSide({ 
        difficulty: 'medium', 
        ratio: 'tan',
        units: 'cm'
      });
    
    case 2:
      // Tab 2: Mixed ratios (random sin/cos/tan)
      return sohcahtoaGenerators.generateFindSide({ 
        difficulty: 'medium',
        units: 'cm'
      });
    
    case 3:
      // Tab 3: Exact values
      return sohcahtoaGenerators.generateExactValue({ 
        difficulty: 'medium'
      });
    
    default:
      return sohcahtoaGenerators.generateFindSide({ difficulty: 'medium' });
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
    return (
      <div className="flex justify-center items-center h-full">
        <RightTriangleSVG
          config={{
            base: viz.base,
            height: viz.height,
            hypotenuse: viz.hypotenuse,
            angle: viz.angle,
            showAngle: viz.showAngle !== false,
            anglePosition: viz.anglePosition || 'bottom-right',
            unknownSide: viz.unknownSide,
            unknownAngle: viz.unknownAngle,
            labels: viz.labels,
            showRightAngle: viz.showRightAngle !== false,
            orientation: viz.orientation || 'default',
            units: viz.units || 'cm'
          }}
          showAnswer={showAnswer}
          className="transform scale-125"
        />
      </div>
    );
  }
  
  // Special triangle (30-60-90 or 45-45-90) - use same SVG with appropriate config
  if (viz.type === 'special-triangle') {
    const is454590 = viz.triangleType === '45-45-90';
    
    return (
      <div className="flex justify-center items-center h-full">
        <RightTriangleSVG
          config={{
            base: is454590 ? 5 : 6,  // Visual proportions
            height: is454590 ? 5 : 3.5,
            showAngle: true,
            anglePosition: 'bottom-right',
            labels: {
              base: is454590 ? '1' : '√3',
              height: '1',
              hypotenuse: is454590 ? '√2' : '2'
            },
            showRightAngle: true,
            orientation: 'default',
            units: ''
          }}
          showAnswer={showAnswer}
          className="transform scale-125"
        />
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