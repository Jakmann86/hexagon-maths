// src/components/math/primitives/Polygon.jsx
import React from 'react';
import * as MafsLib from 'mafs';

/**
 * A polygon primitive that wraps Mafs.Polygon with consistent styling and labeling
 * 
 * @param {array} points - Array of vertex coordinates [[x1,y1], [x2,y2], ...]
 * @param {string} fill - Fill color
 * @param {number} fillOpacity - Fill opacity
 * @param {string} stroke - Stroke color
 * @param {number} strokeWidth - Stroke width
 */
const Polygon = ({
    points,
    fill = 'none',
    fillOpacity = 0.2,
    stroke = 'currentColor',
    strokeWidth = 2,
    ...props
}) => {
    return (
        <MafsLib.Polygon
            points={points}
            color={stroke}
            fillOpacity={fillOpacity}
            strokeWidth={strokeWidth}
            {...props}
        />
    );
};

export default Polygon;