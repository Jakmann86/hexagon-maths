// src/components/math/shapes/BasicSquare.jsx
import React from 'react';
import { Polygon, Text, Theme } from 'mafs';

const BasicSquare = ({
  sideLength = 5,
  position = [0, 0],
  fill = Theme.green,
  fillOpacity = 0.2,
  showDimensions = true,
  showArea = false,
  units = 'cm'
}) => {
  // Calculate vertices
  const vertices = [
    position,
    [position[0] + sideLength, position[1]],
    [position[0] + sideLength, position[1] + sideLength],
    [position[0], position[1] + sideLength]
  ];

  // Calculate center for area text
  const centerX = position[0] + sideLength / 2;
  const centerY = position[1] + sideLength / 2;

  return (
    <>
      <Polygon
        points={vertices}
        color={fill}
        fillOpacity={fillOpacity}
      />
      
      {showDimensions && (
        <>
          <Text x={centerX} y={position[1] - 0.3}>
            {`${sideLength} ${units}`}
          </Text>
          <Text x={position[0] - 0.3} y={centerY}>
            {`${sideLength} ${units}`}
          </Text>
        </>
      )}
      
      {showArea && (
        <Text x={centerX} y={centerY}>
          {`${sideLength * sideLength} ${units}²`}
        </Text>
      )}
    </>
  );
};

export default BasicSquare;