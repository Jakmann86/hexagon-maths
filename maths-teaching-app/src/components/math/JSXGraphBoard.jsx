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
  useEffect(() => {
    if (boardRef.current && onUpdate) {
      // Suspend updates to improve performance
      boardRef.current.suspendUpdate();
      
      try {
        // Manually remove all elements
        const board = boardRef.current;
        const elements = Object.values(board.objects);
        
        elements.forEach(el => {
          if (el && el.remove) {
            el.remove();
          }
        });
        
        // Run the update function
        onUpdate(board);
      } catch (error) {
        console.error("Error in board update:", error);
      }
      
      // Resume updates
      boardRef.current.unsuspendUpdate();
    }
  }, [...dependencies]);

  return <div id={id} className="jxgbox" ref={containerRef} style={{ width, height }} />;
};

export default JSXGraphBoard;