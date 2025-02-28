// src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SectionNav } from '../navigation/SectionNav';
import { useUI } from '../../context/UIContext';
import { curriculum } from '../../data/curriculum';
import { getWeekFromTopic } from '../../data/topicMapping';
import Starter from '../starters/Starter';
import Learn from '../../content/topics/trigonometry-i/pythagoras/';
import { 
    generateSquareAreaQuestion,
    generateSquareSideLengthQuestion,
    generateSquarePerimeterQuestion,
    generateSquareRootQuestion,
    generateInverseSquareRootQuestion
} from '../../generators/mathematical';
import DiagnosticSection from '../../content/topics/trigonometry-i/pythagoras/DiagnosticSection';

const MainLayout = () => {
    // Track current topic and lesson
    const [currentTopic, setCurrentTopic] = useState('Trigonometry I');
    const [currentLessonId, setCurrentLessonId] = useState(1);
    const [activeSection, setActiveSection] = useState('starter');

    const { isSidebarOpen } = useUI();

    // Get current topic and lesson details
    const currentTopicData = curriculum[currentTopic];
    const currentLesson = currentTopicData?.lessons.find(lesson => lesson.id === currentLessonId);

    const weekNumber = getWeekFromTopic(currentTopic);

    // Define question generators for Pythagoras topic
    const pythagorasStarterGenerators = [
        generateSquareAreaQuestion,
        generateSquareSideLengthQuestion,
        generateSquarePerimeterQuestion,
        generateSquareRootQuestion,
        generateInverseSquareRootQuestion
    ];

    // Render active section content
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'starter':
                return (
                    <Starter
                        questionGenerators={pythagorasStarterGenerators}
                        currentTopic={currentTopic}
                        currentLessonId={currentLessonId}
                    />
                );
            case 'learn':
                return (
                    <Learn
                        currentTopic={currentTopic}
                        currentLessonId={currentLessonId}
                    />
                );
                case 'diagnostic':
                    return (
                        <DiagnosticSection
                            currentTopic={currentTopic}
                            currentLessonId={currentLessonId}
                        />
                    );
            case 'examples':
                return <div>Examples Content</div>;
            case 'challenge':
                return <div>Challenge Content</div>;
            default:
                return <div>Select a section</div>;
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
                <div className="sticky top-0 bg-slate-50 z-10 pb-4">
                    <SectionNav
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
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