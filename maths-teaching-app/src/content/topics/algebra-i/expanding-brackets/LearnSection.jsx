// src/content/topics/algebra-i/expanding-brackets/LearnSection.jsx
import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');
  
  // State for controlling the visualization
  const [showSplit, setShowSplit] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  
  // Example problems
  const examples = [
    {
      title: "Example 1",
      firstBracket: { a: 10, b: 2 },
      secondBracket: { c: 10, d: 5 },
      isNumeric: true
    },
    {
      title: "Example 2", 
      firstBracket: { a: 20, b: 3 },
      secondBracket: { c: 15, d: 4 },
      isNumeric: true
    },
    {
      title: "Example 3",
      firstBracket: { a: 12, b: 8 },
      secondBracket: { c: 15, d: 7 },
      isNumeric: true
    },
    {
      title: "Example 4",
      firstBracket: { a: "x", b: 3 },
      secondBracket: { c: "x", d: 2 },
      isNumeric: false
    },
    {
      title: "Example 5",
      firstBracket: { a: "2x", b: 1 },
      secondBracket: { c: "x", d: 4 },
      isNumeric: false
    },
    {
      title: "Example 6",
      firstBracket: { a: "a", b: "b" },
      secondBracket: { c: "c", d: "d" },
      isNumeric: false
    }
  ];
  
  const currentEx = examples[currentExample];
  
  // Calculate areas for numeric examples
  const calculateArea = (val1, val2) => {
    if (typeof val1 === 'number' && typeof val2 === 'number') {
      return val1 * val2;
    }
    return `${val1} × ${val2}`;
  };
  
  const getTotalWidth = () => {
    const { a, b } = currentEx.firstBracket;
    if (typeof a === 'number' && typeof b === 'number') {
      return a + b;
    }
    return `${a} + ${b}`;
  };
  
  const getTotalHeight = () => {
    const { c, d } = currentEx.secondBracket;
    if (typeof c === 'number' && typeof d === 'number') {
      return c + d;
    }
    return `${c} + ${d}`;
  };

  return (
    <div className="space-y-6">
      <Card className={`border-t-4 border-${theme.primary}`}>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Expanding Double Brackets Using Area Models</h2>
          
          {/* Example Navigation */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentExample(index);
                    setShowSplit(false); // Reset split when changing examples
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentExample === index
                      ? `bg-${theme.primary} text-white`
                      : `bg-${theme.secondary} text-${theme.secondaryText} hover:bg-${theme.primary} hover:text-white`
                  }`}
                >
                  {example.title}
                </button>
              ))}
            </div>
          </div>

          {/* Current Example Expression - Clean and Simple */}
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <MathDisplay 
                math={`(${currentEx.firstBracket.a} + ${currentEx.firstBracket.b}) \\times (${currentEx.secondBracket.c} + ${currentEx.secondBracket.d})`} 
                size="x-large" 
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowSplit(!showSplit)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                showSplit 
                  ? `bg-${theme.primary} text-white` 
                  : `bg-${theme.secondary} text-${theme.secondaryText} hover:bg-${theme.primary} hover:text-white`
              }`}
            >
              {showSplit ? 'Hide Split' : 'Show Split'}
            </button>
          </div>

          {/* Area Model Visualization */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <AreaModelVisualization 
                example={currentEx}
                showSplit={showSplit}
                calculateArea={calculateArea}
                getTotalWidth={getTotalWidth}
                getTotalHeight={getTotalHeight}
              />
            </div>
          </div>

          {/* Algebraic Steps - Minimal, Teacher-Led */}
          {showSplit && (
            <div className={`bg-${theme.pastelBg} p-6 rounded-lg mb-6`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-300">
                  <div className="font-bold text-blue-800 text-lg mb-2">First</div>
                  <div className="text-3xl font-mono bg-white p-2 rounded border-2 border-dashed border-blue-300 min-h-[60px] flex items-center justify-center">
                    {/* Empty box for teacher to fill in */}
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
                  <div className="font-bold text-green-800 text-lg mb-2">Outside</div>
                  <div className="text-3xl font-mono bg-white p-2 rounded border-2 border-dashed border-green-300 min-h-[60px] flex items-center justify-center">
                    {/* Empty box for teacher to fill in */}
                  </div>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg border-2 border-orange-300">
                  <div className="font-bold text-orange-800 text-lg mb-2">Inside</div>
                  <div className="text-3xl font-mono bg-white p-2 rounded border-2 border-dashed border-orange-300 min-h-[60px] flex items-center justify-center">
                    {/* Empty box for teacher to fill in */}
                  </div>
                </div>
                <div className="bg-red-100 p-4 rounded-lg border-2 border-red-300">
                  <div className="font-bold text-red-800 text-lg mb-2">Last</div>
                  <div className="text-3xl font-mono bg-white p-2 rounded border-2 border-dashed border-red-300 min-h-[60px] flex items-center justify-center">
                    {/* Empty box for teacher to fill in */}
                  </div>
                </div>
              </div>
              
              {/* Final Answer Box */}
              <div className="mt-6 text-center">
                <div className="inline-block bg-white p-4 rounded-lg border-2 border-dashed border-gray-400">
                  <div className="text-lg font-semibold text-gray-700 mb-2">Final Answer:</div>
                  <div className="text-3xl font-mono min-h-[60px] min-w-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                    {/* Empty box for teacher to write final expanded form */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Teacher Guidance - only shown when answers are toggled on */}
          {showAnswers && (
            <div className={`mt-8 border-t border-${theme.borderColor} pt-6`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Guidance & Discussion Questions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-3">Discussion Questions</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700">
                    <li>Before showing the split: "What is {getTotalWidth()} × {getTotalHeight()}?"</li>
                    <li>After showing split: "How many rectangles do you see? What are their areas?"</li>
                    <li>"Why does splitting the rectangle this way help us expand brackets?"</li>
                    <li>"Can you see the FOIL pattern in the four rectangles?"</li>
                    <li>"What happens if we change the numbers? Will the method still work?"</li>
                    <li>"How does this connect to the distributive property we learned earlier?"</li>
                  </ul>
                </div>
                
                <div className={`bg-${theme.pastelBg} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-${theme.pastelText} mb-3`}>Key Teaching Points</h4>
                  <ul className={`list-disc list-inside space-y-2 text-${theme.secondaryText}`}>
                    <li>The total area remains the same whether we split it or not</li>
                    <li>Each small rectangle represents one term in the expansion</li>
                    <li>FOIL is just a way to remember the four multiplications</li>
                    <li>This method works for any two brackets, not just with numbers</li>
                    <li>Common mistake: Students forget the "middle terms" (Outside + Inside)</li>
                    <li>Extension: This leads naturally to expanding (x+a)² patterns</li>
                  </ul>
                </div>
              </div>

              <div className={`mt-6 bg-${theme.pastelBg} p-4 rounded-lg`}>
                <h4 className={`font-medium text-${theme.pastelText} mb-3`}>Classroom Activities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Interactive Activities</h5>
                    <ul className={`list-decimal list-inside space-y-1 text-${theme.secondaryText}`}>
                      <li>Have students predict the total area before splitting</li>
                      <li>Ask them to identify which rectangle is largest/smallest</li>
                      <li>Challenge: Create their own bracket expansion using this model</li>
                      <li>Connect to real-world: Room extensions, garden planning</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Assessment Opportunities</h5>
                    <ul className={`list-decimal list-inside space-y-1 text-${theme.secondaryText}`}>
                      <li>Can students explain why the method works?</li>
                      <li>Do they correctly identify all four terms?</li>
                      <li>Can they apply this to expand (x+3)(x+5)?</li>
                      <li>Extension: What about (2x+1)(x+4)?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Area Model Visualization Component
const AreaModelVisualization = ({ example, showSplit, calculateArea, getTotalWidth, getTotalHeight }) => {
  const { a, b } = example.firstBracket;
  const { c, d } = example.secondBracket;
  
  // Calculate proportional dimensions for visual representation
  const getProportionalWidth = (value) => {
    if (typeof value === 'number') {
      const total = typeof a === 'number' && typeof b === 'number' ? a + b : 12;
      return (value / total) * 300;
    }
    // For variables, use consistent proportional sizing
    if (value === 'x' || value === '2x') return 200; // Larger consistent size for x terms
    if (value === 'a') return 150; // Consistent size for 'a'
    if (value === 'b') return 150; // Consistent size for 'b'
    return 150; // Default consistent size for any other variables
  };
  
  const getProportionalHeight = (value) => {
    if (typeof value === 'number') {
      const total = typeof c === 'number' && typeof d === 'number' ? c + d : 12;
      return (value / total) * 200;
    }
    // For variables, use consistent proportional sizing
    if (value === 'x' || value === '2x') return 130; // Larger consistent size for x terms
    if (value === 'c') return 100; // Consistent size for 'c'
    if (value === 'd') return 100; // Consistent size for 'd'
    return 100; // Default consistent size for any other variables
  };
  
  const widthA = getProportionalWidth(a);
  const widthB = getProportionalWidth(b);
  const heightC = getProportionalHeight(c);
  const heightD = getProportionalHeight(d);
  
  const totalWidth = widthA + widthB;
  const totalHeight = heightC + heightD;

  return (
    <div className="relative">
      <svg width={totalWidth + 100} height={totalHeight + 100} className="border rounded">
        {/* Main rectangle */}
        <rect
          x={50}
          y={50}
          width={totalWidth}
          height={totalHeight}
          fill={showSplit ? "transparent" : "#e3f2fd"}
          stroke="#1976d2"
          strokeWidth="3"
        />
        
        {/* Split rectangles */}
        {showSplit && (
          <>
            {/* Top-left: a × c */}
            <rect
              x={50}
              y={50}
              width={widthA}
              height={heightC}
              fill="#bbdefb"
              stroke="#1976d2"
              strokeWidth="2"
            />
            
            {/* Top-right: a × d */}
            <rect
              x={50 + widthA}
              y={50}
              width={widthB}
              height={heightC}
              fill="#c8e6c9"
              stroke="#388e3c"
              strokeWidth="2"
            />
            
            {/* Bottom-left: b × c */}
            <rect
              x={50}
              y={50 + heightC}
              width={widthA}
              height={heightD}
              fill="#ffe0b2"
              stroke="#f57c00"
              strokeWidth="2"
            />
            
            {/* Bottom-right: b × d */}
            <rect
              x={50 + widthA}
              y={50 + heightC}
              width={widthB}
              height={heightD}
              fill="#ffcdd2"
              stroke="#d32f2f"
              strokeWidth="2"
            />
            
            {/* No area labels in rectangles - teacher writes on board or in boxes below */}
            
            {/* Split lines */}
            <line x1={50 + widthA} y1={50} x2={50 + widthA} y2={50 + totalHeight} stroke="#666" strokeWidth="2" strokeDasharray="5,5" />
            <line x1={50} y1={50 + heightC} x2={50 + totalWidth} y2={50 + heightC} stroke="#666" strokeWidth="2" strokeDasharray="5,5" />
          </>
        )}
        
        {/* Dimension labels */}
        {showSplit ? (
          <>
            {/* Split mode labels */}
            <text x={50 + widthA/2} y={35} textAnchor="middle" className="fill-gray-700 font-bold text-lg">
              {a}
            </text>
            <text x={50 + widthA + widthB/2} y={35} textAnchor="middle" className="fill-gray-700 font-bold text-lg">
              {b}
            </text>
            <text x={25} y={50 + heightC/2} textAnchor="middle" className="fill-gray-700 font-bold text-lg" transform={`rotate(-90 25 ${50 + heightC/2})`}>
              {c}
            </text>
            <text x={25} y={50 + heightC + heightD/2} textAnchor="middle" className="fill-gray-700 font-bold text-lg" transform={`rotate(-90 25 ${50 + heightC + heightD/2})`}>
              {d}
            </text>
          </>
        ) : (
          <>
            {/* Unsplit mode labels */}
            <text x={50 + totalWidth/2} y={30} textAnchor="middle" className="fill-gray-700 font-bold text-xl">
              {getTotalWidth()}
            </text>
            <text x={20} y={50 + totalHeight/2} textAnchor="middle" className="fill-gray-700 font-bold text-xl" transform={`rotate(-90 20 ${50 + totalHeight/2})`}>
              {getTotalHeight()}
            </text>
          </>
        )}
        
        {/* Total area label (when not split) */}
        {!showSplit && (
          <text x={50 + totalWidth/2} y={50 + totalHeight/2} textAnchor="middle" className="fill-blue-800 font-bold text-2xl">
            {example.isNumeric ? getTotalWidth() * getTotalHeight() : '?'}
          </text>
        )}
      </svg>
    </div>
  );
};

export default LearnSection;