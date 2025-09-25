// src/content/topics/algebra-i/indices/LearnSection.jsx
import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');
  
  // State for controlling the interactive demonstration
  const [currentRule, setCurrentRule] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Index laws with interactive demonstrations
  const indexLaws = [
    {
      title: "Multiplying Powers (Same Base)",
      rule: "x^a \\times x^b = x^{a+b}",
      description: "When multiplying powers with the same base, add the indices",
      example: {
        question: "x^3 \\times x^5",
        steps: [
          { text: "Start with the expression", math: "x^3 \\times x^5" },
          { text: "Apply the multiplication rule: add the indices", math: "x^{3+5}" },
          { text: "Simplify", math: "x^8" }
        ],
        visual: "multiplication"
      }
    },
    {
      title: "Dividing Powers (Same Base)", 
      rule: "x^a \\div x^b = x^{a-b}",
      description: "When dividing powers with the same base, subtract the indices",
      example: {
        question: "x^7 \\div x^3",
        steps: [
          { text: "Start with the expression", math: "x^7 \\div x^3" },
          { text: "Apply the division rule: subtract the indices", math: "x^{7-3}" },
          { text: "Simplify", math: "x^4" }
        ],
        visual: "division"
      }
    },
    {
      title: "Power of a Power",
      rule: "(x^a)^b = x^{a \\times b}",
      description: "When raising a power to another power, multiply the indices",
      example: {
        question: "(x^2)^3",
        steps: [
          { text: "Start with the expression", math: "(x^2)^3" },
          { text: "Apply the power rule: multiply the indices", math: "x^{2 \\times 3}" },
          { text: "Simplify", math: "x^6" }
        ],
        visual: "power"
      }
    },
    {
      title: "Negative Powers",
      rule: "x^{-n} = \\frac{1}{x^n}",
      description: "A negative power means 'one over' the positive power",
      example: {
        question: "x^{-3}",
        steps: [
          { text: "Start with the expression", math: "x^{-3}" },
          { text: "Apply the negative power rule", math: "\\frac{1}{x^3}" }
        ],
        visual: "negative"
      }
    },
    {
      title: "Fractional Powers",
      rule: "x^{\\frac{1}{n}} = \\sqrt[n]{x}",
      description: "Fractional powers represent roots",
      example: {
        question: "x^{\\frac{1}{2}}",
        steps: [
          { text: "Start with the expression", math: "x^{\\frac{1}{2}}" },
          { text: "Apply the fractional power rule", math: "\\sqrt{x}" }
        ],
        visual: "fractional"
      }
    },
    {
      title: "Zero Power",
      rule: "x^0 = 1 \\text{ (where } x \\neq 0 \\text{)}",
      description: "Any non-zero number to the power 0 equals 1",
      example: {
        question: "5^0",
        steps: [
          { text: "Start with the expression", math: "5^0" },
          { text: "Apply the zero power rule", math: "1" }
        ],
        visual: "zero"
      }
    }
  ];

  const currentLaw = indexLaws[currentRule];

  // Interactive visualization component
  const IndexLawVisualization = ({ law, step }) => {
    const baseStyle = "transition-all duration-500 ease-in-out";
    
    if (law.visual === "multiplication") {
      return (
        <div className="flex items-center justify-center space-x-4 py-8">
          <div className={`${baseStyle} ${step >= 0 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">x³</div>
              <div className="text-sm text-gray-600">Base: x, Index: 3</div>
            </div>
          </div>
          
          <div className={`text-3xl font-bold text-gray-400 ${baseStyle} ${step >= 1 ? 'text-green-600' : ''}`}>
            ×
          </div>
          
          <div className={`${baseStyle} ${step >= 0 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">x⁵</div>
              <div className="text-sm text-gray-600">Base: x, Index: 5</div>
            </div>
          </div>
          
          <div className={`text-3xl font-bold text-gray-400 ${baseStyle} ${step >= 2 ? 'text-green-600' : ''}`}>
            =
          </div>
          
          <div className={`${baseStyle} ${step >= 2 ? 'opacity-100 scale-110 text-green-600' : 'opacity-30 scale-95'}`}>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">x⁸</div>
              <div className="text-sm text-gray-600">3 + 5 = 8</div>
            </div>
          </div>
        </div>
      );
    }
    
    if (law.visual === "negative") {
      return (
        <div className="flex items-center justify-center space-x-6 py-8">
          <div className={`${baseStyle} ${step >= 0 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">x⁻³</div>
              <div className="text-sm text-gray-600">Negative power</div>
            </div>
          </div>
          
          <div className={`text-3xl font-bold text-gray-400 ${baseStyle} ${step >= 1 ? 'text-green-600' : ''}`}>
            =
          </div>
          
          <div className={`${baseStyle} ${step >= 1 ? 'opacity-100 scale-110 text-green-600' : 'opacity-30 scale-95'}`}>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                <div className="border-b-2 border-black pb-1">1</div>
                <div className="pt-1">x³</div>
              </div>
              <div className="text-sm text-gray-600">One over x³</div>
            </div>
          </div>
        </div>
      );
    }
    
    if (law.visual === "fractional") {
      return (
        <div className="flex items-center justify-center space-x-6 py-8">
          <div className={`${baseStyle} ${step >= 0 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                x<sup className="text-2xl">½</sup>
              </div>
              <div className="text-sm text-gray-600">Fractional power</div>
            </div>
          </div>
          
          <div className={`text-3xl font-bold text-gray-400 ${baseStyle} ${step >= 1 ? 'text-green-600' : ''}`}>
            =
          </div>
          
          <div className={`${baseStyle} ${step >= 1 ? 'opacity-100 scale-110 text-green-600' : 'opacity-30 scale-95'}`}>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">√x</div>
              <div className="text-sm text-gray-600">Square root of x</div>
            </div>
          </div>
        </div>
      );
    }
    
    // Default visualization for other types
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <MathDisplay expression={law.example.question} className="text-3xl mb-4" />
          {step >= 1 && (
            <div className="mt-4">
              <div className="text-2xl text-green-600">↓</div>
              <MathDisplay 
                expression={law.example.steps[law.example.steps.length - 1].math} 
                className="text-3xl text-green-600" 
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const nextRule = () => {
    setCurrentRule((prev) => (prev + 1) % indexLaws.length);
    setShowSteps(false);
    setAnimationStep(0);
  };

  const prevRule = () => {
    setCurrentRule((prev) => (prev - 1 + indexLaws.length) % indexLaws.length);
    setShowSteps(false);
    setAnimationStep(0);
  };

  const toggleSteps = () => {
    setShowSteps(!showSteps);
    setAnimationStep(0);
  };

  const nextAnimationStep = () => {
    if (animationStep < currentLaw.example.steps.length - 1) {
      setAnimationStep(prev => prev + 1);
    }
  };

  const resetAnimation = () => {
    setAnimationStep(0);
  };

  return (
    <div className="space-y-6">
      {/* Main Rule Card */}
      <Card className={`border-t-4 border-${theme.primary}`}>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Laws of Indices
            </h2>
            <p className="text-gray-600">
              Interactive exploration of index laws
            </p>
          </div>

          {/* Rule Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevRule}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentRule === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : `text-${theme.secondaryText} hover:bg-${theme.secondary}`
              }`}
              disabled={currentRule === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">
                Rule {currentRule + 1} of {indexLaws.length}
              </div>
              <h3 className={`text-xl font-semibold text-${theme.secondaryText}`}>
                {currentLaw.title}
              </h3>
            </div>

            <button
              onClick={nextRule}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentRule === indexLaws.length - 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : `text-${theme.secondaryText} hover:bg-${theme.secondary}`
              }`}
              disabled={currentRule === indexLaws.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Rule Formula */}
          <div className={`bg-${theme.pastelBg} p-6 rounded-lg text-center mb-6`}>
            <MathDisplay 
              expression={currentLaw.rule} 
              className="text-2xl font-bold mb-3"
            />
            <p className="text-gray-700 text-lg">
              {currentLaw.description}
            </p>
          </div>

          {/* Interactive Visualization */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Example:</h4>
              <MathDisplay 
                expression={currentLaw.example.question} 
                className="text-2xl"
              />
            </div>
            
            <IndexLawVisualization law={currentLaw} step={animationStep} />
            
            {/* Animation Controls */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={resetAnimation}
                className={`flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors`}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              
              <button
                onClick={nextAnimationStep}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  animationStep >= currentLaw.example.steps.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : `bg-${theme.primary} text-white hover:bg-${theme.primaryHover}`
                }`}
                disabled={animationStep >= currentLaw.example.steps.length - 1}
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Step-by-step Solution */}
          <div className="space-y-4">
            <button
              onClick={toggleSteps}
              className={`w-full px-4 py-2 rounded-lg border-2 transition-colors ${
                showSteps 
                  ? `bg-${theme.primary} text-white border-${theme.primary}`
                  : `bg-white text-${theme.secondaryText} border-${theme.secondary} hover:bg-${theme.secondary}`
              }`}
            >
              {showSteps ? 'Hide' : 'Show'} Step-by-Step Solution
            </button>

            {showSteps && (
              <div className={`bg-${theme.pastelBg} p-6 rounded-lg`}>
                <h4 className={`text-lg font-semibold text-${theme.secondaryText} mb-4`}>
                  Solution Steps:
                </h4>
                <div className="space-y-4">
                  {currentLaw.example.steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                        index <= animationStep ? 'bg-white border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index <= animationStep ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 mb-1">{step.text}</p>
                        <MathDisplay expression={step.math} className="text-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex justify-center space-x-2">
              {indexLaws.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentRule(index);
                    setShowSteps(false);
                    setAnimationStep(0);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentRule 
                      ? `bg-${theme.primary}` 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSection;