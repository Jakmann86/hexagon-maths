// src/content/topics/trigonometry-i/sohcahtoa2/LearnSection.jsx
// SOHCAHTOA 2 Learn Section - V3.1
// Interactive exploration of INVERSE trigonometric functions
// Uses LearnSectionBase for consistent styling

import React, { useState, useMemo, useRef, useEffect } from 'react';
import LearnSectionBase from '../../../../components/sections/LearnSectionBase';
import MathDisplay from '../../../../components/common/MathDisplay';
import { AlertTriangle } from 'lucide-react';

// ============================================================
// TEACHING NOTES (standardized format for TeachingNotesPanel)
// ============================================================

const TEACHING_NOTES = {
  funFact: "The notation sin⁻¹ was introduced by John Herschel in 1813. Before that, mathematicians used 'arc sin' or 'asin' - which is still used on many calculators today!",
  
  howToUse: [
    "Start with sin⁻¹ and ratio = 0.5 to show 30°",
    "Hide the angle, move slider, ask 'what angle gives this?'",
    "Use special ratio buttons for exact angles (0.5, 0.707, 0.866)",
    "Switch to cos⁻¹ to show same ratio gives different angle",
    "Emphasise: inverse goes FROM ratio TO angle"
  ],
  
  discussionQuestions: [
    "What does sin⁻¹(0.8) mean in words?",
    "If you increase the ratio, does the angle increase?",
    "Why can sin⁻¹(1.5) not exist?",
    "What's the difference between sin⁻¹ and 1/sin?"
  ],
  
  commonMisconceptions: [
    "Thinking sin⁻¹(x) means 1/sin(x)",
    "Confusing sin⁻¹(x) with (sin(x))⁻¹",
    "Not understanding that sin⁻¹ UNDOES sin",
    "Expecting bigger ratios to always give bigger angles"
  ],
  
  keyPoints: [
    "sin⁻¹ takes a ratio and returns the angle",
    "sin⁻¹(0.5) = 30° because sin(30°) = 0.5",
    "For sin/cos, ratios must be between 0 and 1",
    "tan can have ratios greater than 1"
  ],
  
  extensionIdeas: [
    "For what ratio do sin⁻¹ and cos⁻¹ give the same angle?",
    "What happens to tan⁻¹(x) as x gets very large?",
    "Why does cos⁻¹ 'go backwards' compared to sin⁻¹?"
  ]
};

// ============================================================
// GEOMETRY UTILITIES
// ============================================================

const toRadians = (degrees) => degrees * Math.PI / 180;
const toDegrees = (radians) => radians * 180 / Math.PI;

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

// ============================================================
// LOCAL COMPONENTS
// ============================================================

const Slider = ({ value, onChange, min, max, step = 0.01, label, color = 'green' }) => {
  const colorClasses = {
    green: { track: 'bg-green-100', accent: 'accent-green-500', text: 'text-green-700' },
    orange: { track: 'bg-orange-100', accent: 'accent-orange-500', text: 'text-orange-700' },
    purple: { track: 'bg-purple-100', accent: 'accent-purple-500', text: 'text-purple-700' }
  };
  const colors = colorClasses[color] || colorClasses.green;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className={`text-sm font-medium ${colors.text}`}>{label}</label>
        <span className={`text-lg font-bold ${colors.text}`}>
          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 ${colors.track} rounded-lg appearance-none cursor-pointer ${colors.accent}`}
      />
    </div>
  );
};

const ToggleChip = ({ active, onClick, label, color = 'gray' }) => {
  const colorClasses = {
    gray: active ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    green: active ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200',
    red: active ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200',
    purple: active ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    orange: active ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    blue: active ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
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

// ============================================================
// FALLBACK SVG
// ============================================================

const InverseTrigFallbackSVG = ({ angle, functionType, showAngle, showSides }) => {
  const triangle = calculateTriangleFromAngle(angle, 10);
  
  const svgWidth = 400;
  const svgHeight = 320;
  const scale = 25;
  const offsetX = 80;
  const offsetY = 250;
  
  const p1 = { x: offsetX, y: offsetY };
  const p2 = { x: offsetX + triangle.adjacent * scale, y: offsetY };
  const p3 = { x: offsetX, y: offsetY - triangle.opposite * scale };

  const getColor = (side) => {
    if (functionType === 'sin') return (side === 'opposite' || side === 'hypotenuse') ? '#e74c3c' : '#bdc3c7';
    if (functionType === 'cos') return (side === 'adjacent' || side === 'hypotenuse') ? '#27ae60' : '#bdc3c7';
    if (functionType === 'tan') return (side === 'opposite' || side === 'adjacent') ? '#9b59b6' : '#bdc3c7';
    return '#3498db';
  };

  return (
    <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
      <rect width={svgWidth} height={svgHeight} fill="#fffbeb" />
      
      <polygon 
        points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} 
        fill="#3498db" fillOpacity="0.15" stroke="#1a1a1a" strokeWidth="2" 
      />
      
      <path d={`M ${p1.x + 12} ${p1.y} L ${p1.x + 12} ${p1.y - 12} L ${p1.x} ${p1.y - 12}`} 
        fill="none" stroke="#7c3aed" strokeWidth="2" />
      
      {showAngle && (
        <>
          <path d={`M ${p2.x - 25} ${p2.y} A 25 25 0 0 0 ${p2.x - 20} ${p2.y - 15}`} 
            fill="none" stroke="#f39c12" strokeWidth="3" />
          <text x={p2.x - 45} y={p2.y - 8} fill="#e67e22" fontSize="14" fontWeight="bold">
            θ = {triangle.angle}°
          </text>
        </>
      )}
      
      {showSides && (
        <>
          <text x={p1.x - 10} y={(p1.y + p3.y) / 2} textAnchor="end" fill={getColor('opposite')} fontSize="13" fontWeight="bold">
            O = {triangle.opposite}
          </text>
          <text x={(p1.x + p2.x) / 2} y={p1.y + 20} textAnchor="middle" fill={getColor('adjacent')} fontSize="13" fontWeight="bold">
            A = {triangle.adjacent}
          </text>
          <text x={(p2.x + p3.x) / 2 + 15} y={(p2.y + p3.y) / 2} textAnchor="start" fill={getColor('hypotenuse')} fontSize="13" fontWeight="bold">
            H = {triangle.hypotenuse}
          </text>
        </>
      )}
    </svg>
  );
};

// ============================================================
// JSXGRAPH VISUALIZATION
// ============================================================

const InverseTrigJSXGraph = ({ angle = 30, functionType = 'sin', hypotenuse = 10, showAngle = true, showSides = true }) => {
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
      const padding = 2;
      const bbox = [-padding - 1, maxDim + padding, maxDim + padding + 2, -padding];

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

      const p1 = board.create('point', [0, 0], { visible: false, fixed: true, name: '', withLabel: false });
      const p2 = board.create('point', [triangle.adjacent, 0], { visible: false, fixed: true, name: '', withLabel: false });
      const p3 = board.create('point', [0, triangle.opposite], { visible: false, fixed: true, name: '', withLabel: false });

      const getColor = (side) => {
        if (functionType === 'sin') return (side === 'opposite' || side === 'hypotenuse') ? '#e74c3c' : '#94a3b8';
        if (functionType === 'cos') return (side === 'adjacent' || side === 'hypotenuse') ? '#22c55e' : '#94a3b8';
        if (functionType === 'tan') return (side === 'opposite' || side === 'adjacent') ? '#a855f7' : '#94a3b8';
        return '#3498db';
      };

      board.create('polygon', [p1, p2, p3], {
        fillColor: '#3498db', fillOpacity: 0.15, strokeWidth: 0,
        vertices: { visible: false, withLabel: false }, withLabel: false
      });

      board.create('segment', [p1, p2], { strokeColor: getColor('adjacent'), strokeWidth: 3 });
      board.create('segment', [p1, p3], { strokeColor: getColor('opposite'), strokeWidth: 3 });
      board.create('segment', [p2, p3], { strokeColor: getColor('hypotenuse'), strokeWidth: 3 });

      board.create('angle', [p2, p1, p3], {
        radius: 0.5, type: 'square', fillColor: 'none',
        strokeWidth: 1.5, strokeColor: '#7c3aed', withLabel: false, name: ''
      });

      if (showAngle) {
        board.create('angle', [p3, p2, p1], {
          radius: 1.2, fillColor: '#f39c12', fillOpacity: 0.3,
          strokeWidth: 2, strokeColor: '#e67e22', withLabel: false, name: ''
        });

        const labelRadius = 2;
        const angleRad = Math.atan2(triangle.opposite, triangle.adjacent);
        const labelAngle = angleRad / 2;
        board.create('text', [
          triangle.adjacent - Math.cos(labelAngle) * labelRadius - 0.5,
          Math.sin(labelAngle) * labelRadius + 0.3,
          `θ = ${triangle.angle}°`
        ], {
          fontSize: 14, color: '#e67e22', fontWeight: 'bold',
          anchorX: 'middle', anchorY: 'middle', fixed: true
        });
      }

      if (showSides) {
        board.create('text', [-0.8, triangle.opposite / 2, `O = ${triangle.opposite}`], {
          fontSize: 13, color: getColor('opposite'), fontWeight: 'bold',
          anchorX: 'right', anchorY: 'middle'
        });

        board.create('text', [triangle.adjacent / 2, -0.6, `A = ${triangle.adjacent}`], {
          fontSize: 13, color: getColor('adjacent'), fontWeight: 'bold',
          anchorX: 'middle', anchorY: 'top'
        });

        const hypMidX = triangle.adjacent / 2 + 0.8;
        const hypMidY = triangle.opposite / 2 + 0.5;
        board.create('text', [hypMidX, hypMidY, `H = ${hypotenuse}`], {
          fontSize: 13, color: getColor('hypotenuse'), fontWeight: 'bold',
          anchorX: 'left', anchorY: 'bottom'
        });
      }

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
  }, [angle, triangle, functionType, hypotenuse, showAngle, showSides, jsxGraphAvailable]);

  if (jsxGraphAvailable === null) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: '360px' }}>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (jsxGraphAvailable === false) {
    return <InverseTrigFallbackSVG angle={angle} functionType={functionType} showAngle={showAngle} showSides={showSides} />;
  }

  return <div id={idRef.current} ref={containerRef} className="w-full" style={{ height: '360px' }} />;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const LearnSection = ({ currentTopic, currentLessonId }) => {
  // State
  const [functionType, setFunctionType] = useState('sin');
  const [ratio, setRatio] = useState(0.5);
  const [showAngle, setShowAngle] = useState(true);
  const [showSides, setShowSides] = useState(true);
  const [showCalculation, setShowCalculation] = useState(true);

  // Calculate angle from ratio
  const angle = useMemo(() => {
    let angleRad;
    const clampedRatio = functionType === 'tan' ? ratio : Math.min(0.999, Math.max(0.001, ratio));
    
    switch (functionType) {
      case 'sin': angleRad = Math.asin(clampedRatio); break;
      case 'cos': angleRad = Math.acos(clampedRatio); break;
      case 'tan': angleRad = Math.atan(ratio); break;
      default: angleRad = 0;
    }
    return Math.round(toDegrees(angleRad) * 10) / 10;
  }, [functionType, ratio]);

  // Slider range based on function
  const sliderRange = useMemo(() => {
    if (functionType === 'tan') return { min: 0.1, max: 3, step: 0.01 };
    return { min: 0.1, max: 0.99, step: 0.01 };
  }, [functionType]);

  // Adjust ratio when switching functions
  useEffect(() => {
    if ((functionType === 'sin' || functionType === 'cos') && ratio > 0.99) {
      setRatio(0.5);
    }
  }, [functionType, ratio]);

  // Reset handler
  const handleReset = () => {
    setFunctionType('sin');
    setRatio(0.5);
    setShowAngle(true);
    setShowSides(true);
    setShowCalculation(true);
  };

  // Function notation
  const notation = {
    sin: { name: 'sin⁻¹', sides: 'O/H', color: 'red' },
    cos: { name: 'cos⁻¹', sides: 'A/H', color: 'green' },
    tan: { name: 'tan⁻¹', sides: 'O/A', color: 'purple' }
  }[functionType];

  // Special ratios for quick buttons
  const specialRatios = {
    sin: [{ value: 0.5, label: '0.5 → 30°' }, { value: 0.707, label: '0.707 → 45°' }, { value: 0.866, label: '0.866 → 60°' }],
    cos: [{ value: 0.866, label: '0.866 → 30°' }, { value: 0.707, label: '0.707 → 45°' }, { value: 0.5, label: '0.5 → 60°' }],
    tan: [{ value: 0.577, label: '0.577 → 30°' }, { value: 1, label: '1 → 45°' }, { value: 1.732, label: '1.732 → 60°' }]
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
            <h3 className="font-semibold text-gray-700 mb-3">Inverse Function</h3>
            <div className="flex flex-wrap gap-2">
              <ToggleChip active={functionType === 'sin'} onClick={() => setFunctionType('sin')} label="sin⁻¹" color="red" />
              <ToggleChip active={functionType === 'cos'} onClick={() => setFunctionType('cos')} label="cos⁻¹" color="green" />
              <ToggleChip active={functionType === 'tan'} onClick={() => setFunctionType('tan')} label="tan⁻¹" color="purple" />
            </div>
          </div>

          {/* Ratio Slider */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-3">Ratio Value ({notation.sides})</h3>
            <Slider
              value={ratio}
              onChange={setRatio}
              min={sliderRange.min}
              max={sliderRange.max}
              step={sliderRange.step}
              label="Ratio"
              color="orange"
            />
            
            {/* Special ratio quick buttons */}
            <div className="mt-3 flex flex-wrap gap-1">
              {specialRatios.map((sr, idx) => (
                <button
                  key={idx}
                  onClick={() => setRatio(sr.value)}
                  className={`px-2 py-1 text-xs rounded transition-all ${
                    Math.abs(ratio - sr.value) < 0.01
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  {sr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Display toggles */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">Display</h3>
            <div className="flex flex-wrap gap-2">
              <ToggleChip active={showAngle} onClick={() => setShowAngle(!showAngle)} label="Angle θ" color="orange" />
              <ToggleChip active={showSides} onClick={() => setShowSides(!showSides)} label="Side lengths" color="gray" />
              <ToggleChip active={showCalculation} onClick={() => setShowCalculation(!showCalculation)} label="Calculation" color="blue" />
            </div>
          </div>
        </div>

        {/* Right Panel - Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200" style={{ minHeight: '400px' }}>
            <InverseTrigJSXGraph
              angle={angle}
              functionType={functionType}
              hypotenuse={10}
              showAngle={showAngle}
              showSides={showSides}
            />
          </div>

          {/* Calculation Display */}
          {showCalculation && (
            <div className="mt-4 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-gray-700 mb-2">The Calculation</h4>
              <div className="text-center space-y-2">
                <MathDisplay
                  math={`\\theta = ${notation.name}\\left(${ratio.toFixed(3)}\\right)`}
                  displayMode={true}
                />
                <div className="text-2xl font-bold text-orange-600">
                  θ = {angle}°
                </div>
                <div className="text-sm text-gray-500 italic">
                  Check: {functionType}({angle}°) ≈ {ratio.toFixed(3)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </LearnSectionBase>
  );
};

export default LearnSection;