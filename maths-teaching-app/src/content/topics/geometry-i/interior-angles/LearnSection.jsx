// src/content/topics/geometry-i/interior-angles/LearnSection.jsx
// Discovery-based learning for interior angles of polygons
// Students explore the relationship between sides, triangles, and angle sums

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import { Eye, EyeOff, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { useUI } from '../../../../context/UIContext';
import RegularPolygon from '../../../../components/math/shapes/polygons/RegularPolygon';
import MathDisplay from '../../../../components/common/MathDisplay';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const theme = useSectionTheme('learn');
  const { showAnswers } = useUI();
  
  // Current polygon being displayed
  const [currentSides, setCurrentSides] = useState(3);
  
  // Which cells have been revealed (for teacher control)
  const [revealedCells, setRevealedCells] = useState({});
  
  // Toggle showing triangles from vertex
  const [showTriangles, setShowTriangles] = useState(true);
  
  // Polygon data
  const polygonNames = {
    3: 'Triangle',
    4: 'Quadrilateral', 
    5: 'Pentagon',
    6: 'Hexagon',
    7: 'Heptagon',
    8: 'Octagon',
    9: 'Nonagon',
    10: 'Decagon'
  };
  
  // Calculate values for a given number of sides
  const getPolygonData = (n) => ({
    name: polygonNames[n] || `${n}-gon`,
    sides: n,
    triangles: n - 2,
    sumOfAngles: (n - 2) * 180,
    oneAngle: ((n - 2) * 180) / n
  });
  
  // Table rows (3-sided through 10-sided, plus n)
  const tableRows = [3, 4, 5, 6, 7, 8, 9, 10, 'n'];
  
  // Toggle a specific cell
  const toggleCell = (row, col) => {
    const key = `${row}-${col}`;
    setRevealedCells(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Check if cell is revealed
  const isCellRevealed = (row, col) => {
    return showAnswers || revealedCells[`${row}-${col}`];
  };
  
  // Reset all revealed cells
  const resetRevealed = () => {
    setRevealedCells({});
  };
  
  // Reveal all cells in a column
  const revealColumn = (col) => {
    const newRevealed = { ...revealedCells };
    tableRows.forEach(row => {
      newRevealed[`${row}-${col}`] = true;
    });
    setRevealedCells(newRevealed);
  };
  
  // Get display value for a cell
  const getCellValue = (row, col) => {
    if (row === 'n') {
      // Formula row
      switch (col) {
        case 'triangles': return 'n - 2';
        case 'sum': return '(n - 2) × 180°';
        case 'one': return '\\frac{(n-2) \\times 180°}{n}';
        default: return 'n';
      }
    }
    
    const data = getPolygonData(row);
    switch (col) {
      case 'sides': return row;
      case 'triangles': return data.triangles;
      case 'sum': return `${data.sumOfAngles}°`;
      case 'one': return `${Math.round(data.oneAngle * 100) / 100}°`;
      default: return '';
    }
  };
  
  // Current polygon data for display
  const currentData = getPolygonData(currentSides);

  return (
    <div className="space-y-6 mb-8">
      {/* Main content card */}
      <Card className="border-2 border-t-4 border-green-500 shadow-md overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Interior Angles of Polygons
            </h3>
            <button
              onClick={resetRevealed}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-sm"
            >
              <RotateCcw size={16} />
              Reset Table
            </button>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Interactive Polygon */}
            <div className="space-y-4">
              {/* Polygon selector */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentSides(Math.max(3, currentSides - 1))}
                  disabled={currentSides <= 3}
                  className={`p-2 rounded-lg transition-colors ${
                    currentSides <= 3 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="text-center min-w-[140px]">
                  <div className="text-2xl font-bold text-gray-800">{currentData.name}</div>
                  <div className="text-sm text-gray-500">{currentSides} sides</div>
                </div>
                
                <button
                  onClick={() => setCurrentSides(Math.min(10, currentSides + 1))}
                  disabled={currentSides >= 10}
                  className={`p-2 rounded-lg transition-colors ${
                    currentSides >= 10 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              {/* Toggle triangles button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowTriangles(!showTriangles)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    showTriangles 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {showTriangles ? <Eye size={18} /> : <EyeOff size={18} />}
                  Show Triangles
                </button>
              </div>
              
              {/* Polygon display */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-center" style={{ height: '280px' }}>
                <RegularPolygon
                  sides={currentSides}
                  size={100}
                  showTrianglesFromVertex={showTriangles}
                  triangleVertex={0}
                  vertexLabels={{ show: true }}
                  showLabels={{ vertices: true }}
                  style={{
                    maxHeight: '260px',
                    fillColor: '#27ae60',
                    strokeColor: '#1e8449'
                  }}
                />
              </div>
              
              {/* Key insight box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium text-center">
                  🔑 A {currentData.name.toLowerCase()} can be split into{' '}
                  <span className="font-bold text-green-700">{currentData.triangles}</span> triangles
                </p>
                <p className="text-yellow-700 text-sm text-center mt-1">
                  Each triangle has angles that sum to 180°
                </p>
              </div>
            </div>
            
            {/* Right: Discovery Table */}
            <div className="space-y-4">
              <p className="text-gray-600 text-sm text-center">
                Click on cells to reveal answers, or work them out yourself!
              </p>
              
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-500 text-white">
                      <th className="border border-green-600 px-3 py-2 text-sm font-semibold">
                        Number of Sides
                      </th>
                      <th 
                        className="border border-green-600 px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-green-600 transition-colors"
                        onClick={() => revealColumn('triangles')}
                        title="Click to reveal column"
                      >
                        Number of Triangles
                      </th>
                      <th 
                        className="border border-green-600 px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-green-600 transition-colors"
                        onClick={() => revealColumn('sum')}
                        title="Click to reveal column"
                      >
                        Sum of Interior Angles
                      </th>
                      <th 
                        className="border border-green-600 px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-green-600 transition-colors"
                        onClick={() => revealColumn('one')}
                        title="Click to reveal column"
                      >
                        One Angle (Regular)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, index) => (
                      <tr 
                        key={row} 
                        className={`${
                          row === 'n' 
                            ? 'bg-green-100 font-semibold' 
                            : row === currentSides 
                              ? 'bg-green-50' 
                              : index % 2 === 0 
                                ? 'bg-white' 
                                : 'bg-gray-50'
                        }`}
                      >
                        {/* Sides column - always visible */}
                        <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                          {row === 'n' ? (
                            <span className="text-green-700 italic">n</span>
                          ) : (
                            <span className={row === currentSides ? 'text-green-700' : ''}>
                              {row}
                            </span>
                          )}
                        </td>
                        
                        {/* Triangles column */}
                        <td 
                          className="border border-gray-300 px-3 py-2 text-center cursor-pointer hover:bg-green-100 transition-colors"
                          onClick={() => toggleCell(row, 'triangles')}
                        >
                          {isCellRevealed(row, 'triangles') ? (
                            <span className={row === 'n' ? 'text-green-700 italic' : ''}>
                              {getCellValue(row, 'triangles')}
                            </span>
                          ) : (
                            <span className="text-gray-400">?</span>
                          )}
                        </td>
                        
                        {/* Sum column */}
                        <td 
                          className="border border-gray-300 px-3 py-2 text-center cursor-pointer hover:bg-green-100 transition-colors"
                          onClick={() => toggleCell(row, 'sum')}
                        >
                          {isCellRevealed(row, 'sum') ? (
                            row === 'n' ? (
                              <span className="text-green-700 italic text-sm">(n - 2) × 180°</span>
                            ) : (
                              <span>{getCellValue(row, 'sum')}</span>
                            )
                          ) : (
                            <span className="text-gray-400">?</span>
                          )}
                        </td>
                        
                        {/* One angle column */}
                        <td 
                          className="border border-gray-300 px-3 py-2 text-center cursor-pointer hover:bg-green-100 transition-colors"
                          onClick={() => toggleCell(row, 'one')}
                        >
                          {isCellRevealed(row, 'one') ? (
                            row === 'n' ? (
                              <MathDisplay math="\\frac{(n-2) \\times 180°}{n}" className="text-green-700" />
                            ) : (
                              <span>{getCellValue(row, 'one')}</span>
                            )
                          ) : (
                            <span className="text-gray-400">?</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Hint text */}
              <p className="text-xs text-gray-500 text-center">
                💡 Tip: Click column headers to reveal all values in that column
              </p>
            </div>
          </div>
          
          {/* Formula summary - revealed when n row is shown */}
          {(isCellRevealed('n', 'sum') || showAnswers) && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 text-center">📐 The Formula</h4>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Sum of interior angles:</p>
                  <div className="bg-white px-4 py-2 rounded-lg border border-green-300">
                    <MathDisplay math="(n - 2) \times 180°" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">One interior angle (regular polygon):</p>
                  <div className="bg-white px-4 py-2 rounded-lg border border-green-300">
                    <MathDisplay math="\frac{(n - 2) \times 180°}{n}" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Teacher guidance */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🎓 Teaching Notes</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Start with the triangle (3 sides) and build up - let students spot the pattern</li>
              <li>• Key question: "Why is it always 2 less triangles than sides?"</li>
              <li>• Draw attention to vertex A - we can't make a triangle with adjacent vertices</li>
              <li>• Challenge: "Can you predict the sum for a 12-sided polygon before we calculate it?"</li>
              <li>• Extension: What happens as n gets very large? (approaches 180° per angle)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSection;