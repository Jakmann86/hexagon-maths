// src/content/topics/trigonometry-i/3d-trig/LearnSection.jsx
// L4 - 3D Pythagoras & Applications
// Interactive visualization showing internal triangles in 3D shapes

import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { RefreshCw, Eye, EyeOff, RotateCcw } from 'lucide-react';
import Cuboid3D from '../../../../components/math/shapes/3d/Cuboid3D';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');

  // Dimensions state
  const [dimensions, setDimensions] = useState({ width: 4, depth: 3, height: 5 });

  // Triangle visibility states
  const [showBaseDiagonal, setShowBaseDiagonal] = useState(false);
  const [showSpaceDiagonal, setShowSpaceDiagonal] = useState(false);

  // Label visibility states
  const [showDimensionLabels, setShowDimensionLabels] = useState(true);
  const [showBaseDiagonalLabel, setShowBaseDiagonalLabel] = useState(false);
  const [showSpaceDiagonalLabel, setShowSpaceDiagonalLabel] = useState(false);

  // Calculate diagonal values
  const baseDiagonal = Math.sqrt(dimensions.width ** 2 + dimensions.depth ** 2);
  const spaceDiagonal = Math.sqrt(dimensions.width ** 2 + dimensions.depth ** 2 + dimensions.height ** 2);

  // Generate new random dimensions
  const newDimensions = () => {
    setDimensions({
      width: Math.floor(Math.random() * 5) + 3,  // 3-7
      depth: Math.floor(Math.random() * 5) + 3,  // 3-7
      height: Math.floor(Math.random() * 5) + 4  // 4-8
    });
    // Reset triangles when getting new shape
    setShowBaseDiagonal(false);
    setShowSpaceDiagonal(false);
    setShowBaseDiagonalLabel(false);
    setShowSpaceDiagonalLabel(false);
  };

  // Reset all toggles
  const resetView = () => {
    setShowBaseDiagonal(false);
    setShowSpaceDiagonal(false);
    setShowBaseDiagonalLabel(false);
    setShowSpaceDiagonalLabel(false);
    setShowDimensionLabels(true);
  };

  // Toggle base diagonal (also show its label)
  const toggleBaseDiagonal = () => {
    const newState = !showBaseDiagonal;
    setShowBaseDiagonal(newState);
    setShowBaseDiagonalLabel(newState);
  };

  // Toggle space diagonal (also show its label)
  const toggleSpaceDiagonal = () => {
    const newState = !showSpaceDiagonal;
    setShowSpaceDiagonal(newState);
    setShowSpaceDiagonalLabel(newState);
  };

  return (
    <div className="space-y-6 mb-8">
      <Card className="border-2 border-t-4 border-green-500 shadow-md overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              3D Pythagoras: Finding Diagonals in a Cuboid
            </h3>
            <button
              onClick={newDimensions}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
            >
              <RefreshCw size={18} />
              <span>New Cuboid</span>
            </button>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3D Shape Visualization */}
            <div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200" style={{ minHeight: '380px' }}>
                <Cuboid3D
                  width={dimensions.width}
                  depth={dimensions.depth}
                  height={dimensions.height}
                  units="cm"
                  showTriangles={{
                    baseDiagonal: showBaseDiagonal,
                    spaceDiagonal: showSpaceDiagonal
                  }}
                  showLabels={{
                    dimensions: showDimensionLabels,
                    baseDiagonal: showBaseDiagonalLabel,
                    spaceDiagonal: showSpaceDiagonalLabel,
                    vertices: true,
                    faces: false
                  }}
                  vertexLabels={{
                    show: true,
                    labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
                  }}
                />
              </div>

              {/* Toggle Controls */}
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <button
                  onClick={toggleBaseDiagonal}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    showBaseDiagonal
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  {showBaseDiagonal ? <Eye size={16} /> : <EyeOff size={16} />}
                  Base Diagonal
                </button>

                <button
                  onClick={toggleSpaceDiagonal}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    showSpaceDiagonal
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-2 border-purple-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  {showSpaceDiagonal ? <Eye size={16} /> : <EyeOff size={16} />}
                  Space Diagonal
                </button>

                <button
                  onClick={resetView}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-sm"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>

            {/* Explanation Panel */}
            <div className="space-y-4">
              {/* Current dimensions */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Cuboid Dimensions</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Width</div>
                    <div className="text-lg font-bold text-blue-700">{dimensions.width} cm</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Depth</div>
                    <div className="text-lg font-bold text-blue-700">{dimensions.depth} cm</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-xs text-gray-500">Height</div>
                    <div className="text-lg font-bold text-blue-700">{dimensions.height} cm</div>
                  </div>
                </div>
              </div>

              {/* Base Diagonal Explanation */}
              {showBaseDiagonal && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Step 1: Base Diagonal</h4>
                  <p className="text-red-700 text-sm mb-3">
                    First, find the diagonal across the base using the width and depth.
                  </p>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <MathDisplay 
                      math={`d_{base} = \\sqrt{${dimensions.width}^2 + ${dimensions.depth}^2}`}
                    />
                    <MathDisplay 
                      math={`= \\sqrt{${dimensions.width ** 2} + ${dimensions.depth ** 2}} = \\sqrt{${dimensions.width ** 2 + dimensions.depth ** 2}}`}
                    />
                    <MathDisplay 
                      math={`= ${Math.round(baseDiagonal * 100) / 100} \\text{ cm}`}
                    />
                  </div>
                </div>
              )}

              {/* Space Diagonal Explanation */}
              {showSpaceDiagonal && (
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Step 2: Space Diagonal</h4>
                  <p className="text-purple-700 text-sm mb-3">
                    Now use the base diagonal and height to find the space diagonal.
                  </p>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <MathDisplay 
                      math={`d_{space} = \\sqrt{d_{base}^2 + h^2}`}
                    />
                    <MathDisplay 
                      math={`= \\sqrt{${Math.round(baseDiagonal * 100) / 100}^2 + ${dimensions.height}^2}`}
                    />
                    <MathDisplay 
                      math={`= \\sqrt{${Math.round(baseDiagonal ** 2 * 100) / 100} + ${dimensions.height ** 2}} = ${Math.round(spaceDiagonal * 100) / 100} \\text{ cm}`}
                    />
                  </div>
                  
                  {/* Alternative formula */}
                  <div className="mt-3 p-3 bg-purple-100 rounded-lg">
                    <p className="text-purple-800 text-sm font-medium mb-1">Or use the direct formula:</p>
                    <MathDisplay 
                      math={`d = \\sqrt{w^2 + d^2 + h^2} = \\sqrt{${dimensions.width}^2 + ${dimensions.depth}^2 + ${dimensions.height}^2}`}
                    />
                  </div>
                </div>
              )}

              {/* Prompt when nothing is shown */}
              {!showBaseDiagonal && !showSpaceDiagonal && (
                <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                  <p className="text-amber-800 text-center">
                    <strong>Click the buttons below the cuboid</strong><br />
                    <span className="text-base">to reveal the internal triangles</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Teacher Notes */}
          {showAnswers && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Teaching Notes: Bringing This Slide to Life
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-3">How to Use This Visual</h4>
                  <ol className="list-decimal list-inside space-y-2 text-green-700 text-sm">
                    <li>Start with the plain cuboid - discuss what diagonals exist</li>
                    <li>Click <strong>"Base Diagonal"</strong> to show the first triangle</li>
                    <li>Ask: "What type of triangle is this? What theorem can we use?"</li>
                    <li>Work through the base diagonal calculation</li>
                    <li>Click <strong>"Space Diagonal"</strong> to show the second triangle</li>
                    <li>Ask: "What do we use as the base of this new triangle?"</li>
                    <li>Generate new cuboids and have students predict the diagonals</li>
                  </ol>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-3">Key Questions</h4>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 text-sm">
                    <li>"Where is the right angle in the base diagonal triangle?"</li>
                    <li>"Why do we need TWO applications of Pythagoras?"</li>
                    <li>"Can you spot the right angle in the space diagonal triangle?"</li>
                    <li>"Which diagonal is longer - base or space? Why?"</li>
                    <li>"What would happen if this was a cube (all sides equal)?"</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-3">The Two-Step Process</h4>
                  <div className="text-purple-700 text-sm space-y-2">
                    <p><strong>Step 1:</strong> Find base diagonal using width & depth</p>
                    <p className="ml-4 font-mono bg-white px-2 py-1 rounded">d₁² = w² + d²</p>
                    <p><strong>Step 2:</strong> Find space diagonal using base diagonal & height</p>
                    <p className="ml-4 font-mono bg-white px-2 py-1 rounded">d₂² = d₁² + h²</p>
                    <p className="mt-2"><strong>Combined:</strong></p>
                    <p className="ml-4 font-mono bg-white px-2 py-1 rounded">d² = w² + d² + h²</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-3">Common Misconceptions</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700 text-sm">
                    <li>Trying to find space diagonal in one step without seeing the triangles</li>
                    <li>Confusing which edges form each right triangle</li>
                    <li>Forgetting to square root at the end</li>
                    <li>Not recognising that base diagonal becomes a "side" in step 2</li>
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