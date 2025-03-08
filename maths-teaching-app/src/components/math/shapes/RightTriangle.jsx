// src/components/math/shapes/RightTriangle.jsx
import React from 'react';
import * as MafsLib from 'mafs';
import Polygon from '../primitives/Polygon';
import Line from '../primitives/Line';

/**
 * Right Triangle component for displaying right-angled triangles
 */
const RightTriangle = ({
    base = 3,
    height = 4,
    orientation = 'bottom-left', // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
    showRightAngle = true,
    rightAngleSize = 0.3,
    
    // Styling
    fill = 'none',
    fillOpacity = 0.2,
    stroke = 'currentColor',
    strokeWidth = 2,
    
    // Labeling
    labelStyle = 'numeric',
    showLabels = true,
    units = 'cm',
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
    
    const vertices = getVertices();
    
    // Get right angle marker positions
    const getRightAngleMarker = () => {
        const rightAngleVertex = vertices[0];
        
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
        
        // Define the right angle marker lines
        return [
            { 
                from: rightAngleVertex, 
                to: [rightAngleVertex[0] + (rightAngleSize * xDir), rightAngleVertex[1]]
            },
            {
                from: [rightAngleVertex[0] + (rightAngleSize * xDir), rightAngleVertex[1]],
                to: [rightAngleVertex[0] + (rightAngleSize * xDir), rightAngleVertex[1] + (rightAngleSize * yDir)]
            },
            {
                from: [rightAngleVertex[0] + (rightAngleSize * xDir), rightAngleVertex[1] + (rightAngleSize * yDir)],
                to: [rightAngleVertex[0], rightAngleVertex[1] + (rightAngleSize * yDir)]
            },
            {
                from: [rightAngleVertex[0], rightAngleVertex[1] + (rightAngleSize * yDir)],
                to: rightAngleVertex
            }
        ];
    };
    
    const rightAngleMarker = getRightAngleMarker();

    // Create labels based on label style
    const renderLabels = () => {
        if (!showLabels) return null;
        
        const hypotenuse = Math.sqrt(base * base + height * height).toFixed(1);
        
        // Calculate midpoints for side labels
        const sideMidpoints = [
            [(vertices[0][0] + vertices[1][0]) / 2, vertices[0][1] - 0.3], // base
            [vertices[2][0] - 0.3, (vertices[0][1] + vertices[2][1]) / 2], // height
            [(vertices[1][0] + vertices[2][0]) / 2, (vertices[1][1] + vertices[2][1]) / 2] // hypotenuse
        ];
        
        const getLabels = () => {
            if (labelStyle === 'algebraic') {
                return ['a', 'b', 'c'];
            } else if (labelStyle === 'numeric') {
                return [`${base}${units}`, `${height}${units}`, `${hypotenuse}${units}`];
            }
            return ['', '', ''];
        };
        
        const labels = getLabels();
        
        return (
            <>
                {labels[0] && (
                    <MafsLib.Text x={sideMidpoints[0][0]} y={sideMidpoints[0][1]}>
                        {labels[0]}
                    </MafsLib.Text>
                )}
                {labels[1] && (
                    <MafsLib.Text x={sideMidpoints[1][0]} y={sideMidpoints[1][1]}>
                        {labels[1]}
                    </MafsLib.Text>
                )}
                {labels[2] && (
                    <MafsLib.Text x={sideMidpoints[2][0]} y={sideMidpoints[2][1]}>
                        {labels[2]}
                    </MafsLib.Text>
                )}
            </>
        );
    };

    return (
        <>
            {/* Main triangle */}
            <Polygon
                points={vertices}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={stroke}
                strokeWidth={strokeWidth}
                {...props}
            />
            
            {/* Right angle marker */}
            {showRightAngle && rightAngleMarker.map((line, index) => (
                <Line
                    key={`right-angle-${index}`}
                    from={line.from}
                    to={line.to}
                    color={stroke}
                    strokeWidth={strokeWidth * 0.7}
                />
            ))}
            
            {/* Labels */}
            {renderLabels()}
        </>
    );
};

export default RightTriangle;