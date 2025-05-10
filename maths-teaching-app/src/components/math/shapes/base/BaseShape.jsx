// maths-teaching-app/src/components/math/shapes/base/BaseShape.jsx
import React, { useRef, useEffect, useState } from 'react';
import JSXGraphBoard from '../../JSXGraphBoard';
import { BOARD_DEFAULTS } from '../../../../utils/shapeConfig';

/**
 * BaseShape - Foundation component for all mathematical shapes
 * Handles common functionality like JSXGraph initialization, configuration management,
 * and consistent rendering patterns for educational visualizations.
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the JSXGraph board
 * @param {Array} props.boundingBox - Bounding box for the JSXGraph board [xMin, yMax, xMax, yMin]
 * @param {number} props.containerHeight - Height of the container in pixels
 * @param {string} props.backgroundColor - Background color of the board
 * @param {boolean} props.axis - Whether to show axes
 * @param {boolean} props.grid - Whether to show grid
 * @param {Function} props.onMount - Callback when the board is mounted
 * @param {Function} props.onUpdate - Function to update the board with shape-specific rendering
 * @param {Array} props.dependencies - Array of dependencies that should trigger a re-render
 * @param {Object} props.style - Custom styling for the container
 * @param {string} props.className - Additional CSS classes
 */
const BaseShape = ({
  id = `shape-${Math.random().toString(36).substr(2, 9)}`,
  boundingBox = BOARD_DEFAULTS.boundingBox,
  containerHeight = 250,
  backgroundColor = 'transparent',
  axis = BOARD_DEFAULTS.axis,
  grid = BOARD_DEFAULTS.grid,
  onMount = null,
  onUpdate = null,
  dependencies = [],
  style = {},
  className = '',
  children
}) => {
  // Reference to the JSXGraph board instance
  const boardRef = useRef(null);
  
  // Handle board initialization and cleanup
  useEffect(() => {
    // Return cleanup function to handle component unmounting
    return () => {
      if (boardRef.current) {
        try {
          JXG.JSXGraph.freeBoard(boardRef.current);
          boardRef.current = null;
        } catch (error) {
          console.error("Error cleaning up JSXGraph board:", error);
        }
      }
    };
  }, []);

  // Handle board update when dependencies change
  useEffect(() => {
    if (boardRef.current && onUpdate) {
      try {
        onUpdate(boardRef.current);
      } catch (error) {
        console.error("Error updating shape:", error);
      }
    }
  }, [onUpdate, ...dependencies]);

  // JSXGraph initialization callback
  const handleBoardMount = (board) => {
    boardRef.current = board;
    
    // Call the onMount callback if provided
    if (onMount) {
      try {
        onMount(board);
      } catch (error) {
        console.error("Error in onMount callback:", error);
      }
    }
    
    // Call the onUpdate callback for initial rendering
    if (onUpdate) {
      try {
        onUpdate(board);
      } catch (error) {
        console.error("Error in initial onUpdate:", error);
      }
    }
  };

  // Container styling
  const containerStyle = {
    width: '100%',
    height: `${containerHeight}px`,
    ...style
  };

  return (
    <div className={`base-shape ${className}`} style={containerStyle}>
      <JSXGraphBoard
        id={id}
        boundingBox={boundingBox}
        height={containerHeight}
        backgroundColor={backgroundColor}
        axis={axis}
        grid={grid}
        onMount={handleBoardMount}
        dependencies={dependencies}
      />
      {children}
    </div>
  );
};

export default BaseShape;