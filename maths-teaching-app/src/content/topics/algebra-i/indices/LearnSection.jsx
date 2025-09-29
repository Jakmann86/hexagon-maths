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
      description: "A fractional power with numerator 1 means the nth root",
      example: {
        question: "x^{\\frac{1}{2}}",
        steps: [
          { text: "Start with the expression", math: "x^{\\frac{1}{2}}" },
          { text: "Apply the fractional power rule", math: "\\sqrt{x}" }
        ],
        visual: "fractional"
      }
    }
  ];

  const currentLaw = indexLaws[currentRule];

  // Interactive visualization component
  const IndexLawVisualization = ({ law, step }) => {
    const baseStyle = "transition-all duration-500 transform";

    if (law.visual === "fractional") {
      return (
        <div className="flex items-center justify-center space-x-8 py-8">
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
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : `bg-${theme.primary} text-white hover:bg-${theme.secondary}`
                }`}
                disabled={animationStep >= currentLaw.example.steps.length - 1}
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Step-by-Step Breakdown */}
          {showSteps && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Step-by-Step Solution:</h4>
              <div className="space-y-3">
                {currentLaw.example.steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-4 p-3 rounded-lg ${
                      index <= animationStep ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index <= animationStep ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-700 mb-1">{step.text}</p>
                      <MathDisplay expression={step.math} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show/Hide Steps Button */}
          <div className="text-center">
            <button
              onClick={toggleSteps}
              className={`px-6 py-2 rounded-lg transition-colors ${
                showSteps 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : `bg-${theme.primary} text-white hover:bg-${theme.secondary}`
              }`}
            >
              {showSteps ? 'Hide Steps' : 'Show All Steps'}
            </button>
          </div>

          {/* Teacher Notes */}
          {showAnswers && (
            <div className={`mt-8 border-t border-${theme.borderColor} pt-6`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Common Mistakes</h4>
                  <ul className="list-disc list-inside space-y-1 text-amber-700 text-sm">
                    <li>Adding indices when they should be multiplied</li>
                    <li>Forgetting negative signs in calculations</li>
                    <li>Confusing roots with regular powers</li>
                    <li>Not applying rules consistently</li>
                  </ul>
                </div>
                
                <div className={`bg-${theme.pastelBg} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Key Teaching Points</h4>
                  <ul className={`list-disc list-inside space-y-1 text-${theme.secondaryText} text-sm`}>
                    <li>Start with concrete examples using small numbers</li>
                    <li>Use the visualization to reinforce the concept</li>
                    <li>Encourage students to check their work</li>
                    <li>Link to real-world applications when possible</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSection;