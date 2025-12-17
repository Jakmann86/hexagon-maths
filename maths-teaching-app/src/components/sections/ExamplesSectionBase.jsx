// src/components/sections/ExamplesSectionBase.jsx
// V1.0 - Gold Standard Base Component
// Orange theme with darker header (bg-orange-600)
// 1, 2, 3 tab buttons for different example types
// Two-column layout: visualization (left) + blank working space (right)
// Small refresh button in visualization corner
// Solution steps revealed when showAnswers=true

import React, { useState, useMemo, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import MathDisplay from '../common/MathDisplay';
import ContentRenderer from '../common/ContentRenderer';
import TeachingNotesPanel from './TeachingNotesPanel';

/**
 * ExamplesSectionBase - Reusable worked examples component
 * 
 * @param {Object} props
 * @param {Array} props.tabs - Array of tab configs
 *   Each config: { id: number, label: string, title: string }
 * @param {Function} props.generateExample - Function(tabId) => example object
 *   Example object: { title, questionText, answer, solution: [{explanation, formula}], visualization }
 * @param {Function} props.renderVisualization - Custom visualization renderer (example, showAnswer) => JSX
 * @param {Object|Function} props.teachingNotes - Teaching notes object or function(activeTab) => notes
 * @param {string} props.defaultTitle - Default section title
 * @param {string} props.subtitle - Section subtitle
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.currentTopic - Current topic ID
 * @param {number} props.currentLessonId - Current lesson ID
 */
const ExamplesSectionBase = ({
  tabs = [
    { id: 1, label: '1', title: 'Example 1' },
    { id: 2, label: '2', title: 'Example 2' },
    { id: 3, label: '3', title: 'Example 3' }
  ],
  generateExample,
  renderVisualization = null,
  teachingNotes = null,
  defaultTitle = 'Worked Examples',
  subtitle = 'Step-by-step solutions to guide your working',
  className = '',
  currentTopic,
  currentLessonId
}) => {
  const { showAnswers } = useUI();
  
  // State
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 1);
  const [regenerateKey, setRegenerateKey] = useState(0);

  // Generate example based on active tab
  const example = useMemo(() => {
    if (!generateExample) return null;
    
    try {
      return generateExample(activeTab);
    } catch (error) {
      console.error('Error generating example:', error);
      return {
        title: 'Error',
        questionText: 'Error generating example',
        answer: 'N/A',
        solution: []
      };
    }
  }, [activeTab, regenerateKey, generateExample]);

  // Handlers
  const handleRegenerate = useCallback(() => {
    setRegenerateKey(prev => prev + 1);
  }, []);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Get current tab info
  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  // Get teaching notes (can be static object or function of activeTab)
  const resolvedTeachingNotes = useMemo(() => {
    if (!teachingNotes) return null;
    if (typeof teachingNotes === 'function') {
      return teachingNotes(activeTab);
    }
    return teachingNotes;
  }, [teachingNotes, activeTab]);

  // Render visualization
  const renderExampleVisualization = () => {
    if (!example) return null;
    
    // Use custom renderer if provided
    if (renderVisualization) {
      return renderVisualization(example, showAnswers);
    }
    
    // Check for visualization config in example
    const viz = example.visualization;
    if (!viz) return null;
    
    // If it's a component config
    if (viz.component && typeof viz.component === 'function') {
      const { component: Component, props = {} } = viz;
      return <Component {...props} showAnswer={showAnswers} />;
    }
    
    return null;
  };

  // Loading state
  if (!generateExample || !example) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex justify-center items-center mb-4">
            <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
          <div className="text-gray-600">Loading examples...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 mb-8 ${className}`}>
      <div className="border-2 border-t-4 border-orange-500 rounded-xl bg-white shadow-md overflow-hidden">
        
        {/* Header - DARKER orange (bg-orange-600) with 1,2,3 tabs */}
        <div className="bg-orange-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{currentTab?.title || example?.title || defaultTitle}</h2>
              <p className="text-orange-100 text-sm">{subtitle}</p>
            </div>
            
            {/* Tab selector - rounded-square buttons */}
            <div className="flex items-center gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-10 h-10 rounded-lg font-bold text-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-orange-600 shadow-md'
                      : 'bg-orange-500 text-white hover:bg-orange-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Question */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
            <h4 className="text-orange-800 font-medium mb-2">Question</h4>
            <p className="text-gray-800">{example.questionText}</p>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visualization with refresh button in corner */}
            <div className="bg-gray-50 rounded-xl p-6 relative" style={{ minHeight: '340px' }}>
              {/* Refresh button in top right corner */}
              <button
                onClick={handleRegenerate}
                className="absolute top-3 right-3 p-2 bg-white hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200 transition-colors z-10"
                title="New example"
              >
                <RefreshCw size={16} className="text-gray-600" />
              </button>
              
              {/* Visualization - scaled up */}
              <div className="flex items-center justify-center h-full" style={{ transform: 'scale(1.2)', transformOrigin: 'center' }}>
                {renderExampleVisualization()}
              </div>
            </div>

            {/* Blank working space */}
            <div 
              className="bg-white rounded-xl border-2 border-dashed border-gray-300" 
              style={{ minHeight: '340px' }}
            />
          </div>

          {/* Solution Steps */}
          {showAnswers && example.solution && example.solution.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-700">Solution</h4>
              <div className="space-y-2">
                {example.solution.map((step, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">{step.explanation}</p>
                    {step.formula && (
                      <MathDisplay math={step.formula} displayMode={true} />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Final Answer */}
              {example.answer && (
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                  <div className="flex items-center gap-2">
                    <span className="text-green-800 font-semibold">Answer:</span>
                    <MathDisplay math={example.answer} displayMode={false} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Teaching Notes */}
          {showAnswers && resolvedTeachingNotes && (
            <TeachingNotesPanel teachingNotes={resolvedTeachingNotes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamplesSectionBase;