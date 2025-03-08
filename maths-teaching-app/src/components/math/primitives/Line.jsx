// src/components/math/primitives/Line.jsx
import React from 'react';
import * as MafsLib from 'mafs';

/**
 * A line primitive that wraps Mafs.Line.Segment with consistent styling
 * 
 * @param {array} from - Starting point coordinates [x, y]
 * @param {array} to - Ending point coordinates [x, y]
 * @param {string} color - Line color
 * @param {number} strokeWidth - Line thickness
 * @param {string} strokeDasharray - Dash pattern for line
 */
const Line = ({
    from,
    to,
    color = 'currentColor',
    strokeWidth = 2,
    strokeDasharray = '',
    ...props
}) => {
    return (
        <MafsLib.Line.Segment
            point1={from}
            point2={to}
            color={color}
            strokeWidth={strokeWidth}
            // Handle dash array if needed later
            {...props}
        />
    );
};

export default Line;