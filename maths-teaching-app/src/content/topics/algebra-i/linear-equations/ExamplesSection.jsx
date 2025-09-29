// src/content/topics/algebra-i/linear-equations/ExamplesSection.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { useUI } from '../../../../context/UIContext';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  
  const theme = useSectionTheme('examples');
  const { showAnswers } = useUI();

  // Generate examples when component mounts
  useEffect(() => {
    generateExamples();
  }, []);

  const generateExamples = () => {
    const newExamples = [
      // Example 1: Simple case with positive coefficients
      equationGenerators.generateLinearEquationBothSides({ 
        sectionType: 'examples',
        difficulty: 'easy'
      }),
      // Example 2: Medium difficulty with negative terms
      equationGenerators.generateLinearEquationBothSides({ 
        sectionType: 'examples',
        difficulty: 'medium' 
      }),
      // Example 3: More complex with larger coefficients
      equationGenerators.generateLinearEquationBothSides({ 
        sectionType: 'examples',
        difficulty: 'hard'
      })
    ];
    setExamples(newExamples);
    setCurrentExampleIndex(0);
    setCurrentStepIndex(0);
    setShowSteps(false);
  };

  const handleExampleChange = (index) => {
    setCurrentExampleIndex(index);
    setCurrentStepIndex(0);
    setShowSteps(false);
  };

  const nextStep = () => {
    if (currentStepIndex < currentExample?.solution?.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const toggleSteps = () => {
    setShowSteps(!showSteps);
    if (!showSteps) {
      setCurrentStepIndex(0);
    }
  };

  const currentExample = examples[currentExampleIndex];

  if (!currentExample) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading examples...</p>
        </div>
      </div>
    );
  }

  const renderExampleContent = () => {
    return (
      <div className="space-y-6">
        {/* Main Question Display */}
        <div className="text-center mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {currentExample.title}
            </h3>
            <div className="text-2xl font-mono">
              <MathDisplay expression={currentExample.questionText?.replace('Solve ', '') || 'Loading...'} />
            </div>
          </div>
        </div>

        {/* Step-by-Step Solution */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleSteps}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showSteps 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              {showSteps ? 'Hide Steps' : 'Show Step-by-Step Solution'}
            </button>
            
            {showSteps && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="p-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-600">
                  Step {currentStepIndex + 1} of {currentExample.solution?.length || 0}
                </span>
                <button
                  onClick={nextStep}
                  disabled={currentStepIndex >= (currentExample.solution?.length - 1)}
                  className="p-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Solution Steps */}
          {showSteps && currentExample.solution && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                {currentExample.solution.slice(0, currentStepIndex + 1).map((step, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-l-4 transition-all ${
                      index === currentStepIndex 
                        ? 'bg-green-50 border-green-400' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === currentStepIndex 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-700 mb-2">{step.explanation}</p>
                        <div className="text-lg">
                          <MathDisplay expression={step.formula} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Answer Highlight (when show answers is on) */}
        {showAnswers && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-blue-800">
              Final Answer: x = {currentExample.solution?.[currentExample.solution.length - 2]?.formula?.match(/x = (\d+)/)?.[1] || 'N/A'}
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabNames = [
    "Basic Example",
    "Negative Terms", 
    "Complex Equation"
  ];

  const tabDescriptions = [
    "Simple equation with positive coefficients on both sides",
    "Equation involving negative terms and subtraction",
    "More challenging equation with larger numbers"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-t-4 border-orange-500">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Solving Equations with Unknowns on Both Sides
            </h2>
            <p className="text-gray-600">
              Step-by-step worked examples
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {tabNames.map((tabName, index) => (
              <button
                key={index}
                onClick={() => handleExampleChange(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  index === currentExampleIndex
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                {tabName}
              </button>
            ))}
          </div>

          {/* Tab Description */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 italic">
              {tabDescriptions[currentExampleIndex]}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => handleExampleChange(Math.max(0, currentExampleIndex - 1))}
              disabled={currentExampleIndex === 0}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentExampleIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            
            <button
              onClick={generateExamples}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RotateCcw size={16} className="mr-2" />
              New Examples
            </button>
            
            <button
              onClick={() => handleExampleChange(Math.min(examples.length - 1, currentExampleIndex + 1))}
              disabled={currentExampleIndex === examples.length - 1}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentExampleIndex === examples.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          {/* Main Example Content */}
          {renderExampleContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamplesSection;