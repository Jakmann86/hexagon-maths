// src/worksheets/renderers/TriangleRenderer.js
// Static SVG generation for right-angled triangles
// Used for PDF generation - no React state/interactivity
// V1.0

/**
 * Calculate triangle points based on dimensions and orientation
 */
const calculateTrianglePoints = (base, height, orientation, svgWidth, svgHeight) => {
  const padding = 25;
  const maxBase = svgWidth - 2 * padding;
  const maxHeight = svgHeight - 2 * padding - 15;
  
  // Scale to fit
  const scale = Math.min(maxBase / base, maxHeight / height) * 0.75;
  const scaledBase = base * scale;
  const scaledHeight = height * scale;
  
  // Center in SVG
  const startX = (svgWidth - scaledBase) / 2;
  const startY = svgHeight - padding - 10;
  
  // Default orientation: right angle at bottom-left
  let points = {
    rightAngle: { x: startX, y: startY },
    baseEnd: { x: startX + scaledBase, y: startY },
    top: { x: startX, y: startY - scaledHeight },
  };
  
  // Apply orientation transformations
  switch (orientation) {
    case 'flip':
      // Right angle at bottom-right
      points = {
        rightAngle: { x: startX + scaledBase, y: startY },
        baseEnd: { x: startX, y: startY },
        top: { x: startX + scaledBase, y: startY - scaledHeight },
      };
      break;
    case 'rotate90':
      // Right angle at top-left
      points = {
        rightAngle: { x: startX, y: startY - scaledHeight },
        baseEnd: { x: startX, y: startY },
        top: { x: startX + scaledBase, y: startY - scaledHeight },
      };
      break;
    case 'rotate270':
      // Right angle at bottom-right, triangle going up-left
      points = {
        rightAngle: { x: startX + scaledBase, y: startY },
        baseEnd: { x: startX + scaledBase, y: startY - scaledHeight },
        top: { x: startX, y: startY },
      };
      break;
    default:
      // Keep default
      break;
  }
  
  return points;
};

/**
 * Generate right angle marker SVG path
 */
const renderRightAngleMarker = (points, size = 10) => {
  const { rightAngle, baseEnd, top } = points;
  
  // Determine direction vectors
  const toBase = {
    x: (baseEnd.x - rightAngle.x) / Math.sqrt((baseEnd.x - rightAngle.x) ** 2 + (baseEnd.y - rightAngle.y) ** 2),
    y: (baseEnd.y - rightAngle.y) / Math.sqrt((baseEnd.x - rightAngle.x) ** 2 + (baseEnd.y - rightAngle.y) ** 2),
  };
  const toTop = {
    x: (top.x - rightAngle.x) / Math.sqrt((top.x - rightAngle.x) ** 2 + (top.y - rightAngle.y) ** 2),
    y: (top.y - rightAngle.y) / Math.sqrt((top.x - rightAngle.x) ** 2 + (top.y - rightAngle.y) ** 2),
  };
  
  const p1 = { x: rightAngle.x + toBase.x * size, y: rightAngle.y + toBase.y * size };
  const p2 = { x: rightAngle.x + toBase.x * size + toTop.x * size, y: rightAngle.y + toBase.y * size + toTop.y * size };
  const p3 = { x: rightAngle.x + toTop.x * size, y: rightAngle.y + toTop.y * size };
  
  return `
    <path 
      d="M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}" 
      fill="none" 
      stroke="#6b7280" 
      stroke-width="1"
    />
  `;
};

/**
 * Calculate label positions for each side
 */
const calculateLabelPositions = (points, base, height, hypotenuse) => {
  const { rightAngle, baseEnd, top } = points;
  
  return {
    base: {
      x: (rightAngle.x + baseEnd.x) / 2,
      y: Math.max(rightAngle.y, baseEnd.y) + 15,
      anchor: 'middle',
    },
    height: {
      x: Math.min(rightAngle.x, top.x) - 12,
      y: (rightAngle.y + top.y) / 2,
      anchor: 'end',
    },
    hypotenuse: {
      x: (baseEnd.x + top.x) / 2 + 10,
      y: (baseEnd.y + top.y) / 2 - 5,
      anchor: 'start',
    },
  };
};

/**
 * Render a text label
 */
const renderLabel = (text, position, fontSize = 11) => {
  return `
    <text 
      x="${position.x}" 
      y="${position.y}" 
      text-anchor="${position.anchor || 'middle'}"
      font-family="Helvetica, Arial, sans-serif"
      font-size="${fontSize}"
      fill="#374151"
    >${text}</text>
  `;
};

/**
 * Generate static SVG string for a right triangle
 * 
 * @param {Object} config - Triangle configuration
 * @param {number} config.base - Base length
 * @param {number} config.height - Height length
 * @param {number} config.hypotenuse - Hypotenuse length
 * @param {string} config.unknownSide - Which side is unknown: 'base', 'height', or 'hypotenuse'
 * @param {Object} config.labels - Custom labels { base, height, hypotenuse }
 * @param {string} config.orientation - Triangle orientation
 * @param {number} config.width - SVG width
 * @param {number} config.svgHeight - SVG height
 * @param {boolean} config.showRightAngle - Whether to show right angle marker
 * @param {string} config.units - Unit label (default 'cm')
 * @returns {string} SVG string
 */
export const renderRightTriangle = ({
  base = 3,
  height = 4,
  hypotenuse = 5,
  unknownSide = 'hypotenuse',
  labels: customLabels = null,
  orientation = 'default',
  width = 180,
  svgHeight = 160,
  showRightAngle = true,
  units = 'cm',
}) => {
  // Calculate hypotenuse if not provided
  const calcHyp = hypotenuse || Math.round(Math.sqrt(base*base + height*height) * 10) / 10;
  
  // Calculate points
  const points = calculateTrianglePoints(base, height, orientation, width, svgHeight);
  const { rightAngle, baseEnd, top } = points;
  
  // Use custom labels if provided, otherwise generate from values
  const labels = customLabels || {
    base: unknownSide === 'base' ? 'x' : `${base} ${units}`,
    height: unknownSide === 'height' ? 'x' : `${height} ${units}`,
    hypotenuse: unknownSide === 'hypotenuse' ? 'x' : `${calcHyp} ${units}`,
  };
  
  // Calculate label positions
  const labelPositions = calculateLabelPositions(points, base, height, calcHyp);
  
  // Build SVG
  return `
    <svg 
      width="${width}" 
      height="${svgHeight}" 
      viewBox="0 0 ${width} ${svgHeight}"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Background -->
      <rect width="${width}" height="${svgHeight}" fill="#f8fafc"/>
      
      <!-- Triangle fill -->
      <polygon 
        points="${rightAngle.x},${rightAngle.y} ${baseEnd.x},${baseEnd.y} ${top.x},${top.y}" 
        fill="#e0f2fe" 
        stroke="#1e293b" 
        stroke-width="1.5"
      />
      
      <!-- Right angle marker -->
      ${showRightAngle ? renderRightAngleMarker(points) : ''}
      
      <!-- Labels -->
      ${renderLabel(labels.base, labelPositions.base)}
      ${renderLabel(labels.height, labelPositions.height)}
      ${renderLabel(labels.hypotenuse, labelPositions.hypotenuse)}
    </svg>
  `.trim();
};

/**
 * Generate static SVG for an isosceles triangle with height line
 */
export const renderIsoscelesTriangle = ({
  base = 10,
  equalSide = 13,
  height = null,
  showHeight = true,
  labels: customLabels = null,
  width = 180,
  svgHeight = 160,
  units = 'cm',
}) => {
  const padding = 20;
  
  // Calculate height if not provided
  const halfBase = base / 2;
  const calculatedHeight = height || Math.sqrt(equalSide * equalSide - halfBase * halfBase);
  
  // Scale to fit
  const maxWidth = width - 2 * padding;
  const maxHeight = svgHeight - 2 * padding - 20;
  const scale = Math.min(maxWidth / base, maxHeight / calculatedHeight) * 0.7;
  
  const scaledBase = base * scale;
  const scaledHeight = calculatedHeight * scale;
  
  // Triangle points (apex at top center)
  const apexX = width / 2;
  const apexY = padding + 10;
  const leftX = (width - scaledBase) / 2;
  const rightX = leftX + scaledBase;
  const baseY = apexY + scaledHeight;
  
  // Use custom labels if provided
  const labels = customLabels || {
    base: `${base} ${units}`,
    equalSide: `${equalSide} ${units}`,
    height: showHeight ? 'h = ?' : ''
  };
  
  return `
    <svg 
      width="${width}" 
      height="${svgHeight}" 
      viewBox="0 0 ${width} ${svgHeight}"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Background -->
      <rect width="${width}" height="${svgHeight}" fill="#f8fafc"/>
      
      <!-- Triangle fill -->
      <polygon 
        points="${leftX},${baseY} ${rightX},${baseY} ${apexX},${apexY}" 
        fill="#fef3c7" 
        stroke="#1e293b" 
        stroke-width="1.5"
      />
      
      <!-- Height line (dashed) -->
      <line 
        x1="${apexX}" y1="${apexY}" 
        x2="${apexX}" y2="${baseY}" 
        stroke="#6b7280" 
        stroke-width="1" 
        stroke-dasharray="4,3"
      />
      
      <!-- Right angle marker at base -->
      <path 
        d="M ${apexX - 8} ${baseY} L ${apexX - 8} ${baseY - 8} L ${apexX} ${baseY - 8}" 
        fill="none" 
        stroke="#6b7280" 
        stroke-width="1"
      />
      
      <!-- Labels -->
      <text x="${width / 2}" y="${baseY + 15}" text-anchor="middle" font-family="Helvetica" font-size="10" fill="#374151">${labels.base}</text>
      <text x="${leftX - 8}" y="${(apexY + baseY) / 2}" text-anchor="end" font-family="Helvetica" font-size="10" fill="#374151">${labels.equalSide}</text>
      ${labels.height ? `<text x="${apexX + 8}" y="${(apexY + baseY) / 2}" text-anchor="start" font-family="Helvetica" font-size="10" fill="#374151">${labels.height}</text>` : ''}
    </svg>
  `.trim();
};

export default {
  renderRightTriangle,
  renderIsoscelesTriangle,
};