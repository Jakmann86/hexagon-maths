import React from 'react';

const Square = ({
    size = 100,
    sideLength,
    showArea = false,
    className = ''
}) => (
    <div className="relative inline-block">
        <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className={className}
        >
            {/* Square */}
            <rect
                x="10"
                y="10"
                width="80"
                height="80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            {/* Right angle marker */}
            <path
                d="M 10,20 L 10,10 L 20,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />

            {/* Side length label */}
            {sideLength && (
                <text
                    x="50"
                    y="95"
                    textAnchor="middle"
                    className="text-sm fill-current"
                >
                    {sideLength}
                </text>
            )}

            {/* Area label */}
            {showArea && sideLength && (
                <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    className="text-sm fill-current"
                >
                    {sideLength * sideLength}
                </text>
            )}
        </svg>
    </div>
);

const RightTriangle = ({
    size = 100,
    orientation = 'right', // 'right', 'left', 'up', 'down'
    labels = { x: '', y: '', z: '' },
    showAngle = false,
    anglePosition = 'bottom-right',
    className = ''
}) => {
    const getPoints = () => {
        switch (orientation) {
            case 'right':
                return '10,90 90,90 90,10';
            case 'left':
                return '90,90 10,90 10,10';
            case 'up':
                return '10,90 90,90 10,10';
            case 'down':
                return '10,10 90,10 90,90';
            default:
                return '10,90 90,90 90,10';
        }
    };

    const getRightAnglePosition = () => {
        switch (orientation) {
            case 'right':
                return 'M 80,90 L 90,90 L 90,80';
            case 'left':
                return 'M 20,90 L 10,90 L 10,80';
            case 'up':
                return 'M 80,20 L 90,10 L 80,10';
            case 'down':
                return 'M 80,80 L 90,90 L 80,90';
            default:
                return 'M 80,90 L 90,90 L 90,80';
        }
    };

    return (
        <div className="relative inline-block">
            <svg
                viewBox="0 0 100 100"
                width={size}
                height={size}
                className={className}
            >
                {/* Triangle */}
                <polygon
                    points={getPoints()}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                />

                {/* Right angle marker */}
                <path
                    d={getRightAnglePosition()}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                />

                {/* Angle marker if needed */}
                {showAngle && (
                    <path
                        d="M 85,85 A 10 10 0 0 1 75,75"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="2"
                    />
                )}

                {/* Labels */}
                {labels.x && (
                    <text x="50" y="95" textAnchor="middle" className="text-sm fill-current">
                        {labels.x}
                    </text>
                )}
                {labels.y && (
                    <text x="95" y="50" textAnchor="middle" className="text-sm fill-current">
                        {labels.y}
                    </text>
                )}
                {labels.z && (
                    <text x="60" y="40" textAnchor="middle" className="text-sm fill-current">
                        {labels.z}
                    </text>
                )}
            </svg>
        </div>
    );
};

