// src/components/math/shapes/Rectangle.jsx
import React from 'react';
import { Polygon, Line, Text } from '../primitives';

/**
 * Rectangle component that builds on primitive components
 */
const Rectangle = ({
    // Dimensions
    width = 6,
    height = 4,

    // Positioning
    center = [0, 0],
    rotation = 0,

    // Styling
    fill = 'none',
    fillOpacity = 0.2,
    stroke = 'currentColor',
    strokeWidth = 2,

    // Display options
    showDimensions = true,
    showArea = false,
    showDiagonals = false,

    // Labeling
    labelStyle = 'numeric', // 'numeric', 'algebraic', or 'none'
    widthLabel = '',
    heightLabel = '',
    areaLabel = '',
    units = '',
    ...props
}) => {
    // Calculate rectangle vertices based on width, height, and center
    const calculateVertices = () => {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        return [
            [center[0] - halfWidth, center[1] - halfHeight], // Top left
            [center[0] + halfWidth, center[1] - halfHeight], // Top right
            [center[0] + halfWidth, center[1] + halfHeight],  // Bottom right
            [center[0] - halfWidth, center[1] + halfHeight]   // Bottom left
        ];
    };

    const vertices = calculateVertices();

    // Calculate midpoints of sides for labels
    const getSideMidpoints = () => {
        return [
            [(vertices[0][0] + vertices[1][0]) / 2, vertices[0][1]], // Top (width)
            [vertices[1][0], (vertices[1][1] + vertices[2][1]) / 2], // Right (height)
            [(vertices[2][0] + vertices[3][0]) / 2, vertices[2][1]], // Bottom (width)
            [vertices[3][0], (vertices[3][1] + vertices[0][1]) / 2]  // Left (height)
        ];
    };

    const sideMidpoints = getSideMidpoints();

    // Generate labels based on labelStyle
    const getWidthLabel = () => {
        if (labelStyle === 'none') return '';
        if (widthLabel) return widthLabel;

        if (labelStyle === 'algebraic') {
            return 'w';
        }

        if (labelStyle === 'numeric') {
            return `${width}${units}`;
        }

        return '';
    };

    const getHeightLabel = () => {
        if (labelStyle === 'none') return '';
        if (heightLabel) return heightLabel;

        if (labelStyle === 'algebraic') {
            return 'h';
        }

        if (labelStyle === 'numeric') {
            return `${height}${units}`;
        }

        return '';
    };

    const getAreaLabel = () => {
        if (!showArea) return '';
        if (areaLabel) return areaLabel;

        if (labelStyle === 'algebraic') {
            return 'w × h';
        }

        if (labelStyle === 'numeric') {
            const area = width * height;
            return `${area}${units}²`;
        }

        return '';
    };

    const displayWidthLabel = getWidthLabel();
    const displayHeightLabel = getHeightLabel();
    const displayAreaLabel = getAreaLabel();

    return (
        <g transform={rotation ? `rotate(${rotation})` : undefined}>
            {/* Main rectangle */}
            <Polygon
                points={vertices}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={stroke}
                strokeWidth={strokeWidth}
                {...props}
            />

            {/* Diagonals */}
            {showDiagonals && (
                <>
                    <Line
                        from={vertices[0]}
                        to={vertices[2]}
                        stroke={stroke}
                        strokeWidth={strokeWidth * 0.5}
                        strokeOpacity={0.7}
                        strokeDasharray="4,4"
                    />
                    <Line
                        from={vertices[1]}
                        to={vertices[3]}
                        stroke={stroke}
                        strokeWidth={strokeWidth * 0.5}
                        strokeOpacity={0.7}
                        strokeDasharray="4,4"
                    />
                </>
            )}

            {/* Width labels - top and bottom */}
            {showDimensions && displayWidthLabel && (
                <>
                    <Text
                        x={sideMidpoints[0][0]}
                        y={sideMidpoints[0][1]}
                        text={displayWidthLabel}
                        fontSize={12}
                        offset={-10}
                        align="center"
                    />
                    <Text
                        x={sideMidpoints[2][0]}
                        y={sideMidpoints[2][1]}
                        text={displayWidthLabel}
                        fontSize={12}
                        offset={10}
                        align="center"
                    />
                </>
            )}

            {/* Height labels - left and right */}
            {showDimensions && displayHeightLabel && (
                <>
                    <Text
                        x={sideMidpoints[1][0]}
                        y={sideMidpoints[1][1]}
                        text={displayHeightLabel}
                        fontSize={12}
                        offset={10}
                        align="center"
                        rotation={90}
                    />
                    <Text
                        x={sideMidpoints[3][0]}
                        y={sideMidpoints[3][1]}
                        text={displayHeightLabel}
                        fontSize={12}
                        offset={-10}
                        align="center"
                        rotation={90}
                    />
                </>
            )}

            {/* Area label */}
            {showArea && displayAreaLabel && (
                <Text
                    x={center[0]}
                    y={center[1]}
                    text={displayAreaLabel}
                    fontSize={14}
                    align="center"
                />
            )}
        </g>
    );
};

export default Rectangle;