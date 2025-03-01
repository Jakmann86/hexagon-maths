// src/components/math/primitives/Coordinates.jsx
import React from 'react';
import { Coordinates as MafsCoordinates, useStopwatch } from 'mafs';

/**
 * A coordinate system primitive that wraps Mafs.Coordinates
 * 
 * @param {array} xRange - X-axis range [min, max]
 * @param {array} yRange - Y-axis range [min, max]
 * @param {boolean} showGrid - Whether to show grid
 * @param {boolean} showAxes - Whether to show axes
 * @param {number} zoom - Zoom level
 * @param {boolean} animated - Whether to animate
 * @param {string} xLabel - X-axis label
 * @param {string} yLabel - Y-axis label
 */
const Coordinates = ({
    xRange = [-10, 10],
    yRange = [-10, 10],
    showGrid = true,
    showAxes = true,
    zoom = 1,
    animated = false,
    xLabel = 'x',
    yLabel = 'y',
    children,
    ...props
}) => {
    // For animation effects
    const time = useStopwatch(animated ? 1000 : null);

    const xMin = xRange[0];
    const xMax = xRange[1];
    const yMin = yRange[0];
    const yMax = yRange[1];

    // Calculate aspect ratio to maintain consistent scaling
    const xSpan = xMax - xMin;
    const ySpan = yMax - yMin;
    const aspectRatio = xSpan / ySpan;

    // Animation effect for zoom (if enabled)
    const animatedZoom = animated ?
        zoom * (1 + 0.1 * Math.sin(time * 0.001)) :
        zoom;

    // Apply zoom to the ranges
    const zoomedXRange = [
        xMin / animatedZoom,
        xMax / animatedZoom
    ];

    const zoomedYRange = [
        yMin / animatedZoom,
        yMax / animatedZoom
    ];

    return (
        <MafsCoordinates.Cartesian
            xAxis={{
                variant: showAxes ? 'default' : 'none',
                label: xLabel
            }}
            yAxis={{
                variant: showAxes ? 'default' : 'none',
                label: yLabel
            }}
            grid={showGrid}
            xRange={zoomedXRange}
            yRange={zoomedYRange}
            {...props}
        >
            {children}
        </MafsCoordinates.Cartesian>
    );
};

export default Coordinates;