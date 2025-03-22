// src/components/math/TransparentMafs.jsx
import React, { useEffect, useRef } from 'react';
import * as MafsLib from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * TransparentMafs - A wrapper around the Mafs component that forces transparency
 * This is a more aggressive approach to ensure transparent backgrounds
 */
const TransparentMafs = ({ children, className = '', ...props }) => {
  const mafsRef = useRef(null);
  
  // Force transparency after rendering
  useEffect(() => {
    if (mafsRef.current) {
      // Get all SVG elements
      const svgElements = mafsRef.current.querySelectorAll('svg');
      svgElements.forEach(svg => {
        svg.style.background = 'transparent';
      });
      
      // Get container
      const container = mafsRef.current.querySelector('.mafs-container');
      if (container) {
        container.style.background = 'transparent';
        container.style.setProperty('--mafs-bg', 'transparent');
      }
    }
  }, []);
  
  return (
    <div 
      ref={mafsRef}
      className={`transparent-mafs-wrapper ${className}`}
      style={{ background: 'transparent' }}
    >
      <MafsLib.Mafs
        {...props}
        className={`mafs-transparent ${className}`}
        style={{
          '--mafs-bg': 'transparent',
          background: 'transparent',
          ...props.style
        }}
      >
        {children}
      </MafsLib.Mafs>
    </div>
  );
};

export default TransparentMafs;