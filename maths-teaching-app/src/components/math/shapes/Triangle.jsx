// src/components/math/shapes/Triangle.jsx
import React from 'react';
import { Polygon, Line, Text, Angle } from '../primitives';

/**
 * Triangle component that builds on primitive components
 * Supports different ways to specify a triangle
 */
const Triangle = ({
    // Triangle specification (different ways to define a triangle)
    vertices,
    sides,
    base,
    height,

    // Positioning
    center = [0, 0],
    rotation = 0,

    // Styling
    fill = 'none',
    fillOpacity = 0.2,
    stroke = 'currentColor',
    strokeWidth = 2,

    // Labeling
    labels = {
        sides: ['', '', ''],
        angles: ['', '', ''],
        vertices: ['', '', '']
    },
    labelStyle = 'none',
    showLabels = true,
    showAngles = false,
    showDimensions = false,
    units = '',
    ...props
}) => {
    // Determine the triangle vertices based on the provided specification
    const calculateVertices = () => {
        if (vertices && vertices.length === 3) {
            return vertices;
        }

        if (sides && sides.length === 3) {
            // Use law of cosines to calculate vertices from side lengths
            const [a, b, c] = sides;

            // Ensure triangle inequality
            if (a + b <= c || a + c <= b || b + c <= a) {
                console.error('Invalid triangle: sides do not satisfy triangle inequality');
                return [[0, 0], [1, 0], [0, 1]]; // Default triangle
            }

            // Place first vertex at origin
            const x1 = 0;
            const y1 = 0;

            // Place second vertex on x-axis
            const x2 = c;
            const y2 = 0;

            // Calculate third vertex using law of cosines
            const cosA = (b * b + c * c - a * a) / (2 * b * c);
            const sinA = Math.sqrt(1 - cosA * cosA);
            const x3 = b * cosA;
            const y3 = b * sinA;

            return [[x1, y1], [x2, y2], [x3, y3]];
        }

        if (base !== undefined && height !== undefined) {
            // Create a triangle with the given base and height
            return [
                [0, 0],
                [base, 0],
                [0, height]
            ];
        }

        // Default triangle
        return [[0, 0], [1, 0], [0, 1]];
    };

    // Get calculated vertices
    const triangleVertices = calculateVertices();

    // Apply center transformation if needed
    const centeredVertices = center[0] !== 0 || center[1] !== 0
        ? triangleVertices.map(([x, y]) => [x + center[0], y + center[1]])
        : triangleVertices;

    // Generate labels based on labelStyle
    const getLabels = () => {
        if (!showLabels) return { sides: ['', '', ''], angles: ['', '', ''], vertices: ['', '', ''] };

        if (labelStyle === 'algebraic') {
            return {
                sides: labels.sides.length === 3 ? labels.sides : ['a', 'b', 'c'],
                angles: labels.angles.length === 3 ? labels.angles : ['A', 'B', 'C'],
                vertices: labels.vertices.length === 3 ? labels.vertices : ['A', 'B', 'C']
            };
        }

        if (labelStyle === 'numeric' && showDimensions) {
            // Calculate side lengths
            const getSideLength = (index) => {
                const v1 = centeredVertices[index];
                const v2 = centeredVertices[(index + 1) % 3];
                const dx = v2[0] - v1[0];
                const dy = v2[1] - v1[1];
                return Math.sqrt(dx * dx + dy * dy).toFixed(1);
            };

            return {
                sides: [
                    `${getSideLength(0)}${units}`,
                    `${getSideLength(1)}${units}`,
                    `${getSideLength(2)}${units}`
                ],
                angles: labels.angles.length === 3 ? labels.angles : ['', '', ''],
                vertices: labels.vertices.length === 3 ? labels.vertices : ['', '', '']
            };
        }

        return labels;
    };

    const finalLabels = getLabels();

    // Calculate midpoints of sides for placing side labels
    const getSideMidpoints = () => {
        return [
            [(centeredVertices[0][0] + centeredVertices[1][0]) / 2, (centeredVertices[0][1] + centeredVertices[1][1]) / 2],
            [(centeredVertices[1][0] + centeredVertices[2][0]) / 2, (centeredVertices[1][1] + centeredVertices[2][1]) / 2],
            [(centeredVertices[2][0] + centeredVertices[0][0]) / 2, (centeredVertices[2][1] + centeredVertices[0][1]) / 2]
        ];
    };

    // Calculate positions for angle labels (slightly offset from vertices)
    const getAnglePositions = () => {
        const ANGLE_OFFSET = 0.3; // Offset from vertex

        return centeredVertices.map((vertex, index) => {
            const prev = centeredVertices[(index + 2) % 3];
            const next = centeredVertices[(index + 1) % 3];

            // Calculate vectors to adjacent vertices
            const v1x = prev[0] - vertex[0];
            const v1y = prev[1] - vertex[1];
            const v2x = next[0] - vertex[0];
            const v2y = next[1] - vertex[1];

            // Normalize vectors
            const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
            const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);

            const n1x = v1x / mag1;
            const n1y = v1y / mag1;
            const n2x = v2x / mag2;
            const n2y = v2y / mag2;

            // Calculate angle bisector
            const bx = (n1x + n2x) / 2;
            const by = (n1y + n2y) / 2;

            // Normalize bisector
            const magB = Math.sqrt(bx * bx + by * by);
            const nbx = bx / magB;
            const nby = by / magB;

            // Return position along bisector
            return [
                vertex[0] + nbx * ANGLE_OFFSET,
                vertex[1] + nby * ANGLE_OFFSET
            ];
        });
    };

    const sideMidpoints = getSideMidpoints();
    const anglePositions = getAnglePositions();

    // Calculate angles in degrees for each vertex
    const calculateAngles = () => {
        return centeredVertices.map((vertex, index) => {
            const prev = centeredVertices[(index + 2) % 3];
            const next = centeredVertices[(index + 1) % 3];

            // Vectors from vertex to adjacent vertices
            const v1x = prev[0] - vertex[0];
            const v1y = prev[1] - vertex[1];
            const v2x = next[0] - vertex[0];
            const v2y = next[1] - vertex[1];

            // Calculate dot product
            const dotProduct = v1x * v2x + v1y * v2y;

            // Calculate magnitudes
            const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
            const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);

            // Calculate angle in radians and convert to degrees
            const angleRad = Math.acos(dotProduct / (mag1 * mag2));
            return angleRad * (180 / Math.PI);
        });
    };

    const angles = calculateAngles();

    return (
        <g transform={rotation ? `rotate(${rotation})` : undefined}>
            {/* Main triangle */}
            <Polygon
                points={centeredVertices}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={stroke}
                strokeWidth={strokeWidth}
                {...props}
            />

            {/* Side labels */}
            {showLabels && finalLabels.sides.map((label, index) => (
                label && (
                    <Text
                        key={`side-${index}`}
                        x={sideMidpoints[index][0]}
                        y={sideMidpoints[index][1]}
                        text={label}
                        fontSize={12}
                        offset={10}
                        align="center"
                    />
                )
            ))}

            {/* Vertex labels */}
            {showLabels && finalLabels.vertices.map((label, index) => (
                label && (
                    <Text
                        key={`vertex-${index}`}
                        x={centeredVertices[index][0]}
                        y={centeredVertices[index][1]}
                        text={label}
                        fontSize={12}
                        offset={15}
                        align="center"
                    />
                )
            ))}

            {/* Angle markings and labels */}
            {showAngles && angles.map((angle, index) => (
                <React.Fragment key={`angle-${index}`}>
                    <Angle
                        vertex={centeredVertices[index]}
                        startPoint={centeredVertices[(index + 2) % 3]}
                        endPoint={centeredVertices[(index + 1) % 3]}
                        radius={0.3}
                        color={stroke}
                    />
                    {finalLabels.angles[index] && (
                        <Text
                            x={anglePositions[index][0]}
                            y={anglePositions[index][1]}
                            text={finalLabels.angles[index]}
                            fontSize={12}
                            align="center"
                        />
                    )}
                </React.Fragment>
            ))}
        </g>
    );
};

export default Triangle;