// src/components/lesson-content/statistics-i/averages/DiagnosticSection.jsx
import React from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import averageGenerators from '../../../../generators/statistics/averageGenerators';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    const questionTypes = {
        meanCalculation: {
            title: 'Calculating the Mean',
            generator: () => averageGenerators.generateMeanMedianModeRange({
                sectionType: 'diagnostic',
                statistic: 'mean'
            })
        },
        medianCalculation: {
            title: 'Finding the Median',
            generator: () => averageGenerators.generateMeanMedianModeRange({
                sectionType: 'diagnostic',
                statistic: 'median'
            })
        },
        modeCalculation: {
            title: 'Finding the Mode',
            generator: () => averageGenerators.generateMeanMedianModeRange({
                sectionType: 'diagnostic',
                statistic: 'mode'
            })
        },
        rangeCalculation: {
            title: 'Finding the Range',
            generator: () => averageGenerators.generateMeanMedianModeRange({
                sectionType: 'diagnostic',
                statistic: 'range'
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