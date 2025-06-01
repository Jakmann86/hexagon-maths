// src/components/sections/ChallengeSectionBase.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import ContentRenderer from '../common/ContentRenderer';
import { useUI } from '../../context/UIContext';
import { useSectionTheme } from '../../hooks/useSectionTheme';

/**
 * ChallengeSectionBase template provides a standardized way to display 
 * challenge problems with step-by-step solutions across different topics
 */
const ChallengeSectionBase = ({
  challengeTypes = {},
  currentTopic,
  currentLessonId,
  themeKey = 'challenge' // Default to challenge theme
}) => {
  // Get theme colors for the section
  const theme = useSectionTheme(themeKey);

  // Memoize the type keys to prevent recreating array on each render
  const typeKeys = useMemo(() => Object.keys(challengeTypes), [challengeTypes]);

  // State management
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const { setCurrentSection, showAnswers } = useUI();

  // Set current section on mount
  useEffect(() => {
    setCurrentSection('challenge');
  }, [setCurrentSection]);

  // Generate new question when the component mounts or when type index changes
  useEffect(() => {
    if (typeKeys.length > 0) {
      generateNewChallenge();
    }
  }, [currentTypeIndex, typeKeys.length]); // Only depend on the length, not the array itself

  // Question generation and management
  const generateNewChallenge = () => {
    if (typeKeys.length === 0) return;

    const currentTypeId = typeKeys[currentTypeIndex];
    if (!challengeTypes[currentTypeId]) return;

    const challenge = challengeTypes[currentTypeId].generator();
    setCurrentChallenge(challenge);
  };

  // Shape rendering logic
  const renderShape = () => {
    if (!currentChallenge?.shapeConfig) return null;

    const { component: ShapeComponent, props } = currentChallenge.shapeConfig;

    if (ShapeComponent && props) {
      return (
        <div className="w-full my-10" style={{ height: '380px' }}>
          <ShapeComponent {...props} />
        </div>
      );
    }

    return null;
  };

  // Get title based on current question type
  const getCurrentTitle = () => {
    if (typeKeys.length === 0) return "Challenge Problem";
    const currentTypeId = typeKeys[currentTypeIndex];
    return challengeTypes[currentTypeId]?.title || "Challenge Problem";
  };

  // Loading state
  if (typeKeys.length === 0 || !currentChallenge) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex justify-center items-center mb-4">
            <RefreshCw className="w-6 h-6 text-red-500 animate-spin" />
          </div>
          <div className="text-gray-600">Loading challenge problems...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title, new question button and navigation - matches other sections */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-6 pt-6">
        {/* Title - from question type */}
        <h3 className="text-xl font-semibold text-gray-800">
          {getCurrentTitle()}
        </h3>

        {/* New Question Button - In the middle */}
        <button
          onClick={generateNewChallenge}
          className={`flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all`}
        >
          <RefreshCw size={18} />
          <span>New Challenge</span>
        </button>

        {/* Navigation Buttons (1,2,3) - Matching Examples style */}
        <div className="flex gap-2">
          {typeKeys.map((_, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${index === currentTypeIndex
                ? 'bg-red-500 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              onClick={() => {
                setCurrentTypeIndex(index);
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Card */}
      <Card className="shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Problem Statement - Made wider */}
            <div className="bg-red-50 p-5 rounded-lg mb-6">
              <ContentRenderer
                content={currentChallenge.problemText}
                sectionType="challenge"
                size="large"
                color="default"
                fontWeight="normal"
                className="text-gray-800"
              />
            </div>

            {/* Shape Visualization - with increased gap */}
            <div className="mb-6">
              {renderShape()}
            </div>

            {/* Solution Steps - Enhanced with ContentRenderer */}
            {showAnswers && currentChallenge.solution && (
              <div className="p-5 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-4">Solution:</h4>
                <div className="space-y-3">
                  {currentChallenge.solution.map((step, index) => (
                    <div key={index} className="mb-3">
                      {/* Step explanation using ContentRenderer */}
                      <div className="mb-2">
                        <ContentRenderer
                          content={step.explanation}
                          sectionType="challenge"
                          size="normal"
                          color="default"
                          fontWeight="normal"
                          className="text-gray-700"
                        />
                      </div>

                      {/* Step formula using ContentRenderer */}
                      {step.formula && (
                        <div className="mt-2 text-center">
                          <ContentRenderer
                            content={step.formula}
                            sectionType="challenge"
                            size="normal"
                            center={true}
                            mathOptions={{ displayMode: true }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons removed - using global buttons instead */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeSectionBase;