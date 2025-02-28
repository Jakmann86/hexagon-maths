const Square = ({
    sideLength = 5,
    units = 'cm',
    showArea = false,
    showDimensions = true,
    areaLabel
}) => {
    // Calculate area if needed
    const area = areaLabel ?? (sideLength !== '?' ? sideLength * sideLength : '?');

    // Format measurements
    const formatMeasurement = (value) => {
        if (value === '?' || value === undefined) return '?';
        return `${value} ${units}`;
    };

    const formatArea = (value) => {
        if (value === '?' || value === undefined) return '?';
        return `${value} ${units}²`;
    };

    return (
        <div className="relative w-64 h-64">
            <svg
                viewBox="0 0 200 200"
                width="200"
                height="200"
                className="overflow-visible"
                strokeLinecap="square"
                strokeLinejoin="miter"
            >
                <g vectorEffect="non-scaling-stroke">
                    <rect
                        x={2}
                        y={2}
                        width={196}
                        height={196}
                        className="fill-white stroke-black"
                        strokeWidth={3}
                    />
                </g>

                {/* Side Length Labels */}
                {showDimensions && (
                    <>
                        <text
                            x={100}
                            y={220}
                            textAnchor="middle"
                            className="text-base font-medium fill-black"
                        >
                            {formatMeasurement(sideLength)}
                        </text>
                    </>
                )}

                {/* Area Label */}
                {showArea && (
                    <text
                        x={100}
                        y={100}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-base font-medium fill-black"
                    >
                        {formatArea(area)}
                    </text>
                )}
            </svg>
        </div>
    );
};

// Example usage
const SquareExample = () => (
    <div className="space-y-8">
        {/* Basic square with dimensions */}
        <Square sideLength={6} />

        {/* Square with area */}
        <Square sideLength={4} showArea={true} />

        {/* Square for square root questions */}
        <Square sideLength="?" showArea={true} areaLabel={25} />
    </div>
);
