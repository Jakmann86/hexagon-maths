import React from 'react';
import {
    Mafs,
    Coordinates,
    Line,
    Text,
    Theme,
    useStopwatch,
    Polygon,
    Transform
} from "mafs";
import "mafs/core.css";
import "mafs/font.css";
import { Card, CardContent } from '../common/Card.jsx';
console.log('Imported Mafs:', { Mafs, Coordinates, Line, Text, Theme, Polygon, Transform });

const MafsSquare = ({

    // Dimensions
    sideLength = 5,
    units = 'units',

    // Appearance
    fillColor = "#FDE68A",  // Light yellow
    strokeColor = Theme.black,
    fillOpacity = 1,
    strokeWidth = 2,

    // Display options
    showGrid = true,
    showDimensions = true,
    showArea = false,
    showPerimeter = false,
    showDiagonals = false,

    // Label options
    labelStyle = 'numeric', // 'numeric', 'algebraic', or 'unknown'
    areaLabel = null, // Override for area display

    // Position
    center = [0, 0],

    // Optional viewBox override
    viewBox = null,

    // Animation
    animate = false,

    // Custom style overrides
    className = ''
}) => {
    
    const safeSideLength = typeof sideLength === 'number' && sideLength !== '?' 
    ? sideLength 
    : 5;


    // Calculate area
    const area = areaLabel ?? (sideLength !== '?' ? sideLength * sideLength : '?');
    const perimeter = sideLength !== '?' ? sideLength * 4 : '?';


    // Format measurements based on label style
    const formatMeasurement = (value) => {
        if (labelStyle === 'unknown' || value === '?') return '?';
        if (labelStyle === 'algebraic') return 'x';
        return `${value} ${units}`;
    };

    const formatArea = (value) => {
        if (labelStyle === 'unknown' || value === '?') return '?';
        if (labelStyle === 'algebraic') return 'x²';
        return `${value} ${units}²`;
    };

    // Calculate square vertices relative to center
    const halfSide = typeof sideLength === 'number' && sideLength !== '?' 
    ? sideLength / 2 
    : 2.5;
    const points = [
        [center[0] - halfSide, center[1] - halfSide],
        [center[0] + halfSide, center[1] - halfSide],
        [center[0] + halfSide, center[1] + halfSide],
        [center[0] - halfSide, center[1] + halfSide]
    ];

    // Calculate default viewBox if not provided
    const defaultViewBox = {
        x: [center[0] - halfSide - 1, center[0] + halfSide + 1],
        y: [center[1] - halfSide - 1, center[1] + halfSide + 1]
    };

    const actualViewBox = viewBox || defaultViewBox;

    // Animation hook
    const time = useStopwatch(animate ? 1000 : null);

    return (
        <Card>
            <CardContent className="p-6">
                <div className="h-96">
                    <Mafs
                        viewBox={actualViewBox}
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <Coordinates.Cartesian />

                        {/* Main square */}
                        <Polygon
                            points={points}
                            strokeWidth={strokeWidth}
                            stroke={strokeColor}
                            fill="#FDE68A"  // Light yellow
                            fillOpacity={fillOpacity}
                        />

                        {/* Optional diagonals */}
                        {showDiagonals && (
                            <>
                                <Line.Segment
                                    point1={points[0]}
                                    point2={points[2]}
                                    stroke={strokeColor}
                                    strokeOpacity={0.5}
                                    strokeWidth={strokeWidth / 2}
                                />
                                <Line.Segment
                                    point1={points[1]}
                                    point2={points[3]}
                                    stroke={strokeColor}
                                    strokeOpacity={0.5}
                                    strokeWidth={strokeWidth / 2}
                                />
                            </>
                        )}

                        {/* Labels */}
                        {showDimensions && (
                            <>
                                {/* Bottom side length */}
                                <Text
                                    x={center[0]}
                                    y={center[1] - halfSide - 0.3}
                                    size={20}
                                >
                                    {formatMeasurement(sideLength)}
                                </Text>

                                {/* Right side length */}
                                <Transform rotate={90}>
                                    <Text
                                        x={center[1]}
                                        y={-center[0] - halfSide - 0.3}
                                        size={20}
                                    >
                                        {formatMeasurement(sideLength)}
                                    </Text>
                                </Transform>
                            </>
                        )}

                        {/* Area display */}
                        {showArea && (
                            <Text
                                x={center[0]}
                                y={center[1]}
                                size={20}
                            >
                                {formatArea(area)}
                            </Text>
                        )}

                        {/* Perimeter display */}
                        {showPerimeter && (
                            <Text
                                x={center[0]}
                                y={center[1] + halfSide + 0.5}
                                size={16}
                            >
                                {`P = ${formatMeasurement(perimeter)}`}
                            </Text>
                        )}
                    </Mafs>
                </div>
            </CardContent>
        </Card>
    );
};

const Example = () => (
    <div className="grid grid-cols-2 gap-4 p-4">
        <div>
            <h3 className="text-lg font-semibold mb-2">Standard Square</h3>
            <MafsSquare
                sideLength={4}
                showGrid={true}
                showArea={true}
                showDimensions={true}
            />
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">Square Root Problem</h3>
            <MafsSquare
                sideLength="?"
                showGrid={true}
                showArea={true}
                showDimensions={true}
                areaLabel={16}
                labelStyle="unknown"
                fillColor="#FDE68A"
            />
        </div>
    </div>
);

export default MafsSquare;