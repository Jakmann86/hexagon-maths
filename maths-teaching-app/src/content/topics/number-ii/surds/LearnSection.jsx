// src/content/topics/number-ii/surds/LearnSection.jsx
// Surds Learn Section - V1.0
// Interactive exploration: surd grid, number line, multiplication rule, simplification
// Uses LearnSectionBase with MathDisplay throughout

import React, { useState } from 'react';
import LearnSectionBase from '../../../../components/sections/LearnSectionBase';
import MathDisplay from '../../../../components/common/MathDisplay';

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  howToUse: [
    'Start with just the grid visible — ask students which boxes contain "tidy" numbers',
    'Toggle decimals — ask what is different about the red ones',
    'Use the number line slider to estimate where √n sits before revealing the decimal',
    'Show the multiplication rule with a perfect square first, then with a surd',
    'Use Simplify to walk through the method step by step on the current slider value'
  ],
  keyPoints: [
    'A surd is an irrational root that cannot be simplified to a whole number',
    '√(a×b) = √a × √b is the key property used to simplify surds',
    'We look for the LARGEST perfect square factor, not just any square factor',
    'The simplified form is written as coefficient√radicand — e.g. √12 = 2√3'
  ],
  discussionQuestions: [
    'What makes a number irrational?',
    'Can you estimate where √50 sits on the number line before revealing the decimal?',
    'Why do we want the LARGEST square factor, not just any square factor?',
    'What would happen if we used √6 × √2 instead of √4 × √3 for √12?'
  ],
  commonMisconceptions: [
    '√12 = √6 × √2 — valid but does not simplify fully since 6 and 2 are not perfect squares',
    'Thinking all roots are surds — √4 = 2 is rational and not a surd',
    'Stopping at the first square factor found instead of the largest',
    'Confusing √(a+b) with √a + √b — the rule only works for multiplication'
  ],
  extensionIdeas: [
    'Are there more irrational numbers or rational numbers between 1 and 10?',
    'Is π a surd?',
    'Can you prove that √2 is irrational?',
    'What is the simplified form of √(n²k) for any integers n and k?'
  ]
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

const isSquare = (n) => {
  const s = Math.sqrt(n);
  return s === Math.floor(s);
};

const getLargestSquareFactor = (n) => {
  const limit = Math.floor(Math.sqrt(n));
  for (let i = limit; i >= 2; i--) {
    if (n % (i * i) === 0) return i * i;
  }
  return 1;
};

const simplify = (n) => {
  if (isSquare(n)) {
    return { coefficient: Math.round(Math.sqrt(n)), radicand: 1, sqFactor: n, simplified: true, perfect: true };
  }
  const sqFactor = getLargestSquareFactor(n);
  if (sqFactor === 1) {
    return { coefficient: 1, radicand: n, sqFactor: 1, simplified: false, perfect: false };
  }
  return {
    coefficient: Math.round(Math.sqrt(sqFactor)),
    radicand: n / sqFactor,
    sqFactor,
    simplified: true,
    perfect: false
  };
};

// ============================================================
// LOCAL UI COMPONENTS
// ============================================================

const ToggleChip = ({ active, onClick, label, color = 'gray' }) => {
  const colorClasses = {
    green: active ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200',
    gray:  active ? 'bg-gray-600 text-white'  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    blue:  active ? 'bg-blue-500 text-white'  : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    amber: active ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${colorClasses[color]}`}
    >
      {label}
    </button>
  );
};

const Slider = ({ value, onChange, min, max, label }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-green-700">{label}</label>
      <span className="text-lg font-bold text-green-600">{value}</span>
    </div>
    <input
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-500"
    />
  </div>
);

// ============================================================
// SQRT GRID  (√1 to √25)
// ============================================================

const SqrtGrid = ({ showDecimals }) => (
  <div className="grid grid-cols-5 gap-2">
    {Array.from({ length: 25 }, (_, i) => i + 1).map(n => {
      const sq = isSquare(n);
      const val = Math.sqrt(n);
      return (
        <div
          key={n}
          className={`rounded-lg p-2 text-center border-2 ${
            sq ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-300'
          }`}
        >
          <div className={`text-xs font-semibold ${sq ? 'text-green-700' : 'text-red-700'}`}>
            <MathDisplay math={`\\sqrt{${n}}`} displayMode={false} />
          </div>
          {showDecimals && (
            <div className={`text-xs mt-0.5 ${sq ? 'text-green-700 font-bold' : 'text-red-500'}`}>
              {sq
                ? <MathDisplay math={`= ${Math.round(val)}`} displayMode={false} />
                : <span>≈ {val.toFixed(2)}…</span>
              }
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ============================================================
// NUMBER LINE
// ============================================================

const NumberLine = ({ n, showDecimal }) => {
  const sqrtN = Math.sqrt(n);
  const lo = Math.max(0, Math.floor(sqrtN) - 1);
  const integers = [lo, lo + 1, lo + 2, lo + 3];

  const svgW = 460;
  const svgH = 100;
  const padL = 50;
  const padR = 50;
  const lineY = 62;
  const unitW = (svgW - padL - padR) / 3; // 3 intervals for 4 integers

  const xOf = (val) => padL + (val - lo) * unitW;
  const markerX = xOf(sqrtN);
  const markerColor = isSquare(n) ? '#16a34a' : '#dc2626';

  const floorN = Math.floor(sqrtN);
  const ceilN = isSquare(n) ? floorN : Math.ceil(sqrtN);

  return (
    <div>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: '100px' }}>
        {/* Axis */}
        <line x1={padL - 20} y1={lineY} x2={svgW - padR + 20} y2={lineY} stroke="#374151" strokeWidth="2" />

        {/* Integer ticks + labels */}
        {integers.map(k => {
          const x = xOf(k);
          const isFlanking = !isSquare(n) && (k === floorN || k === ceilN);
          return (
            <g key={k}>
              <line
                x1={x} y1={lineY - 9} x2={x} y2={lineY + 9}
                stroke={isFlanking ? markerColor : '#374151'}
                strokeWidth={isFlanking ? 2.5 : 1.5}
              />
              <text
                x={x} y={lineY + 24}
                textAnchor="middle" fontSize="14"
                fill={isFlanking ? markerColor : '#374151'}
                fontWeight={isFlanking ? '700' : '400'}
              >
                {k}
              </text>
            </g>
          );
        })}

        {/* √n marker — downward triangle */}
        <polygon
          points={`${markerX},${lineY - 26} ${markerX - 9},${lineY - 12} ${markerX + 9},${lineY - 12}`}
          fill={markerColor}
        />
        <line x1={markerX} y1={lineY - 12} x2={markerX} y2={lineY} stroke={markerColor} strokeWidth="2" />

        {/* √n plain-text label above marker (SVG can't use MathDisplay) */}
        <text x={markerX} y={lineY - 32} textAnchor="middle" fontSize="13" fill={markerColor} fontWeight="700">
          {`\u221a${n}`}
        </text>
      </svg>

      {/* "Between" label — MathDisplay */}
      {!isSquare(n) && (
        <div className="text-center mt-1">
          <MathDisplay
            math={`${floorN} < \\sqrt{${n}} < ${ceilN}`}
            displayMode={false}
          />
        </div>
      )}

      {/* Decimal approximation */}
      {showDecimal && (
        <div className="text-center mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <MathDisplay
            math={
              isSquare(n)
                ? `\\sqrt{${n}} = ${Math.round(sqrtN)}`
                : `\\sqrt{${n}} \\approx ${sqrtN.toFixed(6)}`
            }
            displayMode={false}
          />
        </div>
      )}
    </div>
  );
};

// ============================================================
// MULTIPLY RULE
// ============================================================

const MultiplyRule = () => (
  <div className="space-y-4">
    <p className="text-sm text-gray-600 font-medium">First, see it with a perfect square:</p>
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <MathDisplay
        math="\\sqrt{36} = \\sqrt{4 \\times 9} = \\sqrt{4} \\times \\sqrt{9} = 2 \\times 3 = 6\\,\\checkmark"
        displayMode={true}
      />
    </div>

    <p className="text-sm text-gray-600 font-medium">Now with a surd — same rule, but one factor stays under the root:</p>
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <MathDisplay
        math="\\sqrt{12} = \\sqrt{4 \\times 3} = \\sqrt{4} \\times \\sqrt{3} = 2\\sqrt{3}"
        displayMode={true}
      />
    </div>

    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
      <p className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">Key property</p>
      <MathDisplay math="\\sqrt{a \\times b} = \\sqrt{a} \\times \\sqrt{b}" displayMode={true} />
    </div>
  </div>
);

// ============================================================
// SIMPLIFY STEPS
// ============================================================

const SimplifySteps = ({ n }) => {
  const result = simplify(n);

  if (result.perfect) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          {n} is a perfect square — the root is a whole number:
        </p>
        <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 text-center">
          <MathDisplay math={`\\sqrt{${n}} = ${result.coefficient}`} displayMode={true} />
        </div>
        <p className="text-sm text-gray-500 italic">Not a surd — it is rational.</p>
      </div>
    );
  }

  if (!result.simplified) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          {n} has no perfect square factors other than 1 — already in simplest form:
        </p>
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-center">
          <MathDisplay math={`\\sqrt{${n}} \\text{ is already simplified}`} displayMode={true} />
        </div>
      </div>
    );
  }

  const steps = [
    {
      label: 'Find the largest perfect square factor',
      math: `${result.sqFactor} \\times ${result.radicand} = ${n}, \\quad \\sqrt{${result.sqFactor}} = ${result.coefficient}`,
    },
    {
      label: 'Rewrite under the root',
      math: `\\sqrt{${n}} = \\sqrt{${result.sqFactor} \\times ${result.radicand}}`,
    },
    {
      label: 'Split using √(a×b) = √a × √b',
      math: `= \\sqrt{${result.sqFactor}} \\times \\sqrt{${result.radicand}}`,
    },
    {
      label: 'Evaluate the square root',
      math: `= ${result.coefficient} \\times \\sqrt{${result.radicand}}`,
    },
    {
      label: 'Write in simplified form',
      math: `= ${result.coefficient}\\sqrt{${result.radicand}}`,
    },
  ];

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center mt-2">
            {i + 1}
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
            <p className="text-xs text-gray-500 mb-1">{step.label}</p>
            <MathDisplay math={step.math} displayMode={false} />
          </div>
        </div>
      ))}

      <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center mt-2">
        <MathDisplay
          math={`\\sqrt{${n}} = ${result.coefficient}\\sqrt{${result.radicand}}`}
          displayMode={true}
        />
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const [n, setN] = useState(12);
  const [showGrid, setShowGrid] = useState(true);
  const [showDecimals, setShowDecimals] = useState(false);
  const [showNumberLine, setShowNumberLine] = useState(false);
  const [showNLDecimal, setShowNLDecimal] = useState(false);
  const [showMultiplyRule, setShowMultiplyRule] = useState(false);
  const [showSimplify, setShowSimplify] = useState(false);

  const handleReset = () => {
    setN(12);
    setShowGrid(true);
    setShowDecimals(false);
    setShowNumberLine(false);
    setShowNLDecimal(false);
    setShowMultiplyRule(false);
    setShowSimplify(false);
  };

  const anyVisible = showGrid || showNumberLine || showMultiplyRule || showSimplify;

  return (
    <LearnSectionBase
      title="Learn: What is a Surd?"
      subtitle="Explore irrational square roots and how to simplify them"
      teachingNotes={TEACHING_NOTES}
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left panel: controls ── */}
        <div className="space-y-4">

          {/* Slider */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-4">Choose a number</h3>
            <Slider value={n} onChange={setN} min={2} max={100} label="n" />
            <p className="text-xs text-gray-500 mt-2 text-center">Used by number line and simplify</p>
          </div>

          {/* Toggle chips */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <h3 className="font-semibold text-gray-700 mb-1">Reveal layers</h3>

            {/* Grid + sub-toggle */}
            <div className="space-y-2">
              <ToggleChip active={showGrid} onClick={() => setShowGrid(v => !v)} label="√1 to √25" color="green" />
              {showGrid && (
                <div className="pl-4">
                  <ToggleChip active={showDecimals} onClick={() => setShowDecimals(v => !v)} label="Show Decimals" color="gray" />
                </div>
              )}
            </div>

            {/* Number line + sub-toggle */}
            <div className="space-y-2">
              <ToggleChip active={showNumberLine} onClick={() => setShowNumberLine(v => !v)} label="Number Line" color="green" />
              {showNumberLine && (
                <div className="pl-4">
                  <ToggleChip active={showNLDecimal} onClick={() => setShowNLDecimal(v => !v)} label="Show decimal" color="gray" />
                </div>
              )}
            </div>

            <ToggleChip active={showMultiplyRule} onClick={() => setShowMultiplyRule(v => !v)} label="√(a×b) = √a × √b" color="amber" />
            <ToggleChip active={showSimplify} onClick={() => setShowSimplify(v => !v)} label="Simplify" color="blue" />
          </div>
        </div>

        {/* ── Right panel: visualizations ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Grid */}
          {showGrid && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="font-semibold text-gray-700">Square roots: √1 to √25</h3>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-green-400 inline-block" />Rational (whole number)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-red-300 inline-block" />Irrational (surd)
                  </span>
                </div>
              </div>
              <SqrtGrid showDecimals={showDecimals} />
            </div>
          )}

          {/* Number line */}
          {showNumberLine && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-1 flex-wrap">
                Where does <MathDisplay math={`\\sqrt{${n}}`} displayMode={false} /> sit?
              </h3>
              <NumberLine n={n} showDecimal={showNLDecimal} />
            </div>
          )}

          {/* Multiply rule */}
          {showMultiplyRule && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">The Multiplication Rule</h3>
              <MultiplyRule />
            </div>
          )}

          {/* Simplify steps */}
          {showSimplify && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-1 flex-wrap">
                Simplify <MathDisplay math={`\\sqrt{${n}}`} displayMode={false} />
              </h3>
              <SimplifySteps n={n} />
            </div>
          )}

          {/* Empty state */}
          {!anyVisible && (
            <div
              className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center"
              style={{ minHeight: '300px' }}
            >
              <p className="text-gray-400 text-sm">Toggle a layer on the left to begin</p>
            </div>
          )}
        </div>
      </div>
    </LearnSectionBase>
  );
};

export default LearnSection;
