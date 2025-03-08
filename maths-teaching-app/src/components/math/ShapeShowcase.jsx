import React, { useState } from 'react';
import { Card, CardContent } from '../../components/common/Card';
import Square from '../../components/math/shapes/Square';
import Rectangle from '../../components/math/shapes/Rectangle';
import Triangle from '../../components/math/shapes/Triangle';
import RightTriangle from '../../components/math/shapes/RightTriangle';
import MathView from '../../components/math/MathView';

const ShapeShowcase = () => {
  const [currentShape, setCurrentShape] = useState('square');
  
  const renderShape = () => {
    // Use a viewBox that fits our shapes
    const viewBox = { x: [-1, 10], y: [-1, 10] };
    
    switch(currentShape) {
      case 'square':
        return (
          <MathView viewBox={viewBox} height={300}>
            <Square 
              sideLength={5} 
              showDimensions={true} 
              showArea={true} 
              labelStyle="numeric"
              fill="#A7F3D0"
              fillOpacity={0.2}
              units="cm"
            />
          </MathView>
        );
      
      case 'rectangle':
        return (
          <MathView viewBox={viewBox} height={300}>
            <Rectangle 
              width={8} 
              height={4}
              showDimensions={true} 
              showArea={true}
              labelStyle="numeric"
              fill="#A7D3F3"
              fillOpacity={0.2}
              units="cm"
            />
          </MathView>
        );
      
      case 'rightTriangle':
        return (
          <MathView viewBox={viewBox} height={300}>
            <RightTriangle 
              base={6} 
              height={8}
              showRightAngle={true}
              showLabels={true}
              labelStyle="numeric"
              fill="#F3A7D3"
              fillOpacity={0.2}
              units="cm"
            />
          </MathView>
        );
      
      case 'rightTriangleAlgebraic':
        return (
          <MathView viewBox={viewBox} height={300}>
            <RightTriangle 
              base={6} 
              height={8}
              showRightAngle={true}
              showLabels={true}
              labelStyle="algebraic"
              fill="#F3A7D3"
              fillOpacity={0.2}
              units="cm"
            />
          </MathView>
        );
      
      case 'triangle':
        return (
          <MathView viewBox={viewBox} height={300}>
            <Triangle 
              sides={[5, 6, 7]}
              showLabels={true}
              labelStyle="numeric"
              fill="#D3F3A7"
              fillOpacity={0.2}
              units="cm"
            />
          </MathView>
        );
        
      case 'triangleVertices':
        return (
          <MathView viewBox={viewBox} height={300}>
            <Triangle 
              vertices={[[0, 0], [8, 0], [4, 6]]}
              showLabels={true}
              labelStyle="algebraic"
              fill="#D3F3A7"
              fillOpacity={0.2}
              units="cm"
            />
          </MathView>
        );
        
      default:
        return <div>Select a shape</div>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex space-x-2 flex-wrap gap-2 justify-center">
        <button 
          className={`px-4 py-2 rounded-lg ${currentShape === 'square' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentShape('square')}
        >
          Square
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${currentShape === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentShape('rectangle')}
        >
          Rectangle
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${currentShape === 'rightTriangle' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentShape('rightTriangle')}
        >
          Right Triangle
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${currentShape === 'rightTriangleAlgebraic' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentShape('rightTriangleAlgebraic')}
        >
          Right Triangle (Algebraic)
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${currentShape === 'triangle' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentShape('triangle')}
        >
          Triangle (by sides)
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${currentShape === 'triangleVertices' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentShape('triangleVertices')}
        >
          Triangle (by vertices)
        </button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-6">Shape Display: {currentShape}</h2>
            {renderShape()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShapeShowcase;