// src/components/math/primitives/Polygon.jsx
import React from 'react';
import { Polygon as MafsPolygon, Text as MafsText } from 'mafs';

/**
 * A polygon primitive that wraps Mafs.Polygon with consistent styling and labeling
 * 
 * @param {array} points - Array of vertex coordinates [[x1,y1], [x2,y2], ...]
 * @param {string} fill - Fill color
 * @param {number} fillOpacity - Fill opacity
 * @param {string} stroke - Stroke color
 * @param {number} strokeWidth - Stroke width
 * @param {array|object} labels - Labels for vertices or sides
 * @param {boolean} showVertexLabels - Whether to show vertex labels
 * @param {boolean} showSideLabels - Whether to show side labels
 */
const Polygon = ({
    points,
    fill = 'none',
    fillOpacity = 0.2,
    stroke = 'currentColor',
    strokeWidth = 2,
    labels = [],
    showVertexLabels = false,
    showSideLabels = false,
    ...props
}) => {
    // Function to calculate the midpoint of a line segment
    const getMidpoint = (p1, p2) => {
        return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    };

    // Function to get vertex label
    const getVertexLabel = (index) => {
        if (Array.isArray(labels) && labels[index]) {
            return labels[index];
        }

        if (typeof labels === 'object' && labels.vertices && labels.vertices[index]) {
            return labels.vertices[index];
        }

        return '';
    };

    // Function to get side label
    const getSideLabel = (index) => {
        if (typeof labels === 'object' && labels.sides && labels.sides[index]) {
            return labels.sides[index];
        }

        return '';
    };

    // Calculate a slight offset for vertex labels
    const getVertexOffset = (index) => {
        const point = points[index];
        // Determine if point is closer to top, right, bottom, or left
        const isTop = point[1] === Math.max(...points.map(p => p[1]));
        const isBottom = point[1] === Math.min(...points.map(p => p[1]));
        const isRight = point[0] === Math.max(...points.map(p => p[0]));
        const isLeft = point[0] === Math.min(...points.map(p => p[0]));

        let offsetX = 0;
        let offsetY = 0;

        if (isTop) offsetY = 0.3;
        if (isBottom) offsetY = -0.3;
        if (isRight) offsetX = 0.3;
        if (isLeft) offsetX = -0.3;

        // If no clear direction, use a default offset
        if (offsetX === 0 && offsetY === 0) {
            offsetX = 0.3;
            offsetY = 0.3;
        }

        return [offsetX, offsetY];
    };

    return (
        <>
            <MafsPolygon
                points={points}
                color={stroke}
                fillOpacity={fillOpacity}
                strokeWidth={strokeWidth}
                {...props}
            />

            {/* Vertex Labels */}
            {showVertexLabels && points.map((point, index) => {
                const label = getVertexLabel(index);
                if (!label) return null;

                const [offsetX, offsetY] = getVertexOffset(index);

                return (
                    <MafsText
                        key={`vertex-${index}`}
                        x={point[0] + offsetX}
                        y={point[1] + offsetY}
                        size={16}
                    >
                        {label}
                    </MafsText>
                );
            })}

            {/* Side Labels */}
            {showSideLabels && points.map((point, index) => {
                const nextIndex = (index + 1) % points.length;
                const label = getSideLabel(index);
                if (!label) return null;

                const [midX, midY] = getMidpoint(point, points[nextIndex]);

                // Calculate perpendicular offset for the side label
                const dx = points[nextIndex][0] - point[0];
                const dy = points[nextIndex][1] - point[1];
                const length = Math.sqrt(dx * dx + dy * dy);

                if (length === 0) return null;

                // Normalize and perpendicular
                const perpX = -dy / length * 0.3;
                const perpY = dx / length * 0.3;

                return (
                    <MafsText
                        key={`side-${index}`}
                        x={midX + perpX}
                        y={midY + perpY}
                        size={16}
                    >
                        {label}
                    </MafsText>
                );
            })}
        </>
    );
};

export default Polygon;