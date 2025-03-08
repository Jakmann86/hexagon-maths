// src/components/math/shapes/Rectangle.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import Polygon from '../primitives/Polygon';
import Line from '../primitives/Line';

/**
 * Rectangle component that builds on primitive components
 */
const Rectangle = ({
    // Dimensions
    width = 6,
    height = 4,

    // Positioning
    center = [0, 0],

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

    // Generate dimensions text based on labelStyle
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
        <>
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
                        color={stroke}
                        strokeWidth={strokeWidth * 0.5}
                        strokeOpacity={0.7}
                    />
                    <Line
                        from={vertices[1]}
                        to={vertices[3]}
                        color={stroke}
                        strokeWidth={strokeWidth * 0.5}
                        strokeOpacity={0.7}
                    />
                </>
            )}

            {/* Labels rendered using Mafs.Text */}
            {showDimensions && displayWidthLabel && (
                <MafsLib.Text
                    x={(vertices[0][0] + vertices[1][0]) / 2}
                    y={vertices[0][1] - 0.3}
                >
                    {displayWidthLabel}
                </MafsLib.Text>
            )}

            {showDimensions && displayHeightLabel && (
                <MafsLib.Text
                    x={vertices[1][0] + 0.3}
                    y={(vertices[1][1] + vertices[2][1]) / 2}
                >
                    {displayHeightLabel}
                </MafsLib.Text>
            )}

            {/* Area label */}
            {showArea && displayAreaLabel && (
                <MafsLib.Text
                    x={center[0]}
                    y={center[1]}
                >
                    {displayAreaLabel}
                </MafsLib.Text>
            )}
        </>
    );
};

export default Rectangle;