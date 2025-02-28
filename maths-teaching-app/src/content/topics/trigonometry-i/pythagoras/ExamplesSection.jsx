// src/content/topics/trigonometry-i/pythagoras/examples.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../../../components/common/Card';
import { MafsRightTriangle } from '../../../../components/shapes';
import { generateExample } from './generators';

const PythagorasExamples = () => {
    const [difficulty, setDifficulty] = useState('easy');
    const [currentExample, setCurrentExample] = useState(() => generateExample(difficulty));
    const [currentStep, setCurrentStep] = useState(0);

    const generateNewExample = () => {
        setCurrentExample(generateExample(difficulty));
        setCurrentStep(0);
    };

    return (
        <div className="space-y-6">
            {/* Difficulty Selection */}
            <div className="flex justify-center space-x-4">
                {['easy', 'medium', 'hard'].map((level) => (
                    <button
                        key={level}
                        onClick={() => {
                            setDifficulty(level);
                            generateNewExample();
                        }}
                        className={`px-4 py-2 rounded-lg capitalize ${difficulty === level
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {/* Example Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6 max-w-2xl mx-auto">
                        {/* Question */}
                        <div className="text-lg font-medium text-center">
                            {currentExample.questionText}
                        </div>

                        {/* Triangle Diagram */}
                        <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
                            <MafsRightTriangle {...currentExample.shapeConfig} />
                        </div>

                        {/* Solution Steps */}
                        <div className="space-y-4">
                            {currentExample.workingOut.slice(0, currentStep + 1).map((step) => (
                                <div
                                    key={step.step}
                                    className="p-4 bg-blue-50 rounded-lg"
                                >
                                    <p className="font-medium">{step.explanation}</p>
                                    <div className="mt-2 text-lg text-center">
                                        {step.math}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Controls */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                                disabled={currentStep === 0}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <span className="font-medium">
                                Step {currentStep + 1} of {currentExample.workingOut.length}
                            </span>

                            <button
                                onClick={() => {
                                    if (currentStep < currentExample.workingOut.length - 1) {
                                        setCurrentStep((prev) => prev + 1);
                                    } else {
                                        generateNewExample();
                                    }
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PythagorasExamples;