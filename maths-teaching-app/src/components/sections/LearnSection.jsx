// src/components/sections/LearnSection.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../common/Card';

/**
 * LearnSection template for presenting mathematical concepts 
 * with visualizations and explanations
 * 
 * @param {Object} visualizationData - The visualization data for this learning section
 * @param {string} currentTopic - Current topic identifier
 * @param {number} currentLessonId - Current lesson identifier
 * @param {boolean} showTeacherNotes - Whether to show teacher notes (controlled by parent)
 */
const LearnSection = ({
    visualizationData = { title: '', description: '', visualizations: [] },
    currentTopic,
    currentLessonId,
    showTeacherNotes = false
}) => {
    const [currentVisIndex, setCurrentVisIndex] = useState(0);

    // Safety check
    if (!visualizationData || !visualizationData.visualizations || visualizationData.visualizations.length === 0) {
        return (
            <div className="text-center p-6">
                <p>No visualization data available for this topic.</p>
            </div>
        );
    }

    const { title, description, visualizations } = visualizationData;
    const currentVis = visualizations[currentVisIndex];

    // Function to render the current visualization
    const renderVisualization = () => {
        if (!currentVis || !currentVis.renderComponent) {
            return (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">Visualization not available</p>
                </div>
            );
        }

        // If renderComponent is a component, render it with its props
        const VisualizationComponent = currentVis.renderComponent;
        return (
            <div className="bg-emerald-50 rounded-lg p-8 shadow-inner min-h-[400px] flex items-center justify-center">
                <VisualizationComponent {...currentVis.props} />
            </div>
        );
    };

    return (
        <div className="space-y-6 mb-12">
            <Card className="overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => setCurrentVisIndex((curr) =>
                                (curr - 1 + visualizations.length) % visualizations.length
                            )}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            disabled={visualizations.length <= 1}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentVis.title || title}</h2>
                            <p className="text-gray-600">{currentVis.description || description}</p>
                        </div>
                        <button
                            onClick={() => setCurrentVisIndex((curr) =>
                                (curr + 1) % visualizations.length
                            )}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            disabled={visualizations.length <= 1}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {renderVisualization()}
                </CardContent>
            </Card>

            {/* Teacher Notes Section */}
            {showTeacherNotes && currentVis.teacherNotes && (
                <Card>
                    <CardContent className="p-8">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Teaching Guidance</h3>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-700">Discussion Questions:</h4>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                    {currentVis.teacherNotes.map((note, index) => (
                                        <li key={index}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                            {currentVis.keyPoints && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-700">Key Points:</h4>
                                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                        {currentVis.keyPoints.map((point, index) => (
                                            <li key={index}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default LearnSection;