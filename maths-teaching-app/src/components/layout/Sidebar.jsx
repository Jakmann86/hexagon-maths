import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { curriculum } from '../../data/curriculum';

export const Sidebar = ({
    onTopicSelect,
    onLessonSelect,
    currentTopic,
    currentLessonId
}) => {
    const { isSidebarOpen, setIsSidebarOpen } = useUI();

    const handleLessonClick = (topicKey, lessonId) => {
        onTopicSelect(topicKey);
        onLessonSelect(lessonId);
        setIsSidebarOpen(false); // Close sidebar after selection on mobile
    };

    return (
        <div
            className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-20`}
        >
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Topics</h3>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {Object.entries(curriculum).map(([topicKey, topic]) => (
                    <div key={topicKey} className="mb-4">
                        <div className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer">
                            <span className="font-medium">{topic.title}</span>
                            <ChevronRight size={20} />
                        </div>
                        <div className="ml-4 mt-2 space-y-2">
                            {topic.lessons.map(lesson => (
                                <div
                                    key={lesson.id}
                                    onClick={() => handleLessonClick(topicKey, lesson.id)}
                                    className={`text-sm cursor-pointer p-2 rounded-md 
                    ${currentTopic === topicKey && currentLessonId === lesson.id
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    Lesson {lesson.id}: {lesson.title}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};