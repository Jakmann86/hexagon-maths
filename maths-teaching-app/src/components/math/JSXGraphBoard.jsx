// maths-teaching-app/src/components/math/JSXGraphBoard.jsx
import React, { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';

const JSXGraphBoard = ({ 
  id, 
  boundingBox = [-5, 5, 5, -5], 
  axis = true, 
  grid = false, 
  width = '100%', 
  height = '400px',
  backgroundColor = 'transparent',
  onMount = null,
  onUpdate = null,
  dependencies = [],
  skipCleanup = false // New prop to control cleanup behavior
}) => {
  const containerRef = useRef(null);
  const boardRef = useRef(null);

  // Create the board on mount
  useEffect(() => {
    if (!containerRef.current || boardRef.current) return;
    
    try {
      // Simple fix: Just disable automatic labeling globally
      JXG.Options.point.withLabel = false;
      JXG.Options.line.withLabel = false;
      JXG.Options.polygon.withLabel = false;
      
      // Create the board with minimal options - let JSXGraph handle most things
      const board = JXG.JSXGraph.initBoard(id, {
        boundingbox: boundingBox,
        axis: axis,
        grid: grid,
        showCopyright: false,
        showNavigation: false,
        keepAspectRatio: true
      });
      
      boardRef.current = board;
      
      // Call onMount callback
      if (onMount) onMount(board);
      
      // Initial update if provided
      if (onUpdate) onUpdate(board);
    } catch (error) {
      console.error("Error initializing JSXGraph board:", error);
    }
    
    // Cleanup function - only execute if skipCleanup is false
    return () => {
      // Skip cleanup if requested (when used by BaseShape)
      if (skipCleanup) return;
      
      try {
        if (boardRef.current) {
          // Check if board exists in global registry before trying to free it
          if (typeof JXG !== 'undefined' && 
              JXG.JSXGraph && 
              JXG.JSXGraph.boards && 
              JXG.JSXGraph.boards[id]) {
            JXG.JSXGraph.freeBoard(boardRef.current);
          }
          boardRef.current = null;
        }
      } catch (error) {
        console.error("Error cleaning up JSXGraph board:", error);
      }
    };
  }, [id, boundingBox, axis, grid, onMount, skipCleanup]); 

  // Handle updates when dependencies change
  useEffect(() => {
    if (!boardRef.current || !onUpdate) return;
    
    try {
      onUpdate(boardRef.current);
    } catch (error) {
      console.error("Error updating JSXGraph board:", error);
    }
  }, [onUpdate, ...(Array.isArray(dependencies) ? dependencies : [])]);

  return (
    <div 
      id={id} 
      className="jxgbox" 
      ref={containerRef} 
      style={{ width, height }} 
    />
  );
};

export default JSXGraphBoard;