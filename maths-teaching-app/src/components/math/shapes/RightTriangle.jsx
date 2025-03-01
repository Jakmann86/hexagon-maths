// src/components/math/shapes/RightTriangle.jsx
import React from 'react';
import Triangle from './Triangle';
import { Line } from '../primitives';

/**
 * Right Triangle component that extends Triangle component
 * Ensures one angle is 90 degrees
 */
const RightTriangle = ({
    base = 3,
    height = 4,
    orientation = 'bottom-left', // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
    showRightAngle = true,
    rightAngleSize = 0.3,
    rightAngleMarkerStyle = 'square',
    ...props
}) => {
    // Define vertices based on orientation
    const getVertices = () => {
        switch (orientation) {
            case 'bottom-left':
                return [
                    [0, 0],       // Right angle
                    [base, 0],    // Bottom right
                    [0, height]   // Top left
                ];
            case 'bottom-right':
                return [
                    [base, 0],    // Right angle
                    [0, 0],       // Bottom left
                    [base, height] // Top right
                ];
            case 'top-left':
                return [
                    [0, height],  // Right angle
                    [0, 0],       // Bottom left
                    [base, height] // Top right
                ];
            case 'top-right':
                return [
                    [base, height], // Right angle
                    [base, 0],     // Bottom right
                    [0, height]    // Top left
                ];
            default:
                return [
                    [0, 0],       // Right angle
                    [base, 0],    // Bottom right
                    [0, height]   // Top left
                ];
        }
    };

    // Get right angle marker position and paths
    const getRightAngleMarker = () => {
        const vertices = getVertices();
        const rightAngleVertex = vertices[0]; // First vertex is always the right angle

        // Determine directions based on orientation
        let xDir, yDir;

        switch (orientation) {
            case 'bottom-left':
                xDir = 1; yDir = 1;
                break;
            case 'bottom-right':
                xDir = -1; yDir = 1;
                break;
            case 'top-left':
                xDir = 1; yDir = -1;
                break;
            case 'top-right':
                xDir = -1; yDir = -1;
                break;
            default:
                xDir = 1; yDir = 1;
        }

        if (rightAngleMarkerStyle === 'square') {
            return [
                [
                    [rightAngleVertex[0], rightAngleVertex[1]],
                    [rightAngleVertex[0] + (rightAngleSize * xDir), rightAngleVertex[1]]
                ],
                [
                    [rightAngleVertex[0] + (rightAngleSize * xDir), rightAngleVertex[1]],
                    [rightAngleVertex[0] + (rightAngleSize * xDir), rightAngleVertex[1] + (rightAngleSize * yDir)]
                ],
                [
                    [rightAngleVertex[0] + (rightAngleSize * xDir), rightAngleVertex[1] + (rightAngleSize * yDir)],
                    [rightAngleVertex[0], rightAngleVertex[1] + (rightAngleSize * yDir)]
                ],
                [
                    [rightAngleVertex[0], rightAngleVertex[1] + (rightAngleSize * yDir)],
                    [rightAngleVertex[0], rightAngleVertex[1]]
                ]
            ];
        } else {
            // Alternative right angle marker (arc)
            return [
                [
                    [rightAngleVertex[0] + (rightAngleSize * xDir), rightAngleVertex[1]],
                    [rightAngleVertex[0], rightAngleVertex[1] + (rightAngleSize * yDir)]
                ]
            ];
        }
    };

    const vertices = getVertices();
    const rightAngleMarker = getRightAngleMarker();

    // If no labels are specified, create default ones based on common right triangle notation
    const defaultLabels = {
        sides: props.labelStyle === 'algebraic' ? ['c', 'a', 'b'] : ['', '', ''],
        angles: props.labelStyle === 'algebraic' ? ['C', 'A', 'B'] : ['', '', ''],
        vertices: props.labelStyle === 'algebraic' ? ['C', 'A', 'B'] : ['', '', '']
    };

    const mergedLabels = {
        ...defaultLabels,
        ...props.labels
    };

    return (
        <>
            <Triangle
                vertices={vertices}
                {...props}
                labels={mergedLabels}
            />

            {/* Right angle marker */}
            {showRightAngle && rightAngleMarker.map((line, index) => (
                <Line
                    key={`right-angle-${index}`}
                    from={line[0]}
                    to={line[1]}
                    stroke={props.stroke || 'currentColor'}
                    strokeWidth={(props.strokeWidth || 2) * 0.8}
                />
            ))}
        </>
    );
};

export default RightTriangle;