// src/content/topics/algebra-i/indices/DiagnosticSection.jsx
import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import { indicesGenerators } from '../../../../generators/algebra/indicesGenerator';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

/**
 * DiagnosticSection for Negative and Fractional Indices
 * Tests prerequisite knowledge needed before learning about negative and fractional indices
 * 
 * Question Types:
 * 1. Basic Laws of Indices (x^a × x^b, x^a ÷ x^b, (x^a)^b)
 * 2. Evaluating Powers (including (4x^2)^3 and zero power)
 * 3. Understanding Roots (√, ∛, ⁴√, ⁵√)
 */
const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    const questionTypes = {
        basicIndexLaws: {
            title: 'Basic Laws of Indices',
            generator: () => indicesGenerators.generateBasicIndexLaws({
                sectionType: 'diagnostic',
                difficulty: 'medium'
            })
        },
        evaluatingPowers: {
            title: 'Evaluating Powers',
            generator: () => indicesGenerators.generateEvaluatingPowers({
                sectionType: 'diagnostic',
                difficulty: 'medium'
            })
        },
        understandingRoots: {
            title: 'Understanding Roots',
            generator: () => indicesGenerators.generateUnderstandingRoots({
                sectionType: 'diagnostic',
                difficulty: 'medium'
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