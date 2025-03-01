// src/components/math/MathView.jsx
import React from 'react';
import { Mafs } from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * A container component for all mathematical visualizations
 * Provides consistent sizing and styling for Mafs components
 * 
 * @param {object} viewBox - The view box configuration { x: [min, max], y: [min, max] }
 * @param {number} width - Container width
 * @param {number} height - Container height
 * @param {string} className - Additional CSS classes
 */
const MathView = ({
    viewBox = { x: [-5, 5], y: [-5, 5] },
    width = '100%',
    height = 300,
    className = '',
    children,
    ...props
}) => {
    return (
        <div
            className={`math-view-container ${className}`}
            style={{ width, height }}
        >
            <Mafs
                viewBox={viewBox}
                preserveAspectRatio={true}
                {...props}
            >
                {children}
            </Mafs>
        </div>
    );
};

export default MathView;