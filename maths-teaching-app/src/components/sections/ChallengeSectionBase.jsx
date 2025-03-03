// src/components/sections/ChallengeSection.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../common/Card';

/**
 * ChallengeSection template for providing more complex problems for extension
 * 
 * @param {Function} challengeGenerator - Function to generate challenge problems with different difficulties
 * @param {string} currentTopic - Current topic identifier
 * @param {number} currentLessonId - Current lesson identifier
 */
const ChallengeSection = ({
    challengeGenerator,
    currentTopic,
    currentLessonId
}) => {
    const [difficulty, setDifficulty] = useState('medium');
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [showingHints, setShowingHints] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [showingSolution, setShowingSolution] = useState(false);
    const [currentSolutionStep, setCurrentSolutionStep] = useState(0);

    const generateNewChallenge = () => {
        if (!challengeGenerator) return;

        setCurrentChallenge(challengeGenerator(difficulty));
        setShowingHints(false);
        setCurrentHintIndex(0);
        setShowingSolution(false);
        setCurrentSolutionStep(0);
    };

    // Initialize challenge when generator changes
    useEffect(() => {
        if (challengeGenerator) {
            generateNewChallenge();
        }
    }, [challengeGenerator]);

    if (!currentChallenge) {
        return (
            <div className="text-center p-6">
                <p>No challenges available for this topic.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Difficulty Selection */}
            <div className="flex justify-center space-x-4">
                {['easy', 'medium', 'hard', 'exam'].map((level) => (
                    <button
                        key={level}
                        onClick={() => {
                            setDifficulty(level);
                            setCurrentChallenge(challengeGenerator(level));
                            setShowingHints(false);
                            setCurrentHintIndex(0);
                            setShowingSolution(false);
                            setCurrentSolutionStep(0);
                        }}
                        className={`px-4 py-2 rounded-lg capitalize ${difficulty === level
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {/* Challenge Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6 max-w-2xl mx-auto">
                        {/* Problem Statement */}
                        <div className="text-lg font-medium">
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="text-xl font-bold text-purple-800 mb-2">Problem:</h3>
                                <p>{currentChallenge.problemText}</p>
                            </div>
                        </div>

                        {/* Shape Visualization */}
                        {currentChallenge.shapeConfig && (
                            <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
                                {currentChallenge.ShapeComponent && (
                                    <currentChallenge.ShapeComponent {...currentChallenge.shapeConfig} />
                                )}
                            </div>
                        )}

                        {/* Hints Section */}
                        {showingHints && currentChallenge.hints && currentChallenge.hints.length > 0 && (
                            <div className="border border-amber-200 bg-amber-50 p-4 rounded-lg">
                                <h4 className="flex items-center text-amber-800 font-medium mb-2">
                                    <Lightbulb className="w-5 h-5 mr-2" />
                                    Hint {currentHintIndex + 1} of {currentChallenge.hints.length}
                                </h4>
                                <p>{currentChallenge.hints[currentHintIndex]}</p>

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
                                        className="p-4 bg-green-50 rounded-lg"
                                    >
                                        <p className="font-medium">{step.explanation}</p>
                                        {step.math && (
                                            <div className="mt-2 text-lg text-center">
                                                {step.math}
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

export default ChallengeSection;