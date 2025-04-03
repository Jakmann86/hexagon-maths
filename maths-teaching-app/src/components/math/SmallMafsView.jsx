// src/components/math/SmallMafsView.jsx
import React, { useRef, useEffect } from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * A small, transparent Mafs visualization component specifically designed
 * for use in starter question boxes with minimal impact on layout.
 * 
 * @param {Object} props
 * @param {Object} props.viewBox - The view box configuration { x: [min, max], y: [min, max] }
 * @param {number} props.height - Height in pixels (default: 120)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showGrid - Whether to show the coordinate grid
 * @param {string} props.textColor - Text color for labels
 */
const SmallMafsView = ({
  viewBox = { x: [-5, 5], y: [-5, 5] },
  height = 120,
  className = '',
  showGrid = false,
  textColor = '#333',
  children,
  ...props
}) => {
  const mafsRef = useRef(null);
  
  // Apply aggressive styling to ensure transparency after component mounts
  useEffect(() => {
    if (!mafsRef.current) return;
    
    const applyTransparency = () => {
      try {
        // Get all SVG elements and containers
        const container = mafsRef.current.querySelector('.mafs-container');
        const svgElements = mafsRef.current.querySelectorAll('svg');
        const rects = mafsRef.current.querySelectorAll('rect');
        
        // Apply styles to container
        if (container) {
          container.style.setProperty('--mafs-bg', 'transparent', 'important');
          container.style.setProperty('background', 'transparent', 'important');
          container.style.setProperty('--mafs-fg', textColor, 'important');
        }
        
        // Apply styles to all SVG elements
        svgElements.forEach(svg => {
          svg.style.setProperty('background', 'transparent', 'important');
        });
        
        // Target any background rectangles
        rects.forEach(rect => {
          const width = rect.getAttribute('width');
          const height = rect.getAttribute('height');
          // If this looks like a background rectangle
          if ((width === '100%' || width === '100') && (height === '100%' || height === '100')) {
            rect.setAttribute('fill', 'transparent');
            rect.style.fill = 'transparent';
          }
        });
        
        // Fix text colors
        const textElements = mafsRef.current.querySelectorAll('text');
        textElements.forEach(text => {
          text.setAttribute('fill', textColor);
        });
      } catch (error) {
        // Silently fail on errors to not disrupt rendering
        console.error('Error applying transparency:', error);
      }
    };
    
    // Apply immediately and after short delay to catch any lazily rendered elements
    applyTransparency();
    const timeoutId = setTimeout(applyTransparency, 50);
    
    return () => clearTimeout(timeoutId);
  }, [textColor]);
  
  return (
    <div 
      ref={mafsRef}
      className={`small-mafs-view overflow-visible ${className}`}
      style={{ 
        width: '100%', 
        height: `${height}px`,
        maxHeight: `${height}px`,
        background: 'transparent'
      }}
    >
      <MafsLib.Mafs
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        height={height}
        width="100%"
        style={{
          '--mafs-bg': 'transparent',
          '--mafs-fg': textColor,
          background: 'transparent'
        }}
        {...props}
      >
        {/* Optional grid */}
        {showGrid && (
          <MafsLib.Coordinates.Cartesian
            xAxis={{ variant: 'secondary', axisColor: '#ccc' }}
            yAxis={{ variant: 'secondary', axisColor: '#ccc' }}
          />
        )}
        
        {children}
      </MafsLib.Mafs>
    </div>
  );
};

export default SmallMafsView;