import React, { useState, useEffect } from 'react';
import {
    Mafs,
    Line,
    Text,
    Transform,
    Theme,
    Polygon,
} from "mafs";
import "mafs/core.css";
import { Card, CardContent } from '../../../../components/common/Card';
import { RefreshCw, Check } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';

// Enhanced color palette for better visual appeal
const COLORS = {
    primary: Theme.blue,     // Using Mafs default blue
};

const getTriangleConfig = (a, b, orientation) => {
    switch(orientation) {
        case 'bottom-left':
            return {
                origin: [0, 0],
                base: [a, 0],
                height: [0, b],
                rightAngle: {
                    translate: [0, 0],
                    paths: [
                        [[0.5, 0], [0.5, 0.5]],
                        [[0, 0.5], [0.5, 0.5]]
                    ]
                },
                labels: {
                    base: { x: a/2, y: -0.8 },
                    height: { x: -0.8, y: b/2 },
                    hypotenuse: { x: a/2 + 1, y: b/2 - 0.5 }
                }
            };
        case 'bottom-right':
            return {
                origin: [a, 0],
                base: [0, 0],
                height: [a, b],
                rightAngle: {
                    translate: [a, 0],
                    paths: [
                        [[-0.5, 0], [-0.5, 0.5]],
                        [[0, 0.5], [-0.5, 0.5]]
                    ]
                },
                labels: {
                    base: { x: a/2, y: -0.8 },
                    height: { x: a + 0.8, y: b/2 },
                    hypotenuse: { x: a/2 - 1, y: b/2 - 0.5 }
                }
            };
        case 'top-left':
            return {
                origin: [0, b],
                base: [a, b],
                height: [0, 0],
                rightAngle: {
                    translate: [0, b],
                    paths: [
                        [[0.5, 0], [0.5, -0.5]],
                        [[0, -0.5], [0.5, -0.5]]
                    ]
                },
                labels: {
                    base: { x: a/2, y: b + 0.8 },
                    height: { x: -0.8, y: b/2 },
                    hypotenuse: { x: a/2 + 1, y: b/2 + 0.5 }
                }
            };
        case 'top-right':
            return {
                origin: [a, b],
                base: [0, b],
                height: [a, 0],
                rightAngle: {
                    translate: [a, b],
                    paths: [
                        [[-0.5, 0], [-0.5, -0.5]],
                        [[0, -0.5], [-0.5, -0.5]]
                    ]
                },
                labels: {
                    base: { x: a/2, y: b + 0.8 },
                    height: { x: a + 0.8, y: b/2 },
                    hypotenuse: { x: a/2 - 1, y: b/2 + 0.5 }
                }
            };
        default:
            return null;
    }
};

const RightTriangle = ({ 
    a, 
    b, 
    c, 
    orientation = 'bottom-left', 
    labels = { base: 'x', height: 'y', hypotenuse: 'z' }, 
    padding = 2 
}) => {
    const maxDim = Math.max(a, b);
    const viewBoxSize = maxDim + (2 * padding);
    const offset = padding;

    const config = getTriangleConfig(a, b, orientation);
    if (!config) return null;

    return (
        <Mafs
            viewBox={{ x: [-offset, viewBoxSize-offset], y: [-offset, viewBoxSize-offset] }}
            width={300}
            height={300}
        >
            {/* Triangle sides */}
            <Line.Segment 
                point1={config.origin} 
                point2={config.base} 
                color={Theme.blue} 
                strokeWidth={2} 
            />
            <Line.Segment 
                point1={config.origin} 
                point2={config.height} 
                color={Theme.blue} 
                strokeWidth={2} 
            />
            <Line.Segment 
                point1={config.height} 
                point2={config.base} 
                color={Theme.blue} 
                strokeWidth={2} 
            />
            
            {/* Right angle marker */}
            <Transform translate={config.rightAngle.translate}>
                {config.rightAngle.paths.map((path, index) => (
                    <Line.Segment 
                        key={index}
                        point1={path[0]} 
                        point2={path[1]} 
                        color={Theme.blue} 
                        strokeWidth={1.5} 
                    />
                ))}
            </Transform>

            {/* Labels */}
            <Text x={config.labels.base.x} y={config.labels.base.y} size={20}>
                {labels.base}
            </Text>
            <Text x={config.labels.height.x} y={config.labels.height.y} size={20}>
                {labels.height}
            </Text>
            <Text x={config.labels.hypotenuse.x} y={config.labels.hypotenuse.y} size={20}>
                {labels.hypotenuse}
            </Text>
        </Mafs>
    );
};

const Square = ({ 
    side, 
    showArea = false, 
    area = null, 
    padding = 2 
}) => {
    const viewBoxSize = side + (2 * padding);
    const offset = padding;
    
    return (
        <Mafs
            viewBox={{ x: [-offset, viewBoxSize-offset], y: [-offset, viewBoxSize-offset] }}
            width={300}
            height={300}
        >
            <Polygon
                points={[
                    [0, 0],
                    [side, 0],
                    [side, side],
                    [0, side]
                ]}
                strokeWidth={2}
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.1}
            />
            {showArea ? (
                <Text x={side/2} y={side/2} size={20}>{`Area = ${area}`}</Text>
            ) : (
                <Text x={side/2} y={-0.5} size={20}>{side}</Text>
            )}
        </Mafs>
    );
};

const generateSquareQuestion = () => {
    const questionTypes = [
        // Area from side length
        () => {
            const side = Math.floor(Math.random() * 6) + 3;
            const correctAnswer = side * side;
            const options = new Set([correctAnswer]);
            
            while (options.size < 4) {
                const option = Math.floor(Math.random() * (side * side * 2));
                if (option !== correctAnswer) {
                    options.add(option);
                }
            }

            return {
                type: 'square',
                variant: 'area',
                prompt: 'What is the area of this square?',
                correctAnswer: correctAnswer,
                options: Array.from(options),
                shapeData: { side, showArea: false }
            };
        },
        // Side length from area
        () => {
            const side = Math.floor(Math.random() * 4) + 3;
            const area = side * side;
            const options = new Set([side]);
            
            while (options.size < 4) {
                const option = Math.floor(Math.random() * (side + 5));
                if (option !== side) {
                    options.add(option);
                }
            }

            return {
                type: 'square',
                variant: 'side',
                prompt: `If a square has an area of ${area} square units, what is its side length?`,
                correctAnswer: side,
                options: Array.from(options),
                shapeData: { side, showArea: true, area }
            };
        }
    ];

    const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    return selectedType();
};

const generateTriangleQuestion = () => {
    const triples = [
        { a: 3, b: 4, c: 5 },
        { a: 5, b: 12, c: 13 },
        { a: 6, b: 8, c: 10 },
        { a: 8, b: 15, c: 17 },
        { a: 9, b: 12, c: 15 },
        { a: 7, b: 24, c: 25 }
    ];

    const orientations = [
        'bottom-left', 
        'bottom-right', 
        'top-left', 
        'top-right'
    ];
    const triple = triples[Math.floor(Math.random() * triples.length)];
    const orientation = orientations[Math.floor(Math.random() * orientations.length)];

    // Available letters for labeling
    const letters = ['x', 'y', 'z'];
    // Shuffle letters for random assignment
    const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);
    
    // Assign letters to sides (last letter will be hypotenuse)
    const labels = {
        base: shuffledLetters[0],
        height: shuffledLetters[1],
        hypotenuse: shuffledLetters[2]
    };

    return {
        type: 'triangle',
        prompt: 'Which letter represents the hypotenuse? (The side opposite to the right angle)',
        correctAnswer: labels.hypotenuse,
        options: Array.from(new Set([labels.base, labels.height, labels.hypotenuse])), // Ensure no duplicates
        shapeData: { 
            a: triple.a, 
            b: triple.b, 
            c: triple.c,
            orientation,
            labels
        }
    };
};

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [questionType, setQuestionType] = useState('square');
    const { setCurrentSection } = useUI();

    const generateQuestion = () => {
        const question = questionType === 'square' 
            ? generateSquareQuestion()
            : generateTriangleQuestion();
        
        setCurrentQuestion({
            ...question,
            options: question.options.sort(() => Math.random() - 0.5)
        });
        setShowAnswer(false);
        setSelectedAnswer(null);
    };

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        setShowAnswer(true);
    };

    const renderShape = () => {
        if (!currentQuestion?.shapeData) return null;

        switch (currentQuestion.type) {
            case 'square':
                return <Square {...currentQuestion.shapeData} />;
            case 'triangle':
                return <RightTriangle {...currentQuestion.shapeData} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        setCurrentSection('diagnostic');
        generateQuestion();
    }, [setCurrentSection]);

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            onClick={() => {
                                setQuestionType('square');
                                const question = generateSquareQuestion();
                                setCurrentQuestion({
                                    ...question,
                                    options: question.options.sort(() => Math.random() - 0.5)
                                });
                                setShowAnswer(false);
                                setSelectedAnswer(null);
                            }}
                            className={`px-6 py-2 rounded-lg transition-colors ${
                                questionType === 'square'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Squares
                        </button>
                        <button
                            onClick={() => {
                                setQuestionType('triangle');
                                const question = generateTriangleQuestion();
                                setCurrentQuestion({
                                    ...question,
                                    options: question.options.sort(() => Math.random() - 0.5)
                                });
                                setShowAnswer(false);
                                setSelectedAnswer(null);
                            }}
                            className={`px-6 py-2 rounded-lg transition-colors ${
                                questionType === 'triangle'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Triangles
                        </button>
                    </div>

                    <div className="text-xl font-medium text-center mb-8">
                        {currentQuestion.prompt}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-8 mb-8">
                        <div className="flex justify-center items-center">
                            <div className="w-[300px] h-[300px]">
                                {renderShape()}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={showAnswer}
                                className={`p-4 rounded-lg border-2 transition-colors ${
                                    showAnswer 
                                        ? option === currentQuestion.correctAnswer
                                            ? 'bg-green-50 border-green-500 text-green-700'
                                            : option === selectedAnswer
                                                ? 'bg-red-50 border-red-500 text-red-700'
                                                : 'bg-gray-50 border-gray-200'
                                        : 'hover:bg-gray-50 border-gray-200'
                                }`}
                            >
                                <span className="text-lg">{option}</span>
                                {showAnswer && option === currentQuestion.correctAnswer && (
                                    <Check className="inline-block ml-2 w-5 h-5 text-green-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <button
                            onClick={generateQuestion}
                            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>New Question</span>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DiagnosticSection;