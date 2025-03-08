// src/components/math/primitives/Coordinates.jsx
import React from 'react';
import * as MafsLib from 'mafs';

/**
 * A coordinate system primitive that wraps Mafs.Coordinates
 * 
 * @param {array} xRange - X-axis range [min, max]
 * @param {array} yRange - Y-axis range [min, max]
 * @param {boolean} showGrid - Whether to show grid
 * @param {boolean} showAxes - Whether to show axes
 * @param {number} zoom - Zoom level
 * @param {string} xLabel - X-axis label
 * @param {string} yLabel - Y-axis label
 */
const Coordinates = ({
    xRange = [-10, 10],
    yRange = [-10, 10],
    showGrid = true,
    showAxes = true,
    zoom = 1,
    xLabel = 'x',
    yLabel = 'y',
    children,
    ...props
}) => {
    // Apply zoom to the ranges
    const zoomedXRange = [
        xRange[0] / zoom,
        xRange[1] / zoom
    ];

    const zoomedYRange = [
        yRange[0] / zoom,
        yRange[1] / zoom
    ];

    return (
        <MafsLib.Coordinates.Cartesian
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
        </MafsLib.Coordinates.Cartesian>
    );
};

export default Coordinates;