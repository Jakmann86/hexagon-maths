// src/content/topics/trigonometry-i/pythagoras/DiagnosticSection.jsx
import React, { useState, useEffect } from 'react';
import {
    Mafs,
    Line,
    Text,
    Transform,
    Theme,
    Coordinates
} from "mafs";
import "mafs/core.css";
import { Card, CardContent } from '../common/Card';
import { RefreshCw, Check } from 'lucide-react';
import { useUI } from '../../context/UIContext';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // State management
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const { setCurrentSection } = useUI();

    // Set current section on mount
    useEffect(() => {
        setCurrentSection('diagnostic');
    }, [setCurrentSection]);

    // Pythagorean triples to use for questions
    const pythagoreanTriples = [
        { a: 3, b: 4, c: 5 },
        { a: 5, b: 12, c: 13 },
        { a: 6, b: 8, c: 10 },
        { a: 8, b: 15, c: 17 }
    ];

    // Question types
    const questionTypes = [
        {
            type: 'findHypotenuse',
            generate: (triple) => ({
                prompt: `Find the length of the hypotenuse in this right-angled triangle.`,
                correctAnswer: triple.c,
                options: [
                    triple.c,
                    triple.a + triple.b,
                    Math.floor(triple.c * 1.2),
                    Math.ceil(Math.sqrt(triple.a * triple.a + triple.b * triple.b * 1.1))
                ],
                solution: `Using Pythagoras' theorem:\na² + b² = c²\n${triple.a}² + ${triple.b}² = c²\n${triple.a * triple.a} + ${triple.b * triple.b} = ${triple.c * triple.c}\nc = ${triple.c}`
            })
        },
        {
            type: 'findMissingSide',
            generate: (triple) => ({
                prompt: `Find the missing side length marked with '?'.`,
                correctAnswer: triple.b,
                options: [
                    triple.b,
                    Math.floor(triple.c / 2),
                    triple.a + 2,
                    Math.ceil(Math.sqrt(triple.c * triple.c - triple.a * triple.a * 0.9))
                ],
                solution: `Using Pythagoras' theorem:\n${triple.a}² + b² = ${triple.c}²\nb² = ${triple.c * triple.c} - ${triple.a * triple.a}\nb² = ${triple.c * triple.c - triple.a * triple.a}\nb = ${triple.b}`
            })
        }
    ];

    // Generate a new question
    const generateQuestion = () => {
        const triple = pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        const orientation = Math.random() > 0.5 ? 'right' : 'left';
        
        const question = questionType.generate(triple);
        
        setCurrentQuestion({
            ...question,
            triple,
            orientation,
            options: question.options.sort(() => Math.random() - 0.5)
        });
        setShowAnswer(false);
        setSelectedAnswer(null);
    };

    // Initialize first question
    useEffect(() => {
        generateQuestion();
    }, []);

    // Handle answer selection
    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        setShowAnswer(true);
    };

    // Render triangle using Mafs
    const RightTriangle = ({ triple, orientation }) => {
        const { a, b } = triple;
        const points = orientation === 'right' 
            ? [[0, 0], [a, 0], [0, b]]
            : [[0, 0], [a, 0], [a, b]];

        return (
            <Mafs
                viewBox={{ x: [-1, a + 1], y: [-1, b + 1] }}
                preserveAspectRatio="xMidYMid meet"
            >
                <Coordinates.Grid />
                
                {/* Draw the triangle */}
                <Line.Segment point1={points[0]} point2={points[1]} color={Theme.blue} strokeWidth={2} />
                <Line.Segment point1={points[1]} point2={points[2]} color={Theme.blue} strokeWidth={2} />
                <Line.Segment point1={points[2]} point2={points[0]} color={Theme.blue} strokeWidth={2} />

                {/* Right angle marker */}
                <Transform translate={orientation === 'right' ? [0, 0] : [a, 0]}>
                    <Line.Segment 
                        point1={[0, 0]} 
                        point2={[0, 0.5]} 
                        color={Theme.black} 
                        strokeWidth={1} 
                    />
                    <Line.Segment 
                        point1={[0, 0.5]} 
                        point2={[0.5, 0.5]} 
                        color={Theme.black} 
                        strokeWidth={1} 
                    />
                </Transform>

                {/* Labels */}
                <Text x={a/2} y={-0.3}>{a}</Text>
                <Text x={orientation === 'right' ? -0.3 : (a + 0.3)} y={b/2}>
                    {currentQuestion?.type === 'findMissingSide' ? '?' : b}
                </Text>
                <Text 
                    x={orientation === 'right' ? (a/3) : (2*a/3)} 
                    y={b/3}
                >
                    {currentQuestion?.type === 'findHypotenuse' ? '?' : triple.c}
                </Text>
            </Mafs>
        );
    };

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Question Text */}
                        <div className="text-lg font-medium text-center">
                            {currentQuestion.prompt}
                        </div>

                        {/* Triangle Diagram */}
                        <div className="bg-gray-50 p-4 rounded-lg flex justify-center h-64">
                            <RightTriangle 
                                triple={currentQuestion.triple}
                                orientation={currentQuestion.orientation}
                            />
                        </div>

                        {/* Multiple Choice Options */}
                        <div className="grid grid-cols-2 gap-4">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={showAnswer}
                                    className={`p-4 rounded-lg border-2 transition-colors ${
                                        showAnswer
                                            ? option === currentQuestion.correctAnswer
                                                ? 'bg-green-100 border-green-500'
                                                : option === selectedAnswer
                                                    ? 'bg-red-100 border-red-500'
                                                    : 'bg-gray-50 border-gray-200'
                                            : 'hover:bg-gray-50 border-gray-200'
                                    }`}
                                >
                                    {option}
                                    {showAnswer && option === currentQuestion.correctAnswer && (
                                        <Check className="inline-block ml-2 w-5 h-5 text-green-500" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Solution Steps */}
                        {showAnswer && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-medium mb-2">Solution:</h3>
                                {currentQuestion.solution.split('\n').map((step, index) => (
                                    <p key={index} className="text-gray-700">{step}</p>
                                ))}
                            </div>
                        )}

                        {/* Generate New Question Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={generateQuestion}
                                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>New Question</span>
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DiagnosticSection;