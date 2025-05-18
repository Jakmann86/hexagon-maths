// maths-teaching-app/src/content/topics/trigonometry-i/pythagoras/DiagnosticSection.jsx
import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

/**
 * DiagnosticSection component for Pythagoras lesson
 * Uses the new architecture with factory-based shape creation
 * and centralized question generation
 */
const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    // Get question types from centralized generators
    const questionTypes = pythagoras.generateDiagnosticQuestions();

    return (
        <div className="space-y-6 mb-8">
            {/* Use DiagnosticSectionBase with themed wrapper */}
            <div className="border-2 border-t-4 border-purple-500 rounded-lg shadow-md bg-white overflow-hidden">
                <DiagnosticSectionBase
                    questionTypes={questionTypes}
                    currentTopic={currentTopic}
                    currentLessonId={currentLessonId}
                    themeKey="diagnostic"
                />
            </div>
        </div>
    );
};

export default DiagnosticSection;