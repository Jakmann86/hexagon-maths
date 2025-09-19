// src/content/topics/algebra-i/simultaneous-equations/DiagnosticSection.jsx - Complete Implementation
import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import { expressionsGenerators } from '../../../../generators/algebra/expressionsGenerator';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import { generateLCMQuestion } from '../../../../generators/number/lcmGenerator';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    const questionTypes = {
        collectingTerms: {
            title: 'Collecting Like Terms with Signs',
            generator: () => expressionsGenerators.generateCollectingLikeTermsWithSigns({
                sectionType: 'diagnostic'
            })
        },
        lcmSkills: {
            title: 'Lowest Common Multiple',
            generator: () => generateLCMQuestion({
                sectionType: 'diagnostic'
            })
        },
        substitutionBack: {
            title: 'Substitution Skills',
            generator: () => equationGenerators.generateSubstitutionWithSecondTerm({
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