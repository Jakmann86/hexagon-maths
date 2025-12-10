// src/content/topics/algebra-i/indices/ExamplesSection.jsx
// Examples Section for Negative and Fractional Indices
// Three tabs: Numeric, Algebraic, Complex Combined
// Following Pattern 2 architecture - Teacher-led approach

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../../../../components/common/Card';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import MathDisplay from '../../../../components/common/MathDisplay';
import { indicesExamplesGenerators } from '../../../../generators/algebra/indicesExamplesGenerator';

/**
 * ExamplesSection for Negative and Fractional Indices
 * 
 * Tab 1: Pure Numeric - negative powers, fractional powers, combined
 * Tab 2: Algebraic - simple variables, with coefficients, simplifying fractions
 * Tab 3: Complex Combined - full fractions with x and y, negative fractional powers
 * 
 * Teacher-led: Question displayed, solution revealed via global "Show Answers" toggle
 */
const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  const theme = useSectionTheme('examples');
  const { showAnswers } = useUI();

  const [examples, setExamples] = useState([]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Generate all examples
  const generateAllExamples = useCallback(() => {
    setIsLoading(true);
    const seed = Date.now();
    
    const newExamples = [
      indicesExamplesGenerators.generateNumericIndicesExample({ seed }),
      indicesExamplesGenerators.generateAlgebraicIndicesExample({ seed: seed + 1000 }),
      indicesExamplesGenerators.generateComplexIndicesExample({ seed: seed + 2000 })
    ];
    
    setExamples(newExamples);
    setIsLoading(false);
  }, []);

  // Generate single example for current tab
  const regenerateCurrentExample = useCallback(() => {
    const generators = [
      indicesExamplesGenerators.generateNumericIndicesExample,
      indicesExamplesGenerators.generateAlgebraicIndicesExample,
      indicesExamplesGenerators.generateComplexIndicesExample
    ];
    
    const seed = Date.now();
    const newExample = generators[currentTabIndex]({ seed });
    
    setExamples(prev => {
      const updated = [...prev];
      updated[currentTabIndex] = newExample;
      return updated;
    });
  }, [currentTabIndex]);

  // Initial generation
  useEffect(() => {
    generateAllExamples();
  }, [generateAllExamples]);

  // Loading state
  if (isLoading || examples.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading examples...</p>
        </div>
      </div>
    );
  }

  const currentExample = examples[currentTabIndex];

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-orange-500 rounded-lg shadow-md bg-white overflow-hidden">
        {/* Header Section */}
        <div className="px-6 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Title - from the generator */}
            <h3 className="text-xl font-semibold text-gray-800">
              {currentExample?.title || 'Worked Examples'}
            </h3>

            {/* New Question Button */}
            <button
              onClick={regenerateCurrentExample}
              className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all"
            >
              <RefreshCw size={18} />
              <span>New Question</span>
            </button>

            {/* Tab Navigation - just 1, 2, 3 */}
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTabIndex(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all font-medium ${
                    index === currentTabIndex
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardContent className="p-6">
            {/* Question Display */}
            <div className="bg-orange-50 rounded-lg p-8 border-l-4 border-orange-400 mb-6">
              <div className="text-center">
                <p className="text-sm text-orange-600 mb-3 font-medium">Simplify:</p>
                <div className="text-3xl">
                  <MathDisplay 
                    math={currentExample?.questionText?.replace(/^\$/, '').replace(/\$$/, '').replace('Simplify: ', '').replace(/\$/g, '')} 
                    displayMode={true}
                  />
                </div>
              </div>
            </div>

            {/* Solution - All steps revealed together when showAnswers is true */}
            {showAnswers && currentExample?.solution && (
              <div className="space-y-4">
                {/* Solution Steps */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-4">Solution:</h4>
                  <div className="space-y-4">
                    {currentExample.solution.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {/* Step Number */}
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        {/* Step Content */}
                        <div className="flex-grow">
                          <p className="text-gray-700 mb-2">{step.explanation}</p>
                          {step.formula && (
                            <div className="bg-white p-3 rounded-md border border-green-200 inline-block">
                              <MathDisplay math={step.formula} displayMode={true} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Final Answer */}
                  {currentExample.answer && (
                    <div className="mt-6 pt-4 border-t border-green-300">
                      <div className="text-center">
                        <span className="text-green-700 font-medium mr-3">Answer:</span>
                        <span className="text-2xl">
                          <MathDisplay math={currentExample.answer} displayMode={false} />
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Rules - shown when answers revealed */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h5 className="font-medium text-purple-800 mb-2">Key Rules</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <MathDisplay math="a^{-n} = \frac{1}{a^n}" displayMode={false} />
                      <p className="text-purple-600 mt-1">Negative power</p>
                    </div>
                    <div className="text-center">
                      <MathDisplay math="a^{\frac{1}{n}} = \sqrt[n]{a}" displayMode={false} />
                      <p className="text-purple-600 mt-1">Fractional power</p>
                    </div>
                    <div className="text-center">
                      <MathDisplay math="a^{\frac{m}{n}} = (\sqrt[n]{a})^m" displayMode={false} />
                      <p className="text-purple-600 mt-1">Combined</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Space for teacher's working when answers hidden */}
            {!showAnswers && (
              <div className="bg-gray-50 rounded-lg p-8 min-h-[200px] border-2 border-dashed border-gray-300">
                {/* Empty space for teacher to work through on board */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamplesSection;