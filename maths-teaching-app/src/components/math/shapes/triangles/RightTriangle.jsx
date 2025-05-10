// maths-teaching-app/src/components/math/shapes/triangles/RightTriangle.jsx
import React, { useRef, useEffect } from 'react';
import BaseShape from '../base/BaseShape';
import useShapeConfiguration from '../base/useShapeConfiguration';
import { getAngleLabelPosition } from '../../../../utils/labelPositioning';

/**
 * RightTriangle - An improved component for rendering right triangles
 * Compatible with the existing RightTriangle API but using the new component system
 * 
 * @param {Object} props
 * @param {number} props.base - Length of base
 * @param {number} props.height - Length of height 
 * @param {boolean} props.showRightAngle - Whether to show the right angle marker
 * @param {Array|boolean} props.showAngles - Which angles to show [origin, third]
 * @param {Array} props.angleLabels - Labels for the angles ['θ', 'φ']
 * @param {string} props.labelStyle - Style of labels ('numeric', 'algebraic', 'custom')
 * @param {Array} props.labels - Custom labels if labelStyle is 'custom'
 * @param {string} props.units - Units to display ('cm', 'm', etc.)
 * @param {Object} props.style - Custom styling
 * @param {string} props.orientation - Orientation ('default', 'rotate90', etc.)
 * @param {number} props.containerHeight - Height of container
 */
const RightTriangle = (props) => {
  // Process and standardize configuration
  const config = useShapeConfiguration(props, 'rightTriangle');
  
  // Create stable orientation reference
  const orientationRef = useRef(
    config.orientation === 'random' 
      ? ['default', 'rotate90', 'rotate180', 'rotate270'][Math.floor(Math.random() * 4)]
      : config.orientation
  );
  
  // Calculate hypotenuse for labels
  const hypotenuse = Math.sqrt(props.base * props.base + props.height * props.height);
  const roundedHypotenuse = Math.round(hypotenuse * 100) / 100;
  
  // JSXGraph board update function
  const updateBoard = (board) => {
    // Clear existing objects for clean redraw
    board.suspendUpdate();
    try {
      Object.keys(board.objects).forEach(id => {
        board.removeObject(id, false);
      });
      
      // Extract styling options
      const {
        fillColor = '#3F51B5',
        fillOpacity = 0.2,
        strokeColor = '#3F51B5',
        strokeWidth = 2
      } = config.style;
      
      // Define the triangle points based on orientation
      // We'll preserve the exact points structure from your existing component
      const orientation = orientationRef.current;
      const scaledBase = props.base;
      const scaledHeight = props.height;
      
      let points;
      switch (orientation) {
        case 'rotate90':
          points = [
            [0, 0],                // Right angle at origin
            [0, scaledBase],       // Vertical leg (was horizontal)
            [scaledHeight, 0]      // Horizontal leg (was vertical)
          ];
          break;
        case 'rotate180':
          points = [
            [scaledBase, scaledHeight], // Right angle at top-right
            [0, scaledHeight],    // Horizontal leg
            [scaledBase, 0]       // Vertical leg
          ];
          break;
        case 'rotate270':
          points = [
            [scaledHeight, scaledBase], // Right angle at bottom-right
            [scaledHeight, 0],     // Vertical leg
            [0, scaledBase]        // Horizontal leg
          ];
          break;
        case 'default':
        default:
          points = [
            [0, 0],                // Right angle at origin
            [scaledBase, 0],       // Horizontal leg
            [0, scaledHeight]      // Vertical leg
          ];
          break;
      }
      
      // Create the triangle points
      const trianglePoints = points.map(p =>
        board.create('point', p, {
          visible: false,
          fixed: true,
          showInfobox: false,
          name: '',
          withLabel: false
        })
      );
      
      // Create the triangle
      board.create('polygon', trianglePoints, {
        fillColor,
        fillOpacity,
        strokeColor,
        strokeWidth,
        vertices: {
          visible: false,
          withLabel: false
        },
        withLabel: false,
        name: ''
      });
      
      // Create labels if enabled
      if (config.showLabels) {
        // Determine side labels based on labelStyle
        let sideLabels;
        if (config.labelStyle === 'numeric') {
          sideLabels = [
            `${props.base} ${config.units}`,
            `${props.height} ${config.units}`,
            `${roundedHypotenuse} ${config.units}`
          ];
        } else if (config.labelStyle === 'algebraic') {
          sideLabels = ['a', 'b', 'c'];
        } else if (config.labelStyle === 'custom' && Array.isArray(config.labels) && config.labels.length > 0) {
          sideLabels = [...config.labels];
          while (sideLabels.length < 3) sideLabels.push('');
        } else {
          sideLabels = ['', '', ''];
        }
        
        // Helper function to get midpoint of a line
        const getMidpoint = (p1, p2) => [(p1[0] + p2[0])/2, (p1[1] + p2[1])/2];
        
        // Label offsets based on orientation - using your exact placement values
        const LABEL_OFFSETS = {
          base: 0.8,
          height: 0.8,
          hypotenuse: 0.6
        };
        
        // Define label positions based on orientation
        let basePosition, heightPosition, hypotenusePosition;
        
        switch (orientation) {
          case 'rotate90':
            basePosition = [trianglePoints[0].X() - LABEL_OFFSETS.base, (trianglePoints[0].Y() + trianglePoints[1].Y())/2];
            heightPosition = [(trianglePoints[0].X() + trianglePoints[2].X())/2, trianglePoints[0].Y() - LABEL_OFFSETS.height];
            hypotenusePosition = getMidpoint(
              [trianglePoints[1].X(), trianglePoints[1].Y()],
              [trianglePoints[2].X(), trianglePoints[2].Y()]
            );
            hypotenusePosition[0] += LABEL_OFFSETS.hypotenuse;
            hypotenusePosition[1] += LABEL_OFFSETS.hypotenuse;
            break;
          case 'rotate180':
            basePosition = [(trianglePoints[0].X() + trianglePoints[1].X())/2, trianglePoints[0].Y() + LABEL_OFFSETS.base];
            heightPosition = [trianglePoints[0].X() + LABEL_OFFSETS.height, (trianglePoints[0].Y() + trianglePoints[2].Y())/2];
            hypotenusePosition = getMidpoint(
              [trianglePoints[1].X(), trianglePoints[1].Y()],
              [trianglePoints[2].X(), trianglePoints[2].Y()]
            );
            hypotenusePosition[0] -= LABEL_OFFSETS.hypotenuse;
            hypotenusePosition[1] -= LABEL_OFFSETS.hypotenuse;
            break;
          case 'rotate270':
            basePosition = [trianglePoints[0].X() + LABEL_OFFSETS.base, (trianglePoints[0].Y() + trianglePoints[1].Y())/2];
            heightPosition = [(trianglePoints[0].X() + trianglePoints[2].X())/2, trianglePoints[0].Y() + LABEL_OFFSETS.height];
            hypotenusePosition = getMidpoint(
              [trianglePoints[1].X(), trianglePoints[1].Y()],
              [trianglePoints[2].X(), trianglePoints[2].Y()]
            );
            hypotenusePosition[0] -= LABEL_OFFSETS.hypotenuse;
            hypotenusePosition[1] -= LABEL_OFFSETS.hypotenuse;
            break;
          case 'default':
          default:
            basePosition = [(trianglePoints[0].X() + trianglePoints[1].X())/2, trianglePoints[0].Y() - LABEL_OFFSETS.base];
            heightPosition = [trianglePoints[0].X() - LABEL_OFFSETS.height, (trianglePoints[0].Y() + trianglePoints[2].Y())/2];
            hypotenusePosition = getMidpoint(
              [trianglePoints[1].X(), trianglePoints[1].Y()],
              [trianglePoints[2].X(), trianglePoints[2].Y()]
            );
            hypotenusePosition[0] += LABEL_OFFSETS.hypotenuse;
            hypotenusePosition[1] += LABEL_OFFSETS.hypotenuse;
            break;
        }
        
        // Create the labels
        if (sideLabels[0]) {
          board.create('text', [...basePosition, sideLabels[0]], {
            fontSize: config.labelSize || 14,
            fixed: true, 
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }
        
        if (sideLabels[1]) {
          board.create('text', [...heightPosition, sideLabels[1]], {
            fontSize: config.labelSize || 14,
            fixed: true, 
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }
        
        if (sideLabels[2]) {
          board.create('text', [...hypotenusePosition, sideLabels[2]], {
            fontSize: config.labelSize || 14,
            fixed: true, 
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }
      }
      
      // Add right angle marker if enabled
      if (config.showRightAngle) {
        const rightAngleIndex = 0; // First point is always the right angle
        board.create('angle', [
          trianglePoints[2],
          trianglePoints[rightAngleIndex],
          trianglePoints[1]
        ], {
          radius: Math.min(scaledBase, scaledHeight) * 0.15,
          type: 'square',
          fillColor: 'none',
          strokeWidth: 1.5,
          fixed: true,
          name: '',
          withLabel: false
        });
      }
      
      // Add other angle markers if requested
      const angleVisibility = Array.isArray(config.showAngles) ? config.showAngles : [config.showAngles, config.showAngles];
      
      if (angleVisibility[0]) {
        // Create first angle (at origin)
        const angle1 = board.create('angle', [
          trianglePoints[2], trianglePoints[0], trianglePoints[1]
        ], {
          radius: Math.min(scaledBase, scaledHeight) * 0.2,
          name: config.angleLabels[0],
          fillColor: 'rgba(255, 255, 0, 0.2)', 
          strokeColor: strokeColor,
          strokeWidth: 1.5,
          fixed: true
        });
        
        // Position the angle label
        if (angle1.label) {
          const pos = getAngleLabelPosition(
            [trianglePoints[0].X(), trianglePoints[0].Y()],
            [trianglePoints[1].X(), trianglePoints[1].Y()],
            [trianglePoints[2].X(), trianglePoints[2].Y()]
          );
          angle1.label.coords.setCoordinates(JXG.COORDS_BY_USER, pos);
          angle1.label.fixed = true;
        }
      }
      
      if (angleVisibility[1]) {
        // Create second angle (at third vertex)
        const angle2 = board.create('angle', [
          trianglePoints[0], trianglePoints[2], trianglePoints[1]
        ], {
          radius: Math.min(scaledBase, scaledHeight) * 0.2,
          name: config.angleLabels[1],
          fillColor: 'rgba(255, 255, 0, 0.2)',
          strokeColor: strokeColor,
          strokeWidth: 1.5,
          fixed: true
        });
        
        // Position the angle label
        if (angle2.label) {
          const pos = getAngleLabelPosition(
            [trianglePoints[2].X(), trianglePoints[2].Y()],
            [trianglePoints[0].X(), trianglePoints[0].Y()],
            [trianglePoints[1].X(), trianglePoints[1].Y()]
          );
          angle2.label.coords.setCoordinates(JXG.COORDS_BY_USER, pos);
          angle2.label.fixed = true;
        }
      }
      
    } catch (error) {
      console.error("Error creating triangle:", error);
    }
    
    board.unsuspendUpdate();
  };

  // Calculate appropriate bounding box
  const calculateBoundingBox = () => {
    const base = props.base;
    const height = props.height;
    const padding = 2;
    
    // Handle different orientations
    switch (orientationRef.current) {
      case 'rotate90':
        return [-padding, base + padding, height + padding, -padding];
      case 'rotate180':
        return [-padding, height + padding, base + padding, -padding];
      case 'rotate270':
        return [-padding, base + padding, height + padding, -padding];
      case 'default':
      default:
        return [-padding, height + padding, base + padding, -padding];
    }
  };

  return (
    <BaseShape
      id={`right-triangle-${Math.random().toString(36).substr(2, 9)}`}
      boundingBox={calculateBoundingBox()}
      containerHeight={config.containerHeight}
      onUpdate={updateBoard}
      style={{ width: '100%', height: `${config.containerHeight}px` }}
      dependencies={[
        props.base,
        props.height,
        config.labelStyle,
        config.showRightAngle,
        Array.isArray(config.showAngles) ? config.showAngles.join(',') : config.showAngles,
        config.angleLabels.join(','),
        JSON.stringify(config.labels),
        orientationRef.current
      ]}
    />
  );
};

// Set default props
RightTriangle.defaultProps = {
  base: 3,
  height: 4,
  showRightAngle: true,
  showAngles: [false, false],
  angleLabels: ['θ', 'φ'],
  labelStyle: 'numeric',
  units: 'cm',
  orientation: 'default',
  containerHeight: 250,
  style: {}
};

export default RightTriangle;