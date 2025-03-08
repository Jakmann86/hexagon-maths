// src/components/math/MathView.jsx
import React from 'react';
import * as MafsLib from 'mafs';
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
            <MafsLib.Mafs
                viewBox={viewBox}
                preserveAspectRatio="contain"
                {...props}
            >
                {children}
            </MafsLib.Mafs>
        </div>
    );
};

export default MathView;