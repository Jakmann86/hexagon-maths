// src/components/math/MafsWrapper.jsx
import React, { useRef, useEffect } from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * A consistent wrapper around Mafs components that handles styling issues
 * 
 * @param {Object} props - All props are passed to the underlying Mafs component
 * @param {Object} props.viewBox - The view box configuration (e.g., { x: [-5, 5], y: [-5, 5] })
 * @param {number} props.height - Height of the Mafs component
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {string} props.background - Background color ('transparent', 'white', or any valid color)
 * @param {string} props.textColor - Text color (default: 'black')
 */
const MafsWrapper = ({
  viewBox = { x: [-5, 5], y: [-5, 5] },
  height = 300,
  width = null,
  className = '',
  style = {},
  background = 'transparent',
  textColor = 'black',
  children,
  ...otherProps
}) => {
  const mafsRef = useRef(null);
  
  // Apply styling after component mounts
  useEffect(() => {
    if (!mafsRef.current) return;
    
    // More aggressive styling approach
    const applyStyles = () => {
      // Get the Mafs container and all SVG elements
      const container = mafsRef.current.querySelector('.mafs-container');
      const svgElements = mafsRef.current.querySelectorAll('svg');
      const rects = mafsRef.current.querySelectorAll('rect');
      
      if (container) {
        // Apply styles to container with !important
        container.style.setProperty('--mafs-bg', background, 'important');
        container.style.setProperty('background', background, 'important');
        container.style.setProperty('--mafs-fg', textColor, 'important');
      }
      
      // Apply styles to all SVG elements
      svgElements.forEach(svg => {
        svg.style.setProperty('background', background, 'important');
        
        // Find and modify the background rect if it exists
        const bgRect = svg.querySelector('rect[width="100%"][height="100%"]');
        if (bgRect) {
          bgRect.setAttribute('fill', background);
          bgRect.style.fill = background;
        }
      });
      
      // Target any background rectangles
      rects.forEach(rect => {
        const width = rect.getAttribute('width');
        const height = rect.getAttribute('height');
        // If this looks like a background rectangle
        if ((width === '100%' || width === '100') && (height === '100%' || height === '100')) {
          rect.setAttribute('fill', background);
          rect.style.fill = background;
        }
      });
      
      // Fix text colors in SVG
      const textElements = mafsRef.current.querySelectorAll('text');
      textElements.forEach(text => {
        if (!text.getAttribute('fill') || text.getAttribute('fill') === 'currentColor') {
          text.setAttribute('fill', textColor);
        }
      });
    };
    
    // Apply immediately
    applyStyles();
    
    // And also after a small delay to catch any elements that might render later
    setTimeout(applyStyles, 100);
    setTimeout(applyStyles, 500);
  }, [background, textColor]);
  
  // Calculate width if not provided (maintain aspect ratio)
  const calculatedWidth = width || height;
  
  return (
    <div 
      ref={mafsRef}
      className={`mafs-wrapper ${className}`}
      style={{ width: '100%', height: `${height}px` }}
    >
      <MafsLib.Mafs
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        height={height}
        width={calculatedWidth}
        style={{
          '--mafs-bg': background,
          '--mafs-fg': textColor,
          background: background,
          ...style
        }}
        {...otherProps}
      >
        {children}
      </MafsLib.Mafs>
    </div>
  );
};

export default MafsWrapper;