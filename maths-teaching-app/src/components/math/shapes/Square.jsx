// src/components/math/shapes/Square.jsx (Updated version)
import React from 'react';
import Rectangle from './Rectangle';

/**
 * Square component that extends Rectangle component
 * A specialized rectangle with equal sides
 */
const Square = ({
    // Dimensions
    sideLength = 5,

    // Labeling
    sideLabel = '',
    ...props
}) => {
    return (
        <Rectangle
            width={sideLength}
            height={sideLength}
            widthLabel={sideLabel}
            heightLabel={sideLabel}
            {...props}
        />
    );
};

export default Square;