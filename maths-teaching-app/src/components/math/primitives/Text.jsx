// src/components/math/primitives/Text.jsx
import React from 'react';
import { Text as MafsText, Transform } from 'mafs';
import 'katex/dist/katex.min.css';

/**
 * A text primitive that wraps Mafs.Text with consistent styling and additional features
 * 
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} content - Text content
 * @param {number} size - Font size
 * @param {string} color - Text color
 * @param {number} rotation - Rotation in degrees
 * @param {boolean} isMath - Whether to render as math using KaTeX
 * @param {string} align - Text alignment (left, center, right)
 * @param {boolean} background - Whether to show background
 * @param {number} backgroundOpacity - Background opacity
 */
const Text = ({
    x,
    y,
    children,
    size = 16,
    color = 'currentColor',
    rotation = 0,
    isMath = false,
    align = 'center',
    background = false,
    backgroundOpacity = 0.7,
    ...props
}) => {
    // Handle alignment
    const getAlignmentOffset = () => {
        // Mafs already centers text by default
        switch (align) {
            case 'left':
                return 1; // Move text right so the left side is at the point
            case 'right':
                return -1; // Move text left so the right side is at the point
            case 'center':
            default:
                return 0; // No offset needed for center alignment
        }
    };

    const alignmentOffset = getAlignmentOffset();

    // Handle rotation if needed
    if (rotation !== 0) {
        return (
            <Transform rotation={rotation * (Math.PI / 180)}>
                <MafsText
                    x={x}
                    y={y}
                    size={size}
                    color={color}
                    {...props}
                >
                    {isMath ? `\\(${children}\\)` : children}
                </MafsText>
            </Transform>
        );
    }

    // If background is enabled, create a background rect
    if (background) {
        // We would need to estimate text dimensions
        const estimatedWidth = String(children).length * size * 0.6;
        const estimatedHeight = size * 1.2;

        return (
            <>
                {/* Background rectangle - would need SVG for this in Mafs */}
                <MafsText
                    x={x}
                    y={y}
                    size={size}
                    color={color}
                    {...props}
                >
                    {isMath ? `\\(${children}\\)` : children}
                </MafsText>
            </>
        );
    }

    // Basic text rendering
    return (
        <MafsText
            x={x}
            y={y}
            size={size}
            color={color}
            {...props}
        >
            {isMath ? `\\(${children}\\)` : children}
        </MafsText>
    );
};

export default Text;