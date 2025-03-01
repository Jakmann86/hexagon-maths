// src/components/math/visualizations/PythagorasVisualization.jsx
import React, { useState } from 'react';
import {
    Mafs,
    Coordinates,
    Polygon,
    Line,
    Text,
    Theme,
    useStopwatch
} from 'mafs';
import "mafs/core.css";
import "mafs/font.css";

/**
 * A visualization component for demonstrating Pythagoras' theorem
 * Shows squares on each side of a right triangle and demonstrates a² + b² = c²
 */
const PythagorasVisualization = ({
    // Triangle dimensions
    base = 3,
    height = 4,

    // Animation settings
    animate = false,
    animationDuration = 3000,

    // Display options
    showGrid = true,
    showLabels = true,
    showSquares = true,
    showColoredSquares = true,
    showTheorem = true,

    // Style options
    triangleStrokeWidth = 2,
    squareStrokeWidth = 1.5,

    // Colors
    triangleColor = Theme.blue,
    baseSquareColor = '#A7F3D0', // light mint green
    heightSquareColor = '#A7F3D0', // light mint green  
    hypotenuseSquareColor = '#FDE68A', // light yellow

    // Additional props
    className = '',
    ...props
}) => {
    // For animation
    const time = useStopwatch(animate ? animationDuration : null);
    const animProgress = animate ? Math.min(1, time) : 1;

    // Calculate triangle points
    const pointA = [0, 0];
    const pointB = [base, 0];
    const pointC = [0, height];

    // Calculate the hypotenuse length
    const hypotenuse = Math.sqrt(base * base + height * height);

    // Calculate square vertices for each side
    const baseSquare = [
        pointA,
        pointB,
        [base, -base],
        [0, -base],
    ];

    const heightSquare = [
        pointA,
        pointC,
        [-height, height],
        [-height, 0],
    ];

    const hypotenuseSquare = [
        pointA,
        pointC,
        [pointC[0] - base, pointC[1] + height],
        [pointA[0] - base, pointA[1] + height],
    ];

    // Animation transforms
    const scaleBaseSquare = showSquares ? (animate ? animProgress : 1) : 0;
    const scaleHeightSquare = showSquares ? (animate ? animProgress : 1) : 0;
    const scaleHypotenuseSquare = showSquares ? (animate ? animProgress : 1) : 0;

    // Viewport calculation
    const maxDimension = Math.max(base, height) + 2;
    const viewBox = {
        x: [-height - 1, base + 1],
        y: [-base - 1, height + 2],
    };

    // Calculate areas for labels
    const baseArea = base * base;
    const heightArea = height * height;
    const hypotenuseArea = baseArea + heightArea;

    return (
        <div className={`pythagoras-visualization ${className}`}>
            <Mafs
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                {...props}
            >
                {showGrid && <Coordinates.Grid />}

                {/* The right triangle */}
                <Polygon
                    points={[pointA, pointB, pointC]}
                    strokeWidth={triangleStrokeWidth}
                    stroke={triangleColor}
                    fill="rgba(180, 200, 255, 0.2)"
                />

                {/* Right angle marker */}
                <Line.Segment
                    point1={[0.2, 0]}
                    point2={[0.2, 0.2]}
                    strokeWidth={1}
                    color={Theme.foreground}
                />
                <Line.Segment
                    point1={[0.2, 0.2]}
                    point2={[0, 0.2]}
                    strokeWidth={1}
                    color={Theme.foreground}
                />

                {/* Square on the base */}
                {showSquares && (
                    <Polygon
                        points={baseSquare}
                        strokeWidth={squareStrokeWidth}
                        stroke={Theme.black}
                        fill={showColoredSquares ? baseSquareColor : 'transparent'}
                        fillOpacity={0.7 * scaleBaseSquare}
                    />
                )}

                {/* Square on the height */}
                {showSquares && (
                    <Polygon
                        points={heightSquare}
                        strokeWidth={squareStrokeWidth}
                        stroke={Theme.black}
                        fill={showColoredSquares ? heightSquareColor : 'transparent'}
                        fillOpacity={0.7 * scaleHeightSquare}
                    />
                )}

                {/* Square on the hypotenuse */}
                {showSquares && (
                    <Polygon
                        points={hypotenuseSquare}
                        strokeWidth={squareStrokeWidth}
                        stroke={Theme.black}
                        fill={showColoredSquares ? hypotenuseSquareColor : 'transparent'}
                        fillOpacity={0.7 * scaleHypotenuseSquare}
                    />
                )}

                {/* Labels */}
                {showLabels && (
                    <>
                        {/* Side labels */}
                        <Text x={base / 2} y={-0.3} size={16}>
                            {`a = ${base}`}
                        </Text>
                        <Text x={-0.7} y={height / 2} size={16}>
                            {`b = ${height}`}
                        </Text>
                        <Text x={base / 2 - 0.5} y={height / 2 + 0.3} size={16}>
                            {`c = ${hypotenuse.toFixed(2)}`}
                        </Text>

                        {/* Area labels for squares */}
                        {showSquares && (
                            <>
                                <Text x={base / 2} y={-base / 2} size={16}>
                                    {`a² = ${baseArea}`}
                                </Text>
                                <Text x={-height / 2 - 0.5} y={height / 2} size={16}>
                                    {`b² = ${heightArea}`}
                                </Text>
                            </>
                        )}

                        {/* The theorem statement */}
                        {showTheorem && (
                            <Text x={-height / 2 - 0.5} y={height + 1.5} size={18} weight="bold">
                                {`a² + b² = c²: ${baseArea} + ${heightArea} = ${hypotenuseArea}`}
                            </Text>
                        )}
                    </>
                )}
            </Mafs>
        </div>
    );
};

/**
 * Interactive Pythagoras Demonstration with controls
 */
export const PythagorasDemonstration = ({
    initialBase = 3,
    initialHeight = 4,
    allowControls = true
}) => {
    const [base, setBase] = useState(initialBase);
    const [height, setHeight] = useState(initialHeight);
    const [showSquares, setShowSquares] = useState(true);
    const [showTheorem, setShowTheorem] = useState(true);
    const [animate, setAnimate] = useState(false);

    return (
        <div className="flex flex-col space-y-4">
            <PythagorasVisualization
                base={base}
                height={height}
                showSquares={showSquares}
                showTheorem={showTheorem}
                animate={animate}
            />

            {allowControls && (
                <div className="flex flex-col space-y-2 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base (a)</label>
                            <input
                                type="range"
                                min="1"
                                max="8"
                                step="1"
                                value={base}
                                onChange={(e) => setBase(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="text-center">{base}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Height (b)</label>
                            <input
                                type="range"
                                min="1"
                                max="8"
                                step="1"
                                value={height}
                                onChange={(e) => setHeight(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="text-center">{height}</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center mt-2">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={showSquares}
                                onChange={() => setShowSquares(!showSquares)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="ml-2">Show Squares</span>
                        </label>

                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={showTheorem}
                                onChange={() => setShowTheorem(!showTheorem)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="ml-2">Show Theorem</span>
                        </label>

                        <button
                            onClick={() => setAnimate(true)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Animate
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PythagorasVisualization;