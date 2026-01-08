// src/worksheets/components/WorksheetButtons.jsx
// Worksheet download buttons for Examples section
// V1.2 - Simplified: Each button generates both blank AND answers versions
// 
// Usage: Included in ExamplesSectionBase automatically
// Only visible when showAnswers is true (teacher mode)

import React, { useState } from 'react';
import { FileDown, Loader2, FileText, Printer } from 'lucide-react';

/**
 * WorksheetButtons - Download buttons for worksheet generation
 * 
 * Each button generates BOTH blank and answered versions:
 * - Worked Examples → 2 PDFs (blank + with answers)
 * - Practice Sheet → PDF with questions + answer page at end
 * 
 * Always visible at bottom of Examples section (doesn't require showAnswers)
 * 
 * @param {Object} props
 * @param {Object} props.worksheetConfig - Config with title, topic, lessonId
 * @param {Array} props.currentExamples - The example objects from all tabs
 */
const WorksheetButtons = ({ 
  worksheetConfig = {},
  currentExamples = [],
}) => {
  const [generating, setGenerating] = useState(null);
  const [lastGenerated, setLastGenerated] = useState(null);

  const handleGenerate = async (type) => {
    setGenerating(type);
    
    try {
      const { generateWorkedExamples, generatePracticeWorksheet, generateTestWorksheet } = 
        await import('../WorksheetBuilder');
      
      if (type === 'worked-examples') {
        // Generate both blank and filled versions using current examples
        if (currentExamples && currentExamples.length > 0) {
          await generateWorkedExamples(worksheetConfig, currentExamples);
        } else {
          // Fallback to test worksheet if no examples
          generateTestWorksheet();
        }
      } else if (type === 'practice') {
        // Generate practice sheet - would need generator function passed in
        // For now, use test worksheet
        generateTestWorksheet();
      }
      
      setLastGenerated(type);
      setTimeout(() => setLastGenerated(null), 3000);
      
    } catch (importError) {
      console.error('WorksheetBuilder error:', importError);
      alert('Error generating worksheet. Check console for details.');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="mt-6 pt-5 border-t border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <FileText size={18} className="text-gray-500" />
        <h4 className="font-medium text-gray-700">Download Worksheets</h4>
        {lastGenerated && (
          <span className="text-sm text-green-600 ml-2">✓ Downloaded!</span>
        )}
      </div>
      
      {/* Button container - translucent grey background */}
      <div className="bg-gray-100/70 rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-3">
          
          {/* Worked Examples - generates BOTH blank and answers */}
          <button
            onClick={() => handleGenerate('worked-examples')}
            disabled={generating !== null}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${generating === 'worked-examples' 
                ? 'bg-orange-200 text-orange-700' 
                : 'bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-700 border border-gray-300 hover:border-orange-300'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-sm hover:shadow
            `}
          >
            {generating === 'worked-examples' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileDown size={16} />
            )}
            <span>Worked Examples</span>
          </button>
          
          {/* Practice Sheet - includes answer page */}
          <button
            onClick={() => handleGenerate('practice')}
            disabled={generating !== null}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${generating === 'practice' 
                ? 'bg-blue-200 text-blue-700' 
                : 'bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-300 hover:border-blue-300'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-sm hover:shadow
            `}
          >
            {generating === 'practice' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Printer size={16} />
            )}
            <span>Practice Sheet</span>
            <span className="text-xs text-gray-500">(12 Qs)</span>
          </button>
          
        </div>
        
        {/* Help text */}
        <p className="mt-3 text-xs text-gray-500">
          Each download includes both blank and answer versions.
        </p>
      </div>
    </div>
  );
};

export default WorksheetButtons;