// src/worksheets/components/WorksheetButtons.jsx
// V2.0 - Updated to use static worked examples
// 
// Two buttons:
// - Worked Examples: Uses static hand-crafted examples (new!)
// - Practice Sheet: Random questions (unchanged)
//
// Place this file in: src/worksheets/components/WorksheetButtons.jsx

import React, { useState } from 'react';
import { FileDown, Loader2, FileText, BookOpen } from 'lucide-react';

/**
 * WorksheetButtons - Download buttons for worksheet generation
 * 
 * - Worked Examples → Static 3 examples (blank + answers versions)
 * - Practice Sheet → 12 random questions + answer page
 * 
 * @param {Object} props
 * @param {Object} props.worksheetConfig - Config with title, topic, lessonId
 */
const WorksheetButtons = ({ worksheetConfig = {} }) => {
  const [generating, setGenerating] = useState(null);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateWorkedExamples = async () => {
    setGenerating('worked');
    setError(null);
    
    try {
      // Import the new static worked examples generator
      const { generateStaticWorkedExamplesPDF } = await import('../generators/WorkedExamplesPDF');
      
      generateStaticWorkedExamplesPDF({
        topic: worksheetConfig.topic || 'pythagoras',
      });
      
      setLastGenerated('worked');
      setTimeout(() => setLastGenerated(null), 3000);
      
    } catch (err) {
      console.error('Worked examples generation error:', err);
      setError('Failed to generate worked examples. Check console for details.');
    } finally {
      setGenerating(null);
    }
  };

  const handleGeneratePractice = async () => {
    setGenerating('practice');
    setError(null);
    
    try {
      // Import the practice worksheet generator (unchanged)
      const { generatePracticeWorksheet } = await import('../WorksheetBuilder');
      
      await generatePracticeWorksheet({
        title: worksheetConfig.title || "Pythagoras' Theorem",
        topic: worksheetConfig.topic || 'pythagoras',
      });
      
      setLastGenerated('practice');
      setTimeout(() => setLastGenerated(null), 3000);
      
    } catch (err) {
      console.error('Practice worksheet generation error:', err);
      setError('Failed to generate practice worksheet. Check console for details.');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <FileDown size={16} />
        Download Worksheets
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {/* Worked Examples Button */}
        <button
          onClick={handleGenerateWorkedExamples}
          disabled={generating !== null}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200
            ${generating === 'worked' 
              ? 'bg-orange-100 text-orange-700 cursor-wait' 
              : lastGenerated === 'worked'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {generating === 'worked' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </>
          ) : lastGenerated === 'worked' ? (
            <>
              <FileText size={16} />
              Downloaded!
            </>
          ) : (
            <>
              <BookOpen size={16} />
              Worked Examples
            </>
          )}
        </button>
        
        {/* Practice Sheet Button */}
        <button
          onClick={handleGeneratePractice}
          disabled={generating !== null}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200
            ${generating === 'practice' 
              ? 'bg-blue-100 text-blue-700 cursor-wait' 
              : lastGenerated === 'practice'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {generating === 'practice' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </>
          ) : lastGenerated === 'practice' ? (
            <>
              <FileText size={16} />
              Downloaded!
            </>
          ) : (
            <>
              <FileDown size={16} />
              Practice Sheet
            </>
          )}
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {/* Helper text */}
      <p className="mt-2 text-xs text-gray-500">
        Worked Examples: 3 static examples (blank + answers). 
        Practice Sheet: 12 random questions.
      </p>
    </div>
  );
};

export default WorksheetButtons;