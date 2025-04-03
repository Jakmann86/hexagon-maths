import React, { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';

const JSXGraphBoard = ({ 
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

  // Initialize the board on mount
  useEffect(() => {
    if (!containerRef.current) return;
    
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
    
    // Call the onMount callback with the board instance
    onMount(board);
    
    // Clean up
    return () => {
      JXG.JSXGraph.freeBoard(board);
    };
  }, [id]); // Only recreate board if ID changes

  // Handle updates to the board
// Handle updates to the board
useEffect(() => {
  if (boardRef.current && onUpdate) {
    // Clear the board before updating
    boardRef.current.suspendUpdate();
    
    try {
      // This is a safer way to clear elements
      Object.keys(boardRef.current.objects).forEach(key => {
        const obj = boardRef.current.objects[key];
        if (obj && obj.type !== undefined && obj.board !== undefined) {
          boardRef.current.removeObject(obj);
        }
      });
    } catch (e) {
      console.log("Error clearing board:", e);
    }
    
    // Run the update function
    onUpdate(boardRef.current);
    
    boardRef.current.unsuspendUpdate();
  }
}, [...dependencies]);

  return <div id={id} className="jxgbox" ref={containerRef} style={{ width, height }} />;
};

export default JSXGraphBoard;