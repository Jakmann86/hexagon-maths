// src/content/topics/algebra-i/expanding-brackets/DiagnosticSection.jsx - Updated
import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import { expressionsGenerators } from '../../../../generators/algebra/expressionsGenerator';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    const questionTypes = {
        simplifying: {
            title: 'Simplifying Expressions',
            generator: () => expressionsGenerators.generateSimplifyingExpression({
                sectionType: 'diagnostic'
            })
        },
        distributiveLaw: {
            title: 'Distributive Law',
            generator: () => expressionsGenerators.generateDistributiveLaw({
                sectionType: 'diagnostic'
            })
        },
        expanding: {
            title: 'Expanding Brackets',
            generator: () => expressionsGenerators.generateExpandingSingleBrackets({
                sectionType: 'diagnostic'
            })
        }
    };

    return (
        <div className="space-y-6 mb-8">
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