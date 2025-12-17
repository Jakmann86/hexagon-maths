// src/content/topics/trigonometry-i/sohcahtoa1/LearnSection.jsx
// SOHCAHTOA Learn Section - V1.0
// Interactive exploration of trigonometric ratios
// Features:
// - Angle slider (20°-70°)
// - Shows O, A, H values that maintain correct ratios
// - Can lock to special angles (30°, 45°, 60°) for exact ratio demonstrations
// - "Ratio mode" to show multiple triangles with same angle but different sizes
// Style consistent with Pythagoras LearnSection

import React, { useState, useMemo, useRef, useEffect } from 'react';
import LearnSectionBase from '../../../../components/sections/LearnSectionBase';
import MathDisplay from '../../../../components/common/MathDisplay';
import { AlertTriangle } from 'lucide-react';

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  howToUse: [
    'Start with angle at 30° - show the 1:2 ratio for sin',
    'Use the slider to change the angle - watch how the ratios change',
    'Change triangle SIZE with hypotenuse slider - ratios stay the same!',
    'Lock to 30°, 45°, or 60° to show exact values',
    'Hide individual values to create prediction opportunities',
    'Use "Highlight Ratio" to show which sides are used for each ratio'
  ],
  keyPoints: [
    'Sin = Opposite ÷ Hypotenuse (SOH)',
    'Cos = Adjacent ÷ Hypotenuse (CAH)',
    'Tan = Opposite ÷ Adjacent (TOA)',
    'The ratios depend ONLY on the angle, not the triangle size',
    'O, A, H are relative to the angle you\'re working with',
    'At 30°: sin = 0.5 (opposite is half of hypotenuse)',
    'At 45°: tan = 1 (opposite equals adjacent)',
    'At 60°: cos = 0.5 (adjacent is half of hypotenuse)'
  ],
  discussionQuestions: [
    'If I make the triangle bigger, does sin(30°) change?',
    'Which ratio would you use if you know the adjacent and want the opposite?',
    'Why is the hypotenuse always the longest side?',
    'What happens to tan as the angle approaches 90°?'
  ],
  commonMisconceptions: [
    'Thinking bigger triangles have bigger trig values',
    'Confusing which side is "opposite" vs "adjacent"',
    'Forgetting that O/A/H change depending on which angle you pick',
    'Using the wrong ratio (e.g., sin when you need tan)'
  ],
  extensionIdeas: [
    'Predict sin(60°) from knowing sin(30°)',
    'Why is sin(45°) = cos(45°)?',
    'What angle makes sin(θ) = cos(θ)?',
    'Can tan ever be greater than 1?'
  ],
  funFact: 'The word "sine" comes from a Latin mistranslation of the Arabic "jiba" (meaning chord), which itself came from the Sanskrit "jya-ardha" (half-chord). The Arabs abbreviated it to "jb", which Latin translators read as "jaib" (meaning bay or fold), translating it to "sinus" - giving us "sine"!'
};

// ============================================================
// GEOMETRY UTILITIES
// ============================================================

const toRadians = (degrees) => degrees * Math.PI / 180;

const calculateTriangle = (angle, hypotenuse) => {
  const rad = toRadians(angle);
  const opposite = hypotenuse * Math.sin(rad);
  const adjacent = hypotenuse * Math.cos(rad);
  
  return {
    opposite: Math.round(opposite * 100) / 100,
    adjacent: Math.round(adjacent * 100) / 100,
    hypotenuse,
    sin: Math.round(Math.sin(rad) * 1000) / 1000,
    cos: Math.round(Math.cos(rad) * 1000) / 1000,
    tan: Math.round(Math.tan(rad) * 1000) / 1000
  };
};

// Nice multipliers for ratio mode (all give integer or clean results at special angles)
const RATIO_MULTIPLIERS = [1, 2, 3, 4, 5];

// ============================================================
// JSXGRAPH VISUALIZATION
// ============================================================

const SohcahtoaJSXGraph = ({ 
  angle = 30, 
  hypotenuse = 10,
  showOpposite = true,
  showAdjacent = true,
  showHypotenuse = true,
  highlightRatio = null // 'sin', 'cos', 'tan', or null
}) => {
  const containerRef = useRef(null);
  const boardRef = useRef(null);
  const idRef = useRef(`sohcahtoa-${Math.random().toString(36).substr(2, 9)}`);
  const [jsxGraphAvailable, setJsxGraphAvailable] = useState(null);
  
  const triangle = useMemo(() => calculateTriangle(angle, hypotenuse), [angle, hypotenuse]);
  
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
      // Smaller bounding box to match Pythagoras visualization
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
      
      // Determine colors based on highlighted ratio
      const getColor = (side) => {
        if (!highlightRatio) {
          return side === 'opposite' ? '#e74c3c' : side === 'adjacent' ? '#27ae60' : '#3498db';
        }
        if (highlightRatio === 'sin') {
          return (side === 'opposite' || side === 'hypotenuse') ? '#9b59b6' : '#bdc3c7';
        }
        if (highlightRatio === 'cos') {
          return (side === 'adjacent' || side === 'hypotenuse') ? '#9b59b6' : '#bdc3c7';
        }
        if (highlightRatio === 'tan') {
          return (side === 'opposite' || side === 'adjacent') ? '#9b59b6' : '#bdc3c7';
        }
        return '#3498db';
      };
      
      // Triangle fill
      board.create('polygon', [p1, p2, p3], {
        fillColor: '#3498db', fillOpacity: 0.15, strokeWidth: 0,
        vertices: { visible: false }, withLabel: false
      });
      
      // Sides with individual colors
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
      
      // Angle arc at p2 (the angle θ) - with adjusted label offset
      board.create('angle', [p3, p2, p1], {
        radius: 0.9, fillColor: '#9b59b6', fillOpacity: 0.25,
        strokeWidth: 2, strokeColor: '#8e44ad', 
        name: '',  // We'll add custom label
        withLabel: false
      });
      
      // Custom angle label - positioned lower/closer to the angle
      const labelRadius = 1.6;
      const angleRad = Math.atan2(triangle.opposite, triangle.adjacent);
      const labelAngle = angleRad / 2; // Midpoint of the angle
      board.create('text', [
        triangle.adjacent - Math.cos(labelAngle) * labelRadius - 0.3,
        Math.sin(labelAngle) * labelRadius,
        `${angle}°`
      ], {
        fontSize: 13, color: '#8e44ad', fontWeight: 'bold',
        anchorX: 'middle', anchorY: 'middle', fixed: true
      });
      
      // Labels
      // Opposite (left side, vertical)
      if (showOpposite) {
        board.create('text', [-0.7, triangle.opposite / 2, `O = ${triangle.opposite}`], {
          fontSize: 13, color: getColor('opposite'), fontWeight: 'bold',
          anchorX: 'right', anchorY: 'middle'
        });
      } else {
        board.create('text', [-0.5, triangle.opposite / 2, 'O = ?'], {
          fontSize: 13, color: getColor('opposite'), fontWeight: 'bold',
          anchorX: 'right', anchorY: 'middle'
        });
      }
      
      // Adjacent (bottom)
      if (showAdjacent) {
        board.create('text', [triangle.adjacent / 2, -0.5, `A = ${triangle.adjacent}`], {
          fontSize: 13, color: getColor('adjacent'), fontWeight: 'bold',
          anchorX: 'middle', anchorY: 'top'
        });
      } else {
        board.create('text', [triangle.adjacent / 2, -0.5, 'A = ?'], {
          fontSize: 13, color: getColor('adjacent'), fontWeight: 'bold',
          anchorX: 'middle', anchorY: 'top'
        });
      }
      
      // Hypotenuse (diagonal)
      const hypMidX = triangle.adjacent / 2 + 0.5;
      const hypMidY = triangle.opposite / 2 + 0.5;
      if (showHypotenuse) {
        board.create('text', [hypMidX, hypMidY, `H = ${hypotenuse}`], {
          fontSize: 13, color: getColor('hypotenuse'), fontWeight: 'bold',
          anchorX: 'left', anchorY: 'bottom'
        });
      } else {
        board.create('text', [hypMidX, hypMidY, 'H = ?'], {
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
  }, [angle, hypotenuse, triangle, showOpposite, showAdjacent, showHypotenuse, highlightRatio, jsxGraphAvailable]);
  
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

const Slider = ({ value, onChange, min, max, step = 1, label, color = 'green', unit = '' }) => {
  const colorClasses = {
    green: 'text-green-700 accent-green-500 bg-green-100',
    purple: 'text-purple-700 accent-purple-500 bg-purple-100'
  };
  const classes = colorClasses[color] || colorClasses.green;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className={`text-sm font-medium ${classes.split(' ')[0]}`}>{label}</label>
        <span className={`text-lg font-bold ${classes.split(' ')[0].replace('-700', '-600')}`}>{value}{unit}</span>
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

const ToggleChip = ({ active, onClick, label, color = 'gray' }) => {
  const colorClasses = {
    red: active ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200',
    blue: active ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    green: active ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200',
    gray: active ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    purple: active ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200',
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

const SpecialAngleButton = ({ angle, currentAngle, onClick }) => {
  const isActive = currentAngle === angle;
  return (
    <button
      onClick={() => onClick(angle)}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-purple-500 text-white shadow-md' 
          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
      }`}
    >
      {angle}°
    </button>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const LearnSection = ({ currentTopic, currentLessonId }) => {
  // State
  const [angle, setAngle] = useState(30);
  const [hypotenuse, setHypotenuse] = useState(10);
  const [showOpposite, setShowOpposite] = useState(true);
  const [showAdjacent, setShowAdjacent] = useState(true);
  const [showHypotenuse, setShowHypotenuse] = useState(true);
  const [highlightRatio, setHighlightRatio] = useState(null);
  
  // Calculated triangle
  const triangle = useMemo(() => calculateTriangle(angle, hypotenuse), [angle, hypotenuse]);
  
  // Reset handler
  const handleReset = () => {
    setAngle(30);
    setHypotenuse(10);
    setShowOpposite(true);
    setShowAdjacent(true);
    setShowHypotenuse(true);
    setHighlightRatio(null);
  };

  return (
    <LearnSectionBase
      title="Learn: Understanding SOHCAHTOA"
      subtitle="Explore the trigonometric ratios and see how they relate to angles"
      teachingNotes={TEACHING_NOTES}
      onReset={handleReset}
    >
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="space-y-4">
          {/* Angle Slider */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-4">Angle θ</h3>
            <Slider 
              value={angle} 
              onChange={setAngle} 
              min={15} 
              max={75} 
              step={1}
              label="Angle" 
              color="purple"
              unit="°"
            />
            {/* Quick buttons for special angles */}
            <div className="flex justify-center gap-2 mt-4">
              <SpecialAngleButton angle={30} currentAngle={angle} onClick={setAngle} />
              <SpecialAngleButton angle={45} currentAngle={angle} onClick={setAngle} />
              <SpecialAngleButton angle={60} currentAngle={angle} onClick={setAngle} />
            </div>
          </div>
          
          {/* Hypotenuse Size */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-4">Triangle Size</h3>
            <Slider 
              value={hypotenuse} 
              onChange={setHypotenuse} 
              min={6} 
              max={14} 
              step={2}
              label="Hypotenuse" 
              color="green"
              unit=" cm"
            />
          </div>
          
          {/* Toggle visibility */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">Show/Hide Sides</h3>
            <div className="flex flex-wrap gap-2">
              <ToggleChip active={showOpposite} onClick={() => setShowOpposite(!showOpposite)} label="O" color="red" />
              <ToggleChip active={showAdjacent} onClick={() => setShowAdjacent(!showAdjacent)} label="A" color="green" />
              <ToggleChip active={showHypotenuse} onClick={() => setShowHypotenuse(!showHypotenuse)} label="H" color="blue" />
            </div>
          </div>
          
          {/* Highlight ratio */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">Highlight Ratio</h3>
            <div className="flex flex-wrap gap-2">
              <ToggleChip 
                active={highlightRatio === 'sin'} 
                onClick={() => setHighlightRatio(highlightRatio === 'sin' ? null : 'sin')} 
                label="SIN (O/H)" 
                color="purple" 
              />
              <ToggleChip 
                active={highlightRatio === 'cos'} 
                onClick={() => setHighlightRatio(highlightRatio === 'cos' ? null : 'cos')} 
                label="COS (A/H)" 
                color="purple" 
              />
              <ToggleChip 
                active={highlightRatio === 'tan'} 
                onClick={() => setHighlightRatio(highlightRatio === 'tan' ? null : 'tan')} 
                label="TAN (O/A)" 
                color="purple" 
              />
            </div>
          </div>
        </div>
        
        {/* Right Panel - Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200" style={{ minHeight: '360px' }}>
            <SohcahtoaJSXGraph 
              angle={angle}
              hypotenuse={hypotenuse}
              showOpposite={showOpposite}
              showAdjacent={showAdjacent}
              showHypotenuse={showHypotenuse}
              highlightRatio={highlightRatio}
            />
          </div>
          
          {/* Ratios Display */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {/* SIN */}
            <div className={`p-4 rounded-lg border-2 transition-all ${
              highlightRatio === 'sin' ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">SOH</div>
                <MathDisplay math={`\\sin(${angle}°) = \\frac{O}{H}`} displayMode={false} />
                <div className="mt-2 text-lg font-bold text-purple-600">
                  = {triangle.sin}
                </div>
                {showOpposite && showHypotenuse && (
                  <div className="text-xs text-gray-500 mt-1">
                    = {triangle.opposite} ÷ {hypotenuse}
                  </div>
                )}
              </div>
            </div>
            
            {/* COS */}
            <div className={`p-4 rounded-lg border-2 transition-all ${
              highlightRatio === 'cos' ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">CAH</div>
                <MathDisplay math={`\\cos(${angle}°) = \\frac{A}{H}`} displayMode={false} />
                <div className="mt-2 text-lg font-bold text-purple-600">
                  = {triangle.cos}
                </div>
                {showAdjacent && showHypotenuse && (
                  <div className="text-xs text-gray-500 mt-1">
                    = {triangle.adjacent} ÷ {hypotenuse}
                  </div>
                )}
              </div>
            </div>
            
            {/* TAN */}
            <div className={`p-4 rounded-lg border-2 transition-all ${
              highlightRatio === 'tan' ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">TOA</div>
                <MathDisplay math={`\\tan(${angle}°) = \\frac{O}{A}`} displayMode={false} />
                <div className="mt-2 text-lg font-bold text-purple-600">
                  = {triangle.tan}
                </div>
                {showOpposite && showAdjacent && (
                  <div className="text-xs text-gray-500 mt-1">
                    = {triangle.opposite} ÷ {triangle.adjacent}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LearnSectionBase>
  );
};

export default LearnSection;