// src/components/sections/LearnSectionBase.jsx
// V3.0 - Simplified Shell Component
// Provides: Green header, visualization container, teaching notes
// Lesson wrapper provides: All controls, visualization, relationship display
// 
// This is intentionally minimal - Learn sections are unique per topic
// and need flexibility. This base just ensures consistent styling.

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import TeachingNotesPanel from './TeachingNotesPanel';

/**
 * LearnSectionBase - Shell component for learn/explore sections
 * 
 * @param {Object} props
 * @param {string} props.title - Main section title
 * @param {string} props.subtitle - Section subtitle/description
 * @param {ReactNode} props.children - Main content (controls + visualization)
 * @param {Object} props.teachingNotes - Standardized teaching notes object (6 categories)
 * @param {Function} props.onReset - Optional reset handler (shows Reset button if provided)
 * @param {string} props.className - Additional CSS classes
 */
const LearnSectionBase = ({
  title = 'Learn: Interactive Exploration',
  subtitle = 'Explore the concept with interactive controls',
  children,
  teachingNotes = null,
  onReset = null,
  className = ''
}) => {
  const { showAnswers } = useUI();

  return (
    <div className={`space-y-6 mb-8 ${className}`}>
      <div className="border-2 border-t-4 border-green-500 rounded-xl bg-white shadow-md overflow-hidden">
        
        {/* Header - DARKER green (bg-green-600) */}
        <div className="bg-green-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-green-100 text-sm">{subtitle}</p>
            </div>
            
            {/* Reset button - only show if onReset provided */}
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg transition-colors"
              >
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Main content area - lesson provides everything */}
        <div className="p-6">
          {children}

          {/* Teaching Notes - Standardized 6-category panel */}
          {showAnswers && teachingNotes && (
            <TeachingNotesPanel teachingNotes={teachingNotes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnSectionBase;