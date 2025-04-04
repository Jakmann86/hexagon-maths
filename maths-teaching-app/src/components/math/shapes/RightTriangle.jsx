import React, { useMemo, useCallback } from 'react';
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
  // Memoized calculations to prevent unnecessary re-renders
  const triangleDetails = useMemo(() => {
    const hypotenuse = Math.sqrt(base * base + height * height);
    
    // Consistent label generation
    const defaultSideLabels = 
      labelStyle === 'algebraic' 
        ? ['a', 'b', 'c'] 
        : [`${base} ${units}`, `${height} ${units}`, `${hypotenuse.toFixed(2)} ${units}`];
    
    return {
      hypotenuse,
      defaultSideLabels
    };
  }, [base, height, labelStyle, units]);

  // Get board configuration
  const boardConfig = useMemo(() => getBoardConfig(size), [size]);
  const finalHeight = containerHeight || boardConfig.height;

  // Memoized board rendering function
  const updateBoard = useCallback((board) => {
    board.suspendUpdate();

    // Consistent style defaults
    const {
      fillColor = 'indigo',
      fillOpacity = 0.2,
      strokeColor = 'indigo',
      strokeWidth = 2
    } = style;

    // Create points for the triangle
    const points = [
      board.create('point', [0, 0], { visible: false, withLabel: false }),
      board.create('point', [base, 0], { visible: false, withLabel: false }),
      board.create('point', [0, height], { visible: false, withLabel: false })
    ];

    // Triangle polygon
    board.create('polygon', points, {
      fillColor,
      fillOpacity,
      strokeColor,
      strokeWidth
    });

    // Intelligent side label positioning
    const sideLabels = labels.sides || triangleDetails.defaultSideLabels;
    const labelConfig = {
      color: '#333',
      fontSize: 14
    };

    board.create('text', [base/2 - 0.7, -0.6, sideLabels[0]], {
      ...labelConfig
    });
    
    board.create('text', [-0.6, height/2 - 0.75, sideLabels[1]], {
      ...labelConfig,
      rotate: 90
    });
    
    board.create('text', [base/2 + 0.2, height/2 + 0.2, sideLabels[2]], {
      ...labelConfig,
      rotate: Math.atan2(height, base) * 180 / Math.PI
    });

    // Right angle marker with consistent styling
    if (showRightAngle) {
      board.create('angle', [points[1], points[0], points[2]], {
        radius: 0.5,
        orthotype: 'square',
        fillColor: 'transparent',
        strokeColor: strokeColor,
        fillOpacity: 0,
        strokeWidth: 1.5,
        fixed: true,
        withLabel: false
      });
    }

    // Optional vertex labels
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
  }, [base, height, triangleDetails, labels, showRightAngle, style]);

  // Consistent bounding box calculation
  const boundingBox = useMemo(() => [
    -boardConfig.padding, 
    Math.max(base, height) + boardConfig.padding, 
    Math.max(base, height) + boardConfig.padding, 
    -boardConfig.padding
  ], [base, height, boardConfig]);

  return (
    <div 
      className="w-full h-full relative" 
      style={{ 
        background: 'transparent',
        aspectRatio: '1 / 1',
        maxWidth: `${finalHeight}px`,
        margin: '0 auto'
      }}
    >
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

export default React.memo(RightTriangle);