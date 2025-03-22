import React, { createContext, useState, useContext, useCallback, useRef } from 'react';

// Extended UI Context
const UIContext = createContext();

export const UIProvider = ({ children }) => {
    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Answers visibility state (already used in Header)
    const [showAnswers, setShowAnswers] = useState(false);
    
    // Current section tracking
    const [currentSection, setCurrentSection] = useState('starter');
    
    // Timer functionality
    const [timerSeconds, setTimerSeconds] = useState(300); // Default 5 minutes
    const [isTimerActive, setIsTimerActive] = useState(false);
    const intervalIdRef = useRef(null); // Use ref to avoid issues with state updates
    
    // Toggle answers visibility
    const toggleAnswers = () => setShowAnswers(!showAnswers);
    
    // Timer functions
    const formatTime = () => {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
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
    
    // Pythagoras visualization specific states
    const [showBaseSquare, setShowBaseSquare] = useState(true);
    const [showHeightSquare, setShowHeightSquare] = useState(true);
    const [showHypotenuseSquare, setShowHypotenuseSquare] = useState(true);
    const [showLabels, setShowLabels] = useState(true);
    
    return (
        <UIContext.Provider
            value={{
                // Sidebar
                isSidebarOpen,
                setIsSidebarOpen,
                
                // Answers visibility
                showAnswers,
                setShowAnswers,
                toggleAnswers,
                
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
                
                // Pythagoras visualization
                showBaseSquare,
                setShowBaseSquare,
                showHeightSquare,
                setShowHeightSquare,
                showHypotenuseSquare,
                setShowHypotenuseSquare,
                showLabels,
                setShowLabels
            }}
        >
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