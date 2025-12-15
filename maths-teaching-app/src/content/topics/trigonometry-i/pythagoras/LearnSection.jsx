// src/content/topics/trigonometry-i/pythagoras/LearnSection.jsx
// Pythagoras Learn Section - V2.3
// Fixed: No ABC labels (explicit name:''), individual toggles for all labels, comprehensive teacher notes

import React, { useState, useMemo, useRef, useEffect } from 'react';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { RotateCcw, Eye, EyeOff, Square, AlertTriangle, BookOpen } from 'lucide-react';

// ============================================================
// GEOMETRY UTILITIES
// ============================================================

const GeometryUtils = {
  calculateHypotenuse: (base, height) => Math.sqrt(base * base + height * height),
  
  calculateSquareAreas: (base, height) => {
    const hypotenuse = GeometryUtils.calculateHypotenuse(base, height);
    return {
      base: Math.round(base * base * 100) / 100,
      height: Math.round(height * height * 100) / 100,
      hypotenuse: Math.round(hypotenuse * hypotenuse * 100) / 100
    };
  },
  
  calculateHypotenuseSquarePoints: (base, height) => {
    const hypLen = Math.sqrt(base * base + height * height);
    const hypUnitX = base / hypLen;
    const hypUnitY = -height / hypLen;
    const perpUnitX = hypUnitY;
    const perpUnitY = -hypUnitX;
    const dotProduct = perpUnitX * 1 + perpUnitY * 1;
    const adjustedPerpUnitX = dotProduct < 0 ? -perpUnitX : perpUnitX;
    const adjustedPerpUnitY = dotProduct < 0 ? -perpUnitY : perpUnitY;
    
    const p1 = [0, height];
    const p2 = [base, 0];
    const p3 = [p2[0] + adjustedPerpUnitX * hypLen, p2[1] + adjustedPerpUnitY * hypLen];
    const p4 = [p1[0] + adjustedPerpUnitX * hypLen, p1[1] + adjustedPerpUnitY * hypLen];
    
    return [p1, p2, p3, p4];
  }
};

// ============================================================
// FALLBACK SVG (when JSXGraph unavailable)
// ============================================================

const PythagorasFallbackSVG = ({ base, height, showSquares, showALabel, showBLabel, showCLabel, showSideA, showSideB, showSideC }) => {
  const areas = GeometryUtils.calculateSquareAreas(base, height);
  const hypotenuse = Math.round(GeometryUtils.calculateHypotenuse(base, height) * 10) / 10;
  
  const svgWidth = 400;
  const svgHeight = 360;
  const scale = 30;
  const offsetX = 150;
  const offsetY = 220;
  
  const p1 = { x: offsetX, y: offsetY };
  const p2 = { x: offsetX + base * scale, y: offsetY };
  const p3 = { x: offsetX, y: offsetY - height * scale };
  
  return (
    <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
      <rect width={svgWidth} height={svgHeight} fill="#fffbeb" />
      
      {showSquares && (
        <>
          <rect x={p1.x} y={p1.y} width={base * scale} height={base * scale} fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
          <rect x={p1.x - height * scale} y={p1.y - height * scale} width={height * scale} height={height * scale} fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
          
          {showALabel && (
            <text x={p1.x + base * scale / 2} y={p1.y + base * scale / 2 + 5} textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="14">{areas.base} cm²</text>
          )}
          {showBLabel && (
            <text x={p1.x - height * scale / 2} y={p1.y - height * scale / 2 - 10} textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="14">{areas.height} cm²</text>
          )}
          {showCLabel && (
            <text x={(p2.x + p3.x) / 2 + 40} y={(p2.y + p3.y) / 2 + 20} textAnchor="middle" fill="#16a34a" fontWeight="bold" fontSize="14">{areas.hypotenuse} cm²</text>
          )}
        </>
      )}
      
      <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill="#c4b5fd" fillOpacity="0.5" stroke="#7c3aed" strokeWidth="3" />
      <path d={`M ${p1.x + 15} ${p1.y} L ${p1.x + 15} ${p1.y - 15} L ${p1.x} ${p1.y - 15}`} fill="none" stroke="#7c3aed" strokeWidth="2" />
      
      {showSideA && <text x={p1.x + base * scale / 2} y={p1.y - 8} textAnchor="middle" fill="#374151" fontSize="13">{base} cm</text>}
      {showSideB && <text x={p1.x - 16} y={p1.y - height * scale / 2} textAnchor="end" fill="#374151" fontSize="13">{height} cm</text>}
      {showSideC && <text x={(p2.x + p3.x) / 2 + 15} y={(p2.y + p3.y) / 2} textAnchor="start" fill="#374151" fontSize="13">{hypotenuse} cm</text>}
    </svg>
  );
};

// ============================================================
// JSXGRAPH VISUALIZATION
// ============================================================

const PythagorasJSXGraph = ({ 
  base = 3, height = 4, 
  showSquares = true, 
  showALabel = true, showBLabel = true, showCLabel = true,
  showSideA = true, showSideB = true, showSideC = true,
  showFormula = false
}) => {
  const containerRef = useRef(null);
  const boardRef = useRef(null);
  const idRef = useRef(`pythagoras-${Math.random().toString(36).substr(2, 9)}`);
  const [jsxGraphAvailable, setJsxGraphAvailable] = useState(null);
  
  const areas = useMemo(() => GeometryUtils.calculateSquareAreas(base, height), [base, height]);
  const hypotenuse = useMemo(() => GeometryUtils.calculateHypotenuse(base, height), [base, height]);
  
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
      const maxDim = Math.max(base, height);
      const padding = maxDim * 0.6;
      const bbox = [-maxDim - padding, maxDim + padding + 2, maxDim + padding + 1, -maxDim - padding - 1];
      
      const board = window.JXG.JSXGraph.initBoard(idRef.current, {
        boundingbox: bbox, axis: false, showCopyright: false, showNavigation: false,
        pan: { enabled: false }, zoom: { enabled: false }, keepAspectRatio: true
      });
      
      boardRef.current = board;
      
      // Triangle points - EXPLICITLY NO LABELS with name:''
      const p1 = board.create('point', [0, 0], { visible: false, fixed: true, name: '', withLabel: false });
      const p2 = board.create('point', [base, 0], { visible: false, fixed: true, name: '', withLabel: false });
      const p3 = board.create('point', [0, height], { visible: false, fixed: true, name: '', withLabel: false });
      
      // Triangle - explicitly no labels on vertices
      board.create('polygon', [p1, p2, p3], {
        fillColor: '#9333ea', fillOpacity: 0.3, strokeWidth: 3, strokeColor: '#7c3aed',
        vertices: { visible: false, withLabel: false, name: '' }, 
        withLabel: false,
        borders: { strokeColor: '#7c3aed', strokeWidth: 3 }
      });
      
      // Right angle marker
      board.create('angle', [p2, p1, p3], {
        radius: 0.5, type: 'square', fillColor: '#9333ea', fillOpacity: 0.3,
        strokeWidth: 1.5, strokeColor: '#7c3aed', withLabel: false, name: ''
      });
      
      // Squares - always show when toggle on
      if (showSquares) {
        // Base square (red) - a²
        const sq1 = board.create('polygon', [[0, 0], [base, 0], [base, -base], [0, -base]], {
          fillColor: '#ef4444', fillOpacity: 0.25, strokeWidth: 2, strokeColor: '#dc2626',
          vertices: { visible: false, withLabel: false, name: '' }, withLabel: false
        });
        
        // Height square (blue) - b²
        const sq2 = board.create('polygon', [[0, 0], [0, height], [-height, height], [-height, 0]], {
          fillColor: '#3b82f6', fillOpacity: 0.25, strokeWidth: 2, strokeColor: '#2563eb',
          vertices: { visible: false, withLabel: false, name: '' }, withLabel: false
        });
        
        // Hypotenuse square (green) - c²
        const hypPoints = GeometryUtils.calculateHypotenuseSquarePoints(base, height);
        const sq3 = board.create('polygon', hypPoints, {
          fillColor: '#22c55e', fillOpacity: 0.25, strokeWidth: 2, strokeColor: '#16a34a',
          vertices: { visible: false, withLabel: false, name: '' }, withLabel: false
        });
        
        // Area labels - individual toggles
        if (showALabel) {
          board.create('text', [base / 2, -base / 2, `${areas.base} cm²`], { 
            fontSize: 14, color: '#dc2626', anchorX: 'middle', anchorY: 'middle', fontWeight: 'bold' 
          });
        }
        if (showBLabel) {
          // Move b² label UP a bit so it doesn't clash with side length
          board.create('text', [-height / 2, height / 2 + 0.4, `${areas.height} cm²`], { 
            fontSize: 14, color: '#2563eb', anchorX: 'middle', anchorY: 'middle', fontWeight: 'bold' 
          });
        }
        if (showCLabel) {
          const hypCenter = [(hypPoints[0][0] + hypPoints[2][0]) / 2, (hypPoints[0][1] + hypPoints[2][1]) / 2];
          board.create('text', [hypCenter[0], hypCenter[1], `${areas.hypotenuse} cm²`], { 
            fontSize: 14, color: '#16a34a', anchorX: 'middle', anchorY: 'middle', fontWeight: 'bold' 
          });
        }
      }
      
      // Side length labels - individual toggles
      if (showSideA) {
        board.create('text', [base / 2, showSquares ? -0.7 : -0.5, `${base} cm`], { 
          fontSize: 13, color: '#374151', anchorX: 'middle', anchorY: 'middle' 
        });
      }
      if (showSideB) {
        board.create('text', [showSquares ? -0.9 : -0.6, height / 2, `${height} cm`], { 
          fontSize: 13, color: '#374151', anchorX: 'middle', anchorY: 'middle' 
        });
      }
      if (showSideC) {
        const hypRounded = Math.round(hypotenuse * 10) / 10;
        board.create('text', [base / 2 + 0.8, height / 2 + 0.6, `${hypRounded} cm`], { 
          fontSize: 13, color: '#374151', anchorX: 'middle', anchorY: 'middle' 
        });
      }
      
      if (showFormula) {
        const boxX = maxDim + padding * 0.3;
        const boxY = maxDim + padding * 0.5;
        board.create('text', [boxX, boxY, 'a² + b² = c²'], { fontSize: 16, color: '#1f2937', fontWeight: 'bold', anchorX: 'left' });
        board.create('text', [boxX, boxY - 0.8, `${base}² + ${height}² = ${Math.round(hypotenuse * 10) / 10}²`], { fontSize: 14, color: '#4b5563', anchorX: 'left' });
        board.create('text', [boxX, boxY - 1.5, `${areas.base} + ${areas.height} = ${areas.hypotenuse}`], { fontSize: 14, color: '#4b5563', anchorX: 'left' });
      }
    } catch (error) {
      console.error('JSXGraph error:', error);
      setJsxGraphAvailable(false);
    }
    
    return () => {
      if (boardRef.current) { try { window.JXG.JSXGraph.freeBoard(boardRef.current); } catch (e) {} boardRef.current = null; }
    };
  }, [base, height, showSquares, showALabel, showBLabel, showCLabel, showSideA, showSideB, showSideC, showFormula, areas, hypotenuse, jsxGraphAvailable]);
  
  if (jsxGraphAvailable === null) {
    return <div className="w-full flex items-center justify-center" style={{ height: '360px' }}><div className="text-gray-400">Loading...</div></div>;
  }
  
  if (jsxGraphAvailable === false) {
    return (
      <div className="w-full">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-2 flex items-center gap-2 text-amber-700 text-sm">
          <AlertTriangle size={16} /><span>Interactive version unavailable</span>
        </div>
        <PythagorasFallbackSVG 
          base={base} height={height} showSquares={showSquares} 
          showALabel={showALabel} showBLabel={showBLabel} showCLabel={showCLabel}
          showSideA={showSideA} showSideB={showSideB} showSideC={showSideC}
        />
      </div>
    );
  }
  
  return <div id={idRef.current} ref={containerRef} className="w-full" style={{ height: '360px' }} />;
};

// ============================================================
// COMPONENTS
// ============================================================

const Slider = ({ value, onChange, min, max, label }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-green-700">{label}</label>
      <span className="text-lg font-bold text-green-600">{value}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-500" />
  </div>
);

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

// ============================================================
// MAIN COMPONENT
// ============================================================

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  
  const [base, setBase] = useState(3);
  const [height, setHeight] = useState(4);
  const [showSquares, setShowSquares] = useState(true);
  const [showFormula, setShowFormula] = useState(false);
  
  // Individual toggles for area labels
  const [showALabel, setShowALabel] = useState(true);  // a² (red)
  const [showBLabel, setShowBLabel] = useState(true);  // b² (blue)
  const [showCLabel, setShowCLabel] = useState(true);  // c² (green)
  
  // Individual toggles for side lengths
  const [showSideA, setShowSideA] = useState(true);  // base
  const [showSideB, setShowSideB] = useState(true);  // height
  const [showSideC, setShowSideC] = useState(true);  // hypotenuse
  
  const areas = useMemo(() => GeometryUtils.calculateSquareAreas(base, height), [base, height]);
  const hypotenuse = useMemo(() => Math.round(GeometryUtils.calculateHypotenuse(base, height) * 10) / 10, [base, height]);
  
  const handleReset = () => {
    setBase(3);
    setHeight(4);
    setShowSquares(true);
    setShowFormula(false);
    setShowALabel(true);
    setShowBLabel(true);
    setShowCLabel(true);
    setShowSideA(true);
    setShowSideB(true);
    setShowSideC(true);
  };
  
  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-green-500 rounded-xl bg-white shadow-md overflow-hidden">
        <div className="bg-green-500 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Learn: Pythagoras' Visual Proof</h2>
              <p className="text-green-100 text-sm">Explore how the squares on each side are related</p>
            </div>
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <RotateCcw size={18} /><span>Reset</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Controls */}
            <div className="space-y-4">
              {/* Sliders */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-4">Triangle Dimensions</h3>
                <div className="space-y-4">
                  <Slider value={base} onChange={setBase} min={2} max={8} label="Base (a)" />
                  <Slider value={height} onChange={setHeight} min={2} max={8} label="Height (b)" />
                </div>
              </div>
              
              {/* Main toggles */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">Display</h3>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip active={showSquares} onClick={() => setShowSquares(!showSquares)} label="Squares" color="purple" />
                  <ToggleChip active={showFormula} onClick={() => setShowFormula(!showFormula)} label="Formula" color="gray" />
                </div>
              </div>
              
              {/* Area label toggles */}
              {showSquares && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Area Labels</h3>
                  <div className="flex flex-wrap gap-2">
                    <ToggleChip active={showALabel} onClick={() => setShowALabel(!showALabel)} label="a²" color="red" />
                    <ToggleChip active={showBLabel} onClick={() => setShowBLabel(!showBLabel)} label="b²" color="blue" />
                    <ToggleChip active={showCLabel} onClick={() => setShowCLabel(!showCLabel)} label="c²" color="green" />
                  </div>
                </div>
              )}
              
              {/* Side length toggles */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">Side Lengths</h3>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip active={showSideA} onClick={() => setShowSideA(!showSideA)} label="a" color="gray" />
                  <ToggleChip active={showSideB} onClick={() => setShowSideB(!showSideB)} label="b" color="gray" />
                  <ToggleChip active={showSideC} onClick={() => setShowSideC(!showSideC)} label="c" color="gray" />
                </div>
              </div>
            </div>
            
            {/* Center/Right Panel - Visualization */}
            <div className="lg:col-span-2">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200" style={{ minHeight: '400px' }}>
                <PythagorasJSXGraph 
                  base={base} 
                  height={height}
                  showSquares={showSquares}
                  showALabel={showALabel}
                  showBLabel={showBLabel}
                  showCLabel={showCLabel}
                  showSideA={showSideA}
                  showSideB={showSideB}
                  showSideC={showSideC}
                  showFormula={showFormula}
                />
              </div>
              
              {/* Relationship Box */}
              <div className="mt-4 bg-gradient-to-r from-purple-50 to-green-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-gray-700 mb-2">The Relationship</h4>
                <div className="flex items-center justify-center gap-4 text-lg">
                  <span className="text-red-600 font-bold">{showALabel ? areas.base : '?'}</span>
                  <span className="text-gray-500">+</span>
                  <span className="text-blue-600 font-bold">{showBLabel ? areas.height : '?'}</span>
                  <span className="text-gray-500">=</span>
                  <span className="text-green-600 font-bold">{showCLabel ? areas.hypotenuse : '?'}</span>
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">
                  <MathDisplay math={`a^2 + b^2 = c^2 \\quad \\Rightarrow \\quad ${base}^2 + ${height}^2 = ${hypotenuse}^2`} displayMode={false} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Teaching Notes - COMPREHENSIVE */}
          {showAnswers && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teaching Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Fun Fact */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={18} className="text-amber-700" />
                    <h4 className="font-medium text-amber-800">Fun Fact</h4>
                  </div>
                  <p className="text-sm text-amber-700">
                    Pythagoras (c. 570–495 BC) was an ancient Greek philosopher and mathematician who 
                    founded a religious movement called Pythagoreanism. His followers believed that 
                    "all is number" and that mathematics was the key to understanding the universe. 
                    He was also a musician who discovered that musical harmony is based on mathematical ratios!
                  </p>
                </div>
                
                {/* Delivery Tips */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Delivery Tips</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Start with 3-4-5 triangle (classic Pythagorean triple)</li>
                    <li>• Toggle area labels to create "predict and check" moments</li>
                    <li>• Have students calculate c² before revealing</li>
                    <li>• Use slider to show relationship holds for ANY right triangle</li>
                    <li>• Hide one square's label and ask students to calculate it</li>
                  </ul>
                </div>
                
                {/* Discussion Points */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Discussion Points</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Why are we using AREA not perimeter?</li>
                    <li>• What happens if it's not a right angle?</li>
                    <li>• Why is c always the longest side?</li>
                    <li>• Can you predict the hypotenuse from a² + b²?</li>
                    <li>• What real-world shapes use right angles?</li>
                  </ul>
                </div>
                
                {/* Common Misconceptions */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">Common Misconceptions</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• "Just add the two sides to get the third" — No! We're adding SQUARES</li>
                    <li>• "The hypotenuse is any side" — It's always opposite the right angle</li>
                    <li>• "Works for all triangles" — Only RIGHT-angled triangles</li>
                    <li>• Forgetting to square root at the end</li>
                  </ul>
                </div>
                
                {/* Historical Context */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">Historical Context</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Babylonians knew this 1000+ years before Pythagoras!</li>
                    <li>• Ancient Egyptians used 3-4-5 rope triangles to build pyramids</li>
                    <li>• The Chinese "Gōu gǔ theorem" predates Greek proof</li>
                    <li>• Over 400 different proofs exist today</li>
                  </ul>
                </div>
                
                {/* Extension Ideas */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-medium text-indigo-800 mb-2">Extension Ideas</h4>
                  <ul className="text-sm text-indigo-700 space-y-1">
                    <li>• Find Pythagorean triples: (3,4,5), (5,12,13), (8,15,17)...</li>
                    <li>• 3D distance: add z² to the formula</li>
                    <li>• Prove using similar triangles</li>
                    <li>• Link to coordinate geometry (distance formula)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnSection;