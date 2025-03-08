// src/components/math/MafsImportTest.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../common/Card';

// Separate imports to identify which one might be causing issues
import * as MafsExports from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

const MafsImportTest = () => {
  const [imports, setImports] = useState({
    loaded: false,
    error: null,
    keys: []
  });

  useEffect(() => {
    try {
      console.log('MafsExports:', MafsExports);
      setImports({
        loaded: true,
        error: null,
        keys: Object.keys(MafsExports)
      });
    } catch (error) {
      console.error('Error accessing Mafs exports:', error);
      setImports({
        loaded: false,
        error: error.message,
        keys: []
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Mafs Import Test</h2>
            
            <div className="w-full space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Import Status:</h3>
                {imports.loaded ? (
                  <p className="text-green-600">✓ Mafs imported successfully</p>
                ) : (
                  <p className="text-red-600">✗ Failed to import Mafs</p>
                )}
                
                {imports.error && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
                    <p className="font-medium">Error:</p>
                    <code className="block whitespace-pre-wrap text-sm mt-1">{imports.error}</code>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Available Exports:</h3>
                {imports.keys.length > 0 ? (
                  <ul className="mt-2 grid grid-cols-3 gap-2">
                    {imports.keys.map(key => (
                      <li key={key} className="text-sm">
                        <code>{key}</code>: {typeof MafsExports[key]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No exports found</p>
                )}
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Manual Test:</h3>
                <p className="text-sm mt-1">
                  If the exports look correct, we'll try to render a basic SVG below.
                </p>
                
                <div className="mt-4 h-40 w-full border border-gray-300 rounded-lg flex items-center justify-center">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="#A7D3F3" stroke="#38BDF8" strokeWidth="2" />
                    <text x="50" y="55" textAnchor="middle" fontSize="12">SVG works</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MafsImportTest;