// src/components/math/TestShapeShowcase.jsx
import React from 'react';
import { Card, CardContent } from '../../components/common/Card';
import MathView from './MathView';
import BasicSquare from './shapes/BasicSquare';

const TestShapeShowcase = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-6">Mafs Test</h2>
            
            {/* Try using MathView with simplified BasicSquare */}
            <div className="mb-8 w-full">
              <h3 className="text-lg font-medium mb-4">Mafs Basic Square</h3>
              <div style={{ height: '300px', width: '100%', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <MathView viewBox={{ x: [-1, 6], y: [-1, 6] }} height={300}>
                  <BasicSquare sideLength={4} position={[1, 1]} showArea={true} />
                </MathView>
              </div>
            </div>
            
            {/* Fallback Native SVG implementation */}
            <div className="w-full">
              <h3 className="text-lg font-medium mb-4">Native SVG Fallback</h3>
              <NativeSVG />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestShapeShowcase;