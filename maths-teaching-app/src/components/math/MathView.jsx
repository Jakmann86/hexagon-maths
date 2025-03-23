// src/components/math/MathView.jsx
import React from 'react';
import MafsWrapper from './MafsWrapper';

/**
 * A container component for all mathematical visualizations
 * Provides consistent sizing and styling for Mafs components
 * 
 * @param {object} viewBox - The view box configuration { x: [min, max], y: [min, max] }
 * @param {number} width - Container width
 * @param {number} height - Container height
 * @param {string} className - Additional CSS classes
 * @param {string} background - Background color ('transparent', 'white', etc.)
 * @param {string} textColor - Text color
 */
const MathView = ({
    viewBox = { x: [-5, 5], y: [-5, 5] },
    width = '100%',
    height = 300,
    className = '',
    background = 'transparent',
    textColor = 'black',
    children,
    ...props
}) => {
    return (
        <div
            className={`math-view-container ${className}`}
            style={{ width, height: typeof height === 'number' ? `${height}px` : height }}
        >
            <MafsWrapper
                viewBox={viewBox}
                preserveAspectRatio="contain"
                height={typeof height === 'number' ? height : parseInt(height)}
                background={background}
                textColor={textColor}
                {...props}
            >
                {children}
            </MafsWrapper>
        </div>
    );
};

export default MathView;