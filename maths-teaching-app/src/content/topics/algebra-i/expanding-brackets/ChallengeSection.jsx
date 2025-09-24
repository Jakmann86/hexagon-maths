// src/content/topics/algebra-i/expanding-brackets/ChallengeSection.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';
import { RefreshCw } from 'lucide-react';
import { expressionsGenerators } from '../../../../generators/algebra/expressionsGenerator';

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for challenge section
  const theme = useSectionTheme('challenge');
  const { showAnswers } = useUI();
  
  // Challenge state
  const [challenge, setChallenge] = useState(null);

  // Generate a new challenge using the triple brackets generator
  const generateChallenge = () => {
    const generatedChallenge = expressionsGenerators.generateExpandingTripleBrackets({
      difficulty: 'medium',
      sectionType: 'examples'
    });
    
    setChallenge(generatedChallenge);
  };

  // Generate challenge on initial render
  useEffect(() => {
    generateChallenge();
  }, []);

  return (
    <div className="space-y-6 mb-8">
      <div className="border-2 border-t-4 border-red-500 rounded-lg shadow-md bg-white overflow-hidden">
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Triple Bracket Expansion Challenge
            </h3>
            
            <button
              onClick={generateChallenge}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
            >
              <RefreshCw size={18} />
              <span>New Challenge</span>
            </button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {challenge && (
              <div className="space-y-6">
                {/* Problem Statement */}
                <div className="bg-red-50 p-5 rounded-lg mb-6">
                  <div className="text-lg text-gray-800">
                    <MathDisplay math={challenge.questionText} />
                  </div>
                </div>

                {/* Space for working */}
                <div className="bg-gray-50 p-6 rounded-lg min-h-40 h-48 border border-dashed border-gray-300">
                  {/* Empty space for teacher's working */}
                </div>

                {/* Solution Steps - only visible when showAnswers is true */}
                {showAnswers && challenge.solution && (
                  <div className="p-5 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-4">Solution:</h4>
                    <div className="space-y-3">
                      {challenge.solution.map((step, index) => (
                        <div key={index} className="mb-3">
                          <p className="text-gray-700">{step.explanation}</p>
                          {step.formula && (
                            <div className="mt-2 text-center bg-white p-2 rounded-md">
                              <MathDisplay math={step.formula} displayMode={true} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeSection;