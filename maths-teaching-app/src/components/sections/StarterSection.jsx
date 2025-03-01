// src/components/sections/StarterSection.jsx
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import QuestionDisplay from '../starters/QuestionDisplay';

/**
 * StarterSection template provides a standardized way to display 
 * starter/warm-up questions across different topics
 * 
 * @param {Function[]} questionGenerators - Array of 4 functions generating starter questions
 * @param {string} currentTopic - Current topic identifier
 * @param {number} currentLessonId - Current lesson identifier
 * @param {boolean} showAnswers - Whether to show answers (controlled by parent)
 * @param {Object} sectionConfig - Additional configuration options
 */
const StarterSection = ({
    questionGenerators = [],
    currentTopic,
    currentLessonId,
    showAnswers = false,
    sectionConfig = {}
}) => {
    // Default section titles if not provided in config
    const defaultSectionTitles = {
        section1: 'Last Lesson Review',
        section2: 'Last Week Review',
        section3: 'Last Topic Review',
        section4: 'Last Year Review'
    };

    // Merge default config with provided config
    const config = {
        sectionTitles: { ...defaultSectionTitles, ...(sectionConfig.sectionTitles || {}) },
        layout: sectionConfig.layout || 'grid', // 'grid' or 'list'
        columns: sectionConfig.columns || 2
    };

    // Ensure we have exactly 4 generators, using empty generators if needed
    const normalizedGenerators = [...questionGenerators];
    while (normalizedGenerators.length < 4) {
        normalizedGenerators.push(() => ({
            question: 'No question available',
            answer: 'No answer available'
        }));
    }

    // State to store current questions
    const [questions, setQuestions] = useState(() => ({
        section1: normalizedGenerators[0](),
        section2: normalizedGenerators[1](),
        section3: normalizedGenerators[2](),
        section4: normalizedGenerators[3]()
    }));

    // Function to regenerate all questions
    const regenerateAllQuestions = () => {
        setQuestions({
            section1: normalizedGenerators[0](),
            section2: normalizedGenerators[1](),
            section3: normalizedGenerators[2](),
            section4: normalizedGenerators[3]()
        });
    };

    return (
        <div className="space-y-4">
            {/* Question grid */}
            <div className={`grid grid-cols-1 md:grid-cols-${config.columns} gap-4`}>
                {Object.entries(questions).map(([sectionKey, questionData]) => (
                    <QuestionDisplay
                        key={sectionKey}
                        type={sectionKey}
                        title={config.sectionTitles[sectionKey]}
                        data={questionData}
                        showAnswers={showAnswers}
                    />
                ))}
            </div>

            {/* Regenerate questions button */}
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