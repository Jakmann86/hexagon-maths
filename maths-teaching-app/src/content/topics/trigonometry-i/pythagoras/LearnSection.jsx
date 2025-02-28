import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import {
    Mafs,
    Line,
    Transform,
    Theme,
    Polygon,
    Text,
    Coordinates
} from "mafs";
import "mafs/core.css";
import "mafs/font.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MafsRightTriangle, MafsSquare } from '../../../../components/shapes';

// Temporary: Data directly in component for testing
const visualizationData = {
    title: "Pythagoras' Theorem",
    description: "Understanding the relationship between squares on the sides of a right triangle",
    visualizations: [
        {
            id: 1,
            title: "Exploring Square Areas",
            triangle: { base: 3, height: 4 },
            showAllSquares: true,
            showAllLabels: true,
            teacherNotes: [
                "What shapes can you see in this diagram?",
                "Look at each colored square - what do you notice about where they're placed?",
                "Can you count the small grid squares inside each colored square?",
            ],
            keyPoints: [
                "Each square is built on one side of the triangle",
                "The squares show the areas visually",
                "Count the squares: 9 + 16 = 25"
            ]
        }
    ]
};

const Learn = ({ currentTopic, currentLessonId, showAnswer = false }) => {
    const [currentVisualization, setCurrentVisualization] = useState(0);
    const vis = visualizationData.visualizations[currentVisualization];

    const renderVisualization = () => {
        const { base: baseScale, height: heightScale } = vis.triangle;

        return (
            <div className="bg-emerald-50 rounded-lg p-8 shadow-inner min-h-[400px] flex items-center justify-center">
                <Mafs
                    viewBox={{ x: [-2, 8], y: [-4, 6] }}
                >
                    {/* Base triangle */}
                    <Line.Segment point1={[0, 0]} point2={[baseScale, 0]} color={Theme.blue} strokeWidth={3} />
                    <Line.Segment point1={[baseScale, 0]} point2={[baseScale, heightScale]} color={Theme.blue} strokeWidth={3} />
                    <Line.Segment point1={[baseScale, heightScale]} point2={[0, 0]} color={Theme.blue} strokeWidth={3} />

                    {/* Right angle marker */}
                    <Transform translate={[baseScale - 0.3, 0]}>
                        <Line.Segment point1={[0, 0]} point2={[0, 0.3]} color={Theme.black} strokeWidth={2} />
                        <Line.Segment point1={[0, 0.3]} point2={[0.3, 0.3]} color={Theme.black} strokeWidth={2} />
                    </Transform>

                    {/* Squares with areas */}
                    {(vis.showAllSquares || vis.showOtherSides) && (
                        <>
                            {/* First smaller square */}
                            <Polygon
                                points={[[0, 0], [baseScale, 0], [baseScale, -baseScale], [0, -baseScale]]}
                                strokeWidth={2}
                                stroke={Theme.black}
                                fill="#A7F3D0"  // Light mint green
                            />
                            <Text x={baseScale / 2} y={-baseScale / 2} size={24}>
                                {`${baseScale * baseScale} cm²`}
                            </Text>

                            {/* Second smaller square */}
                            <Polygon
                                points={[[baseScale, 0], [baseScale, heightScale], [baseScale + heightScale, heightScale], [baseScale + heightScale, 0]]}
                                strokeWidth={2}
                                stroke={Theme.black}
                                fill="#A7F3D0"  // Light mint green
                            />
                            <Text x={baseScale + heightScale / 2} y={heightScale / 2} size={24}>
                                {`${heightScale * heightScale} cm²`}
                            </Text>
                        </>
                    )}

                    {/* Larger square (hypotenuse) */}
                    {(vis.showAllSquares || vis.showHypotenuse) && (
                        <>
                            <Polygon
                                points={[
                                    [0, 0],
                                    [baseScale, heightScale],
                                    [baseScale - heightScale, heightScale + baseScale],
                                    [-heightScale, baseScale]
                                ]}
                                strokeWidth={2}
                                stroke={Theme.black}
                                fill="#FDE68A"  // Light yellow
                            />
                            <Text x={0} y={heightScale} size={24}>
                                {`${baseScale * baseScale + heightScale * heightScale} cm²`}
                            </Text>
                        </>
                    )}

                    {/* Side labels with units */}
                    {(vis.showAllLabels || vis.showOtherSides) && (
                        <>
                            <Text x={baseScale / 2} y={-0.3} size={20}>{`${baseScale} cm`}</Text>
                            <Text x={baseScale + 0.3} y={heightScale / 2} size={20}>{`${heightScale} cm`}</Text>
                        </>
                    )}
                    {(vis.showAllLabels || vis.showHypotenuse) && (
                        <Text
                            x={baseScale / 2 - 0.3}
                            y={heightScale / 2}
                            size={20}
                        >
                            {`${Math.sqrt(baseScale * baseScale + heightScale * heightScale).toFixed(2)} cm`}
                        </Text>
                    )}
                </Mafs>
            </div>
        );
    };

    return (
        <div className="space-y-6 mb-12">
            <Card className="overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => setCurrentVisualization((curr) =>
                                (curr - 1 + visualizationData.visualizations.length) % visualizationData.visualizations.length
                            )}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{vis.title}</h2>
                            <p className="text-gray-600">{visualizationData.description}</p>
                        </div>
                        <button
                            onClick={() => setCurrentVisualization((curr) =>
                                (curr + 1) % visualizationData.visualizations.length
                            )}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                    {renderVisualization()}
                </CardContent>
            </Card>

            {showAnswer && (
                <Card>
                    <CardContent className="p-8">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Teaching Guidance</h3>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-700">Discussion Questions:</h4>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                    {vis.teacherNotes.map((note, index) => (
                                        <li key={index}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-700">Key Points:</h4>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                    {vis.keyPoints.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Learn;