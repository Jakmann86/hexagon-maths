// src/components/math/primitives/Line.jsx
import React from 'react';
import { Line as MafsLine, Text as MafsText } from 'mafs';

/**
 * A line primitive that wraps Mafs.Line.Segment with consistent styling and labeling
 * 
 * @param {array} point1 - Starting point coordinates [x, y]
 * @param {array} point2 - Ending point coordinates [x, y]
 * @param {string} color - Line color
 * @param {number} strokeWidth - Line thickness
 * @param {string} strokeDasharray - Dash pattern for line
 * @param {string} label - Optional label
 * @param {string} labelPosition - Position of the label (start, middle, end)
 * @param {boolean} extendLine - Whether to extend line beyond endpoints
 */
const Line = ({
    point1,
    point2,
    color = 'currentColor',
    strokeWidth = 2,
    strokeDasharray = '',
    label = '',
    labelPosition = 'middle',
    extendLine = false,
    ...props
}) => {
    // Calculate label position
    const getLabelPosition = () => {
        const [x1, y1] = point1;
        const [x2, y2] = point2;

        switch (labelPosition) {
            case 'start':
                return [x1, y1];
            case 'end':
                return [x2, y2];
            case 'middle':
            default:
                return [(x1 + x2) / 2, (y1 + y2) / 2];
        }
    };

    const [labelX, labelY] = getLabelPosition();

    // Calculate perpendicular offset for the label (to not overlap the line)
    const getPerpendicularOffset = () => {
        const [x1, y1] = point1;
        const [x2, y2] = point2;

        // Calculate perpendicular vector
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length === 0) return [0, 0];

        // Normalize and perpendicular
        const perpX = -dy / length * 0.3;
        const perpY = dx / length * 0.3;

        return [perpX, perpY];
    };

    const [offsetX, offsetY] = getPerpendicularOffset();

    return (
        <>
            {extendLine ? (
                <MafsLine.Segment
                    point1={point1}
                    point2={point2}
                    color={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    {...props}
                />
            ) : (
                <MafsLine.Segment
                    point1={point1}
                    point2={point2}
                    color={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    {...props}
                />
            )}

            {label && (
                <MafsText
                    x={labelX + offsetX}
                    y={labelY + offsetY}
                    size={16}
                >
                    {label}
                </MafsText>
            )}
        </>
    );
};

export default Line;