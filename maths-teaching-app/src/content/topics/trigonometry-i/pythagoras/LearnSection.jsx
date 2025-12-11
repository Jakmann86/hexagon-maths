// src/content/topics/trigonometry-i/pythagoras/LearnSection.jsx
// Pythagoras Learn Section - Green theme
// Interactive visualization showing squares on sides and area relationships

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { RefreshCw, Eye, EyeOff, RotateCcw, Type, Ruler, Calculator } from 'lucide-react';

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
  
  calculateHypotenuseSquarePoints: (base, height, verticalOffset = 0) => {
    const hypLen = Math.sqrt(base * base + height * height);
    
    // Calculate unit vectors perpendicular to hypotenuse
    const hypUnitX = base / hypLen;
    const hypUnitY = -height / hypLen;
    
    // Get perpendicular vector (rotated 90 degrees)
    const perpUnitX = hypUnitY;
    const perpUnitY = -hypUnitX;
    
    // Ensure correct orientation (outward from triangle)
    const dotProduct = perpUnitX * 1 + perpUnitY * 1;
    const adjustedPerpUnitX = dotProduct < 0 ? -perpUnitX : perpUnitX;
    const adjustedPerpUnitY = dotProduct < 0 ? -perpUnitY : perpUnitY;
    
    // Calculate square corners
    const p1 = [0, height + verticalOffset];
    const p2 = [base, 0 + verticalOffset];
    const p3 = [p2[0] + adjustedPerpUnitX * hypLen, p2[1] + adjustedPerpUnitY * hypLen];
    const p4 = [p1[0] + adjustedPerpUnitX * hypLen, p1[1] + adjustedPerpUnitY * hypLen];
    
    return [p1, p2, p3, p4];
  }
};

// ============================================================
// SVG VISUALIZATION COMPONENT
// ============================================================

const PythagorasVisualization = ({ 
  base = 3, 
  height = 4, 
  showSquares = true,
  showAreaLabels = true,
  showSideLengths = true,
  showFormula = false
}) => {
  const areas = useMemo(() => GeometryUtils.calculateSquareAreas(base, height), [base, height]);
  const hypotenuse = useMemo(() => GeometryUtils.calculateHypotenuse(base, height), [base, height]);
  
  // SVG viewBox calculations
  const padding = 2;
  const maxDim = Math.max(base, height);
  const viewBoxSize = maxDim * 3 + padding * 2;
  const offsetX = maxDim + padding;
  const offsetY = padding + maxDim;
  
  // Triangle points (origin at right angle)
  const trianglePoints = [
    [0, 0],           // Right angle vertex
    [base, 0],        // Base end
    [0, -height]      // Height end (negative Y because SVG Y is inverted)
  ];
  
  // Square on base (below the base)
  const baseSquarePoints = [
    [0, 0],
    [base, 0],
    [base, base],
    [0, base]
  ];
  
  // Square on height (to the left)
  const heightSquarePoints = [
    [0, 0],
    [0, -height],
    [-height, -height],
    [-height, 0]
  ];
  
  // Square on hypotenuse
  const hypPoints = GeometryUtils.calculateHypotenuseSquarePoints(base, height);
  // Transform for SVG (invert Y)
  const hypSquarePoints = hypPoints.map(p => [p[0], -p[1] + height]);
  
  // Helper to create polygon points string
  const toPointsString = (points, ox = offsetX, oy = offsetY) => 
    points.map(p => `${ox + p[0]},${oy + p[1]}`).join(' ');
  
  return (
    <svg 
      viewBox={`0 0 ${viewBoxSize * 1.2} ${viewBoxSize * 1.2}`}
      className="w-full h-full"
      style={{ maxHeight: '400px' }}
    >
      {/* Squares on sides */}
      {showSquares && (
        <>
          {/* Base square (red) */}
          <polygon
            points={toPointsString(baseSquarePoints)}
            fill="#fee2e2"
            stroke="#ef4444"
            strokeWidth="2"
          />
          
          {/* Height square (blue) */}
          <polygon
            points={toPointsString(heightSquarePoints)}
            fill="#dbeafe"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Hypotenuse square (green) */}
          <polygon
            points={toPointsString(hypSquarePoints)}
            fill="#dcfce7"
            stroke="#22c55e"
            strokeWidth="2"
          />
        </>
      )}
      
      {/* Triangle (purple) */}
      <polygon
        points={toPointsString(trianglePoints)}
        fill="#f3e8ff"
        stroke="#9333ea"
        strokeWidth="3"
      />
      
      {/* Right angle marker */}
      <path
        d={`M ${offsetX + 0.8} ${offsetY} L ${offsetX + 0.8} ${offsetY - 0.8} L ${offsetX} ${offsetY - 0.8}`}
        fill="none"
        stroke="#9333ea"
        strokeWidth="1.5"
      />
      
      {/* Area labels */}
      {showSquares && showAreaLabels && (
        <>
          {/* Base square area */}
          <text
            x={offsetX + base / 2}
            y={offsetY + base / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="600"
            fill="#dc2626"
          >
            {areas.base} cm²
          </text>
          
          {/* Height square area */}
          <text
            x={offsetX - height / 2}
            y={offsetY - height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="600"
            fill="#2563eb"
          >
            {areas.height} cm²
          </text>
          
          {/* Hypotenuse square area */}
          <text
            x={offsetX + (hypSquarePoints[0][0] + hypSquarePoints[2][0]) / 2}
            y={offsetY + (hypSquarePoints[0][1] + hypSquarePoints[2][1]) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="600"
            fill="#16a34a"
          >
            {areas.hypotenuse} cm²
          </text>
        </>
      )}
      
      {/* Side length labels */}
      {showSideLengths && (
        <>
          {/* Base label */}
          <text
            x={offsetX + base / 2}
            y={offsetY + (showSquares ? -0.5 : 1)}
            textAnchor="middle"
            fontSize="13"
            fontWeight="500"
            fill="#1f2937"
          >
            {base} cm
          </text>
          
          {/* Height label */}
          <text
            x={offsetX + (showSquares ? 0.7 : -0.7)}
            y={offsetY - height / 2}
            textAnchor="middle"
            fontSize="13"
            fontWeight="500"
            fill="#1f2937"
          >
            {height} cm
          </text>
          
          {/* Hypotenuse label */}
          <text
            x={offsetX + base / 2 + 0.8}
            y={offsetY - height / 2 - 0.5}
            textAnchor="middle"
            fontSize="13"
            fontWeight="500"
            fill="#1f2937"
          >
            {Math.round(hypotenuse * 10) / 10} cm
          </text>
        </>
      )}
      
      {/* Formula box */}
      {showFormula && (
        <g>
          <rect
            x={viewBoxSize * 0.65}
            y={2}
            width={viewBoxSize * 0.5}
            height={4}
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
            rx="0.3"
          />
          <text x={viewBoxSize * 0.7} y={3.2} fontSize="12" fontWeight="600" fill="#374151">
            a² + b² = c²
          </text>
          <text x={viewBoxSize * 0.7} y={4.5} fontSize="11" fill="#6b7280">
            {base}² + {height}² = {Math.round(hypotenuse * 10) / 10}²
          </text>
          <text x={viewBoxSize * 0.7} y={5.6} fontSize="11" fill="#6b7280">
            {areas.base} + {areas.height} = {areas.hypotenuse}
          </text>
        </g>
      )}
    </svg>
  );
};

// ============================================================
// SLIDER COMPONENT
// ============================================================

const Slider = ({ value, onChange, min, max, label, color = 'green' }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className={`text-sm font-medium text-${color}-700`}>{label}</label>
      <span className={`text-lg font-bold text-${color}-600`}>{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-2 bg-${color}-100 rounded-lg appearance-none cursor-pointer accent-${color}-500`}
    />
  </div>
);

// ============================================================
// TOGGLE BUTTON COMPONENT
// ============================================================

const ToggleButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-medium ${
      active 
        ? 'bg-green-500 text-white shadow-md' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');
  
  // Interactive state
  const [base, setBase] = useState(3);
  const [height, setHeight] = useState(4);
  const [showSquares, setShowSquares] = useState(true);
  const [showAreaLabels, setShowAreaLabels] = useState(true);
  const [showSideLengths, setShowSideLengths] = useState(true);
  const [showFormula, setShowFormula] = useState(false);
  
  // Calculated values
  const areas = useMemo(() => GeometryUtils.calculateSquareAreas(base, height), [base, height]);
  const hypotenuse = useMemo(() => Math.round(GeometryUtils.calculateHypotenuse(base, height) * 10) / 10, [base, height]);
  
  // Reset to defaults
  const resetView = () => {
    setBase(3);
    setHeight(4);
    setShowSquares(true);
    setShowAreaLabels(true);
    setShowSideLengths(true);
    setShowFormula(false);
  };

  return (
    <div className="space-y-6 mb-8">
      <Card className="border-2 border-t-4 border-green-500 shadow-md overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Pythagoras' Theorem: Visual Proof
              </h3>
              <p className="text-gray-500 text-sm">
                Explore how the areas of squares relate to the sides
              </p>
            </div>
            <button
              onClick={resetView}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
            >
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </div>

          {/* Main content - two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Visualization */}
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200" style={{ minHeight: '380px' }}>
                <PythagorasVisualization
                  base={base}
                  height={height}
                  showSquares={showSquares}
                  showAreaLabels={showAreaLabels}
                  showSideLengths={showSideLengths}
                  showFormula={showFormula}
                />
              </div>
              
              {/* Toggle Controls */}
              <div className="flex flex-wrap justify-center gap-2">
                <ToggleButton
                  active={showSquares}
                  onClick={() => setShowSquares(!showSquares)}
                  icon={showSquares ? Eye : EyeOff}
                  label="Squares"
                />
                <ToggleButton
                  active={showAreaLabels}
                  onClick={() => setShowAreaLabels(!showAreaLabels)}
                  icon={Type}
                  label="Areas"
                />
                <ToggleButton
                  active={showSideLengths}
                  onClick={() => setShowSideLengths(!showSideLengths)}
                  icon={Ruler}
                  label="Lengths"
                />
                <ToggleButton
                  active={showFormula}
                  onClick={() => setShowFormula(!showFormula)}
                  icon={Calculator}
                  label="Formula"
                />
              </div>
            </div>

            {/* Right: Controls and Information */}
            <div className="space-y-4">
              {/* Sliders */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 space-y-4">
                <h4 className="font-semibold text-green-800">Adjust Triangle</h4>
                <Slider
                  value={base}
                  onChange={setBase}
                  min={1}
                  max={8}
                  label="Base (a)"
                  color="green"
                />
                <Slider
                  value={height}
                  onChange={setHeight}
                  min={1}
                  max={8}
                  label="Height (b)"
                  color="green"
                />
              </div>
              
              {/* Area relationship display */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">The Relationship</h4>
                <div className="text-center space-y-2">
                  <MathDisplay math="a^2 + b^2 = c^2" displayMode={true} />
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-red-100 p-2 rounded-lg text-center">
                      <div className="text-xs text-red-600">a²</div>
                      <div className="text-lg font-bold text-red-700">{areas.base}</div>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg text-center">
                      <div className="text-xs text-blue-600">b²</div>
                      <div className="text-lg font-bold text-blue-700">{areas.height}</div>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg text-center">
                      <div className="text-xs text-green-600">c²</div>
                      <div className="text-lg font-bold text-green-700">{areas.hypotenuse}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Equation check */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2">Check It!</h4>
                <div className="text-center">
                  <MathDisplay 
                    math={`${areas.base} + ${areas.height} = ${areas.hypotenuse}`} 
                    displayMode={true} 
                  />
                  <p className="text-amber-700 text-sm mt-2">
                    Red square + Blue square = Green square
                  </p>
                </div>
              </div>
              
              {/* Key insight */}
              <div className="bg-green-500 text-white p-4 rounded-xl text-center">
                <p className="font-medium">
                  The hypotenuse is c = √{areas.hypotenuse} = {hypotenuse} cm
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Notes - only visible with "Show Answers" */}
          {showAnswers && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Teaching Notes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Green box - How to use */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-3">How to Use This Visual</h4>
                  <ol className="list-decimal list-inside space-y-2 text-green-700 text-sm">
                    <li>Start with the 3-4-5 triangle (default)</li>
                    <li>Show all squares and ask "What do you notice?"</li>
                    <li>Hide areas, get students to calculate each</li>
                    <li>Change dimensions and verify the relationship holds</li>
                    <li>Challenge: "Will this work for ANY right triangle?"</li>
                  </ol>
                </div>
                
                {/* Blue box - Key questions */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-3">Key Questions</h4>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 text-sm">
                    <li>"What does each coloured square represent?"</li>
                    <li>"Why is this called squaring a number?"</li>
                    <li>"Which square is always the biggest? Why?"</li>
                    <li>"What happens when a = b?"</li>
                    <li>"Can you find c without building the green square?"</li>
                  </ul>
                </div>
                
                {/* Purple box - Key concept */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-3">The Key Insight</h4>
                  <div className="text-purple-700 text-sm space-y-2">
                    <p>The area of the square on the hypotenuse <strong>equals</strong> the sum of the areas of the squares on the other two sides.</p>
                    <p>This is what Pythagoras' theorem states - visually!</p>
                    <p className="font-medium">From areas → To finding lengths using square roots</p>
                  </div>
                </div>
                
                {/* Amber box - Misconceptions */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-3">Common Misconceptions</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700 text-sm">
                    <li><strong>"a + b = c"</strong> - We add the SQUARES, not the sides</li>
                    <li><strong>Wrong side</strong> - c must be the hypotenuse (longest side)</li>
                    <li><strong>Non-right triangles</strong> - Only works for right-angled triangles</li>
                    <li><strong>Forgetting √</strong> - c² = 25 means c = √25 = 5, not c = 25</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSection;