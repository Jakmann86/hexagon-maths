import React, { useMemo } from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import { getBoardConfig } from '../../../config/boardSizes';

const RightTriangle = ({
  base = 3,
  height = 4,
  showRightAngle = true,
  labelStyle = 'standard',
  labels = {},
  units = 'cm',
  style = {},
  size = 'starter',
  containerHeight // Optional override
}) => {
  // Calculate hypotenuse using Pythagoras' theorem
  const hypotenuse = Math.sqrt(base * base + height * height);
  
  // Get board configuration
  const boardConfig = getBoardConfig(size);
  const finalHeight = containerHeight || boardConfig.height;

  // Memoized label generation
  const defaultSideLabels = useMemo(() => 
    labelStyle === 'algebraic' 
      ? ['a', 'b', 'c'] 
      : [`${base} ${units}`, `${height} ${units}`, `${hypotenuse.toFixed(2)} ${units}`]
  , [base, height, labelStyle, units]);
  
  const sideLabels = labels.sides || defaultSideLabels;

  // Rendering method specific to right triangle
  const updateBoard = (board) => {
    // No need to remove objects explicitly
    board.suspendUpdate();

    // Create points for the triangle
    const points = [
      board.create('point', [0, 0], { 
        visible: false,
        withLabel: false
      }),
      board.create('point', [base, 0], { 
        visible: false,
        withLabel: false
      }),
      board.create('point', [0, height], { 
        visible: false,
        withLabel: false
      })
    ];

    // Destructure style with defaults
    const {
      fillColor = 'indigo',
      fillOpacity = 0.2,
      strokeColor = 'indigo',
      strokeWidth = 2
    } = style;

    // Create the polygon (triangle)
    board.create('polygon', points, {
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      strokeColor: strokeColor,
      strokeWidth: strokeWidth
    });

    // Side labels
    board.create('text', [base/2 - 0.7, -0.6, sideLabels[0]], {
      color: '#333',
      fontSize: 14
    });
    
    board.create('text', [-0.6, height/2 - 0.75, sideLabels[1]], {
      color: '#333',
      fontSize: 14,
      rotate: 90
    });
    
    board.create('text', [base/2 + 0.2, height/2 + 0.2, sideLabels[2]], {
      color: '#333',
      fontSize: 14,
      rotate: Math.atan2(height, base) * 180 / Math.PI
    });
    const markerColor = strokeColor || '#333';

    // Right angle marker
    if (showRightAngle) {
      board.create('angle', [points[1], points[0], points[2]], {
        radius: 0.5,
        orthotype: 'square',
        fillColor: 'transparent',
        strokeColor: style.strokeColor || 'indigo', // Explicitly use the style's stroke color
        fillOpacity: 0,
        strokeWidth: 1.5,
        fixed: true,
        withLabel: false // Explicitly disable label
      });
    }

    // Vertex labels
    if (labels.vertices) {
      points.forEach((point, index) => {
        board.create('text', [point.X(), point.Y(), labels.vertices[index]], {
          color: '#333',
          fontSize: 10,
          anchorX: index === 0 ? 'right' : (index === 1 ? 'left' : 'right'),
          anchorY: index === 0 ? 'bottom' : (index === 1 ? 'bottom' : 'top')
        });
      });
    }

    board.unsuspendUpdate();
  };

  // Calculate view box dimensions with padding
  const boundingBox = [
    -boardConfig.padding, 
    Math.max(base, height) + boardConfig.padding, 
    Math.max(base, height) + boardConfig.padding, 
    -boardConfig.padding
  ];

  return (
    <div className="w-full h-full" style={{ background: 'transparent' }}>
      <JSXGraphBoard
        id={`right-triangle-${base}-${height}`}
        boundingBox={boundingBox}
        height={`${finalHeight}px`}
        onUpdate={updateBoard}
        backgroundColor="transparent"
        dependencies={[
          base, 
          height, 
          showRightAngle, 
          labelStyle, 
          JSON.stringify(labels), 
          units, 
          size
        ]}
      />
    </div>
  );
};

export default RightTriangle;