// src/content/topics/algebra-i/indices/ExamplesSection.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for examples section
  const theme = useSectionTheme('examples');
  const { showAnswers } = useUI();

  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [visibleStepIndex, setVisibleStepIndex] = useState(null);

  // Static examples that always work
  const generateExamples = () => {
    const exampleSets = [
      // Set 1: Negative Powers Examples
      [
        {
          title: 'Simple Negative Power',
          question: 'Simplify: $5^{-2}$',
          steps: [
            {
              explanation: 'Apply the negative power rule: $a^{-n} = \\frac{1}{a^n}$',
              formula: '5^{-2} = \\frac{1}{5^2}'
            },
            {
              explanation: 'Calculate the positive power',
              formula: '= \\frac{1}{25}'
            }
          ]
        },
        {
          title: 'Algebraic Negative Power',
          question: 'Simplify: $(3x^2)^{-2}$',
          steps: [
            {
              explanation: 'Apply negative power rule: $(ab)^{-n} = \\frac{1}{(ab)^n}$',
              formula: '(3x^2)^{-2} = \\frac{1}{(3x^2)^2}'
            },
            {
              explanation: 'Apply power to each factor: $(ab)^n = a^n b^n$',
              formula: '= \\frac{1}{3^2 \\times (x^2)^2}'
            },
            {
              explanation: 'Simplify using power rule: $(x^m)^n = x^{mn}$',
              formula: '= \\frac{1}{9x^4}'
            }
          ]
        },
        {
          title: 'Multiple Variables',
          question: 'Simplify: $(2a^3b^{-2})^{-1}$',
          steps: [
            {
              explanation: 'Apply negative power rule',
              formula: '(2a^3b^{-2})^{-1} = \\frac{1}{2a^3b^{-2}}'
            },
            {
              explanation: 'Handle $b^{-2}$ in denominator: $\\frac{1}{b^{-2}} = b^2$',
              formula: '= \\frac{1}{2a^3} \\times b^2'
            },
            {
              explanation: 'Combine',
              formula: '= \\frac{b^2}{2a^3}'
            }
          ]
        }
      ],

      // Set 2: Fractional Powers Examples
      [
        {
          title: 'Square Root Power',
          question: 'Simplify: $25^{\\frac{1}{2}}$',
          steps: [
            {
              explanation: 'Convert fractional power to root form: $a^{\\frac{1}{n}} = \\sqrt[n]{a}$',
              formula: '25^{\\frac{1}{2}} = \\sqrt{25}'
            },
            {
              explanation: 'Calculate the square root',
              formula: '= 5'
            }
          ]
        },
        {
          title: 'Cube Root with Power',
          question: 'Simplify: $8^{\\frac{2}{3}}$',
          steps: [
            {
              explanation: 'Use the rule: $a^{\\frac{m}{n}} = (\\sqrt[n]{a})^m$',
              formula: '8^{\\frac{2}{3}} = (\\sqrt[3]{8})^2'
            },
            {
              explanation: 'Find the cube root: $\\sqrt[3]{8} = 2$',
              formula: '= (2)^2'
            },
            {
              explanation: 'Calculate the final power',
              formula: '= 4'
            }
          ]
        },
        {
          title: 'Algebraic Expression',
          question: 'Simplify: $(9x^4)^{\\frac{1}{2}}$',
          steps: [
            {
              explanation: 'Apply power to each factor: $(ab)^n = a^n b^n$',
              formula: '(9x^4)^{\\frac{1}{2}} = 9^{\\frac{1}{2}} \\times (x^4)^{\\frac{1}{2}}'
            },
            {
              explanation: 'Convert to square roots',
              formula: '= \\sqrt{9} \\times x^{4 \\times \\frac{1}{2}}'
            },
            {
              explanation: 'Simplify',
              formula: '= 3x^2'
            }
          ]
        }
      ],

      // Set 3: Complex Mixed Problems
      [
        {
          title: 'Complex Fraction',
          question: 'Simplify: $\\left(\\frac{8x^3y^6}{27x^9y^3}\\right)^{-\\frac{2}{3}}$',
          steps: [
            {
              explanation: 'First simplify the fraction using index laws',
              formula: '\\frac{8x^3y^6}{27x^9y^3} = \\frac{8y^3}{27x^6}'
            },
            {
              explanation: 'Apply negative power rule (flip fraction)',
              formula: '\\left(\\frac{8y^3}{27x^6}\\right)^{-\\frac{2}{3}} = \\left(\\frac{27x^6}{8y^3}\\right)^{\\frac{2}{3}}'
            },
            {
              explanation: 'Apply fractional power to numerator and denominator',
              formula: '= \\frac{(27x^6)^{\\frac{2}{3}}}{(8y^3)^{\\frac{2}{3}}}'
            },
            {
              explanation: 'Calculate: $27^{\\frac{2}{3}} = (\\sqrt[3]{27})^2 = 3^2 = 9$ and $8^{\\frac{2}{3}} = (\\sqrt[3]{8})^2 = 2^2 = 4$',
              formula: '= \\frac{9x^4}{4y^2}'
            }
          ]
        },
        {
          title: 'Mixed Powers Fraction',
          question: 'Simplify: $\\left(\\frac{25a^4b^2}{16a^8b^6}\\right)^{-\\frac{1}{2}}$',
          steps: [
            {
              explanation: 'Simplify using index laws: $\\frac{a^m}{a^n} = a^{m-n}$',
              formula: '\\frac{25a^4b^2}{16a^8b^6} = \\frac{25}{16a^4b^4}'
            },
            {
              explanation: 'Apply negative power rule (flip fraction)',
              formula: '\\left(\\frac{25}{16a^4b^4}\\right)^{-\\frac{1}{2}} = \\left(\\frac{16a^4b^4}{25}\\right)^{\\frac{1}{2}}'
            },
            {
              explanation: 'Apply square root to each part',
              formula: '= \\frac{\\sqrt{16a^4b^4}}{\\sqrt{25}} = \\frac{4a^2b^2}{5}'
            }
          ]
        },
        {
          title: 'Ultimate Challenge',
          question: 'Simplify: $\\left(\\frac{4p^2q^8}{9p^6q^2}\\right)^{-\\frac{3}{2}}$',
          steps: [
            {
              explanation: 'Simplify the fraction',
              formula: '\\frac{4p^2q^8}{9p^6q^2} = \\frac{4q^6}{9p^4}'
            },
            {
              explanation: 'Apply negative power rule (flip fraction)',
              formula: '\\left(\\frac{4q^6}{9p^4}\\right)^{-\\frac{3}{2}} = \\left(\\frac{9p^4}{4q^6}\\right)^{\\frac{3}{2}}'
            },
            {
              explanation: 'Apply fractional power',
              formula: '= \\frac{(9p^4)^{\\frac{3}{2}}}{(4q^6)^{\\frac{3}{2}}}'
            },
            {
              explanation: 'Calculate: $9^{\\frac{3}{2}} = (\\sqrt{9})^3 = 3^3 = 27$ and $4^{\\frac{3}{2}} = (\\sqrt{4})^3 = 2^3 = 8$',
              formula: '= \\frac{27p^6}{8q^9}'
            }
          ]
        }
      ]
    ];

    // Randomly select one example from each set
    const selectedExamples = exampleSets.map(set => {
      const randomIndex = Math.floor(Math.random() * set.length);
      return set[randomIndex];
    });

    setExamples(selectedExamples);
    setCurrentExampleIndex(0);
    setVisibleStepIndex(null);
  };

  useEffect(() => {
    generateExamples();
  }, []);

  const tabNames = ['Negative Powers', 'Fractional Powers', 'Complex Mixed Problems'];
  const tabDescriptions = [
    'Master negative indices: a⁻ⁿ = 1/aⁿ',
    'Understand fractional powers: a^(m/n) = ⁿ√(aᵐ)',
    'Combine multiple laws in complex expressions'
  ];

  const handleExampleChange = (index) => {
    setCurrentExampleIndex(index);
    setVisibleStepIndex(null);
  };

  const toggleStep = (stepIndex) => {
    setVisibleStepIndex(visibleStepIndex === stepIndex ? null : stepIndex);
  };

  const showAllSteps = () => {
    setVisibleStepIndex('all');
  };

  const hideAllSteps = () => {
    setVisibleStepIndex(null);
  };

  if (examples.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading examples...</p>
        </div>
      </div>
    );
  }

  const currentExample = examples[currentExampleIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-t-4 border-orange-500">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Laws of Indices - Worked Examples
            </h2>
            <p className="text-gray-600">
              Step-by-step solutions for mastering index laws
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
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-orange-600 hover:bg-orange-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-500">
                Example {currentExampleIndex + 1} of {examples.length}
              </span>
            </div>

            <button
              onClick={() => handleExampleChange(Math.min(examples.length - 1, currentExampleIndex + 1))}
              disabled={currentExampleIndex === examples.length - 1}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentExampleIndex === examples.length - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-orange-600 hover:bg-orange-100'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={generateExamples}
              className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Examples
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Current Example */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {currentExample.title}
            </h3>
            
            {/* Question */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <MathDisplay expression={currentExample.question.replace(/^\$|\$$/g, '')} className="text-2xl" />
            </div>
          </div>

          {/* Step Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={showAllSteps}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              Show All Steps
            </button>
            <button
              onClick={hideAllSteps}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Hide Steps
            </button>
          </div>

          {/* Solution Steps */}
          <div className="space-y-4">
            {currentExample.steps.map((step, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleStep(index)}
                  className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${
                    visibleStepIndex === index || visibleStepIndex === 'all'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${
                      visibleStepIndex === index || visibleStepIndex === 'all'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">
                      {step.explanation}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${
                    visibleStepIndex === index || visibleStepIndex === 'all' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {(visibleStepIndex === index || visibleStepIndex === 'all') && (
                  <div className="px-6 py-4 bg-white border-t">
                    <MathDisplay expression={step.formula} className="text-lg" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show Answers Toggle */}
          {showAnswers && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Final Answer:</h4>
              <div className="text-center">
                <MathDisplay 
                  expression={currentExample.steps[currentExample.steps.length - 1].formula} 
                  className="text-xl text-green-700" 
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamplesSection;