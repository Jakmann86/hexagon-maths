// src/content/topics/algebra-i/linear-equations/DiagnosticSection.jsx
import React, { useState } from 'react';
import DiagnosticSectionBase from '../../../../components/sections/DiagnosticSectionBase';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';

const DiagnosticSection = ({ currentTopic, currentLessonId }) => {
    // Add state to track question changes
    const [questionCounter, setQuestionCounter] = useState(0);

    // Get theme colors for diagnostic section
    const theme = useSectionTheme('diagnostic');

    const questionTypes = {
        twoStep: {
            title: 'Two-Step Equations',
            generator: () => {
                setQuestionCounter(prev => prev + 1);
                return equationGenerators.generateSimpleRearrangement({ 
                    sectionType: 'diagnostic',
                    difficulty: 'medium'
                });
            }
        },
        brackets: {
            title: 'Equations with Brackets',
            generator: () => {
                setQuestionCounter(prev => prev + 1);
                return equationGenerators.generateBracketEquation({ 
                    sectionType: 'diagnostic',
                    difficulty: 'medium'
                });
            }
        },
        threeStep: {
            title: 'Three-Step with Fractions',
            generator: () => {
                setQuestionCounter(prev => prev + 1);
                return equationGenerators.generateThreeStepEquation({ 
                    sectionType: 'diagnostic',
                    difficulty: 'medium'
                });
            }
        }
    };

    return (
        <DiagnosticSectionBase
            questionTypes={questionTypes}
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
            themeKey="diagnostic"
        />
    );
};

export default DiagnosticSection;