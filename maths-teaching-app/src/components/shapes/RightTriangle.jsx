const RightTriangle = ({
    base = 5,
    height = 4,
    units = 'cm',
    orientation = 'right',
    labelStyle = 'xyz',
    showRightAngle = true,
}) => {
    const viewBoxWidth = 200;
    const viewBoxHeight = 160;
    const padding = 30;
    const centerX = (viewBoxWidth - padding + padding) / 2;
    const centerY = (viewBoxHeight - padding + padding) / 2;

    const hypotenuse = labelStyle === 'numeric'
        ? Math.sqrt(base * base + height * height).toFixed(1)
        : 'z';

    const config = {
        right: {
            points: `
          ${padding},${viewBoxHeight - padding}
          ${viewBoxWidth - padding},${viewBoxHeight - padding}
          ${padding},${padding}
        `,
            anglePath: `
          M ${padding + 20},${viewBoxHeight - padding}
          L ${padding + 20},${viewBoxHeight - padding - 20}
          L ${padding},${viewBoxHeight - padding - 20}
        `,
            labels: {
                base: { x: centerX, y: viewBoxHeight - padding + 25, rotate: 0 },
                height: { x: padding - 12, y: centerY - 25, rotate: labelStyle === 'numeric' ? -90 : 0 },
                hypotenuse: { x: centerX + 10, y: centerY - 15, rotate: 0 }
            }
        },
        left: {
            points: `
          ${padding},${viewBoxHeight - padding}
          ${viewBoxWidth - padding},${viewBoxHeight - padding}
          ${viewBoxWidth - padding},${padding}
        `,
            anglePath: `
          M ${viewBoxWidth - padding - 20},${viewBoxHeight - padding}
          L ${viewBoxWidth - padding - 20},${viewBoxHeight - padding - 20}
          L ${viewBoxWidth - padding},${viewBoxHeight - padding - 20}
        `,
            labels: {
                base: { x: centerX, y: viewBoxHeight - padding + 25, rotate: 0 },
                height: { x: viewBoxWidth - padding + 25, y: centerY - 25, rotate: labelStyle === 'numeric' ? -90 : 0 },
                hypotenuse: { x: centerX - 10, y: centerY - 15, rotate: 0 }
            }
        },
        up: {
            points: `
          ${padding},${padding}
          ${viewBoxWidth - padding},${padding}
          ${viewBoxWidth - padding},${viewBoxHeight - padding}
        `,
            anglePath: `
          M ${viewBoxWidth - padding},${padding + 20}
          L ${viewBoxWidth - padding - 20},${padding + 20}
          L ${viewBoxWidth - padding - 20},${padding}
        `,
            labels: {
                base: { x: centerX, y: padding - 10, rotate: 0 },
                height: { x: viewBoxWidth - padding + 25, y: centerY - 25, rotate: labelStyle === 'numeric' ? -90 : 0 },
                hypotenuse: { x: centerX - 25, y: centerY + 15, rotate: 0 }  // Moved more left
            }
        },
        down: {
            points: `
          ${padding},${viewBoxHeight - padding}
          ${padding},${padding}
          ${viewBoxWidth - padding},${padding}
        `,
            anglePath: `
          M ${padding},${padding + 20}
          L ${padding + 20},${padding + 20}
          L ${padding + 20},${padding}
        `,
            labels: {
                base: { x: centerX, y: padding - 10, rotate: 0 },
                height: { x: padding - 12, y: centerY - 25, rotate: labelStyle === 'numeric' ? -90 : 0 },
                hypotenuse: { x: centerX + 25, y: centerY + 15, rotate: 0 }  // Moved more right
            }
        }
    };

    const currentConfig = config[orientation];
    const baseLabel = labelStyle === 'numeric' ? base : 'x';
    const heightLabel = labelStyle === 'numeric' ? height : 'y';

    // Function to render text with proper rotation for 'y' label
    const renderText = (label, config, type) => {
        if (type === 'height' && labelStyle === 'xyz') {
            // For 'y' label, keep it upright
            return (
                <text
                    x={config.x}
                    y={config.y}
                    textAnchor="middle"
                    className="text-base font-medium fill-black"
                >
                    {label}
                </text>
            );
        }

        return (
            <text
                x={config.x}
                y={config.y}
                textAnchor="middle"
                transform={config.rotate ? `rotate(${config.rotate}, ${config.x}, ${config.y})` : undefined}
                className="text-base font-medium fill-black"
            >
                {labelStyle === 'numeric' ? `${label} ${units}` : label}
            </text>
        );
    };

    return (
        <div className="relative w-64 h-64">
            <svg
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                width={viewBoxWidth}
                height={viewBoxHeight}
                className="overflow-visible"
                strokeLinecap="square"
                strokeLinejoin="miter"
            >
                <g vectorEffect="non-scaling-stroke">
                    <polygon
                        points={currentConfig.points}
                        className="fill-white stroke-black"
                        strokeWidth={3}
                    />
                </g>

                {showRightAngle && (
                    <g vectorEffect="non-scaling-stroke">
                        <path
                            d={currentConfig.anglePath}
                            className="fill-none stroke-black"
                            strokeWidth={2}
                        />
                    </g>
                )}

                {renderText(baseLabel, currentConfig.labels.base, 'base')}
                {renderText(heightLabel, currentConfig.labels.height, 'height')}
                {renderText(hypotenuse, currentConfig.labels.hypotenuse, 'hypotenuse')}
            </svg>
        </div>
    );
};

// Example showing both orientations with both labeling styles
const TriangleExample = () => (
    <div className="grid grid-cols-2 gap-8 p-4">
        <div>
            <h3 className="text-lg font-semibold mb-2">Right (numeric)</h3>
            <RightTriangle orientation="right" labelStyle="numeric" />
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">Right (xyz)</h3>
            <RightTriangle orientation="right" labelStyle="xyz" />
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">Left (numeric)</h3>
            <RightTriangle orientation="left" labelStyle="numeric" />
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">Left (xyz)</h3>
            <RightTriangle orientation="left" labelStyle="xyz" />
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">Up (numeric)</h3>
            <RightTriangle orientation="up" labelStyle="numeric" />
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">Up (xyz)</h3>
            <RightTriangle orientation="up" labelStyle="xyz" />
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">Down (numeric)</h3>
            <RightTriangle orientation="down" labelStyle="numeric" />
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">Down (xyz)</h3>
            <RightTriangle orientation="down" labelStyle="xyz" />
        </div>
    </div>
);

