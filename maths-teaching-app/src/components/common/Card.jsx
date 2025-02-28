import React from 'react';

const Card = ({ children, className = '' }) => (
    <div className={`bg-white border rounded-lg shadow-sm p-4 mb-4 ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`space-y-2 ${className}`}>
        {children}
    </div>
);

export { Card, CardContent };