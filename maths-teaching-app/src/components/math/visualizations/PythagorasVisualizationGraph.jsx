import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Type, Ruler, HelpCircle, RotateCcw } from 'lucide-react';

// Mock JSXGraph for demo - in real implementation, import from 'jsxgraph'
const JXG = window.JXG || {
  JSXGraph: {
    initBoard: (id, options) => ({
      suspendUpdate: () => {},
      unsuspendUpdate: () => {},
      create: (type, params, options) => ({ 
        id: Math.random().toString(36),
        remove: () => {},
        setAttribute: () => {},
        type
      }),
      removeObject: () => {},
      objects: {}
    })
  }
};

// Utility functions for geometric calculations
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
    
    // Calculate unit vectors perpendicular to hypotenuse
    const hypUnitX = base / hypLen;
    const hypUnitY = -height / hypLen;
    
    // Get perpendicular vector (rotated 90 degrees)
    const perpUnitX = hypUnitY;
    const perpUnitY = -hypUnitX;
    
    // Ensure correct orientation
    const dotProduct = perpUnitX * 1 + perpUnitY * 1;
    const adjustedPerpUnitX = dotProduct < 0 ? -perpUnitX : perpUnitX;
    const adjustedPerpUnitY = dotProduct < 0 ? -perpUnitY : perpUnitY;
    
    // Calculate square corners
    const p1 = [0, height];
    const p2 = [base, 0];
    const p3 = [p2[0] + adjustedPerpUnitX * hypLen, p2[1] + adjustedPerpUnitY * hypLen];
    const p4 = [p1[0] + adjustedPerpUnitX * hypLen, p1[1] + adjustedPerpUnitY * hypLen];
    
    return [p1, p2, p3, p4];
  },
  
  calculateLabelPositions: (base, height) => {
    const hypPoints = GeometryUtils.calculateHypotenuseSquarePoints(base, height);
    const hypCenter = [
      (hypPoints[0][0] + hypPoints[2][0]) / 2,
      (hypPoints[0][1] + hypPoints[2][1]) / 2
    ];
    
    // Shift everything down by 2 units
    const verticalOffset = -2;
    
    return {
      baseSquare: [base / 2, -base / 2 + verticalOffset],
      heightSquare: [-height / 2, height / 2 + verticalOffset],
      hypotenuseSquare: [hypCenter[0], hypCenter[1] + verticalOffset],
      baseSide: [base / 2, -0.4 + verticalOffset],
      heightSide: [-0.5, height / 2 + verticalOffset],
      hypotenuseSide: [base / 2 - 0.3, height / 2 - 0.3 + verticalOffset]
    };
  }
};

// JSXGraph rendering functions
const JSXGraphRenderer = {
  clearBoard: (board) => {
    if (!board) return;
    
    board.suspendUpdate();
    
    // Get all object IDs and remove them safely
    const objectIds = Object.keys(board.objects || {});
    objectIds.forEach(id => {
      const obj = board.objects[id];
      if (obj && typeof obj.remove === 'function' && obj.type !== 'axis') {
        try {
          obj.remove();
        } catch (e) {
          // Silently handle removal errors
        }
      }
    });
    
    board.unsuspendUpdate();
  },
  
  createTriangle: (board, base, height) => {
    const verticalOffset = -2;
    const points = [
      board.create('point', [0, 0 + verticalOffset], { 
        visible: false, 
        fixed: true,
        name: '' // Remove label
      }),
      board.create('point', [base, 0 + verticalOffset], { 
        visible: false, 
        fixed: true,
        name: '' // Remove label
      }),
      board.create('point', [0, height + verticalOffset], { 
        visible: false, 
        fixed: true,
        name: '' // Remove label
      })
    ];
    
    // Create triangle with no labels
    const triangle = board.create('polygon', points, {
      fillColor: '#9c59b6',
      fillOpacity: 0.7,
      strokeWidth: 2,
      strokeColor: '#8e44ad',
      fixed: true,
      vertices: { visible: false },
      withLabel: false // Add this to ensure no labels
    });
    
    // Create right angle marker without label
    board.create('angle', [points[1], points[0], points[2]], {
      radius: 0.5,
      type: 'square',
      fillColor: 'black',
      fillOpacity: 0.2,
      strokeWidth: 1.5,
      fixed: true,
      withLabel: false // Add this to remove angle label
    });
    
    return { triangle, points };
  },
  
  createSquares: (board, base, height) => {
    const squares = {};
    const verticalOffset = -2;
    
    // Base square (red)
    squares.base = board.create('polygon', [
      [0, 0 + verticalOffset], [base, 0 + verticalOffset], 
      [base, -base + verticalOffset], [0, -base + verticalOffset]
    ], {
      fillColor: '#e74c3c',
      fillOpacity: 0.4,
      strokeWidth: 1.5,
      strokeColor: '#c0392b',
      fixed: true,
      vertices: { visible: false }
    });
    
    // Height square (blue)
    squares.height = board.create('polygon', [
      [0, 0 + verticalOffset], [0, height + verticalOffset], 
      [-height, height + verticalOffset], [-height, 0 + verticalOffset]
    ], {
      fillColor: '#3498db',
      fillOpacity: 0.4,
      strokeWidth: 1.5,
      strokeColor: '#2980b9',
      fixed: true,
      vertices: { visible: false }
    });
    
    // Hypotenuse square (green)
    const hypPoints = GeometryUtils.calculateHypotenuseSquarePoints(base, height).map(point => 
      [point[0], point[1] + verticalOffset]
    );
    squares.hypotenuse = board.create('polygon', hypPoints, {
      fillColor: '#2ecc71',
      fillOpacity: 0.4,
      strokeWidth: 1.5,
      strokeColor: '#27ae60',
      fixed: true,
      vertices: { visible: false }
    });
    
    return squares;
  },
  
  createAreaLabels: (board, areas, positions) => {
    const labels = {};
    
    labels.base = board.create('text', [
      positions.baseSquare[0], 
      positions.baseSquare[1], 
      `${areas.base} cm²`
    ], {
      fontSize: 16,
      color: '#c0392b',
      anchorX: 'middle',
      anchorY: 'middle',
      fixed: true
    });
    
    labels.height = board.create('text', [
      positions.heightSquare[0], 
      positions.heightSquare[1], 
      `${areas.height} cm²`
    ], {
      fontSize: 16,
      color: '#2980b9',
      anchorX: 'middle',
      anchorY: 'middle',
      fixed: true
    });
    
    labels.hypotenuse = board.create('text', [
      positions.hypotenuseSquare[0], 
      positions.hypotenuseSquare[1], 
      `${areas.hypotenuse} cm²`
    ], {
      fontSize: 16,
      color: '#27ae60',
      anchorX: 'middle',
      anchorY: 'middle',
      fixed: true
    });
    
    return labels;
  },
  
  createSideLengthLabels: (board, base, height, positions) => {
    const labels = {};
    
    labels.base = board.create('text', [
      positions.baseSide[0], 
      positions.baseSide[1], 
      `${base} cm`
    ], {
      fontSize: 14,
      color: '#333',
      anchorX: 'middle',
      anchorY: 'middle',
      fixed: true
    });
    
    labels.height = board.create('text', [
      positions.heightSide[0], 
      positions.heightSide[1], 
      `${height} cm`
    ], {
      fontSize: 14,
      color: '#333',
      anchorX: 'middle',
      anchorY: 'middle',
      rotate: 90,
      fixed: true
    });
    
    const hypotenuse = GeometryUtils.calculateHypotenuse(base, height);
    const hypAngle = Math.atan2(-height, base) * (180 / Math.PI);
    labels.hypotenuse = board.create('text', [
      positions.hypotenuseSide[0], 
      positions.hypotenuseSide[1], 
      `${hypotenuse.toFixed(1)} cm`
    ], {
      fontSize: 14,
      color: '#333',
      anchorX: 'middle',
      anchorY: 'middle',
      rotate: hypAngle,
      fixed: true
    });
    
    return labels;
  },
  
  createFormula: (board, base, height, areas) => {
    const hypotenuse = GeometryUtils.calculateHypotenuse(base, height);
    
    // Create background box
    const boxX = -6;
    const boxY = 6;
    
    board.create('polygon', [
      [boxX - 0.5, boxY - 0.5],
      [boxX + 7, boxY - 0.5],
      [boxX + 7, boxY + 2.5],
      [boxX - 0.5, boxY + 2.5]
    ], {
      fillColor: 'white',
      fillOpacity: 0.9,
      strokeColor: '#ddd',
      strokeWidth: 1,
      vertices: { visible: false },
      fixed: true
    });
    
    // Formula lines
    const formulas = [
      `a² + b² = c²`,
      `${base}² + ${height}² = ${hypotenuse.toFixed(1)}²`,
      `${areas.base} + ${areas.height} = ${areas.hypotenuse}`
    ];
    
    formulas.forEach((formula, index) => {
      board.create('text', [
        boxX, 
        boxY + 1.5 - (index * 0.6), 
        formula
      ], {
        fontSize: index === 0 ? 18 : 16,
        color: index === 0 ? '#333' : '#666',
        anchorX: 'left',
        anchorY: 'middle',
        fixed: true
      });
    });
  }
};

// Custom Slider Component
const Slider = ({ value, onChange, min, max, step, label, className }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-green-700">{label}: {value}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer slider ${className}`}
    />
    <style jsx>{`
      .slider::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #16a34a;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .slider::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #16a34a;
        cursor: pointer;
        border: none;
      }
    `}</style>
  </div>
);

// Toggle Button Component
const ToggleButton = ({ active, onClick, icon: Icon, label, title }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
      active 
        ? 'bg-green-500 text-white shadow-md transform scale-105' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
    title={title}
  >
    <Icon size={18} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// Main Visualization Component
const PythagorasVisualizationGraph = () => {
  // State management
  const [base, setBase] = useState(3);
  const [height, setHeight] = useState(4);
  const [showAreaLabels, setShowAreaLabels] = useState(true);
  const [showSideLengths, setShowSideLengths] = useState(true);
  const [showFormula, setShowFormula] = useState(false);
  
  const boardRef = useRef(null);
  const containerRef = useRef(null);
  
  // Memoized calculations
  const areas = useMemo(() => 
    GeometryUtils.calculateSquareAreas(base, height), 
    [base, height]
  );
  
  const positions = useMemo(() => 
    GeometryUtils.calculateLabelPositions(base, height), 
    [base, height]
  );
  
  // Board update function
  const updateBoard = useCallback((board) => {
    if (!board) return;
    
    // Clear existing objects
    JSXGraphRenderer.clearBoard(board);
    
    board.suspendUpdate();
    
    try {
      // Create triangle and squares (always visible)
      JSXGraphRenderer.createTriangle(board, base, height);
      JSXGraphRenderer.createSquares(board, base, height);
      
      // Conditionally create labels and formula
      if (showAreaLabels) {
        JSXGraphRenderer.createAreaLabels(board, areas, positions);
      }
      
      if (showSideLengths) {
        JSXGraphRenderer.createSideLengthLabels(board, base, height, positions);
      }
      
      if (showFormula) {
        JSXGraphRenderer.createFormula(board, base, height, areas);
      }
    } catch (error) {
      console.warn('JSXGraph rendering error:', error);
    }
    
    board.unsuspendUpdate();
  }, [base, height, showAreaLabels, showSideLengths, showFormula, areas, positions]);
  
  // Initialize board
  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const boardId = 'pythagoras-board-' + Math.random().toString(36).substr(2, 9);
    containerRef.current.id = boardId;
    
    try {
      // Calculate dynamic bounding box based on current dimensions
      const maxDimension = Math.max(base, height);
      const padding = Math.max(4, maxDimension * 0.8);
      const dynamicBoundingBox = [
        -maxDimension - padding,  // left
        maxDimension + padding,   // top  
        maxDimension + padding,   // right
        -maxDimension - padding   // bottom
      ];

      const board = JXG.JSXGraph.initBoard(boardId, {
        boundingbox: dynamicBoundingBox,
        axis: false,
        showCopyright: false,
        showNavigation: false,
        pan: { enabled: false },
        zoom: { enabled: false },
        keepAspectRatio: true
      });
      
      boardRef.current = board;
      updateBoard(board);
    } catch (error) {
      console.warn('Failed to initialize JSXGraph:', error);
    }
    
    return () => {
      if (boardRef.current) {
        try {
          JSXGraphRenderer.clearBoard(boardRef.current);
        } catch (error) {
          console.warn('Cleanup error:', error);
        }
      }
    };
  }, [base, height]); // Added dependencies
  
  // Update board when dependencies change
  React.useEffect(() => {
    if (boardRef.current) {
      updateBoard(boardRef.current);
    }
  }, [updateBoard]);
  
  // Reset function
  const resetToDefault = () => {
    setBase(3);
    setHeight(4);
    setShowAreaLabels(true);
    setShowSideLengths(true);
    setShowFormula(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          Interactive Pythagoras' Theorem
        </h2>
        <p className="text-gray-600">
          Explore how the areas of squares relate to the sides of a right triangle
        </p>
      </div>
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-green-50 rounded-lg">
        <Slider
          value={base}
          onChange={setBase}
          min={1}
          max={8}
          step={1}
          label="Base length"
        />
        <Slider
          value={height}
          onChange={setHeight}
          min={1}
          max={8}
          step={1}
          label="Height"
        />
      </div>
      
      {/* Toggle Controls */}
      <div className="flex flex-wrap justify-center gap-3 p-4 bg-gray-50 rounded-lg">
        <ToggleButton
          active={showAreaLabels}
          onClick={() => setShowAreaLabels(!showAreaLabels)}
          icon={Type}
          label="Area Labels"
          title="Toggle area labels on squares"
        />
        <ToggleButton
          active={showSideLengths}
          onClick={() => setShowSideLengths(!showSideLengths)}
          icon={Ruler}
          label="Side Lengths"
          title="Toggle side length labels"
        />
        <ToggleButton
          active={showFormula}
          onClick={() => setShowFormula(!showFormula)}
          icon={HelpCircle}
          label="Show Formula"
          title="Show Pythagoras formula"
        />
        <button
          onClick={resetToDefault}
          className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          title="Reset to default values"
        >
          <RotateCcw size={18} />
          <span className="text-sm font-medium">Reset</span>
        </button>
      </div>
      
      {/* Visualization */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg shadow-inner">
        <div
          ref={containerRef}
          className="w-full"
          style={{ height: '500px' }}
        />
      </div>
      
      {/* Information Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600">
            {areas.base} cm²
          </div>
          <div className="text-sm text-gray-600">Base Square</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {areas.height} cm²
          </div>
          <div className="text-sm text-gray-600">Height Square</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {areas.hypotenuse} cm²
          </div>
          <div className="text-sm text-gray-600">Hypotenuse Square</div>
        </div>
      </div>
      
      {/* Mathematical Relationship */}
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <div className="text-lg font-mono">
          {areas.base} + {areas.height} = {areas.hypotenuse}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Red square + Blue square = Green square
        </div>
      </div>
    </div>
  );
};

export default PythagorasVisualizationGraph;