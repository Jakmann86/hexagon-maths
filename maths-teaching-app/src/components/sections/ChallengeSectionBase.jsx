// src/components/sections/ChallengeSectionBase.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, RefreshCw, Award } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import MathDisplay from '../common/MathDisplay';
import { useUI } from '../../context/UIContext';

/**
 * ChallengeSectionBase - A template for creating challenging extension problems
 * with step-by-step hints and solutions
 * 
 * @param {Object} props
 * @param {Object} props.challengeTypes - Map of challenge types with generators
 * @param {string} props.currentTopic - Current topic identifier
 * @param {number} props.currentLessonId - Current lesson identifier
 */
const ChallengeSectionBase = ({
  challengeTypes = {},
  currentTopic,
  currentLessonId
}) => {
  // State management
  const [currentTypeId, setCurrentTypeId] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [showingHints, setShowingHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showingSolution, setShowingSolution] = useState(false);
  const [currentSolutionStep, setCurrentSolutionStep] = useState(0);
  const { setCurrentSection } = useUI();

  // Initialize with the first challenge type
  useEffect(() => {
    if (Object.keys(challengeTypes).length > 0) {
      setCurrentTypeId(Object.keys(challengeTypes)[0]);
    }
  }, [challengeTypes]);

  // Set current section on mount
  useEffect(() => {
    setCurrentSection('challenge');
  }, [setCurrentSection]);

  // Generate new challenge when type or difficulty changes
  useEffect(() => {
    if (currentTypeId && challengeTypes[currentTypeId]) {
      generateNewChallenge();
    }
  }, [currentTypeId, difficulty, challengeTypes]);

  // Challenge generation and management
  const generateNewChallenge = () => {
    if (!currentTypeId || !challengeTypes[currentTypeId]) return;
    const challenge = challengeTypes[currentTypeId].generator(difficulty);
    setCurrentChallenge(challenge);
    setShowingHints(false);
    setCurrentHintIndex(0);
    setShowingSolution(false);
    setCurrentSolutionStep(0);
  };

  // Loading state
  if (!currentTypeId || !currentChallenge) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex justify-center items-center mb-4">
            <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
          <div className="text-gray-600">Loading challenge problems...</div>
        </div>
      </div>
    );
  }

  // Shape rendering logic
  const renderShape = () => {
    if (!currentChallenge?.shapeConfig) return null;
    
    const { component: ShapeComponent, props } = currentChallenge.shapeConfig;
    
    if (ShapeComponent && props) {
      return (
        <div className="flex justify-center items-center w-full my-6" style={{ height: '250px' }}>
          <ShapeComponent {...props} />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Challenge Type Selector */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start overflow-x-auto pb-2">
        {Object.entries(challengeTypes).map(([id, { title }]) => (
          <button
            key={id}
            onClick={() => setCurrentTypeId(id)}
            className={`px-4 py-2 rounded-lg transition-all transform ${
              currentTypeId === id
                ? 'bg-purple-100 text-purple-700 shadow-md scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Difficulty Selection */}
      <div className="flex justify-center space-x-4">
        {['easy', 'medium', 'hard', 'exam'].map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-4 py-2 rounded-lg capitalize ${
              difficulty === level
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Challenge Card */}
      <Card className="shadow-lg border-t-4 border-purple-500 overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Problem Statement */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="flex items-center text-xl font-bold text-purple-800 mb-2">
                <Award className="w-5 h-5 mr-2" />
                Challenge Problem
              </h3>
              <div className="text-lg text-purple-900">
                {currentChallenge.problemText}
              </div>
            </div>

            {/* Shape Visualization */}
            {renderShape()}

            {/* Hints Section */}
            {showingHints && currentChallenge.hints && currentChallenge.hints.length > 0 && (
              <div className="border border-amber-200 bg-amber-50 p-4 rounded-lg">
                <h4 className="flex items-center text-amber-800 font-medium mb-2">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Hint {currentHintIndex + 1} of {currentChallenge.hints.length}
                </h4>
                <div className="text-amber-700">
                  {currentChallenge.hints[currentHintIndex]}
                </div>

                {/* Hint Navigation */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setCurrentHintIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentHintIndex === 0}
                    className="text-amber-700 hover:text-amber-900 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentHintIndex(prev =>
                      Math.min(currentChallenge.hints.length - 1, prev + 1)
                    )}
                    disabled={currentHintIndex === currentChallenge.hints.length - 1}
                    className="text-amber-700 hover:text-amber-900 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Solution Steps */}
            {showingSolution && currentChallenge.solution && (
              <div className="space-y-4">
                {currentChallenge.solution.slice(0, currentSolutionStep + 1).map((step, index) => (
                  <div
                    key={index}
                    className="p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <p className="font-medium text-green-800">{step.explanation}</p>
                    {step.formula && (
                      <div className="mt-2 text-lg text-center">
                        <MathDisplay math={step.formula} />
                      </div>
                    )}
                  </div>
                ))}

                {/* Solution Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentSolutionStep(prev => Math.max(0, prev - 1))}
                    disabled={currentSolutionStep === 0}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <span className="font-medium">
                    Step {currentSolutionStep + 1} of {currentChallenge.solution.length}
                  </span>

                  <button
                    onClick={() => {
                      if (currentSolutionStep < currentChallenge.solution.length - 1) {
                        setCurrentSolutionStep(prev => prev + 1);
                      }
                    }}
                    disabled={currentSolutionStep === currentChallenge.solution.length - 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {!showingHints && !showingSolution && currentChallenge.hints && currentChallenge.hints.length > 0 && (
                <button
                  onClick={() => setShowingHints(true)}
                  className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Show Hints
                </button>
              )}

              {!showingSolution && (
                <button
                  onClick={() => setShowingSolution(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Show Solution
                </button>
              )}

              <button
                onClick={generateNewChallenge}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                New Challenge
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeSectionBase;