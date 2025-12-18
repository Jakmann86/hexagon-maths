// src/content/topics/trigonometry-i/sohcahtoa2/DiagnosticSection.jsx
// SOHCAHTOA 2 Diagnostic Section - V2.0
// Tests prerequisites for finding angles using inverse trig
// Uses DiagnosticSectionBase with RightTriangleSVG

import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import sohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';

// ============================================================
// QUESTION TYPES CONFIGURATION
// ============================================================

const QUESTION_TYPES = [
  {
    id: 'calculator',
    label: '1',
    title: 'Inverse Trig Calculator Skills',
    generator: () => sohcahtoaGenerators.generateTrigCalculatorQuestion({
      sectionType: 'diagnostic',
      inverse: true // Use inverse trig functions
    })
  },
  {
    id: 'choosing-ratio',
    label: '2',
    title: 'Choosing the Correct Ratio',
    generator: () => {
      // Generate a question about which ratio to use (sin, cos, or tan)
      const _ = require('lodash');
      const scenarios = [
        { given: ['opposite', 'hypotenuse'], ratio: 'sin', latex: '\\sin' },
        { given: ['adjacent', 'hypotenuse'], ratio: 'cos', latex: '\\cos' },
        { given: ['opposite', 'adjacent'], ratio: 'tan', latex: '\\tan' }
      ];

      const scenario = _.sample(scenarios);
      const [side1, side2] = scenario.given;

      // Create options
      const allRatios = [
        { value: 'sin', latex: 'sin', label: 'sin' },
        { value: 'cos', latex: 'cos', label: 'cos' },
        { value: 'tan', latex: 'tan', label: 'tan' }
      ];

      const options = allRatios.map(r => ({
        value: r.value,
        latex: r.label,
        isCorrect: r.value === scenario.ratio
      }));

      return {
        type: 'choosing-ratio',
        title: 'Choosing the Correct Ratio',
        question: `You know the ${side1} and ${side2} of a right-angled triangle. Which ratio connects these two sides?`,
        visualization: null,
        options: options,
        correctValue: scenario.ratio,
        explanation: `${scenario.latex} = \\frac{\\text{${side1}}}{\\text{${side2}}}`
      };
    }
  }
];

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  keyPoints: [
    'Finding angles requires INVERSE trig functions: sin⁻¹, cos⁻¹, tan⁻¹',
    'Calculator must still be in DEGREE mode',
    'Students must identify which sides they have FIRST, then choose the right inverse function',
    'sin⁻¹ is often labeled "asin" or accessed with SHIFT+sin on calculators'
  ],
  discussionQuestions: [
    'If you know opposite and hypotenuse, which inverse function do you use?',
    'What is the difference between sin and sin⁻¹?',
    'Why can\'t we use sin(θ) = opposite ÷ hypotenuse to find θ directly?',
    'What buttons on your calculator give you sin⁻¹, cos⁻¹, tan⁻¹?'
  ],
  commonMisconceptions: [
    'Confusing sin⁻¹ with 1/sin (it\'s NOT division)',
    'Trying to use sin/cos/tan instead of their inverses',
    'Calculator in radian mode giving strange answers',
    'Not identifying which sides are given before choosing a function'
  ],
  extensionIdeas: [
    'What is the relationship between sin⁻¹(0.5) and sin(30°)?',
    'Can you use different trig functions to find the same angle?',
    'What happens if you input sin⁻¹(1.5)?'
  ]
};

// ============================================================
// VISUALIZATION RENDERER
// ============================================================

const renderVisualization = (question) => {
  if (!question?.visualization) return null;

  const viz = question.visualization;

  // Right triangle visualization using SVG component
  if (viz.type === 'right-triangle') {
    return (
      <div className="flex justify-center items-center w-full" style={{ height: '200px' }}>
        <RightTriangleSVG
          config={{
            base: viz.base,
            height: viz.height,
            hypotenuse: viz.hypotenuse,
            angle: viz.angle,
            showAngle: viz.showAngle,
            anglePosition: viz.anglePosition || 'bottom-right',
            unknownAngle: viz.unknownAngle,
            labels: viz.labels,
            showRightAngle: viz.showRightAngle !== false,
            orientation: viz.orientation || 'default',
            units: viz.units || 'cm'
          }}
          showAnswer={false}
        />
      </div>
    );
  }

  return null;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
  return (
    <DiagnosticSectionBase
      questionTypes={QUESTION_TYPES}
      renderVisualization={renderVisualization}
      teachingNotes={TEACHING_NOTES}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
    />
  );
};

export default DiagnosticSection;
