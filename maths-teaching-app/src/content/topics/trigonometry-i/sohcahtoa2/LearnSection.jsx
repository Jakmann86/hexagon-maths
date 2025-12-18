// src/content/topics/trigonometry-i/sohcahtoa2/LearnSection.jsx
// SOHCAHTOA 2 Learn Section - V2.0
// Interactive exploration of INVERSE trigonometric functions
// Features:
// - Ratio slider (0.1-0.9 for sin/cos, wider range for tan)
// - Shows angle that corresponds to that ratio
// - Can switch between sin⁻¹, cos⁻¹, tan⁻¹
// - Visual triangle updates to show the angle
// - Lock to special ratios (0.5, 0.707, 0.866) for exact angles

import React, { useState, useMemo, useRef, useEffect } from 'react';
import LearnSectionBase from '../../../../components/sections/LearnSectionBase';
import MathDisplay from '../../../../components/common/MathDisplay';
import { AlertTriangle } from 'lucide-react';

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  howToUse: [
    'Start with sin⁻¹ and ratio = 0.5 - show it gives 30°',
    'Move the slider - watch how the angle changes as the ratio changes',
    'Change to cos⁻¹ or tan⁻¹ to see different inverse functions',
    'Lock to special ratios (0.5, 0.707, 0.866) to show exact angles',
    'Ask: "If the ratio is 0.8, what angle gives that?"',
    'Emphasise: inverse functions go FROM ratio TO angle'
  ],
  keyPoints: [
    'sin⁻¹ takes a ratio and returns the angle',
    'sin⁻¹ is the INVERSE of sin (undoes what sin does)',
    'sin⁻¹(0.5) = 30° because sin(30°) = 0.5',
    'cos⁻¹(0.5) = 60° because cos(60°) = 0.5',
    'tan⁻¹(1) = 45° because tan(45°) = 1',
    'Ratios for sin and cos must be between 0 and 1',
    'tan can have ratios greater than 1'
  ],
  discussionQuestions: [
    'What does sin⁻¹(0.8) mean in words?',
    'If you increase the ratio, does the angle increase or decrease?',
    'Why can sin⁻¹(1.5) not exist?',
    'What angle has a sine of 1? A cosine of 0?'
  ],
  commonMisconceptions: [
    'Thinking sin⁻¹(x) means 1/sin(x)',
    'Confusing sin⁻¹(x) with (sin(x))⁻¹',
    'Not understanding that sin⁻¹ UNDOES sin',
    'Thinking bigger ratios always mean bigger angles (not true for cos!)'
  ],
  extensionIdeas: [
    'For what ratio do sin⁻¹ and cos⁻¹ give the same angle?',
    'What happens to tan⁻¹(x) as x gets very large?',
    'Can you find an angle using two different inverse functions?'
  ],
  funFact: 'The notation sin⁻¹ (with the -1 superscript) was introduced by John Herschel in 1813. Before that, mathematicians used "arc sin" or "asin" - which is still used on many calculators today!'
};

// ============================================================
// GEOMETRY UTILITIES
// ============================================================

const toRadians = (degrees) => degrees * Math.PI / 180;
const toDegrees = (radians) => radians * 180 / Math.PI;

// Calculate triangle dimensions from angle for visualization
const calculateTriangleFromAngle = (angle, hypotenuse = 10) => {
  const rad = toRadians(angle);
  const opposite = hypotenuse * Math.sin(rad);
  const adjacent = hypotenuse * Math.cos(rad);

  return {
    opposite: Math.round(opposite * 100) / 100,
    adjacent: Math.round(adjacent * 100) / 100,
    hypotenuse,
    angle: Math.round(angle * 10) / 10
  };
};

// Special ratios that give nice angles
const SPECIAL_RATIOS = {
  sin: [
    { value: 0.5, angle: 30, label: '0.5 (30°)' },
    { value: 0.707, angle: 45, label: '√2/2 ≈ 0.707 (45°)' },
    { value: 0.866, angle: 60, label: '√3/2 ≈ 0.866 (60°)' }
  ],
  cos: [
    { value: 0.866, angle: 30, label: '√3/2 ≈ 0.866 (30°)' },
    { value: 0.707, angle: 45, label: '√2/2 ≈ 0.707 (45°)' },
    { value: 0.5, angle: 60, label: '0.5 (60°)' }
  ],
  tan: [
    { value: 0.577, angle: 30, label: '1/√3 ≈ 0.577 (30°)' },
    { value: 1, angle: 45, label: '1 (45°)' },
    { value: 1.732, angle: 60, label: '√3 ≈ 1.732 (60°)' }
  ]
};

// ============================================================
// JSXGRAPH VISUALIZATION
// ============================================================

const InverseTrigJSXGraph = ({
  angle = 30,
  functionType = 'sin', // 'sin', 'cos', or 'tan'
  hypotenuse = 10
}) => {
  const containerRef = useRef(null);
  const boardRef = useRef(null);
  const idRef = useRef(`inverse-trig-${Math.random().toString(36).substr(2, 9)}`);
  const [jsxGraphAvailable, setJsxGraphAvailable] = useState(null);

  const triangle = useMemo(() => calculateTriangleFromAngle(angle, hypotenuse), [angle, hypotenuse]);

  useEffect(() => {
    const check = () => {
      if (window.JXG && window.JXG.JSXGraph) setJsxGraphAvailable(true);
      else setTimeout(() => setJsxGraphAvailable(window.JXG && window.JXG.JSXGraph ? true : false), 500);
    };
    check();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !jsxGraphAvailable) return;

    if (boardRef.current) {
      try { window.JXG.JSXGraph.freeBoard(boardRef.current); } catch (e) {}
    }

    try {
      const maxDim = Math.max(triangle.opposite, triangle.adjacent, hypotenuse);
      const padding = 1.5;
      const bbox = [-padding - 1, maxDim + padding, maxDim + padding + 1, -padding];

      const board = window.JXG.JSXGraph.initBoard(idRef.current, {
        boundingbox: bbox,
        axis: false,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
        keepAspectRatio: true
      });

      boardRef.current = board;

      // Triangle points - right angle at origin
      const p1 = board.create('point', [0, 0], { visible: false, fixed: true, name: '' });
      const p2 = board.create('point', [triangle.adjacent, 0], { visible: false, fixed: true, name: '' });
      const p3 = board.create('point', [0, triangle.opposite], { visible: false, fixed: true, name: '' });

      // Determine highlight colors based on which function we're using
      const getColor = (side) => {
        if (functionType === 'sin') {
          return (side === 'opposite' || side === 'hypotenuse') ? '#e74c3c' : '#bdc3c7';
        }
        if (functionType === 'cos') {
          return (side === 'adjacent' || side === 'hypotenuse') ? '#27ae60' : '#bdc3c7';
        }
        if (functionType === 'tan') {
          return (side === 'opposite' || side === 'adjacent') ? '#9b59b6' : '#bdc3c7';
        }
        return '#3498db';
      };

      // Triangle fill
      board.create('polygon', [p1, p2, p3], {
        fillColor: '#3498db', fillOpacity: 0.15, strokeWidth: 0,
        vertices: { visible: false }, withLabel: false
      });

      // Sides with colors based on function type
      board.create('segment', [p1, p2], {
        strokeColor: getColor('adjacent'), strokeWidth: 3
      });
      board.create('segment', [p1, p3], {
        strokeColor: getColor('opposite'), strokeWidth: 3
      });
      board.create('segment', [p2, p3], {
        strokeColor: getColor('hypotenuse'), strokeWidth: 3
      });

      // Right angle marker
      board.create('angle', [p2, p1, p3], {
        radius: 0.4, type: 'square', fillColor: 'none',
        strokeWidth: 1.5, strokeColor: '#7f8c8d', withLabel: false
      });

      // Angle arc at p2 (the angle θ we're finding)
      board.create('angle', [p3, p2, p1], {
        radius: 0.9, fillColor: '#f39c12', fillOpacity: 0.3,
        strokeWidth: 2, strokeColor: '#e67e22',
        name: '',
        withLabel: false
      });

      // Custom angle label
      const labelRadius = 1.6;
      const angleRad = Math.atan2(triangle.opposite, triangle.adjacent);
      const labelAngle = angleRad / 2;
      board.create('text', [
        triangle.adjacent - Math.cos(labelAngle) * labelRadius - 0.3,
        Math.sin(labelAngle) * labelRadius,
        `θ = ${triangle.angle}°`
      ], {
        fontSize: 14, color: '#e67e22', fontWeight: 'bold',
        anchorX: 'middle', anchorY: 'middle', fixed: true
      });

      // Labels for sides
      board.create('text', [-0.7, triangle.opposite / 2, `O = ${triangle.opposite}`], {
        fontSize: 13, color: getColor('opposite'), fontWeight: 'bold',
        anchorX: 'right', anchorY: 'middle'
      });

      board.create('text', [triangle.adjacent / 2, -0.5, `A = ${triangle.adjacent}`], {
        fontSize: 13, color: getColor('adjacent'), fontWeight: 'bold',
        anchorX: 'middle', anchorY: 'top'
      });

      const hypMidX = triangle.adjacent / 2 + 0.5;
      const hypMidY = triangle.opposite / 2 + 0.5;
      board.create('text', [hypMidX, hypMidY, `H = ${hypotenuse}`], {
        fontSize: 13, color: getColor('hypotenuse'), fontWeight: 'bold',
        anchorX: 'left', anchorY: 'bottom'
      });

    } catch (error) {
      console.error('JSXGraph error:', error);
      setJsxGraphAvailable(false);
    }

    return () => {
      if (boardRef.current) {
        try { window.JXG.JSXGraph.freeBoard(boardRef.current); } catch (e) {}
        boardRef.current = null;
      }
    };
  }, [angle, triangle, functionType, hypotenuse, jsxGraphAvailable]);

  if (jsxGraphAvailable === null) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: '320px' }}>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (jsxGraphAvailable === false) {
    return (
      <div className="w-full">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-2 flex items-center gap-2 text-amber-700 text-sm">
          <AlertTriangle size={16} /><span>Interactive version unavailable</span>
        </div>
      </div>
    );
  }

  return <div id={idRef.current} ref={containerRef} className="w-full" style={{ height: '320px' }} />;
};

// ============================================================
// LOCAL COMPONENTS
// ============================================================

const Slider = ({ value, onChange, min, max, step = 0.01, label, color = 'green' }) => {
  const colorClasses = {
    green: 'text-green-700 accent-green-500 bg-green-100',
    purple: 'text-purple-700 accent-purple-500 bg-purple-100',
    orange: 'text-orange-700 accent-orange-500 bg-orange-100'
  };
  const classes = colorClasses[color] || colorClasses.green;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className={`text-sm font-medium ${classes.split(' ')[0]}`}>{label}</label>
        <span className={`text-lg font-bold ${classes.split(' ')[0].replace('-700', '-600')}`}>
          {value.toFixed(3)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 ${classes.split(' ')[2]} rounded-lg appearance-none cursor-pointer ${classes.split(' ')[1]}`}
      />
    </div>
  );
};

const FunctionToggle = ({ active, onClick, label, color }) => {
  const colorMap = {
    sin: { bg: 'bg-red-500', bgLight: 'bg-red-100', text: 'text-red-700', hoverBg: 'hover:bg-red-200' },
    cos: { bg: 'bg-green-500', bgLight: 'bg-green-100', text: 'text-green-700', hoverBg: 'hover:bg-green-200' },
    tan: { bg: 'bg-purple-500', bgLight: 'bg-purple-100', text: 'text-purple-700', hoverBg: 'hover:bg-purple-200' }
  };

  const colors = colorMap[color] || colorMap.sin;

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? `${colors.bg} text-white shadow-md`
          : `${colors.bgLight} ${colors.text} ${colors.hoverBg}`
      }`}
    >
      {label}
    </button>
  );
};

const SpecialRatioButton = ({ ratio, currentRatio, onClick, label }) => {
  const isActive = Math.abs(currentRatio - ratio) < 0.01;
  return (
    <button
      onClick={() => onClick(ratio)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        isActive
          ? 'bg-orange-500 text-white shadow-md'
          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
      }`}
    >
      {label}
    </button>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const LearnSection = ({ currentTopic, currentLessonId }) => {
  // State
  const [functionType, setFunctionType] = useState('sin'); // 'sin', 'cos', 'tan'
  const [ratio, setRatio] = useState(0.5); // The ratio value
  const [hypotenuse] = useState(10); // Fixed for simplicity

  // Calculate angle from ratio using inverse function
  const angle = useMemo(() => {
    let angleRad;
    switch (functionType) {
      case 'sin':
        angleRad = Math.asin(Math.min(1, Math.max(0, ratio)));
        break;
      case 'cos':
        angleRad = Math.acos(Math.min(1, Math.max(0, ratio)));
        break;
      case 'tan':
        angleRad = Math.atan(ratio);
        break;
      default:
        angleRad = 0;
    }
    return Math.round(toDegrees(angleRad) * 10) / 10;
  }, [functionType, ratio]);

  // Get min/max for slider based on function
  const sliderRange = useMemo(() => {
    switch (functionType) {
      case 'sin':
      case 'cos':
        return { min: 0.1, max: 0.99, step: 0.01 };
      case 'tan':
        return { min: 0.1, max: 3, step: 0.01 };
      default:
        return { min: 0.1, max: 0.99, step: 0.01 };
    }
  }, [functionType]);

  // Ensure ratio is within valid range when switching functions
  useEffect(() => {
    if ((functionType === 'sin' || functionType === 'cos') && ratio > 0.99) {
      setRatio(0.5);
    }
  }, [functionType, ratio]);

  // Reset handler
  const handleReset = () => {
    setFunctionType('sin');
    setRatio(0.5);
  };

  // Get function notation
  const functionNotation = {
    sin: { name: 'sin⁻¹', sides: 'O/H' },
    cos: { name: 'cos⁻¹', sides: 'A/H' },
    tan: { name: 'tan⁻¹', sides: 'O/A' }
  }[functionType];

  return (
    <LearnSectionBase
      title="Learn: Finding Angles with Inverse Trig"
      subtitle="Explore how inverse functions turn ratios back into angles"
      teachingNotes={TEACHING_NOTES}
      onReset={handleReset}
    >
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="space-y-4">
          {/* Function selector */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">Choose Function</h3>
            <div className="flex flex-col gap-2">
              <FunctionToggle
                active={functionType === 'sin'}
                onClick={() => setFunctionType('sin')}
                label="sin⁻¹ (O/H)"
                color="sin"
              />
              <FunctionToggle
                active={functionType === 'cos'}
                onClick={() => setFunctionType('cos')}
                label="cos⁻¹ (A/H)"
                color="cos"
              />
              <FunctionToggle
                active={functionType === 'tan'}
                onClick={() => setFunctionType('tan')}
                label="tan⁻¹ (O/A)"
                color="tan"
              />
            </div>
          </div>

          {/* Ratio Slider */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-4">Ratio Value</h3>
            <Slider
              value={ratio}
              onChange={setRatio}
              min={sliderRange.min}
              max={sliderRange.max}
              step={sliderRange.step}
              label={`Ratio (${functionNotation.sides})`}
              color="orange"
            />

            {/* Quick buttons for special ratios */}
            {SPECIAL_RATIOS[functionType] && (
              <div className="mt-4">
                <p className="text-xs text-orange-700 mb-2">Special values:</p>
                <div className="flex flex-wrap gap-1">
                  {SPECIAL_RATIOS[functionType].map((special, idx) => (
                    <SpecialRatioButton
                      key={idx}
                      ratio={special.value}
                      currentRatio={ratio}
                      onClick={setRatio}
                      label={special.label}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200" style={{ minHeight: '360px' }}>
            <InverseTrigJSXGraph
              angle={angle}
              functionType={functionType}
              hypotenuse={hypotenuse}
            />
          </div>

          {/* Calculation Display */}
          <div className="mt-4">
            <div className="p-6 rounded-lg border-2 bg-white border-orange-300">
              <div className="text-center space-y-3">
                <div className="text-sm font-medium text-gray-600 mb-2">The Inverse Function:</div>
                <MathDisplay
                  math={`\\theta = ${functionNotation.name}\\left(\\frac{${functionNotation.sides.split('/')[0]}}{${functionNotation.sides.split('/')[1]}}\\right)`}
                  displayMode={true}
                />
                <MathDisplay
                  math={`\\theta = ${functionNotation.name}(${ratio.toFixed(3)})`}
                  displayMode={true}
                />
                <div className="text-2xl font-bold text-orange-600 mt-3">
                  θ = {angle}°
                </div>
                <div className="text-xs text-gray-500 mt-2 italic">
                  Check: {functionType}({angle}°) ≈ {ratio.toFixed(3)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LearnSectionBase>
  );
};

export default LearnSection;
