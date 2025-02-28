import React from 'react';
import { useCurrentDate } from '../../hooks/useCurrentDate';

export const DateDisplay = () => {
    const currentDate = useCurrentDate();

    return (
        <span className="text-sm text-gray-600 font-medium">
            {currentDate}
        </span>
    );
};