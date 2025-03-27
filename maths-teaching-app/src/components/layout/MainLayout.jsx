// src/components/layout/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SectionNav } from '../navigation/SectionNav';
import { useUI } from '../../context/UIContext';
import { curriculum } from '../../data/curriculum';
import { getWeekFromTopic } from '../../data/topicMapping';   
import LessonContentProvider from '../../content/LessonContentProvider';

const MainLayout = () => {
    // Track current topic and lesson
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
                <div className="sticky top-0 bg-slate-50 z-10 pb-4">
                    <SectionNav
                        activeSection={currentSection}
                        onSectionChange={setCurrentSection}
                    />
                </div>

                <div className="mt-4">
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