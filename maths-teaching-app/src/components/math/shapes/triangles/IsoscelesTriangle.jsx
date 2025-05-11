// maths-teaching-app/src/components/math/shapes/triangles/IsoscelesTriangle.jsx
import React, { useMemo } from 'react';
import BaseShape from '../base/BaseShape';
import useShapeConfiguration from '../base/useShapeConfiguration';

const IsoscelesTriangle = (props) => {
  // Process and standardize configuration
  const config = useShapeConfiguration(props, 'isoscelesTriangle');
  
  // Use useMemo for orientation with stable reference
  const orientation = useMemo(() => {
    return config.orientation === 'random' 
      ? ['default', 'rotate90', 'rotate180', 'rotate270'][Math.floor(Math.random() * 4)]
      : config.orientation;
  }, [config.orientation]);
  
  // Calculate leg length (equal sides)
  const legLength = Math.sqrt((props.base/2) * (props.base/2) + props.height * props.height);
  const roundedLegLength = Math.round(legLength * 100) / 100;
  
  // Calculate area
  const area = (props.base * props.height) / 2;
  const roundedArea = Math.round(area * 100) / 100;
  
  // Generate a deterministic ID based on props
  const triangleId = useMemo(() => {
    return `it-${props.base}-${props.height}-${orientation}-${Math.random().toString(36).substr(2, 5)}`;
  }, [props.base, props.height, orientation]);
  
  // JSXGraph board update function
  const updateBoard = (board) => {
    if (!board) return;
    
    // Clear existing objects for clean redraw
    board.suspendUpdate();
    
    try {
      // Clear all existing objects first
      for (const id in board.objects) {
        if (board.objects[id] && typeof board.objects[id].remove === 'function') {
          board.removeObject(board.objects[id], false);
        }
      }
      
      // Extract styling options
      const {
        fillColor = '#3F51B5',
        fillOpacity = 0.2,
        strokeColor = '#3F51B5',
        strokeWidth = 2
      } = config.style;
      
      // Define the triangle points based on orientation
      const base = props.base;
      const height = props.height;
      
      let points;
      switch (orientation) {
        case 'rotate90':
          points = [
            [0, base/2],          // Apex (rotated left)
            [height, 0],          // Bottom right
            [height, base]        // Top right
          ];
          break;
        case 'rotate180':
          points = [
            [base/2, 0],          // Apex (rotated bottom)
            [base, height],       // Top right
            [0, height]           // Top left
          ];
          break;
        case 'rotate270':
          points = [
            [height, base/2],     // Apex (rotated right)
            [0, base],            // Top left
            [0, 0]                // Bottom left
          ];
          break;
        case 'default':
        default:
          points = [
            [base/2, height],     // Apex (top center)
            [0, 0],               // Bottom left
            [base, 0]             // Bottom right
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
      
      // Mark equal sides if requested
      if (config.showEqualSides) {
        // Add hash marks to indicate equal sides
        const markLength = Math.min(props.base, props.height) * 0.1; // Scale with triangle size
        
        // Function to add hash marks on a line
        const addEqualSideMarks = (p1, p2, count = 1) => {
          // Calculate vector along the line
          const dx = p2.X() - p1.X();
          const dy = p2.Y() - p1.Y();
          const length = Math.sqrt(dx*dx + dy*dy);
          
          // Calculate unit perpendicular vector
          const perpX = -dy / length;
          const perpY = dx / length;
          
          // Position the mark in the middle of the line
          const midX = (p1.X() + p2.X()) / 2;
          const midY = (p1.Y() + p2.Y()) / 2;
          
          // Create the hash marks
          for (let i = 0; i < count; i++) {
            // Position marks slightly apart
            const offset = (i - (count-1)/2) * markLength * 0.7;
            const markX = midX + offset * dx / length;
            const markY = midY + offset * dy / length;
            
            board.create('segment', [
              [markX + perpX * markLength/2, markY + perpY * markLength/2],
              [markX - perpX * markLength/2, markY - perpY * markLength/2]
            ], {
              strokeWidth: 2,
              strokeColor: strokeColor,
              fixed: true
            });
          }
        };
        
        // Add marks to the two equal sides
        if (orientation === 'default') {
          addEqualSideMarks(trianglePoints[0], trianglePoints[1], 1); // Left leg
          addEqualSideMarks(trianglePoints[0], trianglePoints[2], 1); // Right leg
        } else if (orientation === 'rotate90') {
          addEqualSideMarks(trianglePoints[0], trianglePoints[1], 1); // Bottom leg
          addEqualSideMarks(trianglePoints[0], trianglePoints[2], 1); // Top leg
        } else if (orientation === 'rotate180') {
          addEqualSideMarks(trianglePoints[0], trianglePoints[1], 1); // Right leg
          addEqualSideMarks(trianglePoints[0], trianglePoints[2], 1); // Left leg
        } else if (orientation === 'rotate270') {
          addEqualSideMarks(trianglePoints[0], trianglePoints[1], 1); // Top leg
          addEqualSideMarks(trianglePoints[0], trianglePoints[2], 1); // Bottom leg
        }
      }
      
      // Add height line if requested
      if (config.showHeight) {
        // Height line depends on orientation
        let heightLine;
        if (orientation === 'default') {
          // From apex to base
          heightLine = board.create('segment', [
            trianglePoints[0],
            [trianglePoints[0].X(), trianglePoints[1].Y()]
          ], {
            strokeWidth: 1,
            strokeColor: strokeColor,
            dash: 2,
            fixed: true
          });
        } else if (orientation === 'rotate90') {
          // From apex to right side
          heightLine = board.create('segment', [
            trianglePoints[0],
            [trianglePoints[1].X(), trianglePoints[0].Y()]
          ], {
            strokeWidth: 1,
            strokeColor: strokeColor,
            dash: 2,
            fixed: true
          });
        } else if (orientation === 'rotate180') {
          // From apex to top side
          heightLine = board.create('segment', [
            trianglePoints[0],
            [trianglePoints[0].X(), trianglePoints[1].Y()]
          ], {
            strokeWidth: 1,
            strokeColor: strokeColor,
            dash: 2,
            fixed: true
          });
        } else if (orientation === 'rotate270') {
          // From apex to left side
          heightLine = board.create('segment', [
            trianglePoints[0],
            [trianglePoints[1].X(), trianglePoints[0].Y()]
          ], {
            strokeWidth: 1,
            strokeColor: strokeColor,
            dash: 2,
            fixed: true
          });
        }
      }
      
      // Create labels if enabled
      if (config.showLabels) {
        // Determine side labels based on labelStyle
        let sideLabels;
        if (config.labelStyle === 'numeric') {
          sideLabels = [
            `${props.base} ${config.units}`, // Base
            `${roundedLegLength} ${config.units}`, // Left leg
            `${roundedLegLength} ${config.units}`  // Right leg
          ];
        } else if (config.labelStyle === 'algebraic') {
          sideLabels = ['b', 'a', 'a']; // a for equal sides, b for base
        } else if (config.labelStyle === 'custom' && Array.isArray(config.labels) && config.labels.length > 0) {
          sideLabels = [...config.labels];
          while (sideLabels.length < 3) sideLabels.push('');
        } else {
          sideLabels = ['', '', ''];
        }
        
        // Helper function to get midpoint of a line
        const getMidpoint = (p1, p2) => [(p1[0] + p2[0])/2, (p1[1] + p2[1])/2];
        
        // Label offsets based on orientation
        const LABEL_OFFSETS = {
          base: 0.8,
          left: 0.8,
          right: 0.8,
        };
        
        // Define label positions based on orientation
        let basePosition, leftLegPosition, rightLegPosition;
        
        switch (orientation) {
          case 'rotate90':
            // Base is vertical on right
            basePosition = [trianglePoints[1].X() + LABEL_OFFSETS.base, (trianglePoints[1].Y() + trianglePoints[2].Y())/2];
            // Legs from apex to top/bottom right
            leftLegPosition = [(trianglePoints[0].X() + trianglePoints[1].X())/2, (trianglePoints[0].Y() + trianglePoints[1].Y())/2 - LABEL_OFFSETS.left];
            rightLegPosition = [(trianglePoints[0].X() + trianglePoints[2].X())/2, (trianglePoints[0].Y() + trianglePoints[2].Y())/2 + LABEL_OFFSETS.right];
            break;
          case 'rotate180':
            // Base is horizontal at top
            basePosition = [(trianglePoints[1].X() + trianglePoints[2].X())/2, trianglePoints[1].Y() + LABEL_OFFSETS.base];
            // Legs from apex to top left/right
            leftLegPosition = [(trianglePoints[0].X() + trianglePoints[1].X())/2 + LABEL_OFFSETS.left, (trianglePoints[0].Y() + trianglePoints[1].Y())/2];
            rightLegPosition = [(trianglePoints[0].X() + trianglePoints[2].X())/2 - LABEL_OFFSETS.right, (trianglePoints[0].Y() + trianglePoints[2].Y())/2];
            break;
          case 'rotate270':
            // Base is vertical on left
            basePosition = [trianglePoints[1].X() - LABEL_OFFSETS.base, (trianglePoints[1].Y() + trianglePoints[2].Y())/2];
            // Legs from apex to top/bottom left
            leftLegPosition = [(trianglePoints[0].X() + trianglePoints[1].X())/2, (trianglePoints[0].Y() + trianglePoints[1].Y())/2 + LABEL_OFFSETS.left];
            rightLegPosition = [(trianglePoints[0].X() + trianglePoints[2].X())/2, (trianglePoints[0].Y() + trianglePoints[2].Y())/2 - LABEL_OFFSETS.right];
            break;
          case 'default':
          default:
            // Base is horizontal at bottom
            basePosition = [(trianglePoints[1].X() + trianglePoints[2].X())/2, trianglePoints[1].Y() - LABEL_OFFSETS.base];
            // Legs from apex to bottom left/right
            leftLegPosition = [(trianglePoints[0].X() + trianglePoints[1].X())/2 - LABEL_OFFSETS.left, (trianglePoints[0].Y() + trianglePoints[1].Y())/2];
            rightLegPosition = [(trianglePoints[0].X() + trianglePoints[2].X())/2 + LABEL_OFFSETS.right, (trianglePoints[0].Y() + trianglePoints[2].Y())/2];
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
          board.create('text', [...leftLegPosition, sideLabels[1]], {
            fontSize: config.labelSize || 14,
            fixed: true, 
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }
        
        if (sideLabels[2]) {
          board.create('text', [...rightLegPosition, sideLabels[2]], {
            fontSize: config.labelSize || 14,
            fixed: true, 
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }
        
        // Add height label if needed
        if (config.showHeight) {
          let heightPosition;
          const heightValue = `${props.height} ${config.units}`;
          
          if (orientation === 'default') {
            heightPosition = [trianglePoints[0].X() - 0.8, trianglePoints[1].Y() + props.height/2];
          } else if (orientation === 'rotate90') {
            heightPosition = [trianglePoints[1].X() - props.height/2, trianglePoints[0].Y() - 0.8];
          } else if (orientation === 'rotate180') {
            heightPosition = [trianglePoints[0].X() + 0.8, trianglePoints[1].Y() - props.height/2];
          } else if (orientation === 'rotate270') {
            heightPosition = [trianglePoints[1].X() + props.height/2, trianglePoints[0].Y() + 0.8];
          }
          
          board.create('text', [...heightPosition, heightValue], {
            fontSize: config.labelSize || 14,
            fixed: true, 
            anchorX: 'middle',
            anchorY: 'middle',
            color: '#000000'
          });
        }
      }
      
      // Add area label if requested
      if (config.showArea && config.areaLabel) {
        // Position area label in the center of the triangle
        const centerX = (trianglePoints[0].X() + trianglePoints[1].X() + trianglePoints[2].X()) / 3;
        const centerY = (trianglePoints[0].Y() + trianglePoints[1].Y() + trianglePoints[2].Y()) / 3;
        
        board.create('text', [centerX, centerY, config.areaLabel], {
          fontSize: config.labelSize || 14,
          fixed: true, 
          anchorX: 'middle',
          anchorY: 'middle',
          color: '#000000'
        });
      }
      
      // Add angle markers for equal angles if requested
      if (config.showEqualAngles) {
        const radius = Math.min(props.base, props.height) * 0.15;
        
        // Create angles at the base (these are equal in an isosceles triangle)
        if (orientation === 'default') {
          // Bottom left angle
          board.create('angle', [trianglePoints[0], trianglePoints[1], trianglePoints[2]], {
            radius: radius,
            fillColor: 'rgba(255, 255, 0, 0.2)', 
            strokeColor: strokeColor,
            strokeWidth: 1.5,
            fixed: true,
            name: '°'
          });
          
          // Bottom right angle
          board.create('angle', [trianglePoints[0], trianglePoints[2], trianglePoints[1]], {
            radius: radius,
            fillColor: 'rgba(255, 255, 0, 0.2)', 
            strokeColor: strokeColor,
            strokeWidth: 1.5,
            fixed: true,
            name: '°'
          });
        } else if (orientation === 'rotate90') {
          // Similar logic for rotated triangle
          board.create('angle', [trianglePoints[0], trianglePoints[1], trianglePoints[2]], {
            radius: radius,
            fillColor: 'rgba(255, 255, 0, 0.2)', 
            strokeColor: strokeColor,
            strokeWidth: 1.5,
            fixed: true,
            name: '°'
          });
          
          board.create('angle', [trianglePoints[0], trianglePoints[2], trianglePoints[1]], {
            radius: radius,
            fillColor: 'rgba(255, 255, 0, 0.2)', 
            strokeColor: strokeColor,
            strokeWidth: 1.5,
            fixed: true,
            name: '°'
          });
        } else if (orientation === 'rotate180') {
          // Similar logic for 180° rotated triangle 
          board.create('angle', [trianglePoints[0], trianglePoints[1], trianglePoints[2]], {
            radius: radius,
            fillColor: 'rgba(255, 255, 0, 0.2)', 
            strokeColor: strokeColor,
            strokeWidth: 1.5,
            fixed: true,
            name: '°'
          });
          
          board.create('angle', [trianglePoints[0], trianglePoints[2], trianglePoints[1]], {
            radius: radius,
            fillColor: 'rgba(255, 255, 0, 0.2)', 
            strokeColor: strokeColor,
            strokeWidth: 1.5,
            fixed: true,
            name: '°'
          });
        } else if (orientation === 'rotate270') {
          // Similar logic for 270° rotated triangle
          board.create('angle', [trianglePoints[0], trianglePoints[1], trianglePoints[2]], {
            radius: radius,
            fillColor: 'rgba(255, 255, 0, 0.2)', 
            strokeColor: strokeColor,
            strokeWidth: 1.5,
            fixed: true,
            name: '°'
          });
          
          board.create('angle', [trianglePoints[0], trianglePoints[2], trianglePoints[1]], {
            radius: radius,
            fillColor: 'rgba(255, 255, 0, 0.2)', 
            strokeColor: strokeColor,
            strokeWidth: 1.5,
            fixed: true,
            name: '°'
          });
        }
      }
      
    } catch (error) {
      console.error("Error creating isosceles triangle:", error);
    }
    
    board.unsuspendUpdate();
  };

  // Calculate appropriate bounding box
  const calculateBoundingBox = () => {
    const base = props.base;
    const height = props.height;
    const padding = 2;
    
    // Handle different orientations
    switch (orientation) {
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
      id={triangleId}
      boundingBox={calculateBoundingBox()}
      containerHeight={config.containerHeight}
      onUpdate={updateBoard}
      style={{ width: '100%', height: `${config.containerHeight}px` }}
      dependencies={[
        props.base,
        props.height,
        config.labelStyle,
        config.showEqualSides ? 1 : 0,
        config.showHeight ? 1 : 0,
        config.showArea ? 1 : 0,
        config.areaLabel,
        config.showEqualAngles ? 1 : 0,
        JSON.stringify(config.labels || []),
        orientation
      ]}
    />
  );
};

// Set default props
IsoscelesTriangle.defaultProps = {
  base: 6,
  height: 4,
  showEqualSides: true,
  showEqualAngles: false,
  showHeight: false,
  showArea: false,
  areaLabel: null,
  labelStyle: 'numeric',
  units: 'cm',
  orientation: 'default',
  containerHeight: 250,
  style: {}
};

export default IsoscelesTriangle;