// src/content/topics/trigonometry-i/sohcahtoa2/ChallengeSection.jsx
// SOHCAHTOA 2 Challenge Section - V3.0
// Rectangle diagonal crossing: find the acute angle at point P
// Uses ChallengeSectionBase with custom inline SVG

import React from 'react';
import _ from 'lodash';
import ChallengeSectionBase from '../../../../components/sections/ChallengeSectionBase';

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  keyPoints: [
    'This problem requires TWO inverse trig calculations before finding the angle at P',
    'Each line forms a right-angled triangle with base AB — find both angles separately',
    'M is the midpoint of AD — its height above AB is h/2, not h',
    'Use angles in a triangle: they always sum to 180°',
    'If the triangle angle at P comes out obtuse, the acute angle at P is its supplement'
  ],
  discussionQuestions: [
    'Why do we need two separate angle calculations before we can find angle P?',
    'Could you use sine or cosine instead of tangent here?',
    'What changes in your working if M were one-third of the way up instead of halfway?',
    'How could you verify your answer is correct?'
  ],
  commonMisconceptions: [
    'Using h instead of h/2 for the height of M (M is the midpoint, not the top)',
    'Mixing up opposite and adjacent when setting up tan⁻¹',
    'Forgetting to check whether the triangle angle at P is acute or obtuse',
    'Assuming the angle at P equals one of the other angles in the triangle'
  ],
  extensionIdeas: [
    'What if M were one-third of the way up AD instead of halfway?',
    'What if a second line went from D to the midpoint of BC?',
    'Can you prove algebraically that P is always at position (w/3, h/3) from corner A?',
    'What dimensions make the angle at P exactly 45°?'
  ]
};

// ============================================================
// SVG VISUALIZATION
// ============================================================

const RectangleSVG = ({ w, h, anglePAB, angleABM, triangleAngle, acuteAngleP, showAnswer }) => {
  const svgW = 480, svgH = 360;
  const pad = { left: 70, top: 45, right: 65, bottom: 58 };
  const innerW = svgW - pad.left - pad.right; // 345
  const innerH = svgH - pad.top - pad.bottom; // 257

  const scale = Math.min(innerW / w, innerH / h);
  const rectW = w * scale;
  const rectH = h * scale;
  const ox = pad.left + (innerW - rectW) / 2;
  const oy = pad.top + (innerH - rectH) / 2;

  // Rectangle corners: A=bottom-left, B=bottom-right, C=top-right, D=top-left
  const A = { x: ox,         y: oy + rectH };
  const B = { x: ox + rectW, y: oy + rectH };
  const C = { x: ox + rectW, y: oy };
  const D = { x: ox,         y: oy };

  // M = midpoint of left side AD
  const M = { x: ox, y: oy + rectH / 2 };

  // P = intersection of AC and BM, always at (w/3, h/3) from A in problem coordinates
  // In SVG: Px = A.x + rectW/3, Py = A.y - rectH/3
  const P = { x: A.x + rectW / 3, y: A.y - rectH / 3 };

  // Direction angles at P (in SVG coordinate space, y increases downward)
  const angle_PA = Math.atan2(A.y - P.y, A.x - P.x); // toward A: lower-left
  const angle_PB = Math.atan2(B.y - P.y, B.x - P.x); // toward B: lower-right
  const angle_PM = angle_PB + Math.PI;                 // toward M: upper-left (opposite of PB)

  // Arc: show the acute angle at P
  // If the triangle interior angle APB is obtuse, the acute angle is between PA and PM directions
  // If it's already acute, show the arc between PB and PA
  const arcR = 22;
  let arcStartAngle, arcEndAngle;
  if (triangleAngle <= 90) {
    arcStartAngle = angle_PB;
    arcEndAngle   = angle_PA;
  } else {
    arcStartAngle = angle_PA;
    arcEndAngle   = angle_PM;
  }

  const arcStart = {
    x: P.x + arcR * Math.cos(arcStartAngle),
    y: P.y + arcR * Math.sin(arcStartAngle)
  };
  const arcEnd = {
    x: P.x + arcR * Math.cos(arcEndAngle),
    y: P.y + arcR * Math.sin(arcEndAngle)
  };

  // Label at the bisector of the arc
  const bisectorAngle = (arcStartAngle + arcEndAngle) / 2;
  const labelR = arcR + 16;
  const angleLabel = {
    x: P.x + labelR * Math.cos(bisectorAngle),
    y: P.y + labelR * Math.sin(bisectorAngle)
  };

  // Midpoint tick positions on left side AD
  const tickDM = { y: (D.y + M.y) / 2 }; // midpoint of upper half
  const tickMA = { y: (M.y + A.y) / 2 }; // midpoint of lower half

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ width: '100%', height: '100%', maxHeight: '360px' }}
    >
      {/* Rectangle */}
      <rect
        x={D.x} y={D.y} width={rectW} height={rectH}
        fill="#f9fafb" stroke="#374151" strokeWidth="2"
      />

      {/* Diagonal AC (blue) */}
      <line
        x1={A.x} y1={A.y} x2={C.x} y2={C.y}
        stroke="#2563eb" strokeWidth="2" strokeDasharray="7 4"
      />

      {/* Line BM (orange) */}
      <line
        x1={B.x} y1={B.y} x2={M.x} y2={M.y}
        stroke="#ea580c" strokeWidth="2" strokeDasharray="7 4"
      />

      {/* Arc at P showing the acute angle */}
      <path
        d={`M ${arcStart.x.toFixed(1)} ${arcStart.y.toFixed(1)} A ${arcR} ${arcR} 0 0 1 ${arcEnd.x.toFixed(1)} ${arcEnd.y.toFixed(1)}`}
        fill="none" stroke="#111827" strokeWidth="1.5"
      />

      {/* Angle label at P */}
      <text
        x={angleLabel.x.toFixed(1)} y={angleLabel.y.toFixed(1)}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="13" fontWeight="700" fill="#111827"
      >
        {showAnswer ? `${acuteAngleP}°` : '?'}
      </text>

      {/* Point M */}
      <circle cx={M.x} cy={M.y} r="4" fill="#ea580c" />

      {/* Point P */}
      <circle cx={P.x} cy={P.y} r="4" fill="#111827" />

      {/* Midpoint tick marks on left side (equal segment notation) */}
      <line x1={D.x - 7} y1={tickDM.y} x2={D.x + 7} y2={tickDM.y} stroke="#ea580c" strokeWidth="1.5" />
      <line x1={D.x - 7} y1={tickMA.y} x2={D.x + 7} y2={tickMA.y} stroke="#ea580c" strokeWidth="1.5" />

      {/* Corner labels */}
      <text x={A.x - 14} y={A.y + 16} textAnchor="middle" fontSize="15" fontWeight="700" fill="#111827">A</text>
      <text x={B.x + 14} y={B.y + 16} textAnchor="middle" fontSize="15" fontWeight="700" fill="#111827">B</text>
      <text x={C.x + 14} y={C.y - 8}  textAnchor="middle" fontSize="15" fontWeight="700" fill="#111827">C</text>
      <text x={D.x - 14} y={D.y - 8}  textAnchor="middle" fontSize="15" fontWeight="700" fill="#111827">D</text>

      {/* M label */}
      <text x={M.x - 18} y={M.y + 5} textAnchor="middle" fontSize="13" fontWeight="600" fill="#ea580c">M</text>

      {/* P label */}
      <text x={P.x + 14} y={P.y - 10} textAnchor="middle" fontSize="13" fontWeight="600" fill="#374151">P</text>

      {/* Width dimension below rectangle */}
      <line x1={A.x} y1={A.y + 24} x2={B.x} y2={A.y + 24} stroke="#9ca3af" strokeWidth="1" />
      <line x1={A.x} y1={A.y + 19} x2={A.x} y2={A.y + 29} stroke="#9ca3af" strokeWidth="1" />
      <line x1={B.x} y1={A.y + 19} x2={B.x} y2={A.y + 29} stroke="#9ca3af" strokeWidth="1" />
      <text x={(A.x + B.x) / 2} y={A.y + 42} textAnchor="middle" fontSize="13" fill="#374151" fontWeight="500">
        {w} cm
      </text>

      {/* Height dimension right of rectangle */}
      <line x1={B.x + 24} y1={B.y} x2={B.x + 24} y2={C.y} stroke="#9ca3af" strokeWidth="1" />
      <line x1={B.x + 19} y1={B.y} x2={B.x + 29} y2={B.y} stroke="#9ca3af" strokeWidth="1" />
      <line x1={B.x + 19} y1={C.y} x2={B.x + 29} y2={C.y} stroke="#9ca3af" strokeWidth="1" />
      <text x={B.x + 42} y={(B.y + C.y) / 2 + 5} textAnchor="middle" fontSize="13" fill="#374151" fontWeight="500">
        {h} cm
      </text>
    </svg>
  );
};

// ============================================================
// GENERATOR
// ============================================================

const generateChallenge = () => {
  const widths  = [6, 7, 8, 9, 10, 11, 12];
  const heights = [4, 5, 6, 7, 8, 9, 10];

  let w, h;
  do {
    w = _.sample(widths);
    h = _.sample(heights);
  } while (w === h);

  // Step 1: angle diagonal AC makes with AB. Opposite = h, adjacent = w.
  const anglePAB = Math.round(Math.atan(h / w) * 180 / Math.PI * 10) / 10;

  // Step 2: angle line BM makes with AB. M is at height h/2, so opposite = h/2, adjacent = w → h/(2w).
  const angleABM = Math.round(Math.atan(h / (2 * w)) * 180 / Math.PI * 10) / 10;

  // Step 3: interior angle at P in triangle APB
  const triangleAngle = Math.round((180 - anglePAB - angleABM) * 10) / 10;

  // Acute angle at P — supplement if triangle angle is obtuse
  const acuteAngleP = triangleAngle <= 90
    ? triangleAngle
    : Math.round((180 - triangleAngle) * 10) / 10;

  const solution = [
    {
      explanation: 'Step 1: Find angle PAB — the angle diagonal AC makes with base AB. Opposite = h, adjacent = w.',
      formula: `\\angle PAB = \\tan^{-1}\\!\\left(\\frac{${h}}{${w}}\\right) = ${anglePAB}^\\circ`
    },
    {
      explanation: `Step 2: Find angle ABM — M is the midpoint of AD, so it is at height ${h}/2 = ${h / 2}. Opposite = ${h / 2}, adjacent = ${w}.`,
      formula: `\\angle ABM = \\tan^{-1}\\!\\left(\\frac{${h}}{${2 * w}}\\right) = ${angleABM}^\\circ`
    },
    {
      explanation: 'Step 3: Angles in triangle APB sum to 180°.',
      formula: `\\angle APB = 180^\\circ - ${anglePAB}^\\circ - ${angleABM}^\\circ = ${triangleAngle}^\\circ`
    },
    ...(triangleAngle > 90 ? [{
      explanation: `Step 4: Angle APB = ${triangleAngle}° is obtuse. The acute angle at P is its supplement.`,
      formula: `\\text{Acute angle at } P = 180^\\circ - ${triangleAngle}^\\circ = ${acuteAngleP}^\\circ`
    }] : [])
  ];

  return {
    questionText: `Rectangle ABCD has width ${w} cm and height ${h} cm (A = bottom-left, B = bottom-right, C = top-right, D = top-left). The diagonal AC and the line from B to M — the midpoint of AD — cross at point P inside the rectangle. Find the acute angle at P. Give your answer to 1 decimal place.`,
    answer: `${acuteAngleP}^\\circ`,
    solution,
    hints: [
      'Both lines start from the base AB — what angle does each make with AB?',
      'For diagonal AC: opposite = h, adjacent = w. Use tan⁻¹.',
      `M is the midpoint of AD — it is at height ${h / 2} cm, not ${h} cm.`,
      'Use angles in a triangle: they sum to 180°. Check whether your angle at P is acute.'
    ],
    visualization: { w, h, anglePAB, angleABM, triangleAngle, acuteAngleP }
  };
};

// ============================================================
// VISUALIZATION RENDERER
// ============================================================

const renderVisualization = (challenge, showAnswer) => {
  if (!challenge?.visualization) return null;
  return <RectangleSVG {...challenge.visualization} showAnswer={showAnswer} />;
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
      title="Challenge: Intersecting Lines in a Rectangle"
      subtitle="Two inverse trig calculations combined with angle facts"
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
    />
  );
};

export default ChallengeSection;
