// maths-teaching-app/src/components/math/JSXGraphBoard.jsx
import React, { useRef, useEffect, memo } from 'react';
import JXG from 'jsxgraph';

// Use memo to prevent unnecessary re-renders
const JSXGraphBoard = memo(({ 
  id, 
  boundingBox = [-5, 5, 5, -5], 
  axis = true, 
  grid = false, 
  width = '100%', 
  height = '400px',
  backgroundColor = 'white',
  axisCss = { strokeColor: '#666' },
  onMount = () => {},
  onUpdate = null,
  dependencies = []
}) => {
  const containerRef = useRef(null);
  const boardRef = useRef(null);
  const lastDependenciesRef = useRef(dependencies);
  const initializedRef = useRef(false);

  // Create the board only once on mount
  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;
    
    try {
      // Create the board
      const board = JXG.JSXGraph.initBoard(id, {
        boundingbox: boundingBox,
        axis: axis,
        grid: grid,
        showCopyright: false,
        showNavigation: false,
        keepAspectRatio: true,
        pan: {
          enabled: false,
          needShift: false
        },
        zoom: {
          enabled: false
        },
        defaultAxes: {
          x: { 
            strokeColor: axisCss.strokeColor,
            ticks: { visible: false }
          },
          y: { 
            strokeColor: axisCss.strokeColor,
            ticks: { visible: false }
          }
        },
        renderer: 'svg',
        background: { color: backgroundColor }
      });
      
      boardRef.current = board;
      initializedRef.current = true;
      
      // Call the onMount callback with the board instance
      onMount(board);
      
      // Initial update if provided
      if (onUpdate) {
        board.suspendUpdate();
        try {
          onUpdate(board);
        } catch (error) {
          console.error("Error in initial board update:", error);
        }
        board.unsuspendUpdate();
      }
    } catch (error) {
      console.error("Error initializing JSXGraph board:", error);
    }
    
    // Cleanup function
    return () => {
      try {
        if (boardRef.current) {
          JXG.JSXGraph.freeBoard(boardRef.current);
          boardRef.current = null;
          initializedRef.current = false;
        }
      } catch (error) {
        console.error("Error cleaning up JSXGraph board:", error);
      }
    };
  }, [id]); // Only depend on id to ensure it's created once

  // Handle updates to the board based on dependencies
  useEffect(() => {
    if (!boardRef.current || !onUpdate || !initializedRef.current) return;
    
    // Skip update if dependencies haven't actually changed
    // This is a very important optimization
    if (depsEqual(dependencies, lastDependenciesRef.current)) {
      return;
    }
    
    // Remember current dependencies
    lastDependenciesRef.current = [...dependencies];
    
    // Update the board
    try {
      // Suspend updates to improve performance
      boardRef.current.suspendUpdate();
      
      // Call update function
      onUpdate(boardRef.current);
      
      // Resume updates
      boardRef.current.unsuspendUpdate();
    } catch (error) {
      console.error("Error updating JSXGraph board:", error);
      // Try to recover
      try {
        boardRef.current.unsuspendUpdate();
      } catch (e) {}
    }
  }, [onUpdate, ...dependencies]);

  // Update boundingBox if it changes
  useEffect(() => {
    if (boardRef.current && initializedRef.current) {
      try {
        boardRef.current.setBoundingBox(boundingBox, true);
      } catch (error) {
        console.error("Error updating boundingBox:", error);
      }
    }
  }, [boundingBox]);

  return <div id={id} className="jxgbox" ref={containerRef} style={{ width, height }} />;
});

// Helper to compare dependencies
function depsEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// Set display name for development
JSXGraphBoard.displayName = 'JSXGraphBoard';

export default JSXGraphBoard;