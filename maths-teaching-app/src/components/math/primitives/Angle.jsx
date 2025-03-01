// src/components/math/primitives/Angle.jsx
import React from 'react';
import { Circle, Text as MafsText } from 'mafs';

/**
 * An angle primitive for creating angle markers between two points
 * 
 * @param {array} vertex - The vertex point coordinates [x, y]
 * @param {array} point1 - First arm point coordinates [x, y]
 * @param {array} point2 - Second arm point coordinates [x, y]
 * @param {number} radius - Radius of the angle arc
 * @param {string} color - Stroke color
 * @param {number} strokeWidth - Stroke width
 * @param {string} label - Optional angle label
 * @param {boolean} isRightAngle - Whether to display as a right angle
 */
const Angle = ({
    vertex,
    point1,
    point2,
    radius = 0.5,
    color = 'currentColor',
    strokeWidth = 2,
    label = '',
    isRightAngle = false,
    ...props
}) => {
    // Calculate angles in radians
    const calculateAngle = (point) => {
        const [vx, vy] = vertex;
        const [px, py] = point;
        return Math.atan2(py - vy, px - vx);
    };

    const angle1 = calculateAngle(point1);
    const angle2 = calculateAngle(point2);

    // Ensure we draw the shorter arc
    let startAngle = angle1;
    let endAngle = angle2;

    // Adjust angles to ensure we draw the correct arc
    if (Math.abs(endAngle - startAngle) > Math.PI) {
        if (endAngle > startAngle) {
            startAngle += 2 * Math.PI;
        } else {
            endAngle += 2 * Math.PI;
        }
    }

    // Calculate position for the label
    const labelAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius * 1.3; // Slightly outside the arc
    const labelX = vertex[0] + Math.cos(labelAngle) * labelRadius;
    const labelY = vertex[1] + Math.sin(labelAngle) * labelRadius;

    // For right angles, we'll draw a square instead of an arc
    if (isRightAngle) {
        // Calculate points for right angle marker (square)
        const [vx, vy] = vertex;

        // Calculate unit vectors along each arm
        const unit1X = Math.cos(angle1);
        const unit1Y = Math.sin(angle1);
        const unit2X = Math.cos(angle2);
        const unit2Y = Math.sin(angle2);

        // Scale by the radius
        const r = radius * 0.8; // Slightly smaller for right angle marker

        // Calculate the three points of the right angle marker
        const p1 = [vx + unit1X * r, vy + unit1Y * r];
        const p2 = [vx + unit1X * r + unit2X * r, vy + unit1Y * r + unit2Y * r];
        const p3 = [vx + unit2X * r, vy + unit2Y * r];

        // We would draw a polyline/path here, but Mafs doesn't have a direct equivalent
        // Use Circle as a workaround with only a portion showing

        return (
            <>
                {/* TODO: Implement right angle marker */}
                <Circle
                    center={vertex}
                    radius={radius}
                    angleStart={Math.min(angle1, angle2)}
                    angleEnd={Math.max(angle1, angle2)}
                    color={color}
                    strokeWidth={strokeWidth}
                    {...props}
                />

                {label && (
                    <MafsText x={labelX} y={labelY} size={16}>
                        {label}
                    </MafsText>
                )}
            </>
        );
    }

    // Normal angle arc
    return (
        <>
            <Circle
                center={vertex}
                radius={radius}
                angleStart={startAngle}
                angleEnd={endAngle}
                color={color}
                strokeWidth={strokeWidth}
                {...props}
            />

            {label && (
                <MafsText x={labelX} y={labelY} size={16}>
                    {label}
                </MafsText>
            )}
        </>
    );
};

export default Angle;