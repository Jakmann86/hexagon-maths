import React, { useState, useEffect } from 'react';
import { Menu, Timer, Eye, Maximize2, Play, Pause, RotateCcw } from 'lucide-react';
import { DateDisplay } from '../common/DateDisplay';
import { useUI } from '../../context/UIContext';

export const Header = ({ title, lesson }) => {
    const {
        setIsSidebarOpen,
        showAnswers,
        toggleAnswers,
        currentSection,
        isTimerActive,
        formatTime,
        startTimer,
        pauseTimer,
        resetTimer,
        adjustTimer
    } = useUI();

    const [showTimerSettings, setShowTimerSettings] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const timerOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 50, 60];

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
            // Ensure background color persists in fullscreen
            if (document.fullscreenElement) {
                document.fullscreenElement.style.backgroundColor = 'white';
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                const elem = document.documentElement;
                await elem.requestFullscreen();
                elem.style.backgroundColor = 'white'; // Set background color when entering fullscreen
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Error toggling fullscreen:', error);
        }
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto">
                <div className="flex justify-end px-4 py-1 border-b border-gray-100">
                    <DateDisplay />
                </div>

                <div className="grid grid-cols-3 items-center px-4 py-3">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-semibold text-slate-800 tracking-wide whitespace-nowrap">
                            {title}
                        </h1>
                        <h2 className="text-sm text-gray-600 mt-1">
                            {lesson}
                        </h2>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        {/* Timer Controls */}
                        <div className="relative">
                            <button
                                onClick={() => setShowTimerSettings(!showTimerSettings)}
                                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                            >
                                <Timer size={18} className="mr-2" />
                                {formatTime()}
                            </button>

                            {showTimerSettings && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                                    <div className="p-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            {timerOptions.map((minutes) => (
                                                <button
                                                    key={minutes}
                                                    onClick={() => {
                                                        adjustTimer(minutes);
                                                        setShowTimerSettings(false);
                                                    }}
                                                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                >
                                                    {minutes} min
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex justify-center mt-2 pt-2 border-t border-gray-200">
                                            {!isTimerActive ? (
                                                <button
                                                    onClick={() => {
                                                        startTimer();
                                                        setShowTimerSettings(false);
                                                    }}
                                                    className="flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
                                                >
                                                    <Play size={16} className="mr-1" />
                                                    Start
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        pauseTimer();
                                                        setShowTimerSettings(false);
                                                    }}
                                                    className="flex items-center px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded-md"
                                                >
                                                    <Pause size={16} className="mr-1" />
                                                    Pause
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    resetTimer();
                                                    setShowTimerSettings(false);
                                                }}
                                                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md ml-2"
                                            >
                                                <RotateCcw size={16} className="mr-1" />
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Show/Hide Answers Button */}
                        {currentSection !== 'diagnostic' && (
                            <button
                                onClick={toggleAnswers}
                                className={`text-indigo-500 hover:text-indigo-600 ${showAnswers ? 'bg-indigo-50' : ''}`}
                                title={showAnswers ? "Hide Answers" : "Show Answers"}
                            >
                                <Eye size={24} />
                            </button>
                        )}

                        {/* Fullscreen Button */}
                        <button
                            onClick={toggleFullscreen}
                            className="text-orange-500 hover:text-orange-600"
                            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            <Maximize2 size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};