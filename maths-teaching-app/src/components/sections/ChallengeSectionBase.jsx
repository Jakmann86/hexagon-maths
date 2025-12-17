// src/components/sections/ChallengeSectionBase.jsx
// V1.0 - Gold Standard Base Component
// Red theme with darker header (bg-red-600)
// Trophy icon in header
// Two-column: visualization + blank working space
// Small refresh button in corner
// Solution steps when showAnswers=true

import React, { useState, useMemo, useCallback } from 'react';
import { RefreshCw, Trophy } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import MathDisplay from '../common/MathDisplay';
import ContentRenderer from '../common/ContentRenderer';
import TeachingNotesPanel from './TeachingNotesPanel';

/**
 * ChallengeSectionBase - Reusable challenge problem component
 * 
 * @param {Object} props
 * @param {Array} props.challengeTypes - Array of challenge type configs (optional for tabs)
 *   Each config: { id: string, title: string, generator: Function }
 * @param {Function} props.generator - Single generator function (if not using tabs)
 * @param {Function} props.renderVisualization - Custom visualization renderer (challenge, showAnswer) => JSX
 * @param {Object} props.teachingNotes - Standardized teaching notes object
 * @param {string} props.title - Default section title
 * @param {string} props.subtitle - Section subtitle
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.currentTopic - Current topic ID
 * @param {number} props.currentLessonId - Current lesson ID
 */
const ChallengeSectionBase = ({
  challengeTypes = [],
  generator = null,
  renderVisualization = null,
  teachingNotes = null,
  title = 'Challenge Problem',
  subtitle = 'Apply your knowledge to a harder problem',
  className = '',
  currentTopic,
  currentLessonId
}) => {
  const { showAnswers } = useUI();
  
  // State
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const [regenerateKey, setRegenerateKey] = useState(0);

  // Determine if using tabs or single generator
  const useTabs = challengeTypes.length > 0;

  // Generate challenge - only regenerate on key change or tab change
  const challenge = useMemo(() => {
    try {
      if (useTabs) {
        const currentType = challengeTypes[activeTypeIndex];
        if (!currentType?.generator) return null;
        return currentType.generator();
      } else if (generator) {
        return generator();
      }
      return null;
    } catch (error) {
      console.error('Error generating challenge:', error);
      return {
        questionText: 'Error generating challenge',
        answer: 'N/A',
        solution: []
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTypeIndex, regenerateKey]);  // Intentionally minimal deps - only regen on tab/key change

  // Handlers
  const handleRegenerate = useCallback(() => {
    setRegenerateKey(prev => prev + 1);
  }, []);

  const handleTypeChange = useCallback((index) => {
    setActiveTypeIndex(index);
  }, []);

  // Get current title
  const currentTitle = useMemo(() => {
    if (useTabs && challengeTypes[activeTypeIndex]?.title) {
      return challengeTypes[activeTypeIndex].title;
    }
    return challenge?.title || title;
  }, [useTabs, challengeTypes, activeTypeIndex, challenge, title]);

  // Render visualization
  const renderChallengeVisualization = () => {
    if (!challenge) return null;
    
    // Use custom renderer if provided
    if (renderVisualization) {
      return renderVisualization(challenge, showAnswers);
    }
    
    // Check for shapeConfig pattern
    if (challenge.shapeConfig?.component) {
      const { component: Component, props = {} } = challenge.shapeConfig;
      return <Component {...props} showAnswer={showAnswers} />;
    }
    
    // Check for visualization config
    if (challenge.visualization?.component) {
      const { component: Component, props = {} } = challenge.visualization;
      return <Component {...props} showAnswer={showAnswers} />;
    }
    
    return null;
  };

  // Loading state
  if (!challenge) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex justify-center items-center mb-4">
            <RefreshCw className="w-6 h-6 text-red-500 animate-spin" />
          </div>
          <div className="text-gray-600">Loading challenge problem...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 mb-8 ${className}`}>
      <div className="border-2 border-t-4 border-red-500 rounded-xl bg-white shadow-md overflow-hidden">
        
        {/* Header - DARKER red (bg-red-600) with Trophy icon */}
        <div className="bg-red-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Trophy Icon */}
              <div className="bg-yellow-400 p-2 rounded-lg">
                <Trophy size={24} className="text-yellow-800" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentTitle}</h2>
                <p className="text-red-100 text-sm">{subtitle}</p>
              </div>
            </div>
            
            {/* Tab buttons (if using tabs) */}
            {useTabs && (
              <div className="flex items-center gap-2">
                {challengeTypes.map((type, index) => (
                  <button
                    key={type.id || index}
                    onClick={() => handleTypeChange(index)}
                    className={`w-10 h-10 rounded-lg font-bold text-lg transition-all ${
                      activeTypeIndex === index
                        ? 'bg-white text-red-600 shadow-md'
                        : 'bg-red-500 text-white hover:bg-red-400'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Question/Problem */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
            <h4 className="text-red-800 font-semibold mb-2">Problem</h4>
            <ContentRenderer
              content={challenge.questionText || challenge.problemText}
              sectionType="challenge"
              size="large"
              color="default"
              fontWeight="normal"
              className="text-gray-800"
            />
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visualization with refresh button in corner */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center relative" style={{ minHeight: '400px' }}>
              {/* Small refresh button in top right corner */}
              <button
                onClick={handleRegenerate}
                className="absolute top-3 right-3 p-2 bg-white hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200 transition-colors z-10"
                title="New challenge"
              >
                <RefreshCw size={16} className="text-gray-600" />
              </button>
              
              {renderChallengeVisualization()}
            </div>

            {/* Blank working space */}
            <div 
              className="bg-white rounded-xl border-2 border-dashed border-gray-300" 
              style={{ minHeight: '400px' }}
            />
          </div>

          {/* Solution Steps */}
          {showAnswers && challenge.solution && challenge.solution.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-700">Solution</h4>
              <div className="space-y-2">
                {challenge.solution.map((step, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">{step.explanation}</p>
                    {step.formula && (
                      <MathDisplay math={step.formula} displayMode={true} />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Final Answer */}
              {challenge.answer && (
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                  <div className="flex items-center gap-2">
                    <span className="text-green-800 font-semibold">Answer:</span>
                    <MathDisplay math={challenge.answer} displayMode={false} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Teaching Notes */}
          {showAnswers && teachingNotes && (
            <TeachingNotesPanel teachingNotes={teachingNotes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeSectionBase;