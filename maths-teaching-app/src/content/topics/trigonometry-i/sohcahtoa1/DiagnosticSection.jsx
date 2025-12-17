// src/content/topics/trigonometry-i/sohcahtoa1/DiagnosticSection.jsx
// SOHCAHTOA Diagnostic Section - V2.0
// Uses DiagnosticSectionBase with RightTriangleSVG (not JSXGraph)
// Tests: equation solving, calculator skills, triangle labeling (O/A/H)

import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import sohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';

// ============================================================
// QUESTION TYPES CONFIGURATION
// ============================================================

const QUESTION_TYPES = [
  { 
    id: 'equations', 
    label: '1', 
    title: 'Solving Equations',
    generator: () => equationGenerators.generateDivisionEquation({ 
      sectionType: 'diagnostic' 
    })
  },
  { 
    id: 'calculator', 
    label: '2', 
    title: 'Calculator Skills',
    generator: () => sohcahtoaGenerators.generateTrigCalculatorQuestion({ 
      sectionType: 'diagnostic' 
    })
  },
  { 
    id: 'labeling', 
    label: '3', 
    title: 'Triangle Labeling',
    generator: () => sohcahtoaGenerators.generateTriangleLabelingQuestion({ 
      sectionType: 'diagnostic' 
    })
  }
];

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  keyPoints: [
    'Students need confident equation solving before SOHCAHTOA',
    'Calculator must be in DEGREE mode (not radians)',
    'O/A/H are RELATIVE to the angle you\'re looking at'
  ],
  discussionQuestions: [
    'What mode should your calculator be in for trigonometry?',
    'If I move to a different angle, which side becomes the opposite?',
    'Why is the hypotenuse always the same regardless of which angle?'
  ],
  commonMisconceptions: [
    'Thinking the "opposite" is always the vertical side',
    'Calculator in radian mode giving wrong answers',
    'Confusing adjacent with hypotenuse'
  ],
  extensionIdeas: [
    'What happens to sin(θ) as θ gets bigger?',
    'Can sin or cos ever be greater than 1?',
    'Why does tan(90°) cause an error?'
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