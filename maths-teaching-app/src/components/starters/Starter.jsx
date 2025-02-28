// src/components/starters/Starter.jsx
import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import QuestionDisplay from './QuestionDisplay';
import { RefreshCw } from 'lucide-react';

const Starter = ({ questionGenerators, currentTopic, currentLessonId }) => {
    const { showAnswers } = useUI();
    
    const generateQuestions = () => {
        return {
            lastLesson: questionGenerators[0](),
            lastWeek: questionGenerators[1](),
            lastTopic: questionGenerators[2](),
            lastYear: questionGenerators[3]()
        };
    };
    
    const [questions, setQuestions] = useState(generateQuestions);

    return (
        <>
       <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full min-h-[calc(100vh-17rem)] -mt-2 px-4">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-1 gap-x-4 p-3">
        {Object.entries(questions).map(([type, questionData]) => (
            <QuestionDisplay
                key={type}
                type={type}
                data={questionData}
                showAnswers={showAnswers}
            />
        ))}
    </div>
</div>
        <div className="sticky bottom-4 right-4 float-right mr-4">
            <button
                onClick={() => setQuestions(generateQuestions())}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 bg-white shadow-md"
                title="Generate New Questions"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>
    </>
    );
};

export default Starter;