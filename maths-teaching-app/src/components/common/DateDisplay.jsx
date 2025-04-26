// Updated DateDisplay.jsx
import React from 'react';

export const DateDisplay = () => {
    // Format date as "25th April 2025"
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

    return (
        <span className="text-base font-medium">
            {getFormattedDate()}
        </span>
    );
};