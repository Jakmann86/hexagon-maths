// Updated SectionNav.jsx
import React, { useState, useEffect } from 'react';
import { PlayCircle, Brain, LineChart, BookOpen, Target, Timer, Eye, EyeOff } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export const SectionNav = ({ activeSection, onSectionChange }) => {
    const { showAnswers, toggleAnswers, formatTime, isTimerActive, startTimer, pauseTimer, adjustTimer } = useUI();
    const [showTimerSettings, setShowTimerSettings] = useState(false);
    
    // Timer duration options with more increments
    const timerOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60];

    // Enhanced styling with original MathStarters colors
    const sectionColors = {
        starter: {
            active: 'bg-blue-500 hover:bg-blue-600',
            inactive: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        },
        diagnostic: {
            active: 'bg-purple-500 hover:bg-purple-600',
            inactive: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        },
        learn: {
            active: 'bg-green-500 hover:bg-green-600',
            inactive: 'bg-green-100 text-green-700 hover:bg-green-200'
        },
        examples: {
            active: 'bg-orange-500 hover:bg-orange-600',
            inactive: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
        },
        challenge: {
            active: 'bg-red-500 hover:bg-red-600',
            inactive: 'bg-red-100 text-red-700 hover:bg-red-200'
        }
    };

    // Section data with labels and icons
    const sections = [
        { name: 'starter', icon: PlayCircle },
        { name: 'diagnostic', icon: LineChart },
        { name: 'learn', icon: Brain },
        { name: 'examples', icon: BookOpen },
        { name: 'challenge', icon: Target }
    ];
    
    // Close timer settings dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showTimerSettings && !event.target.closest('.timer-dropdown')) {
                setShowTimerSettings(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showTimerSettings]);
    
    // Handle timer duration selection
    const handleTimerSelection = (minutes) => {
        // Call the adjustTimer function with the selected minutes
        adjustTimer(minutes);
        // Close the dropdown
        setShowTimerSettings(false);
    };

    // Handle timer start/pause with dropdown closure
    const handleTimerToggle = () => {
        if (isTimerActive) {
            pauseTimer();
        } else {
            startTimer();
        }
        setShowTimerSettings(false);
    };

    return (
        <div className="bg-transparent border-b border-gray-200 z-10">
            <div className="max-w-6xl mx-auto py-3 px-4">
                <div className="flex items-center justify-between">
                    {/* Timer on the left */}
                    <div className="relative">
                        <button
                            onClick={() => setShowTimerSettings(!showTimerSettings)}
                            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                        >
                            <Timer size={18} className="mr-2" />
                            {formatTime()}
                        </button>

                        {showTimerSettings && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 timer-dropdown">
                                <div className="p-2">
                                    <div className="grid grid-cols-3 gap-2">
                                        {timerOptions.map((minutes) => (
                                            <button
                                                key={minutes}
                                                onClick={() => handleTimerSelection(minutes)}
                                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                            >
                                                {minutes} min
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-center mt-2 pt-2 border-t border-gray-200">
                                        <button
                                            onClick={handleTimerToggle}
                                            className={`flex items-center px-3 py-1 text-sm rounded-md ${
                                                isTimerActive 
                                                ? 'text-orange-600 hover:bg-orange-50' 
                                                : 'text-green-600 hover:bg-green-50'
                                            }`}
                                        >
                                            {isTimerActive ? 'Pause' : 'Start'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Centered section navigation with equal spacing */}
                    <nav className="flex justify-center">
                        <div className="grid grid-cols-5 gap-6">
                            {sections.map(({ name, icon: Icon }) => (
                                <button
                                    key={name}
                                    onClick={() => onSectionChange(name)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md flex items-center justify-center space-x-2 transition-all ${
                                        activeSection === name
                                            ? `${sectionColors[name].active} text-white`
                                            : sectionColors[name].inactive
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Answer toggle on the right - just the eye icon */}
                    <button
                        onClick={toggleAnswers}
                        className={`p-2 rounded-full ${
                            showAnswers 
                                ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`}
                        title={showAnswers ? "Hide Answers" : "Show Answers"}
                    >
                        {showAnswers ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};