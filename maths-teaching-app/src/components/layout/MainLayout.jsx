// Updated MainLayout.jsx to connect components
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SectionNav } from '../navigation/SectionNav';
import { useUI } from '../../context/UIContext';
import { curriculum } from '../../data/curriculum';
import LessonContentProvider from '../../content/LessonContentProvider';

const MainLayout = () => {
    // State management
    const [currentTopic, setCurrentTopic] = useState('Trigonometry I');
    const [currentLessonId, setCurrentLessonId] = useState(1);
    const { currentSection, setCurrentSection, isSidebarOpen } = useUI();

    // Get current topic and lesson details
    const currentTopicData = curriculum[currentTopic];
    const currentLesson = currentTopicData?.lessons.find(lesson => lesson.id === currentLessonId);

    // Set default section if needed
    useEffect(() => {
        if (!currentSection) {
            setCurrentSection('starter');
        }
    }, [currentSection, setCurrentSection]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Updated Header with fullscreen button on right */}
            <Header
                title={currentTopicData?.title || ''}
                lesson={currentLesson?.title || ''}
            />

            {/* Sidebar with topic navigation */}
            <Sidebar
                onTopicSelect={setCurrentTopic}
                onLessonSelect={setCurrentLessonId}
                currentTopic={currentTopic}
                currentLessonId={currentLessonId}
            />

            {/* Section Navigation with timer, centered buttons, and answers toggle */}
            <SectionNav
                activeSection={currentSection}
                onSectionChange={setCurrentSection}
            />

            <main className="max-w-6xl mx-auto">
                {/* Content area with padding for better spacing */}
                <div className="px-4 py-6">
                    <LessonContentProvider
                        currentTopic={currentTopic}
                        currentLessonId={currentLessonId}
                        currentSection={currentSection}
                    />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;