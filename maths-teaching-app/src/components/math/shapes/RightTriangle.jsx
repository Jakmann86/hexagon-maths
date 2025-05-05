// maths-teaching-app/src/components/math/shapes/RightTriangle.jsx
import React from 'react';
import JSXGraphBoard from '../JSXGraphBoard';
import { STANDARD_SHAPES } from '../../../config/standardShapes';

const RightTriangle = ({
  base = 3,
  height = 4,
  showRightAngle = true,
  labels = [],
  units = 'cm',
  style = {},
  containerHeight = 250,
  orientation = 'default',
  scale = 1,
  labelOffset = 0.8 // Customizable label offset distance
}) => {
  // Handle random orientation
  const actualOrientation = orientation === 'random' 
    ? ['default', 'rotate90', 'rotate180', 'rotate270'][Math.floor(Math.random() * 4)]
    : orientation;
  
  const STANDARD = {
    base: STANDARD_SHAPES.rightTriangle.base * scale,
    height: STANDARD_SHAPES.rightTriangle.height * scale,
    boundingBox: STANDARD_SHAPES.rightTriangle.boundingBox.map(v => v * scale)
  };
  
  const hypotenuse = Math.sqrt(base * base + height * height);
  // Add unique identifier to prevent board conflicts
  const boardId = `right-triangle-standard-${actualOrientation}-${scale}-${Math.random().toString(36).substr(2, 9)}`;

  // Get orientation-specific label configurations
  const getLabelConfig = () => {
    const configs = {
      default: {
        // Standard orientation - hyp and left label need to move left
        points: [
          [0, 4],      // top-left
          [4, 4],      // top-right  
          [0, 0]       // bottom-left (right angle)
        ],
        labels: [
          {
            position: [2, 4.25],  // base (top)
            rotation: 0,
            anchor: { x: 'middle', y: 'bottom' }
          },
          {
            position: [-0.5, 2],  // height (left) - moved left
            rotation: 0,
            anchor: { x: 'right', y: 'middle' }
          },
          {
            position: [1.5, 1.2],  // hypotenuse - moved left
            rotation: 0,
            anchor: { x: 'center', y: 'center' }
          }
        ],
        rightAnglePoints: [1, 2, 0]
      },
      rotate90: {
        // Rotated 90° - labels are perfect, keep them
        points: [
          [0, 0],      // bottom-left
          [0, 4],      // top-left
          [4, 0]       // bottom-right (right angle)
        ],
        labels: [
          {
            position: [4.25, 2],   // base (right)
            rotation: 0,
            anchor: { x: 'left', y: 'middle' }
          },
          {
            position: [2, -0.25],  // height (bottom)
            rotation: 0,
            anchor: { x: 'middle', y: 'top' }
          },
          {
            position: [1.2, 2.3],  // hypotenuse
            rotation: 0,
            anchor: { x: 'center', y: 'center' }
          }
        ],
        rightAnglePoints: [1, 2, 0]
      },
      rotate180: {
        // Rotated 180° - right label and hyp too far up
        points: [
          [4, 0],      // bottom-right (right angle)
          [0, 0],      // bottom-left
          [4, 4]       // top-right
        ],
        labels: [
          {
            position: [2, -0.25],  // base (bottom)
            rotation: 0,
            anchor: { x: 'middle', y: 'top' }
          },
          {
            position: [4.5, 2],   // height (right) - moved right to fix
            rotation: 0,
            anchor: { x: 'left', y: 'middle' }
          },
          {
            position: [1.3, 2],  // hypotenuse - moved down
            rotation: 0,
            anchor: { x: 'center', y: 'center' }
          }
        ],
        rightAnglePoints: [1, 0, 2]
      },
      rotate270: {
        // Rotated 270° - hyp label needs to come up
        points: [
          [4, 4],      // top-right
          [4, 0],      // bottom-right
          [0, 4]       // top-left (right angle)
        ],
        labels: [
          {
            position: [-0.25, 2],  // base (left)
            rotation: 0,
            anchor: { x: 'right', y: 'middle' }
          },
          {
            position: [2, 4.25],   // height (top)
            rotation: 0,
            anchor: { x: 'middle', y: 'bottom' }
          },
          {
            position: [2.8, 2.5],  // hypotenuse - moved up
            rotation: 0,
            anchor: { x: 'center', y: 'center' }
          }
        ],
        rightAnglePoints: [1, 2, 0]
      }
    };

    return configs[actualOrientation] || configs.default;
  };

  const updateBoard = (board) => {
    // Clear existing objects more safely
    const objectIds = Object.keys(board.objects);
    for (let i = objectIds.length - 1; i >= 0; i--) {
      try {
        board.removeObject(board.objects[objectIds[i]]);
      } catch (e) {
        // Ignore errors during object removal
      }
    }
    
    board.suspendUpdate();
    
    try {
      const {
        fillColor = 'indigo',
        fillOpacity = 0.2,
        strokeColor = 'indigo',
        strokeWidth = 2
      } = style;
      
      const config = getLabelConfig();
      
      // Create points
      const [p1, p2, p3] = config.points.map(point => 
        board.create('point', point, { visible: false, fixed: true })
      );
      
      // Create triangle
      board.create('polygon', [p1, p2, p3], {
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        strokeColor: strokeColor,
        strokeWidth: strokeWidth,
        vertices: { visible: false }
      });
      
      // Create labels
      const sideLabels = labels.length === 3 ? labels : [
        `${base} ${units}`,
        `${height} ${units}`,
        `${hypotenuse.toFixed(2)} ${units}`
      ];
      
      config.labels.forEach((labelConfig, index) => {
        const text = board.create('text', 
          [labelConfig.position[0], labelConfig.position[1], sideLabels[index]], 
          {
            fontSize: 14 * scale,
            fixed: true,
            anchorX: labelConfig.anchor.x,
            anchorY: labelConfig.anchor.y,
            rotate: labelConfig.rotation,
            color: '#000000'
          }
        );
      });
      
      // Create right angle marker using JSXGraph's built-in right angle feature
      if (showRightAngle) {
        const [idx1, idx2, idx3] = config.rightAnglePoints;
        const anglePoints = [p1, p2, p3];
        
        // Create right angle marker using JSXGraph's built-in feature
        board.create('angle', [
          anglePoints[idx1], 
          anglePoints[idx2], 
          anglePoints[idx3]
        ], {
          radius: 0.5,
          type: 'square', // Makes it a right angle square marker
          fillColor: 'transparent',
          fillOpacity: 0,
          strokeColor: '#000',
          strokeWidth: 2,
          fixed: true,
          visible: true
        });
      }
    } catch (error) {
      console.error('Error creating triangle:', error);
    }
    
    board.unsuspendUpdate();
  };

  // Fixed bounding box - use the same proportions as the demo
  const getBoundingBox = () => {
    const padding = 0.5; // Minimal padding, just like the demo
    return [
      -0.5 - padding,
      4.5 + padding,
      4.5 + padding,
      -0.5 - padding
    ];
  };

  return (
    <div className="w-full h-full" style={{ maxHeight: `${containerHeight}px` }}>
      <JSXGraphBoard
        id={boardId}
        boundingBox={getBoundingBox()}
        height={containerHeight}
        backgroundColor="transparent"
        axis={false}
        onUpdate={updateBoard}
        dependencies={[base, height, labels, actualOrientation, scale, labelOffset]}
      />
    </div>
  );
};

export default RightTriangle;