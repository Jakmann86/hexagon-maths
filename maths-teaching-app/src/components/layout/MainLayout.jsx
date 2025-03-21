// src/components/layout/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SectionNav } from '../navigation/SectionNav';
import { useUI } from '../../context/UIContext';
import { curriculum } from '../../data/curriculum';
import { getWeekFromTopic } from '../../data/topicMapping';
import WorkingMafs from '../math/WorkingMafs';   
 

// Import components from new structure
import { DiagnosticSection, StarterSection, LearnSection } from '../../content/topics/trigonometry-i/pythagoras';

const MainLayout = () => {
    // Track current topic and lesson
    const [currentTopic, setCurrentTopic] = useState('Trigonometry I');
    const [currentLessonId, setCurrentLessonId] = useState(1);
    const { currentSection, setCurrentSection } = useUI();

    const { isSidebarOpen } = useUI();

    // Get current topic and lesson details
    const currentTopicData = curriculum[currentTopic];
    const currentLesson = currentTopicData?.lessons.find(lesson => lesson.id === currentLessonId);

    const weekNumber = getWeekFromTopic(currentTopic);

    // Set default section if needed
    useEffect(() => {
        if (!currentSection) {
            setCurrentSection('starter');
        }
    }, [currentSection, setCurrentSection]);

    // Render active section content
    const renderSectionContent = () => {
        // If we're in Trigonometry I, Lesson 1 (Pythagoras)
        if (currentTopic === 'Trigonometry I' && currentLessonId === 1) {
            switch (currentSection) {
                case 'starter':
                    return <StarterSection 
                        currentTopic={currentTopic} 
                        currentLessonId={currentLessonId} 
                    />;
                case 'diagnostic':
                    return <DiagnosticSection 
                        currentTopic={currentTopic} 
                        currentLessonId={currentLessonId}
                    />;
                case 'learn':
                    return <LearnSection 
                        currentTopic={currentTopic} 
                        currentLessonId={currentLessonId}
                    />;
                case 'examples':
                    return <WorkingMafs 
                        currentTopic={currentTopic} 
                        currentLessonId={currentLessonId}
                    />;
                case 'challenge':
                    return <div>Challenge Content - Coming Soon</div>;
                default:
                    return <div>Select a section</div>;
            }
        } else {
            // For other topics/lessons, use the existing implementation
            switch (currentSection) {
                case 'starter':
                    return (
                        <div>Starter Content for {currentTopic} - Lesson {currentLessonId}</div>
                    );
                case 'diagnostic':
                    return (
                        <div>Diagnostic Content for {currentTopic} - Lesson {currentLessonId}</div>
                    );
                case 'learn':
                    return <div>Learn Content for {currentTopic} - Lesson {currentLessonId}</div>;
                case 'examples':
                    return <div>Examples Content for {currentTopic} - Lesson {currentLessonId}</div>;
                case 'challenge':
                    return <div>Challenge Content for {currentTopic} - Lesson {currentLessonId}</div>;
                default:
                    return <div>Select a section</div>;
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header
                title={currentTopicData?.title || ''}
                lesson={currentLesson?.title || ''}
            />

            <Sidebar
                onTopicSelect={setCurrentTopic}
                onLessonSelect={setCurrentLessonId}
                currentTopic={currentTopic}
                currentLessonId={currentLessonId}
            />

            <main className="max-w-6xl mx-auto mt-10 px-4">
                <div className="pb-4">
                    <SectionNav
                        activeSection={currentSection}
                        onSectionChange={setCurrentSection}
                    />
                </div>

                <div className="mt-4">
                    {renderSectionContent()}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;