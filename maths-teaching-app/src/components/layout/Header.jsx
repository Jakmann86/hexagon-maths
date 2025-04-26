// Header.jsx with neutral styling
import React from 'react';
import { Menu, Maximize2 } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export const Header = ({ title, lesson }) => {
    const { setIsSidebarOpen } = useUI();

    // Format date as "25th April 2025" but smaller
    const getFormattedDate = () => {
        const date = new Date();
        
        // Add ordinal suffix to day
        const day = date.getDate();
        const suffix = getDaySuffix(day);
        
        // Get month and year
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        
        return `${day}${suffix} ${month} ${year}`;
    };
    
    // Helper function to get day suffix (st, nd, rd, th)
    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    // Toggle fullscreen function
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    return (
        <header>
            {/* Neutral header with subtle styling */}
            <div className="bg-white text-gray-800 py-3 px-4 border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between">
                        {/* Menu button with darker color for contrast */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-gray-600 hover:text-gray-800 p-2"
                        >
                            <Menu size={24} />
                        </button>
                        
                        {/* Center content focused on lesson objective */}
                        <div className="text-center flex-grow">
                            <h1 className="text-xl font-bold text-gray-800">{lesson}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {getFormattedDate()}
                            </p>
                        </div>
                        
                        {/* Fullscreen button */}
                        <button
                            onClick={toggleFullscreen}
                            className="text-gray-600 hover:text-gray-800 p-2"
                            title="Toggle Fullscreen"
                        >
                            <Maximize2 size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};