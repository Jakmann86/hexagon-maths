// src/worksheets/components/WorksheetButtons.jsx
// V4.0 - Registry pattern for both worked examples and practice
// 
// Two buttons (both amber):
// - Worked Examples: Uses static hand-crafted examples (topic-specific)
// - Practice Sheet: Random questions (topic-specific)

import React, { useState } from 'react';
import { FileDown, Loader2, FileText, BookOpen, ClipboardList } from 'lucide-react';
import { worksheetGenerators } from '../generators';

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

  const topic = worksheetConfig.topic || 'pythagoras';
  
  // Check what's available for this topic
  const hasWorkedExamples = !!worksheetGenerators.workedExamples?.[topic];
  const hasPractice = !!worksheetGenerators.practice?.[topic];

  const handleGenerateWorkedExamples = async () => {
    setGenerating('worked');
    setError(null);
    
    try {
      if (!worksheetGenerators.workedExamples?.[topic]) {
        throw new Error(`No worked examples generator found for topic: ${topic}`);
      }
      
      const module = await worksheetGenerators.workedExamples[topic]();
      const generateFn = module.default || Object.values(module)[0];
      
      await generateFn({ topic });
      
      setLastGenerated('worked');
      setTimeout(() => setLastGenerated(null), 3000);
      
    } catch (err) {
      console.error('Worked examples generation error:', err);
      setError(`Failed to generate worked examples: ${err.message}`);
    } finally {
      setGenerating(null);
    }
  };

  const handleGeneratePractice = async () => {
    setGenerating('practice');
    setError(null);
    
    try {
      if (!worksheetGenerators.practice?.[topic]) {
        throw new Error(`No practice generator found for topic: ${topic}`);
      }
      
      const module = await worksheetGenerators.practice[topic]();
      const generateFn = module.default || Object.values(module)[0];
      
      await generateFn({ topic });
      
      setLastGenerated('practice');
      setTimeout(() => setLastGenerated(null), 3000);
      
    } catch (err) {
      console.error('Practice worksheet generation error:', err);
      setError(`Failed to generate practice worksheet: ${err.message}`);
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
        {/* Worked Examples Button - Amber */}
        <button
          onClick={handleGenerateWorkedExamples}
          disabled={generating !== null || !hasWorkedExamples}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200
            ${generating === 'worked' 
              ? 'bg-amber-100 text-amber-700 cursor-wait' 
              : lastGenerated === 'worked'
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          title={!hasWorkedExamples ? `Worked examples not yet available for ${topic}` : 'Download worked examples PDF'}
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
        
        {/* Practice Sheet Button - Amber */}
        <button
          onClick={handleGeneratePractice}
          disabled={generating !== null || !hasPractice}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200
            ${generating === 'practice' 
              ? 'bg-amber-100 text-amber-700 cursor-wait' 
              : lastGenerated === 'practice'
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          title={!hasPractice ? `Practice sheet not yet available for ${topic}` : 'Download practice PDF with random questions'}
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
              <ClipboardList size={16} />
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
        Worked Examples: 3 step-by-step solutions. 
        Practice Sheet: 12 random questions.
      </p>
    </div>
  );
};

export default WorksheetButtons;