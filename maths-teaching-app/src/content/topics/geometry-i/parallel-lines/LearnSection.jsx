// src/content/topics/geometry-i/parallel-lines/LearnSection.jsx
// Angles in Parallel Lines - Discovery-based learning
// Three phases: Discovery → Puzzle → Vocabulary

import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

// ============================================
// DISCOVERY DIAGRAM - Two lines crossing horizontal
// Supports full range of angles (30-150)
// ============================================
const DiscoveryDiagram = ({ angle1, angle2, showProjection = true }) => {
  const lineY = 0, lineLength = 300;
  const int1X = -80, int2X = 80;
  
  const toRad = (a) => (a * Math.PI) / 180;
  const tan1 = Math.tan(toRad(angle1));
  const tan2 = Math.tan(toRad(angle2));
  
  const getLineEndpoints = (intX, angle, length = 120) => {
    const tanA = Math.tan(toRad(angle));
    const dir = { x: 1, y: -tanA };
    const len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
    return {
      start: { x: intX - dir.x / len * length, y: lineY + tanA / len * length },
      end: { x: intX + dir.x / len * length, y: lineY - tanA / len * length }
    };
  };
  
  const line1 = getLineEndpoints(int1X, angle1);
  const line2 = getLineEndpoints(int2X, angle2);
  
  // Calculate intersection point
  let intersectionPoint = null, intersectionStatus = 'parallel';
  if (Math.abs(tan1 - tan2) > 0.001) {
    const intX = (tan1 * int1X - tan2 * int2X) / (tan1 - tan2);
    const intY = tan1 * (intX - int1X);
    intersectionPoint = { x: intX, y: -intY };
    intersectionStatus = intY > 5 ? 'above' : intY < -5 ? 'below' : 'parallel';
  }
  
  // Create angle arc
  const createArc = (intX, angle, radius = 22) => {
    const tanA = Math.tan(toRad(angle));
    const transAngle = Math.atan2(-tanA, 1);
    
    const horizLeft = Math.PI;
    const startAngle = horizLeft;
    const endAngle = transAngle;
    
    const start = { x: intX + Math.cos(startAngle) * radius, y: Math.sin(startAngle) * radius };
    const end = { x: intX + Math.cos(endAngle) * radius, y: Math.sin(endAngle) * radius };
    
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 2 * Math.PI;
    const largeArc = diff > Math.PI ? 1 : 0;
    
    // Label always in upper-left quadrant
    const labelAngle = Math.PI * 0.75;
    
    return {
      sector: `M ${intX} 0 L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`,
      arc: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      label: { x: intX + Math.cos(labelAngle) * (radius + 14), y: Math.sin(labelAngle) * (radius + 14) },
      displayAngle: 180 - angle
    };
  };
  
  const arc1 = createArc(int1X, angle1);
  const arc2 = createArc(int2X, angle2);
  const areEqual = Math.abs(angle1 - angle2) < 1;

  return (
    <svg viewBox="-180 -140 360 280" className="w-full h-full">
      {showProjection && intersectionPoint && Math.abs(intersectionPoint.y) < 200 && <>
        <line x1={line1.end.x} y1={line1.end.y} x2={intersectionPoint.x} y2={intersectionPoint.y} stroke="#bdc3c7" strokeWidth={1.5} strokeDasharray="5,5" />
        <line x1={line2.end.x} y1={line2.end.y} x2={intersectionPoint.x} y2={intersectionPoint.y} stroke="#bdc3c7" strokeWidth={1.5} strokeDasharray="5,5" />
        <circle cx={intersectionPoint.x} cy={intersectionPoint.y} r={5} fill="#e74c3c" />
      </>}
      <line x1={-lineLength/2} y1={0} x2={lineLength/2} y2={0} stroke="#2c3e50" strokeWidth={3} />
      <line x1={line1.start.x} y1={line1.start.y} x2={line1.end.x} y2={line1.end.y} stroke="#3498db" strokeWidth={2.5} />
      <line x1={line2.start.x} y1={line2.start.y} x2={line2.end.x} y2={line2.end.y} stroke="#e74c3c" strokeWidth={2.5} />
      <path d={arc1.sector} fill="#3498db" fillOpacity={0.3} /><path d={arc1.arc} fill="none" stroke="#3498db" strokeWidth={2} />
      <text x={arc1.label.x} y={arc1.label.y} fontSize={13} fill="#3498db" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{arc1.displayAngle}°</text>
      <path d={arc2.sector} fill="#e74c3c" fillOpacity={0.3} /><path d={arc2.arc} fill="none" stroke="#e74c3c" strokeWidth={2} />
      <text x={arc2.label.x} y={arc2.label.y} fontSize={13} fill="#e74c3c" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{arc2.displayAngle}°</text>
      <circle cx={int1X} cy={0} r={4} fill="#3498db" /><circle cx={int2X} cy={0} r={4} fill="#e74c3c" />
      {intersectionStatus === 'above' && <text x={0} y={-115} fontSize={14} fill="#e74c3c" textAnchor="middle" fontWeight="bold">Lines meet ABOVE ↑</text>}
      {intersectionStatus === 'below' && <text x={0} y={115} fontSize={14} fill="#e74c3c" textAnchor="middle" fontWeight="bold">Lines meet BELOW ↓</text>}
      {areEqual && <text x={0} y={-115} fontSize={14} fill="#27ae60" textAnchor="middle" fontWeight="bold">✓ PARALLEL</text>}
    </svg>
  );
};

// ============================================
// PUZZLE DIAGRAM
// ============================================
const PuzzleDiagram = ({ lines, parallelPairs, showAnswers }) => {
  const toRad = (a) => (a * Math.PI) / 180;
  
  const createArc = (x, y, angle, side, r = 18) => {
    const tanA = Math.tan(toRad(angle));
    const transAngle = Math.atan2(-tanA, 1);
    const horizLeft = Math.PI, horizRight = 0;
    
    const [s, e] = side === 'left' ? [horizLeft, transAngle] : [transAngle, horizRight];
    const start = { x: x + Math.cos(s) * r, y: y + Math.sin(s) * r };
    const end = { x: x + Math.cos(e) * r, y: y + Math.sin(e) * r };
    
    let diff = e - s; if (diff < 0) diff += 2 * Math.PI;
    const mid = s + diff / 2;
    
    return { 
      sector: `M ${x} ${y} L ${start.x} ${start.y} A ${r} ${r} 0 ${diff > Math.PI ? 1 : 0} 1 ${end.x} ${end.y} Z`,
      arc: `M ${start.x} ${start.y} A ${r} ${r} 0 ${diff > Math.PI ? 1 : 0} 1 ${end.x} ${end.y}`,
      label: { x: x + Math.cos(mid) * (r + 12), y: y + Math.sin(mid) * (r + 12) } 
    };
  };
  
  const getLine = (x, y, angle, len = 80) => {
    const tanA = Math.tan(toRad(angle));
    const d = { x: 1 / Math.sqrt(1 + tanA * tanA), y: -tanA / Math.sqrt(1 + tanA * tanA) };
    return { s: { x: x - d.x * len, y: y - d.y * len }, e: { x: x + d.x * len, y: y + d.y * len } };
  };

  return (
    <svg viewBox="-220 -110 440 220" className="w-full h-full">
      <line x1={-200} y1={0} x2={200} y2={0} stroke="#2c3e50" strokeWidth={3} />
      {lines.map((l, i) => {
        const ln = getLine(l.x, l.y || 0, l.angle);
        const arc = createArc(l.x, l.y || 0, l.angle, l.labelSide);
        const isP = showAnswers && parallelPairs.some(p => p.includes(l.label));
        const col = isP ? '#27ae60' : '#7f8c8d';
        
        const labelX = ln.s.x - 15;
        const labelY = ln.s.y - 5;
        
        return <g key={i}>
          <line x1={ln.s.x} y1={ln.s.y} x2={ln.e.x} y2={ln.e.y} stroke={col} strokeWidth={2} />
          <path d={arc.sector} fill={col} fillOpacity={0.3} /><path d={arc.arc} fill="none" stroke={col} strokeWidth={1.5} />
          <text x={arc.label.x} y={arc.label.y} fontSize={11} fill={isP ? '#27ae60' : '#2c3e50'} fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{l.displayAngle}°</text>
          <text x={labelX} y={labelY} fontSize={14} fill={isP ? '#27ae60' : '#2c3e50'} fontWeight="bold" textAnchor="middle">{l.label}</text>
          <circle cx={l.x} cy={l.y || 0} r={3} fill="#2c3e50" />
        </g>;
      })}
    </svg>
  );
};

// ============================================
// ANGLE TYPES DIAGRAM
// ============================================
const AngleTypesDiagram = ({ angleType }) => {
  const gap = 90, angle = 65;
  const line1Y = -gap / 2, line2Y = gap / 2;
  const tanA = Math.tan((angle * Math.PI) / 180);
  const int1 = { x: -line1Y / tanA, y: line1Y }, int2 = { x: -line2Y / tanA, y: line2Y };
  const types = { corresponding: [1, 5], alternate: [4, 5], cointerior: [3, 5] };
  const positions = types[angleType] || [1, 5];
  
  const createArc = (pos, r = 24) => {
    const int = pos <= 4 ? int1 : int2;
    const transAngle = Math.atan2(-tanA, 1);
    const angles = { 
      1: [Math.PI, transAngle], 2: [transAngle, 0], 
      3: [transAngle + Math.PI, Math.PI], 4: [0, transAngle + Math.PI],
      5: [Math.PI, transAngle], 6: [transAngle, 0], 
      7: [transAngle + Math.PI, Math.PI], 8: [0, transAngle + Math.PI] 
    };
    const [s, e] = angles[pos];
    const start = { x: int.x + Math.cos(s) * r, y: int.y + Math.sin(s) * r };
    const end = { x: int.x + Math.cos(e) * r, y: int.y + Math.sin(e) * r };
    let diff = e - s; if (diff < 0) diff += 2 * Math.PI;
    const mid = s + diff / 2;
    const val = [1, 4, 5, 8].includes(pos) ? angle : 180 - angle;
    return { 
      sector: `M ${int.x} ${int.y} L ${start.x} ${start.y} A ${r} ${r} 0 ${diff > Math.PI ? 1 : 0} 1 ${end.x} ${end.y} Z`,
      arc: `M ${start.x} ${start.y} A ${r} ${r} 0 ${diff > Math.PI ? 1 : 0} 1 ${end.x} ${end.y}`,
      label: { x: int.x + Math.cos(mid) * (r + 16), y: int.y + Math.sin(mid) * (r + 16) }, 
      val 
    };
  };
  
  const ext = 45;
  const dir = { x: 1 / Math.sqrt(1 + tanA * tanA), y: -tanA / Math.sqrt(1 + tanA * tanA) };
  const transStart = { x: int2.x - dir.x * ext, y: int2.y - dir.y * ext };
  const transEnd = { x: int1.x + dir.x * ext, y: int1.y + dir.y * ext };
  const colors = ['#e74c3c', '#3498db'];

  return (
    <svg viewBox="-140 -100 280 200" className="w-full h-full">
      <rect x={-120} y={line1Y} width={240} height={gap} fill="#f0f0f0" fillOpacity={0.5} />
      <line x1={-120} y1={line1Y} x2={120} y2={line1Y} stroke="#2c3e50" strokeWidth={2.5} />
      <line x1={-120} y1={line2Y} x2={120} y2={line2Y} stroke="#2c3e50" strokeWidth={2.5} />
      <polyline points={`-70,${line1Y-5} -60,${line1Y} -70,${line1Y+5}`} fill="none" stroke="#9b59b6" strokeWidth={2.5} />
      <polyline points={`-70,${line2Y-5} -60,${line2Y} -70,${line2Y+5}`} fill="none" stroke="#9b59b6" strokeWidth={2.5} />
      <line x1={transStart.x} y1={transStart.y} x2={transEnd.x} y2={transEnd.y} stroke="#2c3e50" strokeWidth={2.5} />
      {positions.map((pos, i) => {
        const arc = createArc(pos);
        return <g key={pos}>
          <path d={arc.sector} fill={colors[i]} fillOpacity={0.35} />
          <path d={arc.arc} fill="none" stroke={colors[i]} strokeWidth={2.5} />
          <text x={arc.label.x} y={arc.label.y} fontSize={13} fill={colors[i]} fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{arc.val}°</text>
        </g>;
      })}
      <circle cx={int1.x} cy={int1.y} r={4} fill="#2c3e50" />
      <circle cx={int2.x} cy={int2.y} r={4} fill="#2c3e50" />
      <text x={90} y={0} fontSize={10} fill="#999" textAnchor="middle">interior</text>
    </svg>
  );
};

// ============================================
// PUZZLE DATA
// ============================================
const puzzles = [
  { 
    lines: [
      { label: 'A', x: -140, y: 0, angle: 65, labelSide: 'left', displayAngle: 65 },
      { label: 'B', x: -70, y: 0, angle: 91, labelSide: 'right', displayAngle: 89 },
      { label: 'C', x: 0, y: 0, angle: 65, labelSide: 'left', displayAngle: 65 },
      { label: 'D', x: 70, y: 0, angle: 52, labelSide: 'right', displayAngle: 128 },
      { label: 'E', x: 140, y: 0, angle: 89, labelSide: 'left', displayAngle: 89 },
    ],
    parallelPairs: [['A', 'C']], 
    explanation: 'A and C both make 65° on the LEFT side — they\'re parallel!\n\nB shows 89° on the RIGHT side. Angles on a straight line = 180°, so its actual angle is 180° - 89° = 91°.\n\nE shows 89° on the LEFT. That\'s not equal to B\'s 91°, so they\'re NOT parallel!'
  },
  { 
    lines: [
      { label: 'P', x: -140, y: 0, angle: 130, labelSide: 'left', displayAngle: 50 },
      { label: 'Q', x: -70, y: 0, angle: 130, labelSide: 'right', displayAngle: 50 },
      { label: 'R', x: 0, y: 0, angle: 75, labelSide: 'left', displayAngle: 75 },
      { label: 'S', x: 70, y: 0, angle: 75, labelSide: 'right', displayAngle: 105 },
      { label: 'T', x: 140, y: 0, angle: 50, labelSide: 'left', displayAngle: 50 },
    ],
    parallelPairs: [['P', 'Q'], ['R', 'S']], 
    explanation: 'P shows 50° (the acute angle). Q shows 50° on the RIGHT. 180° - 50° = 130° actual angle.\nBut wait - P\'s actual angle is also 130° (it\'s obtuse). They\'re parallel!\n\nR = 75° on left. S = 105° on right → 180° - 105° = 75°. Parallel!\n\nT = 50° on left. Q = 130° actual. NOT the same, NOT parallel!'
  }
];

const typeInfo = { 
  corresponding: { name: 'Corresponding', rel: 'EQUAL', col: 'bg-blue-500' },
  alternate: { name: 'Alternate', rel: 'EQUAL', col: 'bg-green-500' },
  cointerior: { name: 'Co-interior', rel: 'SUM = 180°', col: 'bg-orange-500' } 
};

// ============================================
// MAIN LEARN SECTION COMPONENT
// ============================================
const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');
  
  const [phase, setPhase] = useState(1);
  const [angle1, setAngle1] = useState(55);
  const [angle2, setAngle2] = useState(70);
  const [showProj, setShowProj] = useState(true);
  const [puzzle, setPuzzle] = useState(0);
  const [angleType, setAngleType] = useState('corresponding');

  return (
    <div className="space-y-6 mb-8">
      <Card className="border-2 border-t-4 border-green-500 shadow-md overflow-hidden">
        <CardContent className="p-6">
          {/* Header with Phase Navigation */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Angles in Parallel Lines
            </h3>
            <div className="flex gap-1">
              {[1, 2, 3].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPhase(p)}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                    phase === p 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* PHASE 1: Discovery */}
          {phase === 1 && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-800 font-medium">🔍 Discovery: When are lines parallel?</p>
                <p className="text-blue-700 text-sm">Adjust angles. Watch where lines meet. What happens when equal?</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl border p-2" style={{ minHeight: '320px' }}>
                  <DiscoveryDiagram angle1={angle1} angle2={angle2} showProjection={showProj} />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-600 font-medium">Blue line:</span>
                      <span className="font-bold">{180 - angle1}°</span>
                    </div>
                    <input 
                      type="range" 
                      min={30} 
                      max={150} 
                      value={180 - angle1} 
                      onChange={e => setAngle1(180 - +e.target.value)} 
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-600 font-medium">Red line:</span>
                      <span className="font-bold">{180 - angle2}°</span>
                    </div>
                    <input 
                      type="range" 
                      min={30} 
                      max={150} 
                      value={180 - angle2} 
                      onChange={e => setAngle2(180 - +e.target.value)} 
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                  
                  <button 
                    onClick={() => setShowProj(!showProj)} 
                    className={`w-full py-2 rounded-lg font-medium transition-all ${
                      showProj ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {showProj ? '👁 Hide' : 'Show'} meeting point
                  </button>
                  
                  <button 
                    onClick={() => setAngle2(angle1)} 
                    className="w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                  >
                    Make angles equal
                  </button>
                  
                  <div className={`p-4 rounded-lg border-2 text-center font-medium ${
                    Math.abs(angle1 - angle2) < 1 
                      ? 'bg-green-50 border-green-500 text-green-700' 
                      : 'bg-yellow-50 border-yellow-400 text-yellow-700'
                  }`}>
                    {Math.abs(angle1 - angle2) < 1 
                      ? '✓ Equal angles = Parallel lines!' 
                      : `Difference: ${Math.abs((180-angle1) - (180-angle2))}°`
                    }
                  </div>
                </div>
              </div>

              {/* Teacher Notes - Phase 1 */}
              {showAnswers && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Teaching Notes: Bringing This Slide to Life
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-3">How to Use This Visual</h4>
                      <ol className="list-decimal list-inside space-y-2 text-green-700 text-sm">
                        <li>Start with angles clearly different - show they meet</li>
                        <li>Ask: "What happens to the meeting point as angles get closer?"</li>
                        <li>Gradually make angles more similar</li>
                        <li>Ask: "Where is the meeting point now?"</li>
                        <li>Click "Make angles equal" for the reveal</li>
                        <li>Key moment: "The meeting point is at infinity!"</li>
                      </ol>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-3">Key Questions</h4>
                      <ul className="list-disc list-inside space-y-2 text-blue-700 text-sm">
                        <li>"If the lines meet above, which angle is bigger?"</li>
                        <li>"Can you make them meet below?"</li>
                        <li>"What's special about when they're equal?"</li>
                        <li>"So how can we TEST if two lines are parallel?"</li>
                        <li>"What about obtuse angles - does the rule still work?"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* PHASE 2: Puzzle */}
          {phase === 2 && (
            <>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <p className="text-purple-800 font-medium">🧩 Puzzle: Which lines are parallel?</p>
                <p className="text-purple-700 text-sm">Watch out! Some angles shown on left, some on right. Angles on a straight line = 180°!</p>
              </div>
              
              <div className="flex gap-2 justify-center mb-4">
                {puzzles.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPuzzle(i)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      puzzle === i ? 'bg-purple-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Puzzle {i + 1}
                  </button>
                ))}
              </div>
              
              <div className="bg-slate-50 rounded-xl border p-2 mb-4" style={{ minHeight: '240px' }}>
                <PuzzleDiagram 
                  lines={puzzles[puzzle].lines} 
                  parallelPairs={puzzles[puzzle].parallelPairs} 
                  showAnswers={showAnswers} 
                />
              </div>
              
              {showAnswers && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium mb-2">
                    Parallel pairs: {puzzles[puzzle].parallelPairs.map(p => p.join(' & ')).join(', ')}
                  </p>
                  <p className="text-green-700 text-sm whitespace-pre-line">{puzzles[puzzle].explanation}</p>
                </div>
              )}

              {/* Teacher Notes - Phase 2 */}
              {showAnswers && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Teaching Notes: Bringing This Slide to Life
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-3">How to Use This Visual</h4>
                      <ol className="list-decimal list-inside space-y-2 text-green-700 text-sm">
                        <li>Give students 30 seconds to find parallel pairs</li>
                        <li>Ask: "Who thinks A and E are parallel?" (common mistake)</li>
                        <li>Challenge: "But they both say 65° and 89°..."</li>
                        <li>Key question: "Which SIDE is the angle on?"</li>
                        <li>Draw angles on a straight line = 180° on board</li>
                        <li>Work through converting right-side angles</li>
                      </ol>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-3">Key Questions</h4>
                      <ul className="list-disc list-inside space-y-2 text-blue-700 text-sm">
                        <li>"B shows 89° - but is that its ACTUAL angle?"</li>
                        <li>"How do we convert a right-side angle?"</li>
                        <li>"Why is this a common exam trap?"</li>
                        <li>"What's the quick check for parallel lines?"</li>
                        <li>"Could two lines showing 89° NOT be parallel?"</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 md:col-span-2">
                      <h4 className="font-medium text-amber-800 mb-3">Common Misconceptions</h4>
                      <ul className="list-disc list-inside space-y-2 text-amber-700 text-sm">
                        <li><strong>Matching numbers:</strong> Students see "89° and 89°" and assume parallel without checking which side</li>
                        <li><strong>Ignoring side:</strong> Not realising left-side and right-side angles are supplementary</li>
                        <li><strong>Obtuse confusion:</strong> Students may think 130° and 50° can't be the same line's angle</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* PHASE 3: Angle Types */}
          {phase === 3 && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 font-medium">📚 Angle Types</p>
                <p className="text-green-700 text-sm">Interior = between lines. Alternate = different sides. Co-interior = same side.</p>
              </div>
              
              <div className="flex gap-2 justify-center mb-4">
                {Object.entries(typeInfo).map(([k, v]) => (
                  <button 
                    key={k} 
                    onClick={() => setAngleType(k)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      angleType === k ? `${v.col} text-white` : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
              
              <div className="bg-slate-50 rounded-xl border p-2 mb-4" style={{ minHeight: '240px' }}>
                <AngleTypesDiagram angleType={angleType} />
              </div>
              
              <div className={`p-4 rounded-lg border-2 text-center ${typeInfo[angleType].col.replace('bg-', 'border-')}`}>
                <p className="font-bold text-lg">{typeInfo[angleType].name} Angles</p>
                <p className={`font-bold text-xl mt-1 ${angleType === 'cointerior' ? 'text-orange-600' : 'text-green-600'}`}>
                  {typeInfo[angleType].rel}
                </p>
              </div>
              
              {/* Summary Table */}
              <table className="w-full mt-4 text-sm border-collapse">
                <thead>
                  <tr className="bg-green-500 text-white">
                    <th className="border border-green-600 p-2">Type</th>
                    <th className="border border-green-600 p-2">Region</th>
                    <th className="border border-green-600 p-2">Side of Transversal</th>
                    <th className="border border-green-600 p-2">Rule</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50">
                    <td className="border p-2">Corresponding</td>
                    <td className="border p-2">Same (both ext. or both int.)</td>
                    <td className="border p-2">Same</td>
                    <td className="border p-2 text-green-600 font-bold">Equal</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border p-2">Alternate</td>
                    <td className="border p-2">Interior</td>
                    <td className="border p-2 font-bold text-purple-600">Different</td>
                    <td className="border p-2 text-green-600 font-bold">Equal</td>
                  </tr>
                  <tr className="bg-orange-50">
                    <td className="border p-2">Co-interior</td>
                    <td className="border p-2">Interior</td>
                    <td className="border p-2">Same</td>
                    <td className="border p-2 text-orange-600 font-bold">Sum = 180°</td>
                  </tr>
                </tbody>
              </table>

              {/* Teacher Notes - Phase 3 */}
              {showAnswers && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Teaching Notes: Bringing This Slide to Life
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-3">How to Use This Visual</h4>
                      <ol className="list-decimal list-inside space-y-2 text-green-700 text-sm">
                        <li>Click each angle type - ask students to describe position</li>
                        <li>Build vocabulary: "interior", "exterior", "transversal"</li>
                        <li>For alternate: trace the Z-shape with your finger</li>
                        <li>For co-interior: emphasise SAME side = supplementary</li>
                        <li>Use table to consolidate - cover answers and test</li>
                      </ol>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-3">Key Questions</h4>
                      <ul className="list-disc list-inside space-y-2 text-blue-700 text-sm">
                        <li>"What does 'interior' mean here?"</li>
                        <li>"Why are alternate angles equal, not adding to 180°?"</li>
                        <li>"What's different about co-interior?"</li>
                        <li>"F, Z, C - which letter matches which type?"</li>
                        <li>"If I know one angle, how do I find its alternate?"</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 md:col-span-2">
                      <h4 className="font-medium text-purple-800 mb-3">The Key Insight</h4>
                      <p className="text-purple-700 text-sm">
                        <strong>Alternate angles</strong> are equal because they're on <strong>different sides</strong> of the transversal.<br/>
                        <strong>Co-interior angles</strong> sum to 180° because they're on the <strong>same side</strong>.<br/><br/>
                        The F, Z, C shapes are memory aids, but understanding <em>why</em> (interior/exterior + same/different side) is more powerful for problem-solving.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSection;