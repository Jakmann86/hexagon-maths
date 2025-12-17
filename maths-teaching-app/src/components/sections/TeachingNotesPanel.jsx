// src/components/sections/TeachingNotesPanel.jsx
// Shared Teaching Notes Panel - V2.0
// Standardized format for all section types
// Six colored boxes:
//   - Key Points (green)
//   - Discussion Questions (blue)
//   - Common Misconceptions (amber)
//   - Extension Ideas (purple)
//   - Fun Fact (indigo) - historical context, trivia
//   - How To Use (slate) - visualization instructions (mainly for Learn section)

import React from 'react';
import { Lightbulb, MessageCircle, AlertTriangle, Sparkles, BookOpen, MousePointer } from 'lucide-react';

/**
 * TeachingNotesPanel - Standardized teaching notes display
 * 
 * @param {Object} props
 * @param {Object} props.teachingNotes - Teaching notes object with standardized structure
 * @param {string[]} props.teachingNotes.keyPoints - Array of key learning points
 * @param {string[]} props.teachingNotes.discussionQuestions - Array of discussion prompts
 * @param {string[]} props.teachingNotes.commonMisconceptions - Array of common errors/misconceptions
 * @param {string[]} props.teachingNotes.extensionIdeas - Array of extension activities
 * @param {string|string[]} props.teachingNotes.funFact - Historical context or interesting trivia (string or array)
 * @param {string[]} props.teachingNotes.howToUse - Instructions for using the visualization
 * @param {string} props.className - Additional CSS classes
 */
const TeachingNotesPanel = ({ 
  teachingNotes = {},
  className = '' 
}) => {
  const {
    keyPoints = [],
    discussionQuestions = [],
    commonMisconceptions = [],
    extensionIdeas = [],
    funFact = null,
    howToUse = []
  } = teachingNotes;

  // Normalize funFact to array for consistent rendering
  const funFactArray = funFact 
    ? (Array.isArray(funFact) ? funFact : [funFact])
    : [];

  // Don't render if no notes provided
  const hasNotes = keyPoints.length > 0 || 
                   discussionQuestions.length > 0 || 
                   commonMisconceptions.length > 0 || 
                   extensionIdeas.length > 0 ||
                   funFactArray.length > 0 ||
                   howToUse.length > 0;

  if (!hasNotes) return null;

  return (
    <div className={`mt-6 border-t border-gray-200 pt-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Teaching Notes</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* How To Use - Slate (appears first when present, typically Learn section) */}
        {howToUse.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer size={18} className="text-slate-700" />
              <h4 className="font-medium text-slate-800">How To Use</h4>
            </div>
            <ul className="text-sm text-slate-700 space-y-1">
              {howToUse.map((instruction, index) => (
                <li key={index}>• {instruction}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Points - Green */}
        {keyPoints.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={18} className="text-green-700" />
              <h4 className="font-medium text-green-800">Key Points</h4>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              {keyPoints.map((point, index) => (
                <li key={index}>• {point}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Discussion Questions - Blue */}
        {discussionQuestions.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle size={18} className="text-blue-700" />
              <h4 className="font-medium text-blue-800">Discussion Questions</h4>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              {discussionQuestions.map((question, index) => (
                <li key={index}>• {question}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Misconceptions - Amber */}
        {commonMisconceptions.length > 0 && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-amber-700" />
              <h4 className="font-medium text-amber-800">Common Misconceptions</h4>
            </div>
            <ul className="text-sm text-amber-700 space-y-1">
              {commonMisconceptions.map((misconception, index) => (
                <li key={index}>• {misconception}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Extension Ideas - Purple */}
        {extensionIdeas.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-purple-700" />
              <h4 className="font-medium text-purple-800">Extension Ideas</h4>
            </div>
            <ul className="text-sm text-purple-700 space-y-1">
              {extensionIdeas.map((idea, index) => (
                <li key={index}>• {idea}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Fun Fact - Indigo */}
        {funFactArray.length > 0 && (
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-indigo-700" />
              <h4 className="font-medium text-indigo-800">Fun Fact</h4>
            </div>
            {funFactArray.length === 1 ? (
              <p className="text-sm text-indigo-700">{funFactArray[0]}</p>
            ) : (
              <ul className="text-sm text-indigo-700 space-y-1">
                {funFactArray.map((fact, index) => (
                  <li key={index}>• {fact}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachingNotesPanel;