// src/components/math/DebugMafsExports.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../common/Card';
// Import from mafs
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

const DebugMafsExports = () => {
  const [debug, setDebug] = useState({
    exports: {},
    coordinatesType: '',
    mafsType: '',
    coordinatesKeys: [],
    error: null
  });

  useEffect(() => {
    try {
      // Inspect the Mafs library exports
      const exports = {...MafsLib};
      const coordinatesType = typeof MafsLib.Coordinates;
      const mafsType = typeof MafsLib.Mafs;
      
      // Get keys if Coordinates is an object
      let coordinatesKeys = [];
      if (coordinatesType === 'object' && MafsLib.Coordinates !== null) {
        coordinatesKeys = Object.keys(MafsLib.Coordinates);
      }
      
      setDebug({
        exports,
        coordinatesType,
        mafsType,
        coordinatesKeys,
        error: null
      });
      
      // Log to console for deeper inspection
      console.log('MafsLib:', MafsLib);
      console.log('Coordinates:', MafsLib.Coordinates);
      console.log('Mafs component:', MafsLib.Mafs);
      
    } catch (error) {
      setDebug(prev => ({
        ...prev,
        error: error.message
      }));
      console.error('Error inspecting Mafs:', error);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Mafs Library Debug</h2>
            
            <div className="w-full space-y-4">
              {debug.error && (
                <div className="p-3 bg-red-50 rounded-lg text-red-700">
                  <h3 className="font-medium">Error:</h3>
                  <p>{debug.error}</p>
                </div>
              )}
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Key Component Types:</h3>
                <div className="mt-2 space-y-2">
                  <p><strong>Mafs:</strong> {debug.mafsType}</p>
                  <p><strong>Coordinates:</strong> {debug.coordinatesType}</p>
                </div>
              </div>
              
              {debug.coordinatesType === 'object' && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Coordinates Object Properties:</h3>
                  <div className="mt-2 overflow-auto max-h-40">
                    <ul className="list-disc pl-5 space-y-1">
                      {debug.coordinatesKeys.map(key => (
                        <li key={key}>{key}: {typeof MafsLib.Coordinates[key]}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Available Exports:</h3>
                <div className="mt-2 overflow-auto max-h-60">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(Object.keys(debug.exports).reduce((acc, key) => {
                      acc[key] = typeof debug.exports[key];
                      return acc;
                    }, {}), null, 2)}
                  </pre>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Try with Just a DIV:</h3>
                <div style={{ height: 100, width: '100%', backgroundColor: '#e5e7eb', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Basic DIV element works
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugMafsExports;