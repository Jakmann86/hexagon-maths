// src/context/UIContext.jsx
// V3.0 - Added resetShowAnswers for section change behaviour

import React, { createContext, useState, useContext, useCallback, useRef, useMemo } from 'react';

// Extended UI Context
const UIContext = createContext();

export const UIProvider = ({ children }) => {
    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Answers visibility state - use useRef and useState together
    const [showAnswersState, setShowAnswersState] = useState(false);
    const showAnswersRef = useRef(showAnswersState);
    
    // Current section tracking
    const [currentSection, setCurrentSectionState] = useState('starter');
    
    // Timer functionality
    const [timerSeconds, setTimerSeconds] = useState(300); // Default 5 minutes
    const [isTimerActive, setIsTimerActive] = useState(false);
    const intervalIdRef = useRef(null); // Use ref to avoid issues with state updates
    
    // Toggle answers visibility with ref update
    const toggleAnswers = useCallback(() => {
        const newValue = !showAnswersRef.current;
        showAnswersRef.current = newValue;
        setShowAnswersState(newValue);
    }, []);
    
    // Expose showAnswers as a getter that reads from the ref
    const showAnswers = showAnswersRef.current;
    
    // Expose setShowAnswers that updates both state and ref
    const setShowAnswers = useCallback((value) => {
        showAnswersRef.current = value;
        setShowAnswersState(value);
    }, []);
    
    // Reset showAnswers to false (for section changes)
    const resetShowAnswers = useCallback(() => {
        showAnswersRef.current = false;
        setShowAnswersState(false);
    }, []);
    
    // Set current section AND reset showAnswers
    const setCurrentSection = useCallback((section) => {
        // Only reset if actually changing to a different section
        if (section !== currentSection) {
            resetShowAnswers();
        }
        setCurrentSectionState(section);
    }, [currentSection, resetShowAnswers]);
    
    // Timer functions
    const formatTime = useCallback(() => {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, [timerSeconds]);
    
    const startTimer = useCallback(() => {
        if (isTimerActive) return;
        
        // Clear any existing interval first
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }
        
        const id = setInterval(() => {
            setTimerSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(id);
                    setIsTimerActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        intervalIdRef.current = id;
        setIsTimerActive(true);
    }, [isTimerActive]);
    
    const pauseTimer = useCallback(() => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
        setIsTimerActive(false);
    }, []);
    
    const resetTimer = useCallback(() => {
        pauseTimer();
        setTimerSeconds(300); // Reset to default 5 minutes
    }, [pauseTimer]);
    
    const adjustTimer = useCallback((minutes) => {
        pauseTimer();
        setTimerSeconds(minutes * 60);
    }, [pauseTimer]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        // Sidebar
        isSidebarOpen,
        setIsSidebarOpen,
        
        // Answers visibility
        showAnswers,
        setShowAnswers,
        toggleAnswers,
        resetShowAnswers,
        
        // Current section
        currentSection,
        setCurrentSection,
        
        // Timer
        timerSeconds,
        isTimerActive,
        formatTime,
        startTimer,
        pauseTimer,
        resetTimer,
        adjustTimer,
    }), [
        isSidebarOpen, 
        showAnswersState, // Use state for dependency, but expose ref value
        currentSection, 
        timerSeconds, 
        isTimerActive, 
        formatTime, 
        startTimer, 
        pauseTimer, 
        resetTimer, 
        adjustTimer,
        setShowAnswers,
        toggleAnswers,
        resetShowAnswers,
        setCurrentSection
    ]);

    return (
        <UIContext.Provider value={contextValue}>
            {children}
        </UIContext.Provider>
    );
};

// Custom hook for accessing the UI context
export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};

export default UIContext;