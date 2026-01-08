// src/worksheets/renderers/CoordinateRenderer.js
// Static SVG generation for coordinate grids with points
// Used for PDF generation - no React state/interactivity
// V1.0

/**
 * Generate static SVG for a coordinate grid with two points
 * Shows the distance problem setup with right-triangle helper lines
 * 
 * @param {Object} config - Configuration
 * @param {Array} config.pointA - First point [x, y]
 * @param {Array} config.pointB - Second point [x, y]
 * @param {number} config.width - SVG width
 * @param {number} config.svgHeight - SVG height
 * @param {boolean} config.showGrid - Whether to show grid lines
 * @param {boolean} config.showHelperLines - Whether to show the right-triangle helper
 * @returns {string} SVG string
 */
export const renderCoordinateGrid = ({
  pointA = [2, 1],
  pointB = [8, 9],
  width = 200,
  svgHeight = 150,
  showGrid = false,
  showHelperLines = true,
}) => {
  const padding = 20;
  
  // Calculate bounds (handle negative coordinates)
  const minX = Math.min(pointA[0], pointB[0], 0) - 1;
  const maxX = Math.max(pointA[0], pointB[0], 0) + 1;
  const minY = Math.min(pointA[1], pointB[1], 0) - 1;
  const maxY = Math.max(pointA[1], pointB[1], 0) + 1;
  
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;
  
  // Available drawing area
  const drawWidth = width - 2 * padding;
  const drawHeight = svgHeight - 2 * padding;
  
  // Scale to fit
  const scale = Math.min(drawWidth / rangeX, drawHeight / rangeY) * 0.85;
  
  // Origin position in SVG coordinates
  const originX = padding + (-minX) * scale;
  const originY = svgHeight - padding - (-minY) * scale; // Flip Y axis
  
  // Convert point to SVG coordinates
  const toSVG = (point) => ({
    x: originX + point[0] * scale,
    y: originY - point[1] * scale, // Flip Y
  });
  
  const svgA = toSVG(pointA);
  const svgB = toSVG(pointB);
  
  // Axis endpoints
  const axisLeft = padding;
  const axisRight = width - padding;
  const axisBottom = svgHeight - padding;
  const axisTop = padding;
  
  // Grid lines (optional)
  let gridLines = '';
  if (showGrid) {
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
      const svgX = originX + x * scale;
      gridLines += `<line x1="${svgX}" y1="${axisTop}" x2="${svgX}" y2="${axisBottom}" stroke="#e5e7eb" stroke-width="0.5"/>`;
    }
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
      const svgY = originY - y * scale;
      gridLines += `<line x1="${axisLeft}" y1="${svgY}" x2="${axisRight}" y2="${svgY}" stroke="#e5e7eb" stroke-width="0.5"/>`;
    }
  }
  
  // Helper lines (right triangle)
  let helperLines = '';
  if (showHelperLines) {
    helperLines = `
      <!-- Horizontal helper line -->
      <line 
        x1="${svgA.x}" y1="${svgA.y}" 
        x2="${svgB.x}" y2="${svgA.y}" 
        stroke="#9ca3af" 
        stroke-width="1" 
        stroke-dasharray="3,2"
      />
      <!-- Vertical helper line -->
      <line 
        x1="${svgB.x}" y1="${svgA.y}" 
        x2="${svgB.x}" y2="${svgB.y}" 
        stroke="#9ca3af" 
        stroke-width="1" 
        stroke-dasharray="3,2"
      />
      <!-- Right angle marker -->
      <path 
        d="M ${svgB.x - 6} ${svgA.y} L ${svgB.x - 6} ${svgA.y + (svgB.y > svgA.y ? -6 : 6)} L ${svgB.x} ${svgA.y + (svgB.y > svgA.y ? -6 : 6)}" 
        fill="none" 
        stroke="#9ca3af" 
        stroke-width="1"
      />
    `;
  }
  
  // Point labels
  const labelA = `A(${pointA[0]}, ${pointA[1]})`;
  const labelB = `B(${pointB[0]}, ${pointB[1]})`;
  
  // Adjust label positions to avoid overlap
  const labelAOffset = pointA[1] < pointB[1] ? { x: -5, y: 12 } : { x: -5, y: -8 };
  const labelBOffset = pointA[1] < pointB[1] ? { x: 5, y: -8 } : { x: 5, y: 12 };
  
  return `
    <svg 
      width="${width}" 
      height="${svgHeight}" 
      viewBox="0 0 ${width} ${svgHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background -->
      <rect width="${width}" height="${svgHeight}" fill="#f8fafc"/>
      
      <!-- Grid lines -->
      ${gridLines}
      
      <!-- X axis -->
      <line 
        x1="${axisLeft}" y1="${originY}" 
        x2="${axisRight}" y2="${originY}" 
        stroke="#374151" 
        stroke-width="1"
      />
      <!-- X axis arrow -->
      <polygon points="${axisRight},${originY} ${axisRight-5},${originY-3} ${axisRight-5},${originY+3}" fill="#374151"/>
      
      <!-- Y axis -->
      <line 
        x1="${originX}" y1="${axisBottom}" 
        x2="${originX}" y2="${axisTop}" 
        stroke="#374151" 
        stroke-width="1"
      />
      <!-- Y axis arrow -->
      <polygon points="${originX},${axisTop} ${originX-3},${axisTop+5} ${originX+3},${axisTop+5}" fill="#374151"/>
      
      <!-- Axis labels -->
      <text x="${axisRight - 5}" y="${originY + 12}" font-family="Helvetica" font-size="9" fill="#6b7280">x</text>
      <text x="${originX + 8}" y="${axisTop + 5}" font-family="Helvetica" font-size="9" fill="#6b7280">y</text>
      
      <!-- Origin label (if visible) -->
      ${minX <= 0 && maxX >= 0 && minY <= 0 && maxY >= 0 ? 
        `<text x="${originX - 8}" y="${originY + 12}" font-family="Helvetica" font-size="8" fill="#6b7280">O</text>` : ''}
      
      <!-- Helper lines -->
      ${helperLines}
      
      <!-- Distance line (dashed) -->
      <line 
        x1="${svgA.x}" y1="${svgA.y}" 
        x2="${svgB.x}" y2="${svgB.y}" 
        stroke="#1e293b" 
        stroke-width="1.5" 
        stroke-dasharray="4,3"
      />
      
      <!-- Point A -->
      <circle cx="${svgA.x}" cy="${svgA.y}" r="4" fill="#3b82f6"/>
      <text 
        x="${svgA.x + labelAOffset.x}" 
        y="${svgA.y + labelAOffset.y}" 
        font-family="Helvetica" 
        font-size="9" 
        fill="#374151"
        text-anchor="${labelAOffset.x < 0 ? 'end' : 'start'}"
      >${labelA}</text>
      
      <!-- Point B -->
      <circle cx="${svgB.x}" cy="${svgB.y}" r="4" fill="#3b82f6"/>
      <text 
        x="${svgB.x + labelBOffset.x}" 
        y="${svgB.y + labelBOffset.y}" 
        font-family="Helvetica" 
        font-size="9" 
        fill="#374151"
        text-anchor="${labelBOffset.x < 0 ? 'end' : 'start'}"
      >${labelB}</text>
    </svg>
  `.trim();
};

export default {
  renderCoordinateGrid,
};