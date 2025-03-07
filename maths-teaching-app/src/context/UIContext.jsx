import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const [currentSection, setCurrentSection] = useState('starter');
    const [previousSection, setPreviousSection] = useState(null);

    // Timer states
    const [currentTime, setCurrentTime] = useState(25); // Default minutes
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(currentTime * 60);
    const timerRef = useRef(null);

    // When section changes, store the previous section
    useEffect(() => {
        if (currentSection !== previousSection) {
            setPreviousSection(currentSection);
        }
    }, [currentSection, previousSection]);

    // Timer functions
    const startTimer = useCallback(() => {
        if (!isTimerActive) {
            setIsTimerActive(true);
            setRemainingSeconds(currentTime * 60);
            timerRef.current = setInterval(() => {
                setRemainingSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setIsTimerActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }, [currentTime, isTimerActive]);

    const pauseTimer = () => {
        clearInterval(timerRef.current);
        setIsTimerActive(false);
    };

    const resetTimer = () => {
        clearInterval(timerRef.current);
        setIsTimerActive(false);
        setRemainingSeconds(currentTime * 60);
    };

    const adjustTimer = (minutes) => {
        setCurrentTime(minutes);
        setRemainingSeconds(minutes * 60);
        if (isTimerActive) {
            clearInterval(timerRef.current);
            setIsTimerActive(false);
        }
    };

    // Format remaining time for display
    const formatTime = () => {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Global answer handling - works across all sections
    const toggleAnswers = () => {
        setShowAnswers(prev => !prev);
    };

    // Cleanup interval on unmount
    React.useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            setIsSidebarOpen,
            showAnswers,
            setShowAnswers,
            toggleAnswers,
            currentSection,
            setCurrentSection,
            previousSection,
            // Timer values and functions
            currentTime,
            isTimerActive,
            remainingSeconds,
            formatTime,
            startTimer,
            pauseTimer,
            resetTimer,
            adjustTimer
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);