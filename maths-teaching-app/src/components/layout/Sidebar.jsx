import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { curriculum } from '../../data/curriculum';

export const Sidebar = ({
    onTopicSelect,
    onLessonSelect,
    currentTopic,
    currentLessonId
}) => {
    const { isSidebarOpen, setIsSidebarOpen, setShowAnswers, setCurrentSection } = useUI();
    
    // State to track which topics are expanded
    const [expandedTopics, setExpandedTopics] = useState({});
    const sidebarRef = useRef(null);
    
    // Initialize expandedTopics with current topic expanded
    useEffect(() => {
        if (currentTopic) {
            setExpandedTopics(prev => ({...prev, [currentTopic]: true}));
        }
    }, []);
    
    // Handle click outside sidebar to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && 
                !sidebarRef.current.contains(event.target) && 
                isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen, setIsSidebarOpen]);

    // Toggle expanded state for a topic
    const toggleTopicExpanded = (topicKey) => {
        setExpandedTopics(prev => ({
            ...prev,
            [topicKey]: !prev[topicKey]
        }));
    };
    
    // When a topic is selected, expand it and collapse others
    const handleTopicClick = (topicKey) => {
        // Create a new object with all topics collapsed
        const newExpandedState = {};
        Object.keys(curriculum).forEach(key => {
            newExpandedState[key] = key === topicKey;
        });
        
        setExpandedTopics(newExpandedState);
    };

    // When a lesson is selected, also set to starter section and hide answers
    const handleLessonClick = (topicKey, lessonId) => {
        onTopicSelect(topicKey);
        onLessonSelect(lessonId);
        // Default to starter section and hide answers
        setCurrentSection('starter');
        setShowAnswers(false);
        // Close sidebar on mobile
        setIsSidebarOpen(false);
    };

    return (
        <div
            ref={sidebarRef}
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
                        <div 
                            className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-50 rounded-md"
                            onClick={() => {
                                toggleTopicExpanded(topicKey);
                                handleTopicClick(topicKey);
                            }}
                        >
                            <span className="font-medium">{topic.title}</span>
                            {expandedTopics[topicKey] ? 
                                <ChevronDown size={20} /> : 
                                <ChevronRight size={20} />
                            }
                        </div>
                        
                        {/* Lesson list - only show if topic is expanded */}
                        {expandedTopics[topicKey] && (
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
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};