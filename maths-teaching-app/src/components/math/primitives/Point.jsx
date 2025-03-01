// src/components/math/primitives/Point.jsx
import React from 'react';
import { Point as MafsPoint, Text as MafsText } from 'mafs';

/**
 * A point primitive that wraps Mafs.Point with consistent styling and labeling
 * 
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} color - Point color
 * @param {number} size - Point size in pixels
 * @param {string} label - Optional label
 * @param {string} labelPosition - Position of the label relative to the point
 * @param {boolean} interactive - Whether point can be moved/interacted with
 * @param {function} onMove - Callback for movement when interactive
 */
const Point = ({
    x,
    y,
    color = 'currentColor',
    size = 5,
    label = '',
    labelPosition = 'right',
    interactive = false,
    onMove = () => { },
    ...props
}) => {
    // Calculate label position offset
    const getLabelOffset = () => {
        switch (labelPosition) {
            case 'top':
                return [0, -0.5];
            case 'right':
                return [0.5, 0];
            case 'bottom':
                return [0, 0.5];
            case 'left':
                return [-0.5, 0];
            default:
                return [0.5, 0];
        }
    };

    const [offsetX, offsetY] = getLabelOffset();

    return (
        <>
            {interactive ? (
                <MafsPoint
                    x={x}
                    y={y}
                    color={color}
                    size={size}
                    onMove={onMove}
                    {...props}
                />
            ) : (
                <MafsPoint
                    x={x}
                    y={y}
                    color={color}
                    size={size}
                    {...props}
                />
            )}

            {label && (
                <MafsText x={x + offsetX} y={y + offsetY} size={16}>
                    {label}
                </MafsText>
            )}
        </>
    );
};

export default Point;