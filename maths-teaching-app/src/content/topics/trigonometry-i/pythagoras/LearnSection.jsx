// src/content/topics/trigonometry-i/pythagoras/LearnSection.jsx
// Pythagoras Learn Section - V2.1
// Fixed: No ABC labels, better label positioning, more toggle control

import React, { useState, useMemo, useRef, useEffect } from 'react';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { RotateCcw, Eye, EyeOff, Type, Ruler, Calculator, Square, AlertTriangle } from 'lucide-react';

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

const PythagorasFallbackSVG = ({ base, height, showSquares, showAreaLabels, showSideLengths, showHypArea, showLegsArea }) => {
  const areas = GeometryUtils.calculateSquareAreas(base, height);
  const hypotenuse = Math.round(GeometryUtils.calculateHypotenuse(base, height) * 10) / 10;
  
  const svgWidth = 400;
  const svgHeight = 360;
  const scale = 30;
  const offsetX = 150;
  const offsetY = 200;
  
  const p1 = { x: offsetX, y: offsetY };
  const p2 = { x: offsetX + base * scale, y: offsetY };
  const p3 = { x: offsetX, y: offsetY - height * scale };
  
  return (
    <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
      <rect width={svgWidth} height={svgHeight} fill="#fffbeb" />
      
      {showSquares && showLegsArea && (
        <>
          <rect x={p1.x} y={p1.y} width={base * scale} height={base * scale} fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
          <rect x={p1.x - height * scale} y={p1.y - height * scale} width={height * scale} height={height * scale} fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
          {showAreaLabels && (
            <>
              <text x={p1.x + base * scale / 2} y={p1.y + base * scale / 2 + 5} textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="14">{areas.base} cm²</text>
              <text x={p1.x - height * scale / 2} y={p1.y - height * scale / 2} textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="14">{areas.height} cm²</text>
            </>
          )}
        </>
      )}
      
      <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill="#c4b5fd" fillOpacity="0.5" stroke="#7c3aed" strokeWidth="3" />
      <path d={`M ${p1.x + 15} ${p1.y} L ${p1.x + 15} ${p1.y - 15} L ${p1.x} ${p1.y - 15}`} fill="none" stroke="#7c3aed" strokeWidth="2" />
      
      {showSideLengths && (
        <>
          <text x={p1.x + base * scale / 2} y={p1.y - 8} textAnchor="middle" fill="#374151" fontSize="13">{base} cm</text>
          <text x={p1.x - 16} y={p1.y - height * scale / 2} textAnchor="end" fill="#374151" fontSize="13">{height} cm</text>
          {showHypArea && <text x={(p2.x + p3.x) / 2 + 15} y={(p2.y + p3.y) / 2} textAnchor="start" fill="#374151" fontSize="13">{hypotenuse} cm</text>}
        </>
      )}
    </svg>
  );
};

// ============================================================
// JSXGRAPH VISUALIZATION
// ============================================================

const PythagorasJSXGraph = ({ 
  base = 3, height = 4, 
  showSquares = true, showAreaLabels = true, showSideLengths = true, showFormula = false,
  showHypArea = true, showLegsArea = true
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
      const bbox = [-maxDim - padding, maxDim + padding + 1, maxDim + padding + 1, -maxDim - padding];
      
      const board = window.JXG.JSXGraph.initBoard(idRef.current, {
        boundingbox: bbox, axis: false, showCopyright: false, showNavigation: false,
        pan: { enabled: false }, zoom: { enabled: false }, keepAspectRatio: true
      });
      
      boardRef.current = board;
      
      // Triangle points - NO LABELS (removed A, B, C)
      const p1 = board.create('point', [0, 0], { visible: false, fixed: true });
      const p2 = board.create('point', [base, 0], { visible: false, fixed: true });
      const p3 = board.create('point', [0, height], { visible: false, fixed: true });
      
      // Triangle - NO LABELS
      board.create('polygon', [p1, p2, p3], {
        fillColor: '#9333ea', fillOpacity: 0.3, strokeWidth: 3, strokeColor: '#7c3aed',
        vertices: { visible: false }, withLabel: false
      });
      
      // Right angle marker - NO LABEL
      board.create('angle', [p2, p1, p3], {
        radius: 0.5, type: 'square', fillColor: '#9333ea', fillOpacity: 0.3,
        strokeWidth: 1.5, strokeColor: '#7c3aed', withLabel: false
      });
      
      // Squares
      if (showSquares) {
        // Base and height squares (red & blue) - only if showLegsArea
        if (showLegsArea) {
          board.create('polygon', [[0, 0], [base, 0], [base, -base], [0, -base]], {
            fillColor: '#ef4444', fillOpacity: 0.25, strokeWidth: 2, strokeColor: '#dc2626',
            vertices: { visible: false }, withLabel: false
          });
          board.create('polygon', [[0, 0], [0, height], [-height, height], [-height, 0]], {
            fillColor: '#3b82f6', fillOpacity: 0.25, strokeWidth: 2, strokeColor: '#2563eb',
            vertices: { visible: false }, withLabel: false
          });
          
          if (showAreaLabels) {
            board.create('text', [base / 2, -base / 2, `${areas.base} cm²`], { fontSize: 14, color: '#dc2626', anchorX: 'middle', anchorY: 'middle', fontWeight: 'bold' });
            board.create('text', [-height / 2, height / 2, `${areas.height} cm²`], { fontSize: 14, color: '#2563eb', anchorX: 'middle', anchorY: 'middle', fontWeight: 'bold' });
          }
        }
        
        // Hypotenuse square (green) - only if showHypArea
        if (showHypArea) {
          const hypPoints = GeometryUtils.calculateHypotenuseSquarePoints(base, height);
          board.create('polygon', hypPoints, {
            fillColor: '#22c55e', fillOpacity: 0.25, strokeWidth: 2, strokeColor: '#16a34a',
            vertices: { visible: false }, withLabel: false
          });
          
          if (showAreaLabels) {
            const hypCenter = [(hypPoints[0][0] + hypPoints[2][0]) / 2, (hypPoints[0][1] + hypPoints[2][1]) / 2];
            board.create('text', [hypCenter[0], hypCenter[1], `${areas.hypotenuse} cm²`], { fontSize: 14, color: '#16a34a', anchorX: 'middle', anchorY: 'middle', fontWeight: 'bold' });
          }
        }
      }
      
      // Side length labels - IMPROVED POSITIONING
      if (showSideLengths) {
        // Base label - BELOW the base line (pushed down more)
        if (showLegsArea || !showSquares) {
          board.create('text', [base / 2, showSquares ? -0.7 : -0.5, `${base} cm`], { fontSize: 13, color: '#374151', anchorX: 'middle', anchorY: 'middle' });
        }
        
        // Height label - TO THE LEFT of the height line (pushed left more)
        if (showLegsArea || !showSquares) {
          board.create('text', [showSquares ? -0.9 : -0.6, height / 2, `${height} cm`], { fontSize: 13, color: '#374151', anchorX: 'middle', anchorY: 'middle' });
        }
        
        // Hypotenuse label - only if showing hyp area
        if (showHypArea) {
          const hypRounded = Math.round(hypotenuse * 10) / 10;
          board.create('text', [base / 2 + 0.8, height / 2 + 0.6, `${hypRounded} cm`], { fontSize: 13, color: '#374151', anchorX: 'middle', anchorY: 'middle' });
        }
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
  }, [base, height, showSquares, showAreaLabels, showSideLengths, showFormula, showHypArea, showLegsArea, areas, hypotenuse, jsxGraphAvailable]);
  
  if (jsxGraphAvailable === null) {
    return <div className="w-full flex items-center justify-center" style={{ height: '360px' }}><div className="text-gray-400">Loading...</div></div>;
  }
  
  if (jsxGraphAvailable === false) {
    return (
      <div className="w-full">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-2 flex items-center gap-2 text-amber-700 text-sm">
          <AlertTriangle size={16} /><span>Interactive version unavailable</span>
        </div>
        <PythagorasFallbackSVG base={base} height={height} showSquares={showSquares} showAreaLabels={showAreaLabels} showSideLengths={showSideLengths} showHypArea={showHypArea} showLegsArea={showLegsArea} />
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

const ToggleButton = ({ active, onClick, icon: Icon, label }) => (
  <button onClick={onClick} className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-medium ${active ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
    <Icon size={16} /><span>{label}</span>
  </button>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  
  const [base, setBase] = useState(3);
  const [height, setHeight] = useState(4);
  const [showSquares, setShowSquares] = useState(true);
  const [showAreaLabels, setShowAreaLabels] = useState(true);
  const [showSideLengths, setShowSideLengths] = useState(true);
  const [showFormula, setShowFormula] = useState(false);
  const [showHypArea, setShowHypArea] = useState(true);
  const [showLegsArea, setShowLegsArea] = useState(true);
  
  const areas = useMemo(() => GeometryUtils.calculateSquareAreas(base, height), [base, height]);
  const hypotenuse = useMemo(() => Math.round(GeometryUtils.calculateHypotenuse(base, height) * 10) / 10, [base, height]);
  
  const resetView = () => {
    setBase(3); setHeight(4);
    setShowSquares(true); setShowAreaLabels(true); setShowSideLengths(true); setShowFormula(false);
    setShowHypArea(true); setShowLegsArea(true);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-green-500 rounded-xl bg-white shadow-md overflow-hidden">
        
        <div className="bg-green-500 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Pythagoras' Theorem: Visual Proof</h2>
              <p className="text-green-100 text-sm">Explore how the areas of squares relate to the sides</p>
            </div>
            <button onClick={resetView} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all">
              <RotateCcw size={18} /><span>Reset</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-xl border-2 border-amber-200 overflow-hidden">
                <PythagorasJSXGraph base={base} height={height} showSquares={showSquares} showAreaLabels={showAreaLabels} showSideLengths={showSideLengths} showFormula={showFormula} showHypArea={showHypArea} showLegsArea={showLegsArea} />
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                <ToggleButton active={showSquares} onClick={() => setShowSquares(!showSquares)} icon={showSquares ? Eye : EyeOff} label="Squares" />
                <ToggleButton active={showAreaLabels} onClick={() => setShowAreaLabels(!showAreaLabels)} icon={Type} label="Areas" />
                <ToggleButton active={showSideLengths} onClick={() => setShowSideLengths(!showSideLengths)} icon={Ruler} label="Lengths" />
                <ToggleButton active={showFormula} onClick={() => setShowFormula(!showFormula)} icon={Calculator} label="Formula" />
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 pt-2 border-t border-gray-200">
                <ToggleButton active={showLegsArea} onClick={() => setShowLegsArea(!showLegsArea)} icon={Square} label="a² + b²" />
                <ToggleButton active={showHypArea} onClick={() => setShowHypArea(!showHypArea)} icon={Square} label="c²" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 space-y-4">
                <h4 className="font-semibold text-green-800">Adjust Triangle</h4>
                <Slider value={base} onChange={setBase} min={1} max={8} label="Base (a)" />
                <Slider value={height} onChange={setHeight} min={1} max={8} label="Height (b)" />
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">The Relationship</h4>
                <div className="text-center space-y-2">
                  <MathDisplay math="a^2 + b^2 = c^2" displayMode={true} />
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {showLegsArea ? (
                      <>
                        <div className="bg-red-100 p-2 rounded-lg text-center">
                          <div className="text-xs text-red-600">a²</div>
                          <div className="text-lg font-bold text-red-700">{areas.base}</div>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-lg text-center">
                          <div className="text-xs text-blue-600">b²</div>
                          <div className="text-lg font-bold text-blue-700">{areas.height}</div>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 bg-gray-100 p-2 rounded-lg text-center text-gray-400">Hidden</div>
                    )}
                    {showHypArea ? (
                      <div className="bg-green-100 p-2 rounded-lg text-center">
                        <div className="text-xs text-green-600">c²</div>
                        <div className="text-lg font-bold text-green-700">{areas.hypotenuse}</div>
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-2 rounded-lg text-center text-gray-400">?</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2">Check It!</h4>
                <div className="text-center">
                  {showLegsArea && showHypArea ? (
                    <>
                      <MathDisplay math={`${areas.base} + ${areas.height} = ${areas.hypotenuse}`} displayMode={true} />
                      <p className="text-amber-700 text-sm mt-2">Red square + Blue square = Green square</p>
                    </>
                  ) : (
                    <p className="text-amber-600 text-sm">Toggle the squares to see the relationship</p>
                  )}
                </div>
              </div>
              
              <div className="bg-green-500 text-white p-4 rounded-xl text-center">
                {showHypArea ? (
                  <p className="font-medium">The hypotenuse is c = √{areas.hypotenuse} = {hypotenuse} cm</p>
                ) : (
                  <p className="font-medium">Toggle "c²" to reveal the hypotenuse</p>
                )}
              </div>
            </div>
          </div>

          {showAnswers && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teaching Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Suggested Sequence</h4>
                  <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                    <li>Start with 3-4-5 triangle (default)</li>
                    <li>Hide the c² square first - ask students to predict</li>
                    <li>Reveal and verify: 9 + 16 = 25</li>
                    <li>Try other values, verify each time</li>
                    <li>Challenge: what if a = b? (isosceles)</li>
                  </ol>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Key Questions</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• What do you notice about the green square?</li>
                    <li>• Why do we call it "squared"?</li>
                    <li>• Which side is always the longest?</li>
                    <li>• Does the formula work for non-right triangles?</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">Common Misconceptions</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Thinking a + b = c (adding sides not squares)</li>
                    <li>• Confusing which side is the hypotenuse</li>
                    <li>• Forgetting to take the square root at the end</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">Extension</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Pythagorean triples: (3,4,5), (5,12,13), (8,15,17)</li>
                    <li>• What happens if c² {"<"} a² + b²? (acute)</li>
                    <li>• What happens if c² {">"} a² + b²? (obtuse)</li>
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