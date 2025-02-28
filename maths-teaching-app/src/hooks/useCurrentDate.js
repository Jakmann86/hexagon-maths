import { useState, useEffect } from 'react';

export const useCurrentDate = () => {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).replace(/\//g, '.');
            setCurrentDate(formattedDate);
        };

        updateDate();
        const interval = setInterval(updateDate, 1000 * 60);
        return () => clearInterval(interval);
    }, []);

    return currentDate;
};