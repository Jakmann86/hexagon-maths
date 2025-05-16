// src/components/math/JSXGraphBoard.jsx

import React, { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';

/**
 * JSXGraphBoard - A clean React wrapper for JSXGraph
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the board
 * @param {Array} props.boundingBox - Bounding box [xMin, yMax, xMax, yMin]
 * @param {number} props.containerHeight - Height of the container in pixels
 * @param {number} props.containerWidth - Width of the container (default: 100%)
 * @param {boolean} props.axis - Whether to show axes
 * @param {boolean} props.grid - Whether to show grid
 * @param {Function} props.onMount - Callback when the board is mounted with the board instance
 * @param {Array} props.dependencies - Dependencies that trigger board updates
 * @param {Object} props.style - Additional styles for the container
 * @param {string} props.className - Additional CSS classes
 */
function JSXGraphBoard({
  id,
  boundingBox = [-5, 5, 5, -5],
  containerHeight = 300,
  containerWidth = '100%',
  axis = false,
  grid = false,
  showNavigation = false,
  showCopyright = false,
  keepAspectRatio = true,
  pan = { enabled: false },
  zoom = { enabled: false },
  onMount = null,
  dependencies = [],
  style = {},
  className = ''
}) {
  // Reference to the container element
  const containerRef = useRef(null);
  
  // Reference to the board instance
  const boardRef = useRef(null);
  
  // Create board on mount and handle cleanup
  useEffect(() => {
    if (!containerRef.current) return;
    
    try {
      console.log(`Creating JSXGraph board: ${id}`);
      
      // Create the board
      const board = JXG.JSXGraph.initBoard(id, {
        boundingbox: boundingBox,
        axis: axis,
        grid: grid,
        showNavigation: showNavigation,
        showCopyright: showCopyright,
        keepAspectRatio: keepAspectRatio,
        pan: pan,
        zoom: zoom
      });
      
      // Store reference to the board
      boardRef.current = board;
      
      // Call onMount callback with the board instance
      if (onMount && typeof onMount === 'function') {
        console.log(`Calling onMount for board: ${id}`);
        onMount(board);
      }
    } catch (error) {
      console.error("Error creating JSXGraph board:", error);
    }
    
    // Clean up on unmount
    return () => {
      try {
        if (boardRef.current) {
          console.log(`Cleaning up JSXGraph board: ${id}`);
          // Check if the board exists in the global JSXGraph registry
          if (JXG.JSXGraph.boards && JXG.JSXGraph.boards[id]) {
            JXG.JSXGraph.freeBoard(boardRef.current);
          }
          boardRef.current = null;
        }
      } catch (error) {
        console.error("Error cleaning up JSXGraph board:", error);
      }
    };
  }, [id]); // Only create/destroy on id change
  
  // Container style with specified dimensions
  const containerStyle = {
    width: containerWidth,
    height: `${containerHeight}px`,
    ...style
  };
  
  return (
    <div 
      ref={containerRef}
      id={id}
      className={`jxgbox ${className}`}
      style={containerStyle}
    />
  );
}

export default JSXGraphBoard;