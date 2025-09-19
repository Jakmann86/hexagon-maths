import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { Play, Pause, RotateCcw, ArrowRight, ArrowDown } from 'lucide-react';
import * as symbolPuzzleGenerators from '../../../../generators/puzzles/symbolPuzzleGenerators';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const theme = useSectionTheme('learn');
  
  // State management
  const [currentPart, setCurrentPart] = useState(0); // 0, 1, 2 for the three parts
  const [currentExample, setCurrentExample] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  // Part definitions with custom examples
  const parts = [
    {
      title: "Part 1: Single Variable Difference",
      subtitle: "When one coefficient differs by exactly 1",
      examples: [
        {
          title: "Example 1A",
          story: "Sarah visits a pet shop. She buys 3 cats and 4 dogs for £15. Later, she buys 3 cats and 5 dogs for £18. What's the price of each animal?",
          equations: ["🐱🐱🐱 + 🐶🐶🐶🐶 = 15", "🐱🐱🐱 + 🐶🐶🐶🐶🐶 = 18"],
          symbols: ['🐱', '🐶'],
          coeffs: [[3, 4], [3, 5]],
          sums: [15, 18],
          solutions: { '🐱': 3, '🐶': 3 },
          steps: [
            {
              description: "Start with both equations",
              equations: ["🐱🐱🐱 + 🐶🐶🐶🐶 = 15", "🐱🐱🐱 + 🐶🐶🐶🐶🐶 = 18"],
              highlight: []
            },
            {
              description: "Notice: Same number of 🐱 in both equations, but different numbers of 🐶",
              equations: ["🐱🐱🐱 + 🐶🐶🐶🐶 = 15", "🐱🐱🐱 + 🐶🐶🐶🐶🐶 = 18"],
              highlight: ['🐶']
            },
            {
              description: "Subtract the first equation from the second",
              equations: ["🐶🐶🐶🐶🐶 - 🐶🐶🐶🐶 = 18 - 15"],
              highlight: ['🐶'],
              operation: "Equation 2 - Equation 1"
            },
            {
              description: "Simplify: One 🐶 equals 3",
              equations: ["🐶 = 3"],
              highlight: ['🐶']
            },
            {
              description: "Substitute back: 🐱🐱🐱 + (3)(4) = 15",
              equations: ["🐱🐱🐱 + 12 = 15"],
              highlight: ['🐱']
            },
            {
              description: "Solve: 🐱🐱🐱 = 3, so 🐱 = 1",
              equations: ["🐱 = 1"],
              highlight: ['🐱']
            }
          ]
        },
        {
          title: "Example 1B",
          story: "At the music store, Jake buys 2 stars and 3 musical notes for £11. Then he buys 2 stars and 4 musical notes for £14. How much does each item cost?",
          equations: ["🌟🌟 + 🎵🎵🎵 = 11", "🌟🌟 + 🎵🎵🎵🎵 = 14"],
          symbols: ['🌟', '🎵'],
          coeffs: [[2, 3], [2, 4]],
          sums: [11, 14],
          solutions: { '🌟': 4, '🎵': 1 },
          steps: [
            {
              description: "Start with both equations",
              equations: ["🌟🌟 + 🎵🎵🎵 = 11", "🌟🌟 + 🎵🎵🎵🎵 = 14"],
              highlight: []
            },
            {
              description: "Same number of 🌟, different numbers of 🎵",
              equations: ["🌟🌟 + 🎵🎵🎵 = 11", "🌟🌟 + 🎵🎵🎵🎵 = 14"],
              highlight: ['🎵']
            },
            {
              description: "Subtract: Extra 🎵 = 14 - 11",
              equations: ["🎵 = 3"],
              highlight: ['🎵'],
              operation: "Equation 2 - Equation 1"
            },
            {
              description: "Substitute back: 🌟🌟 + (3)(3) = 11",
              equations: ["🌟🌟 + 9 = 11"],
              highlight: ['🌟']
            },
            {
              description: "Solve: 🌟🌟 = 2, so 🌟 = 1",
              equations: ["🌟 = 1"],
              highlight: ['🌟']
            }
          ]
        }
      ]
    },
    {
      title: "Part 2: Multiple Variable Difference",
      subtitle: "When coefficients differ by more than 1",
      examples: [
        {
          title: "Example 2A",
          story: "Emma goes to the fruit market. She buys 5 apples and 3 bananas for £22. On another trip, she buys 5 apples and 6 bananas for £28. What's the cost of each fruit?",
          equations: ["🍎🍎🍎🍎🍎 + 🍌🍌🍌 = 22", "🍎🍎🍎🍎🍎 + 🍌🍌🍌🍌🍌🍌 = 28"],
          symbols: ['🍎', '🍌'],
          coeffs: [[5, 3], [5, 6]],
          sums: [22, 28],
          solutions: { '🍎': 4, '🍌': 2 },
          steps: [
            {
              description: "Start with both equations",
              equations: ["🍎🍎🍎🍎🍎 + 🍌🍌🍌 = 22", "🍎🍎🍎🍎🍎 + 🍌🍌🍌🍌🍌🍌 = 28"],
              highlight: []
            },
            {
              description: "Same 🍎, but 🍌 differs by 3",
              equations: ["🍎🍎🍎🍎🍎 + 🍌🍌🍌 = 22", "🍎🍎🍎🍎🍎 + 🍌🍌🍌🍌🍌🍌 = 28"],
              highlight: ['🍌']
            },
            {
              description: "Subtract: 3 extra 🍌 = 28 - 22",
              equations: ["🍌🍌🍌 = 6"],
              highlight: ['🍌'],
              operation: "Equation 2 - Equation 1"
            },
            {
              description: "Divide by 3: 🍌 = 2",
              equations: ["🍌 = 2"],
              highlight: ['🍌']
            },
            {
              description: "Substitute: 🍎🍎🍎🍎🍎 + (2)(3) = 22",
              equations: ["🍎🍎🍎🍎🍎 + 6 = 22"],
              highlight: ['🍎']
            },
            {
              description: "Solve: 🍎🍎🍎🍎🍎 = 16, so 🍎 = 4",
              equations: ["🍎 = 4"],
              highlight: ['🍎']
            }
          ]
        },
        {
          title: "Example 2B",
          story: "At the sports shop, Ben buys 3 footballs and 2 basketballs for £13. Later, he buys 3 footballs and 5 basketballs for £19. Find the price of each ball.",
          equations: ["⚽⚽⚽ + 🏀🏀 = 13", "⚽⚽⚽ + 🏀🏀🏀🏀🏀 = 19"],
          symbols: ['⚽', '🏀'],
          coeffs: [[3, 2], [3, 5]],
          sums: [13, 19],
          solutions: { '⚽': 3, '🏀': 2 },
          steps: [
            {
              description: "Start with both equations",
              equations: ["⚽⚽⚽ + 🏀🏀 = 13", "⚽⚽⚽ + 🏀🏀🏀🏀🏀 = 19"],
              highlight: []
            },
            {
              description: "Same ⚽, but 🏀 differs by 3",
              equations: ["⚽⚽⚽ + 🏀🏀 = 13", "⚽⚽⚽ + 🏀🏀🏀🏀🏀 = 19"],
              highlight: ['🏀']
            },
            {
              description: "Subtract: 3 extra 🏀 = 19 - 13",
              equations: ["🏀🏀🏀 = 6"],
              highlight: ['🏀'],
              operation: "Equation 2 - Equation 1"
            },
            {
              description: "Divide by 3: 🏀 = 2",
              equations: ["🏀 = 2"],
              highlight: ['🏀']
            },
            {
              description: "Substitute: ⚽⚽⚽ + (2)(2) = 13",
              equations: ["⚽⚽⚽ + 4 = 13"],
              highlight: ['⚽']
            },
            {
              description: "Solve: ⚽⚽⚽ = 9, so ⚽ = 3",
              equations: ["⚽ = 3"],
              highlight: ['⚽']
            }
          ]
        }
      ]
    },
    {
      title: "Part 3: Different Coefficients",
      subtitle: "When we need to multiply equations first",
      examples: [
        {
          title: "Example 3A",
          story: "Tom visits the toy shop twice. First trip: 2 cars and 3 bicycles cost £13. Second trip: 3 cars and 2 bicycles cost £16. What does each toy cost?",
          equations: ["🚗🚗 + 🚲🚲🚲 = 13", "🚗🚗🚗 + 🚲🚲 = 16"],
          symbols: ['🚗', '🚲'],
          coeffs: [[2, 3], [3, 2]],
          sums: [13, 16],
          solutions: { '🚗': 5, '🚲': 1 },
          steps: [
            {
              description: "Start with both equations - neither variable matches!",
              equations: ["🚗🚗 + 🚲🚲🚲 = 13", "🚗🚗🚗 + 🚲🚲 = 16"],
              highlight: []
            },
            {
              description: "We need to make coefficients match. Let's eliminate 🚗",
              equations: ["🚗🚗 + 🚲🚲🚲 = 13", "🚗🚗🚗 + 🚲🚲 = 16"],
              highlight: ['🚗']
            },
            {
              description: "Multiply first equation by 3: 3 × (🚗🚗 + 🚲🚲🚲 = 13)",
              equations: ["🚗🚗🚗🚗🚗🚗 + 🚲🚲🚲🚲🚲🚲🚲🚲🚲 = 39"],
              highlight: ['🚗'],
              operation: "Multiply equation 1 by 3"
            },
            {
              description: "Multiply second equation by 2: 2 × (🚗🚗🚗 + 🚲🚲 = 16)",
              equations: ["🚗🚗🚗🚗🚗🚗 + 🚲🚲🚲🚲 = 32"],
              highlight: ['🚗'],
              operation: "Multiply equation 2 by 2"
            },
            {
              description: "Now we have the same number of 🚗! Subtract:",
              equations: ["🚗🚗🚗🚗🚗🚗 + 🚲🚲🚲🚲🚲🚲🚲🚲🚲 = 39", "🚗🚗🚗🚗🚗🚗 + 🚲🚲🚲🚲 = 32"],
              highlight: ['🚗']
            },
            {
              description: "Subtract: 5🚲 = 7, so 🚲 = 1",
              equations: ["🚲🚲🚲🚲🚲 = 5", "🚲 = 1"],
              highlight: ['🚲'],
              operation: "Equation A - Equation B"
            },
            {
              description: "Substitute: 🚗🚗 + (1)(3) = 13, so 🚗 = 5",
              equations: ["🚗🚗 = 10", "🚗 = 5"],
              highlight: ['🚗']
            }
          ]
        }
      ]
    }
  ];

  const currentPartData = parts[currentPart];
  const currentExampleData = currentPartData.examples[currentExample];
  const currentStepData = currentExampleData.steps[currentStep];

  // Auto-play functionality
  React.useEffect(() => {
    let interval;
    if (autoPlay && currentStep < currentExampleData.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 3000);
    } else if (autoPlay && currentStep >= currentExampleData.steps.length - 1) {
      setAutoPlay(false);
    }
    return () => clearInterval(interval);
  }, [autoPlay, currentStep, currentExampleData.steps.length]);

  // Emoji rendering component
  const EmojiEquation = ({ equations, highlight = [], operation = null }) => {
    const renderEquation = (equation) => {
      // Split equation into parts and render with large emojis
      const parts = equation.split(/([=+\-×÷\(\)])/).filter(part => part.trim());
      
      return parts.map((part, index) => {
        // Check if part contains emojis
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        const emojis = part.match(emojiRegex);
        
        if (emojis) {
          // Render each emoji with highlighting
          return emojis.map((emoji, emojiIndex) => {
            const isHighlighted = highlight.includes(emoji);
            return (
              <span 
                key={`${index}-${emojiIndex}`}
                className={`inline-block text-5xl mx-1 transition-all duration-500 ${
                  isHighlighted ? 'bg-yellow-200 rounded-lg px-1 scale-110 shadow-lg' : ''
                }`}
              >
                {emoji}
              </span>
            );
          });
        } else {
          // Render operators and numbers
          return (
            <span 
              key={index}
              className="text-3xl font-bold mx-2 text-gray-700"
            >
              {part.trim()}
            </span>
          );
        }
      }).flat();
    };

    return (
      <div className="space-y-4">
        {operation && (
          <div className="text-center bg-blue-100 border border-blue-300 rounded-lg p-2 mb-4">
            <span className="text-blue-800 font-semibold">{operation}</span>
          </div>
        )}
        
        {equations.map((equation, index) => (
          <div key={index} className="text-center py-3 bg-white rounded-lg border-2 border-gray-200">
            {renderEquation(equation)}
          </div>
        ))}
      </div>
    );
  };

  const nextStep = () => {
    if (currentStep < currentExampleData.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetExample = () => {
    setCurrentStep(0);
    setAutoPlay(false);
  };

  const nextExample = () => {
    if (currentExample < currentPartData.examples.length - 1) {
      setCurrentExample(prev => prev + 1);
      setCurrentStep(0);
      setAutoPlay(false);
    }
  };

  const prevExample = () => {
    if (currentExample > 0) {
      setCurrentExample(prev => prev - 1);
      setCurrentStep(0);
      setAutoPlay(false);
    }
  };

  const nextPart = () => {
    if (currentPart < parts.length - 1) {
      setCurrentPart(prev => prev + 1);
      setCurrentExample(0);
      setCurrentStep(0);
      setAutoPlay(false);
    }
  };

  const prevPart = () => {
    if (currentPart > 0) {
      setCurrentPart(prev => prev - 1);
      setCurrentExample(0);
      setCurrentStep(0);
      setAutoPlay(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={`border-t-4 border-${theme.primary}`}>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Solving Simultaneous Equations</h2>
          
          {/* Part Navigation */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {parts.map((part, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentPart(index);
                  setCurrentExample(0);
                  setCurrentStep(0);
                  setAutoPlay(false);
                }}
                className={`px-6 py-3 rounded-lg transition-colors text-lg font-semibold ${
                  index === currentPart
                    ? `bg-${theme.primary} text-white shadow-lg`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Part {index + 1}
              </button>
            ))}
          </div>

          {/* Example Navigation */}
          <div className="flex justify-center items-center space-x-3 mb-8">
            {currentPartData.examples.map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentExample(index);
                  setCurrentStep(0);
                  setAutoPlay(false);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  index === currentExample
                    ? `bg-${theme.secondary} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>

          {/* Main Visualization */}
          <div className="bg-gray-50 rounded-lg p-8 mb-6">
            {/* Story */}
            <div className="text-center mb-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
              <p className="text-lg text-gray-800 leading-relaxed">
                {currentExampleData.story}
              </p>
            </div>

            {/* Emoji Equations */}
            <div className="max-w-4xl mx-auto">
              <EmojiEquation 
                equations={currentStepData.equations}
                highlight={currentStepData.highlight || []}
                operation={currentStepData.operation}
              />
            </div>
          </div>

          {/* Simple Step Navigation */}
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              ← Previous
            </button>
            
            <button
              onClick={nextStep}
              disabled={currentStep === currentExampleData.steps.length - 1}
              className={`px-6 py-3 text-white rounded-lg disabled:opacity-50 transition-colors bg-${theme.primary} hover:bg-${theme.secondary}`}
            >
              Next →
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {currentExampleData.steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? `bg-${theme.primary}`
                    : index < currentStep
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Teacher Notes - Hidden behind showAnswers */}
          {showAnswers && (
            <div className={`mt-8 border-t border-${theme.borderColor} pt-6`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Notes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Teaching Progression</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700">
                    <li><strong>Part 1:</strong> Build confidence with obvious eliminations</li>
                    <li><strong>Part 2:</strong> Develop pattern recognition for larger differences</li>
                    <li><strong>Part 3:</strong> Introduce the concept of multiplying equations</li>
                    <li>Use the emoji highlighting to show which variables "cancel out"</li>
                    <li>Emphasize the visual patterns before introducing algebraic notation</li>
                  </ul>
                </div>
                
                <div className={`bg-${theme.pastelBg} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Discussion Questions</h4>
                  <ul className={`list-disc list-inside space-y-2 text-${theme.secondaryText}`}>
                    <li>Why can we subtract one equation from another?</li>
                    <li>What happens when we multiply an equation by a number?</li>
                    <li>How do you decide which variable to eliminate first?</li>
                    <li>Can you predict the next step before clicking?</li>
                    <li>How would this look with letters instead of emojis?</li>
                  </ul>
                </div>
              </div>

              <div className={`mt-4 bg-${theme.pastelBg} p-4 rounded-lg`}>
                <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Bridge to Algebra</h4>
                <p className="text-gray-700 mb-3">
                  These emoji patterns directly translate to algebraic simultaneous equations:
                </p>
                <ul className={`list-disc list-inside space-y-1 text-${theme.secondaryText}`}>
                  <li>🐱🐱🐱 becomes 3x</li>
                  <li>🐶🐶🐶🐶 becomes 4y</li>
                  <li>The same elimination steps work with letters</li>
                  <li>Students will see the algebra as just a shorthand for the emoji patterns</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  <strong>Next:</strong> In the Examples section, students will practice the same methods using algebraic notation.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSection;