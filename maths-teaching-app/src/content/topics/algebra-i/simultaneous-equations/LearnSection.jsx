import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import { RefreshCw } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  
  // State management
  const [currentPart, setCurrentPart] = useState(0);
  const [currentExample, setCurrentExample] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [multiplierA, setMultiplierA] = useState(1);
  const [multiplierB, setMultiplierB] = useState(1);
  const [showMultiplierModal, setShowMultiplierModal] = useState(false);
  const [extraSteps, setExtraSteps] = useState([]);

  // Part definitions with custom examples
  const parts = [
    {
      title: "Part 1: Single Variable Difference",
      examples: [
        {
          title: "Example A",
          story: "Sarah visits a pet shop. She buys 3 cats and 4 dogs for £15. Later, she buys 3 cats and 5 dogs for £18. What's the price of each animal?",
          equations: ["🐱🐱🐱 + 🐶🐶🐶🐶 = 15", "🐱🐱🐱 + 🐶🐶🐶🐶🐶 = 18"],
          symbols: ['🐱', '🐶'],
          coeffs: [[3, 4], [3, 5]],
          sums: [15, 18],
          solutions: { '🐱': 3, '🐶': 3 },
          steps: [
            { equations: ["🐱🐱🐱 + 🐶🐶🐶🐶 = 15", "🐱🐱🐱 + 🐶🐶🐶🐶🐶 = 18"] },
            { equations: ["🐱🐱🐱 + 🐶🐶🐶🐶 = 15", "🐱🐱🐱 + 🐶🐶🐶🐶🐶 = 18"] },
            { equations: ["🐶 = 3"], operation: "Equation 2 - Equation 1" },
            { equations: ["🐱🐱🐱 + 12 = 15"] },
            { equations: ["🐱 = 1"] }
          ],
          teacherScript: [
            "Start with both equations. What do you notice?",
            "The number of cats is the same in both equations, but the dogs are different. Which variable should we eliminate?",
            "Subtract equation 1 from equation 2. What happens to the cats? What are we left with?",
            "Now we know one dog costs £3. How can we find the cost of a cat?",
            "Each cat costs £1. Let's verify this works in both original equations."
          ]
        },
        {
          title: "Example B",
          story: "At the music store, Jake buys 2 stars and 3 musical notes for £11. Then he buys 2 stars and 4 musical notes for £14. How much does each item cost?",
          equations: ["🌟🌟 + 🎵🎵🎵 = 11", "🌟🌟 + 🎵🎵🎵🎵 = 14"],
          symbols: ['🌟', '🎵'],
          coeffs: [[2, 3], [2, 4]],
          sums: [11, 14],
          solutions: { '🌟': 4, '🎵': 1 },
          steps: [
            { equations: ["🌟🌟 + 🎵🎵🎵 = 11", "🌟🌟 + 🎵🎵🎵🎵 = 14"] },
            { equations: ["🌟🌟 + 🎵🎵🎵 = 11", "🌟🌟 + 🎵🎵🎵🎵 = 14"] },
            { equations: ["🎵 = 3"], operation: "Equation 2 - Equation 1" },
            { equations: ["🌟🌟 + 9 = 11"] },
            { equations: ["🌟 = 1"] }
          ],
          teacherScript: [
            "What's the same and what's different in these two equations?",
            "Stars stay the same, notes change by 1. Which should we eliminate?",
            "Subtracting gives us the value of one note immediately.",
            "Substitute the note value back. What equation do we get?",
            "One star costs £1. Check: does this satisfy both equations?"
          ]
        }
      ]
    },
    {
      title: "Part 2: Multiple Variable Difference",
      examples: [
        {
          title: "Example A",
          story: "Emma goes to the fruit market. She buys 5 apples and 3 bananas for £26. On another trip, she buys 5 apples and 6 bananas for £32. What's the cost of each fruit?",
          equations: ["🍎🍎🍎🍎🍎 + 🍌🍌🍌 = 26", "🍎🍎🍎🍎🍎 + 🍌🍌🍌🍌🍌🍌 = 32"],
          symbols: ['🍎', '🍌'],
          coeffs: [[5, 3], [5, 6]],
          sums: [26, 32],
          solutions: { '🍎': 4, '🍌': 2 },
          steps: [
            { equations: ["🍎🍎🍎🍎🍎 + 🍌🍌🍌 = 26", "🍎🍎🍎🍎🍎 + 🍌🍌🍌🍌🍌🍌 = 32"] },
            { equations: ["🍎🍎🍎🍎🍎 + 🍌🍌🍌 = 26", "🍎🍎🍎🍎🍎 + 🍌🍌🍌🍌🍌🍌 = 32"] },
            { equations: ["🍌🍌🍌 = 6"], operation: "Equation 2 - Equation 1" },
            { equations: ["🍌 = 2"] },
            { equations: ["🍎🍎🍎🍎🍎 + 6 = 26"] },
            { equations: ["🍎 = 4"] }
          ],
          teacherScript: [
            "Look at both equations. What stays constant?",
            "Apples are the same, bananas differ by 3. What operation eliminates apples?",
            "We get 3 bananas equal 6. What's the next step?",
            "One banana costs £2. How do we find the apple price?",
            "Substitute back: 5 apples plus 3 bananas (£6) equals £26.",
            "Each apple costs £4. Let's verify in both equations."
          ]
        },
        {
          title: "Example B",
          story: "At the sports shop, Ben buys 3 footballs and 2 basketballs for £13. Later, he buys 3 footballs and 5 basketballs for £19. Find the price of each ball.",
          equations: ["⚽⚽⚽ + 🏀🏀 = 13", "⚽⚽⚽ + 🏀🏀🏀🏀🏀 = 19"],
          symbols: ['⚽', '🏀'],
          coeffs: [[3, 2], [3, 5]],
          sums: [13, 19],
          solutions: { '⚽': 3, '🏀': 2 },
          steps: [
            { equations: ["⚽⚽⚽ + 🏀🏀 = 13", "⚽⚽⚽ + 🏀🏀🏀🏀🏀 = 19"] },
            { equations: ["⚽⚽⚽ + 🏀🏀 = 13", "⚽⚽⚽ + 🏀🏀🏀🏀🏀 = 19"] },
            { equations: ["🏀🏀🏀 = 6"], operation: "Equation 2 - Equation 1" },
            { equations: ["🏀 = 2"] },
            { equations: ["⚽⚽⚽ + 4 = 13"] },
            { equations: ["⚽ = 3"] }
          ],
          teacherScript: [
            "What patterns do you notice in these equations?",
            "Footballs constant, basketballs differ by 3. What should we do?",
            "After subtraction, we have 3 basketballs equal 6.",
            "Each basketball costs £2. Now find the football price.",
            "Substitute: 3 footballs plus 2 basketballs (£4) equals £13.",
            "Each football costs £3. Does this check in equation 2?"
          ]
        }
      ]
    },
    {
      title: "Part 3: Different Coefficients",
      examples: [
        {
          title: "Example A",
          story: "Tom visits the toy shop twice. First trip: 2 cars and 3 bicycles cost £13. Second trip: 3 cars and 2 bicycles cost £16. What does each toy cost?",
          equations: ["🚗🚗 + 🚲🚲🚲 = 13", "🚗🚗🚗 + 🚲🚲 = 16"],
          symbols: ['🚗', '🚲'],
          coeffs: [[2, 3], [3, 2]],
          sums: [13, 16],
          solutions: { '🚗': 5, '🚲': 1 },
          allowMultiplier: true,
          steps: [
            { equations: ["🚗🚗 + 🚲🚲🚲 = 13", "🚗🚗🚗 + 🚲🚲 = 16"] },
            { equations: ["🚗🚗 + 🚲🚲🚲 = 13", "🚗🚗🚗 + 🚲🚲 = 16"] }
          ],
          teacherScript: [
            "This is different! Neither variable has the same coefficient. What's our problem?",
            "We need to make the coefficients match. What numbers multiply to give the same result for cars?"
          ]
        },
        {
          title: "Example B",
          story: "Lisa shops for school supplies. First visit: 4 pens and 3 pencils cost £11. Second visit: 3 pens and 2 pencils cost £8. Find the price of each item.",
          equations: ["🖊️🖊️🖊️🖊️ + ✏️✏️✏️ = 11", "🖊️🖊️🖊️ + ✏️✏️ = 8"],
          symbols: ['🖊️', '✏️'],
          coeffs: [[4, 3], [3, 2]],
          sums: [11, 8],
          solutions: { '🖊️': 2, '✏️': 1 },
          allowMultiplier: true,
          steps: [
            { equations: ["🖊️🖊️🖊️🖊️ + ✏️✏️✏️ = 11", "🖊️🖊️🖊️ + ✏️✏️ = 8"] },
            { equations: ["🖊️🖊️🖊️🖊️ + ✏️✏️✏️ = 11", "🖊️🖊️🖊️ + ✏️✏️ = 8"] }
          ],
          teacherScript: [
            "Both coefficients are different. What's the challenge here?",
            "To eliminate one variable, what must we do to the equations first?"
          ]
        }
      ]
    }
  ];

  const currentPartData = parts[currentPart];
  const currentExampleData = currentPartData.examples[currentExample];
  
  // Combine original steps with any extra steps from multiplication
  const allSteps = [...currentExampleData.steps, ...extraSteps];
  const currentStepData = allSteps[currentStep];

  // Emoji rendering component with left alignment - no highlighting
  const EmojiEquation = ({ equations, operation = null }) => {
    const renderEquation = (equation) => {
      const parts = equation.split(/([=+\-×÷\(\)])/).filter(part => part.trim());
      
      return (
        <div className="flex items-center justify-start flex-wrap">
          {parts.map((part, index) => {
            const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
            const emojis = part.match(emojiRegex);
            
            if (emojis) {
              return emojis.map((emoji, emojiIndex) => (
                <span 
                  key={`${index}-${emojiIndex}`}
                  className="inline-block text-5xl"
                  style={{ marginRight: '4px' }}
                >
                  {emoji}
                </span>
              ));
            } else {
              return (
                <span 
                  key={index}
                  className="text-3xl font-bold mx-2 text-gray-700"
                >
                  {part.trim()}
                </span>
              );
            }
          }).flat()}
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {operation && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 mb-4">
            <span className="text-blue-800 font-semibold">{operation}</span>
          </div>
        )}
        
        {equations.map((equation, index) => (
          <div key={index} className="py-3 bg-white rounded-lg border-2 border-gray-200 px-4">
            {renderEquation(equation)}
          </div>
        ))}
      </div>
    );
  };

  const nextStep = () => {
    if (currentStep < allSteps.length - 1) {
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
    setExtraSteps([]);
    setMultiplierA(1);
    setMultiplierB(1);
  };

  const applyMultipliers = () => {
    const multA = multiplierA;
    const multB = multiplierB;
    
    const [coeff1A, coeff1B] = currentExampleData.coeffs[0];
    const [coeff2A, coeff2B] = currentExampleData.coeffs[1];
    const sum1 = currentExampleData.sums[0];
    const sum2 = currentExampleData.sums[1];
    
    const symbol1 = currentExampleData.symbols[0];
    const symbol2 = currentExampleData.symbols[1];
    
    const eq1Multiplied = `${symbol1.repeat(coeff1A * multA)} + ${symbol2.repeat(coeff1B * multA)} = ${sum1 * multA}`;
    const eq2Multiplied = `${symbol1.repeat(coeff2A * multB)} + ${symbol2.repeat(coeff2B * multB)} = ${sum2 * multB}`;
    
    const newSteps = [
      {
        equations: [eq1Multiplied],
        operation: `Equation 1 × ${multA}`
      },
      {
        equations: [eq2Multiplied],
        operation: `Equation 2 × ${multB}`
      },
      {
        equations: [eq1Multiplied, eq2Multiplied]
      }
    ];
    
    setExtraSteps(newSteps);
    setShowMultiplierModal(false);
    setCurrentStep(currentExampleData.steps.length); // Jump to first new step
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-green-500 rounded-lg shadow-md bg-white overflow-hidden">
        <div className="px-6 pt-6">
          {/* Header with A/B buttons on left and Part buttons (1,2,3) on right */}
          <div className="flex items-center justify-between mb-6">
            {/* A/B Example selector on left */}
            <div className="flex gap-2">
              {currentPartData.examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentExample(index);
                    setCurrentStep(0);
                    setExtraSteps([]);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index === currentExample
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </button>
              ))}
            </div>

            {/* Part selector (1,2,3) on right */}
            <div className="flex gap-2">
              {parts.map((part, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentPart(index);
                    setCurrentExample(0);
                    setCurrentStep(0);
                    setExtraSteps([]);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index === currentPart
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentPartData.title}</h2>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Story/Question */}
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                <p className="text-lg text-gray-800">
                  {currentExampleData.story}
                </p>
              </div>

              {/* Emoji Equations - left aligned, no highlighting */}
              <div className="bg-gray-50 rounded-lg p-8">
                <EmojiEquation 
                  equations={currentStepData.equations}
                  operation={currentStepData.operation}
                />
              </div>

              {/* Multiplier button for Part 3 */}
              {currentPartData.title.includes("Part 3") && currentStep === 1 && currentExampleData.allowMultiplier && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowMultiplierModal(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                  >
                    Multiply Equations
                  </button>
                </div>
              )}

              {/* Step controls */}
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  ← Previous
                </button>
                
                <div className="flex gap-2">
                  {allSteps.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-3 h-3 rounded-full cursor-pointer ${
                        index === currentStep ? 'bg-green-600' : index < currentStep ? 'bg-green-400' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextStep}
                  disabled={currentStep === allSteps.length - 1}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
                >
                  Next →
                </button>
              </div>

              {/* Teacher Script - only shown when showAnswers is true */}
              {showAnswers && currentExampleData.teacherScript && currentStep < currentExampleData.teacherScript.length && (
                <div className="mt-8 pt-6 border-t-2 border-green-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Script - Step {currentStep + 1}</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">
                      {currentExampleData.teacherScript[currentStep]}
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Teacher Notes */}
              {showAnswers && (
                <div className="mt-8 pt-6 border-t-2 border-green-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Notes</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-medium text-amber-800 mb-2">Teaching Progression</h4>
                      <ul className="list-disc list-inside space-y-2 text-amber-700">
                        <li><strong>Part 1:</strong> Build confidence with obvious eliminations</li>
                        <li><strong>Part 2:</strong> Develop pattern recognition for larger differences</li>
                        <li><strong>Part 3:</strong> Introduce multiplying equations to match coefficients</li>
                        <li>Use emoji highlighting to show which variables "cancel out"</li>
                        <li>Emphasize visual patterns before introducing algebra</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Discussion Questions</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Why can we subtract one equation from another?</li>
                        <li>What happens when we multiply an equation by a number?</li>
                        <li>How do you decide which variable to eliminate first?</li>
                        <li>Can you predict the next step before clicking?</li>
                        <li>How would this look with letters instead of emojis?</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Bridge to Algebra</h4>
                    <p className="text-gray-700 mb-3">
                      These emoji patterns directly translate to algebraic simultaneous equations:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>🐱🐱🐱 becomes 3x</li>
                      <li>🐶🐶🐶🐶 becomes 4y</li>
                      <li>The same elimination steps work with letters</li>
                      <li>Students will see algebra as just shorthand for emoji patterns</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multiplier Modal */}
      {showMultiplierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMultiplierModal(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Multiply Equations</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiply first equation by:
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={multiplierA}
                  onChange={(e) => setMultiplierA(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiply second equation by:
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={multiplierB}
                  onChange={(e) => setMultiplierB(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowMultiplierModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={applyMultipliers}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnSection;