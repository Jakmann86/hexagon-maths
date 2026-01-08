// src/worksheets/renderers/ContextRenderer.js
// Static SVG generation for real-world context diagrams
// TV diagonal, ladder against wall, ship navigation, etc.
// V1.0

/**
 * Render a rectangle with diagonal (TV screen, pitch)
 */
export const renderRectangleDiagonal = ({
  width: rectWidth = 80,
  height: rectHeight = 60,
  context = 'TV', // 'TV' or 'pitch'
  svgWidth = 200,
  svgHeight = 150,
  units = 'cm',
}) => {
  const padding = 25;
  
  // Scale rectangle to fit
  const maxWidth = svgWidth - 2 * padding;
  const maxHeight = svgHeight - 2 * padding - 20;
  const scale = Math.min(maxWidth / rectWidth, maxHeight / rectHeight) * 0.7;
  
  const scaledWidth = rectWidth * scale;
  const scaledHeight = rectHeight * scale;
  
  // Position rectangle
  const rx = (svgWidth - scaledWidth) / 2;
  const ry = (svgHeight - scaledHeight) / 2 - 5;
  
  // Context-specific styling
  const contextStyles = {
    TV: { fill: '#1e293b', label: 'TV Screen' },
    pitch: { fill: '#22c55e', label: 'Pitch' },
    rectangle: { fill: '#e2e8f0', label: '' },
  };
  const style = contextStyles[context] || contextStyles.rectangle;
  
  // Unit based on context
  const displayUnits = context === 'pitch' ? 'm' : units;
  
  return `
    <svg 
      width="${svgWidth}" 
      height="${svgHeight}" 
      viewBox="0 0 ${svgWidth} ${svgHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background -->
      <rect width="${svgWidth}" height="${svgHeight}" fill="#f8fafc"/>
      
      <!-- Rectangle -->
      <rect 
        x="${rx}" y="${ry}" 
        width="${scaledWidth}" height="${scaledHeight}" 
        fill="${style.fill}" 
        fill-opacity="0.1"
        stroke="#374151" 
        stroke-width="1.5"
      />
      
      <!-- Diagonal (dashed) -->
      <line 
        x1="${rx}" y1="${ry + scaledHeight}" 
        x2="${rx + scaledWidth}" y2="${ry}" 
        stroke="#ef4444" 
        stroke-width="2" 
        stroke-dasharray="5,3"
      />
      
      <!-- Width label -->
      <text 
        x="${rx + scaledWidth / 2}" 
        y="${ry + scaledHeight + 15}" 
        text-anchor="middle" 
        font-family="Helvetica" 
        font-size="10" 
        fill="#374151"
      >${rectWidth} ${displayUnits}</text>
      
      <!-- Height label -->
      <text 
        x="${rx + scaledWidth + 10}" 
        y="${ry + scaledHeight / 2}" 
        text-anchor="start" 
        font-family="Helvetica" 
        font-size="10" 
        fill="#374151"
      >${rectHeight} ${displayUnits}</text>
      
      <!-- Diagonal label -->
      <text 
        x="${rx + scaledWidth / 2}" 
        y="${ry + scaledHeight / 2 - 5}" 
        text-anchor="middle" 
        font-family="Helvetica" 
        font-size="11" 
        font-weight="bold"
        fill="#ef4444"
      >?</text>
      
      <!-- Context label (if any) -->
      ${style.label ? `
        <text 
          x="${svgWidth / 2}" 
          y="${padding - 5}" 
          text-anchor="middle" 
          font-family="Helvetica" 
          font-size="9" 
          fill="#6b7280"
        >${style.label}</text>
      ` : ''}
    </svg>
  `.trim();
};

/**
 * Render a ladder against wall diagram
 */
export const renderLadderWall = ({
  ladderLength = 5,
  distanceFromWall = 1.5,
  svgWidth = 200,
  svgHeight = 150,
  units = 'm',
}) => {
  const padding = 20;
  
  // Calculate height using Pythagoras (for diagram scaling)
  const wallHeight = Math.sqrt(ladderLength * ladderLength - distanceFromWall * distanceFromWall);
  
  // Scale to fit
  const maxWidth = svgWidth - 2 * padding - 30;
  const maxHeight = svgHeight - 2 * padding - 20;
  const scale = Math.min(maxWidth / distanceFromWall, maxHeight / wallHeight) * 0.6;
  
  // Positions
  const wallX = padding + 30;
  const groundY = svgHeight - padding - 10;
  const wallTop = groundY - wallHeight * scale;
  const ladderBottomX = wallX + distanceFromWall * scale;
  
  return `
    <svg 
      width="${svgWidth}" 
      height="${svgHeight}" 
      viewBox="0 0 ${svgWidth} ${svgHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background -->
      <rect width="${svgWidth}" height="${svgHeight}" fill="#f8fafc"/>
      
      <!-- Wall (thick line) -->
      <line 
        x1="${wallX}" y1="${groundY}" 
        x2="${wallX}" y2="${wallTop - 20}" 
        stroke="#374151" 
        stroke-width="4"
      />
      
      <!-- Wall bricks pattern -->
      <rect x="${wallX - 15}" y="${wallTop - 10}" width="15" height="${groundY - wallTop + 10}" fill="#fef3c7" stroke="#374151" stroke-width="1"/>
      
      <!-- Ground -->
      <line 
        x1="${wallX - 20}" y1="${groundY}" 
        x2="${ladderBottomX + 30}" y2="${groundY}" 
        stroke="#374151" 
        stroke-width="2"
      />
      
      <!-- Ladder -->
      <line 
        x1="${ladderBottomX}" y1="${groundY}" 
        x2="${wallX}" y2="${wallTop}" 
        stroke="#92400e" 
        stroke-width="3"
      />
      
      <!-- Distance from wall label -->
      <line 
        x1="${wallX}" y1="${groundY + 8}" 
        x2="${ladderBottomX}" y2="${groundY + 8}" 
        stroke="#374151" 
        stroke-width="1"
      />
      <text 
        x="${(wallX + ladderBottomX) / 2}" 
        y="${groundY + 20}" 
        text-anchor="middle" 
        font-family="Helvetica" 
        font-size="10" 
        fill="#374151"
      >${distanceFromWall} ${units}</text>
      
      <!-- Ladder length label -->
      <text 
        x="${(wallX + ladderBottomX) / 2 + 15}" 
        y="${(groundY + wallTop) / 2}" 
        text-anchor="start" 
        font-family="Helvetica" 
        font-size="10" 
        fill="#374151"
      >${ladderLength} ${units}</text>
      
      <!-- Height (unknown) label -->
      <text 
        x="${wallX - 20}" 
        y="${(groundY + wallTop) / 2}" 
        text-anchor="end" 
        font-family="Helvetica" 
        font-size="11" 
        font-weight="bold"
        fill="#ef4444"
      >?</text>
      
      <!-- Right angle marker -->
      <path 
        d="M ${wallX + 8} ${groundY} L ${wallX + 8} ${groundY - 8} L ${wallX} ${groundY - 8}" 
        fill="none" 
        stroke="#6b7280" 
        stroke-width="1"
      />
    </svg>
  `.trim();
};

/**
 * Render a navigation/journey diagram (ship sailing East then North)
 */
export const renderNavigation = ({
  eastDistance = 24,
  northDistance = 10,
  context = 'ship', // 'ship', 'walk', 'drive'
  svgWidth = 200,
  svgHeight = 150,
  units = 'km',
}) => {
  const padding = 25;
  
  // Scale to fit
  const maxWidth = svgWidth - 2 * padding - 20;
  const maxHeight = svgHeight - 2 * padding - 20;
  const scale = Math.min(maxWidth / eastDistance, maxHeight / northDistance) * 0.7;
  
  // Positions
  const startX = padding + 10;
  const startY = svgHeight - padding - 20;
  const eastEndX = startX + eastDistance * scale;
  const northEndY = startY - northDistance * scale;
  
  return `
    <svg 
      width="${svgWidth}" 
      height="${svgHeight}" 
      viewBox="0 0 ${svgWidth} ${svgHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background -->
      <rect width="${svgWidth}" height="${svgHeight}" fill="#f8fafc"/>
      
      <!-- Compass indicator -->
      <text x="${svgWidth - padding}" y="${padding}" text-anchor="end" font-family="Helvetica" font-size="8" fill="#6b7280">N↑</text>
      
      <!-- East line -->
      <line 
        x1="${startX}" y1="${startY}" 
        x2="${eastEndX}" y2="${startY}" 
        stroke="#3b82f6" 
        stroke-width="2"
      />
      <!-- East arrow -->
      <polygon points="${eastEndX},${startY} ${eastEndX-6},${startY-3} ${eastEndX-6},${startY+3}" fill="#3b82f6"/>
      
      <!-- North line -->
      <line 
        x1="${eastEndX}" y1="${startY}" 
        x2="${eastEndX}" y2="${northEndY}" 
        stroke="#3b82f6" 
        stroke-width="2"
      />
      <!-- North arrow -->
      <polygon points="${eastEndX},${northEndY} ${eastEndX-3},${northEndY+6} ${eastEndX+3},${northEndY+6}" fill="#3b82f6"/>
      
      <!-- Direct line (dashed) -->
      <line 
        x1="${startX}" y1="${startY}" 
        x2="${eastEndX}" y2="${northEndY}" 
        stroke="#ef4444" 
        stroke-width="2" 
        stroke-dasharray="5,3"
      />
      
      <!-- Start point -->
      <circle cx="${startX}" cy="${startY}" r="4" fill="#22c55e"/>
      <text x="${startX}" y="${startY + 15}" text-anchor="middle" font-family="Helvetica" font-size="8" fill="#374151">Start</text>
      
      <!-- End point -->
      <circle cx="${eastEndX}" cy="${northEndY}" r="4" fill="#ef4444"/>
      
      <!-- Right angle marker -->
      <path 
        d="M ${eastEndX - 8} ${startY} L ${eastEndX - 8} ${startY - 8} L ${eastEndX} ${startY - 8}" 
        fill="none" 
        stroke="#6b7280" 
        stroke-width="1"
      />
      
      <!-- East label -->
      <text 
        x="${(startX + eastEndX) / 2}" 
        y="${startY + 15}" 
        text-anchor="middle" 
        font-family="Helvetica" 
        font-size="10" 
        fill="#374151"
      >${eastDistance} ${units} East</text>
      
      <!-- North label -->
      <text 
        x="${eastEndX + 10}" 
        y="${(startY + northEndY) / 2}" 
        text-anchor="start" 
        font-family="Helvetica" 
        font-size="10" 
        fill="#374151"
      >${northDistance} ${units} North</text>
      
      <!-- Direct distance label -->
      <text 
        x="${(startX + eastEndX) / 2 - 10}" 
        y="${(startY + northEndY) / 2}" 
        text-anchor="end" 
        font-family="Helvetica" 
        font-size="11" 
        font-weight="bold"
        fill="#ef4444"
      >?</text>
    </svg>
  `.trim();
};

/**
 * Main export - renders any context diagram based on type
 */
export const renderContextDiagram = (config) => {
  const { type, context } = config;
  
  switch (type || context) {
    case 'rectangle-diagonal':
    case 'TV':
    case 'pitch':
      return renderRectangleDiagonal(config);
    
    case 'ladder':
      return renderLadderWall(config);
    
    case 'navigation':
    case 'ship':
      return renderNavigation(config);
    
    default:
      console.warn(`Unknown context diagram type: ${type || context}`);
      return renderRectangleDiagonal(config);
  }
};

export default {
  renderRectangleDiagonal,
  renderLadderWall,
  renderNavigation,
  renderContextDiagram,
};