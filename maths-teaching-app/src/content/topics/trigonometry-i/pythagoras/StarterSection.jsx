// src/content/topics/trigonometry-i/pythagoras/StarterSection.jsx
import React, { useState } from 'react';
import { useUI } from '../../../../context/UIContext';
import StarterSection from '../../../../components/sections/StarterSection';
import { RefreshCw } from 'lucide-react';
import {
    generateSquareQuestion,
    generateSquareRootQuestion,
    generateInverseSquareRootQuestion,
    generateSquarePerimeterQuestion
} from '../../../../generators/mathematical';

const StarterSection = ({ currentTopic, currentLessonId }) => {
    const { showAnswers } = useUI();

    // State to store current questions
    const [questions, setQuestions] = useState(() => ({
        section1: generateSquareQuestion({
            minSide: 3,
            maxSide: 8,
            units: 'cm'
        }),
        section2: generateSquareRootQuestion({
            minRoot: 2,
            maxRoot: 6,
            units: 'cm'
        }),
        section3: generateInverseSquareRootQuestion({
            minSide: 3,
            maxSide: 7,
            units: 'cm'
        }),
        section4: generateSquarePerimeterQuestion({
            minSide: 4,
            maxSide: 9,
            units: 'cm'
        })
    }));

    // Function to regenerate all questions
    const regenerateAllQuestions = () => {
        setQuestions({
            section1: generateSquareQuestion({ minSide: 3, maxSide: 8, units: 'cm' }),
            section2: generateSquareRootQuestion({ minRoot: 2, maxRoot: 6, units: 'cm' }),
            section3: generateInverseSquareRootQuestion({ minSide: 3, maxSide: 7, units: 'cm' }),
            section4: generateSquarePerimeterQuestion({ minSide: 4, maxSide: 9, units: 'cm' })
        });
    };

    // Map section names to display titles
    const sectionTitles = {
        section1: 'Last Lesson Review',
        section2: 'Last Week Review',
        section3: 'Last Topic Review',
        section4: 'Last Year Review'
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(questions).map(([sectionKey, questionData]) => (
                    <QuestionDisplay
                        key={sectionKey}
                        type={sectionKey}
                        title={sectionTitles[sectionKey]}
                        data={{
                            question: questionData.question,
                            answer: questionData.answer,
                            shape: questionData.shape
                        }}
                        showAnswers={showAnswers}
                    />
                ))}
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={regenerateAllQuestions}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Generate New Questions
                </button>
            </div>
        </div>
    );
};

export default StarterSection;