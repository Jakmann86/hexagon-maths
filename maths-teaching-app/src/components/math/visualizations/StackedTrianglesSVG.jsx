// src/components/math/visualizations/StackedTrianglesSVG.jsx
// Composite/Stacked Triangles Visualization - V3.0
// 
// Two right triangles that SHARE a common side
//
// Arrangements:
// - 'back-to-back': Mirror image sharing vertical side (like a bowtie)
// - 'hypotenuse-to-height': T1's hypotenuse becomes T2's vertical side

import React from 'react';

const StackedTrianglesSVG = ({
  config = {},
  showAnswer = false,
  showStep = 0, // 0 = all, 1 = T1 highlighted, 2 = T2 highlighted
  className = ''
}) => {
  const {
    arrangement = 'back-to-back', // 'back-to-back' or 'hypotenuse-to-height'
    
    // Triangle 1: Left triangle (or bottom for hyp-to-height)
    triangle1 = {
      base: 6,
      height: 8,
      labels: { base: '6 cm', height: null, hypotenuse: '10 cm' },
      angle: null,
      showAngle: false,
      color: '#3498db'
    },
    
    // Triangle 2: Right triangle (or top for hyp-to-height)
    triangle2 = {
      base: 5,
      height: 8, // Should match T1's height for back-to-back (shared side)
      labels: { base: '5 cm', height: null, hypotenuse: 'x' },
      angle: 35,
      showAngle: true,
      color: '#e74c3c'
    },
    
    // The shared side
    sharedSide = {
      value: 8,
      label: '8 cm',
      showLabel: false,
      color: '#9b59b6',
      highlight: false
    },
    
    units = 'cm',
    showRightAngles = true,
    scale = 1
  } = config;

  // SVG dimensions
  const svgWidth = 340 * scale;
  const svgHeight = 220 * scale;
  const padding = 40;

  const t1 = triangle1;
  const t2 = triangle2;

  // Points for each arrangement
  let t1A, t1B, t1C; // T1: A=right angle vertex, B=base end, C=height end
  let t2A, t2B, t2C; // T2: A=right angle vertex, B=base end, C=height end
  let sharedStart, sharedEnd;

  if (arrangement === 'back-to-back') {
    // ============================================
    // BACK-TO-BACK: Mirror sharing vertical side
    // ============================================
    //
    //     T1C -------- T2C
    //      |\        /|
    //      | \      / |
    //      |  \    /  |
    //      |   \  /   |
    //      |    \/    |
    //      |    /\    |
    //      |   /  \   |
    //      |  /    \  |
    //      | /      \ |
    //      |/        \|
    //     T1A -------- T2A
    //      ^          ^
    //    T1 right   T2 right
    //    angle      angle
    //
    // Shared side: T1C to T1A (= T2C to T2A)
    
    const maxHeight = Math.max(t1.height, t2.height);
    const totalWidth = t1.base + t2.base;
    
    const drawScale = Math.min(
      (svgWidth - padding * 2) / totalWidth,
      (svgHeight - padding * 2) / maxHeight
    ) * 0.85;
    
    const s = drawScale;
    const sharedX = padding + t1.base * s; // X position of shared vertical side
    const bottomY = svgHeight - padding;
    const topY = bottomY - t1.height * s;
    
    // Triangle 1 (LEFT) - right angle at bottom of shared side
    t1A = { x: sharedX, y: bottomY };           // Right angle (bottom of shared)
    t1B = { x: sharedX - t1.base * s, y: bottomY }; // Base extends LEFT
    t1C = { x: sharedX, y: topY };               // Top of shared side
    
    // Triangle 2 (RIGHT) - right angle at bottom of shared side (mirrored)
    t2A = { x: sharedX, y: bottomY };           // Right angle (same point as T1A)
    t2B = { x: sharedX + t2.base * s, y: bottomY }; // Base extends RIGHT
    t2C = { x: sharedX, y: topY };               // Top of shared side (same as T1C)
    
    sharedStart = { x: sharedX, y: bottomY };
    sharedEnd = { x: sharedX, y: topY };
    
  } else if (arrangement === 'hypotenuse-to-height') {
    // ============================================
    // HYPOTENUSE-TO-HEIGHT: T1's hyp = T2's height
    // ============================================
    //
    //              T2C
    //               |\ 
    //               | \
    //               |  \  T2 hypotenuse
    //               |   \
    //     T1's      |    \
    //     hyp   T1C=T2A---T2B
    //        \      
    //         \     
    //          \    
    //           \   
    //            \  
    //     T1A-----T1B
    //
    // T1's hypotenuse (T1B to T1C) becomes T2's vertical side (T2A to T2C)
    
    // Calculate T1's hypotenuse length
    const t1Hyp = Math.sqrt(t1.base * t1.base + t1.height * t1.height);
    
    // T2's height IS T1's hypotenuse
    const t2ActualHeight = t1Hyp;
    
    const totalHeight = t1.height + t2ActualHeight * 0.7; // Some overlap visual
    const totalWidth = Math.max(t1.base, t2.base) + t1.base * 0.5;
    
    const drawScale = Math.min(
      (svgWidth - padding * 2) / totalWidth,
      (svgHeight - padding * 2) / totalHeight
    ) * 0.75;
    
    const s = drawScale;
    
    // Triangle 1 (BOTTOM) - standard orientation
    const t1BottomY = svgHeight - padding;
    const t1LeftX = padding + 20;
    
    t1A = { x: t1LeftX, y: t1BottomY };                    // Right angle
    t1B = { x: t1LeftX + t1.base * s, y: t1BottomY };      // Base end
    t1C = { x: t1LeftX, y: t1BottomY - t1.height * s };    // Height end
    
    // Triangle 2 (TOP-RIGHT) - its vertical side IS T1's hypotenuse
    // T2's right angle is at T1C, and T2 extends up and right
    // The "height" of T2 (vertical side) equals T1's hypotenuse length
    t2A = { x: t1C.x, y: t1C.y };                          // Right angle at T1's top
    t2B = { x: t1C.x + t2.base * s, y: t1C.y };            // Base extends right
    t2C = { x: t1C.x, y: t1C.y - t2ActualHeight * s };     // Height = T1's hyp length
    
    // Shared "side" is conceptual - T1's hypotenuse value = T2's height value
    // But visually we can highlight T2's vertical side
    sharedStart = t2A;
    sharedEnd = t2C;
  }

  // ============================================
  // RENDERING HELPERS
  // ============================================

  // Right angle marker
  const renderRightAngle = (vertex, p1, p2, color) => {
    const size = 10;
    
    const d1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
    const d2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
    const len1 = Math.hypot(d1.x, d1.y);
    const len2 = Math.hypot(d2.x, d2.y);
    
    if (len1 === 0 || len2 === 0) return null;
    
    const u1 = { x: d1.x / len1, y: d1.y / len1 };
    const u2 = { x: d2.x / len2, y: d2.y / len2 };
    
    const c1 = { x: vertex.x + u1.x * size, y: vertex.y + u1.y * size };
    const c2 = { x: vertex.x + u1.x * size + u2.x * size, y: vertex.y + u1.y * size + u2.y * size };
    const c3 = { x: vertex.x + u2.x * size, y: vertex.y + u2.y * size };
    
    return (
      <path
        d={`M ${c1.x} ${c1.y} L ${c2.x} ${c2.y} L ${c3.x} ${c3.y}`}
        fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.6"
      />
    );
  };

  // Angle arc
  const renderAngleArc = (vertex, p1, p2, angleDegrees, color) => {
    if (!angleDegrees) return null;
    
    const radius = 16;
    const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
    const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
    
    let diff = a2 - a1;
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    
    const sweep = diff > 0 ? 1 : 0;
    const start = { x: vertex.x + Math.cos(a1) * radius, y: vertex.y + Math.sin(a1) * radius };
    const end = { x: vertex.x + Math.cos(a2) * radius, y: vertex.y + Math.sin(a2) * radius };
    const mid = a1 + diff / 2;
    const labelR = radius + 14;
    
    return (
      <g>
        <path
          d={`M ${vertex.x} ${vertex.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweep} ${end.x} ${end.y} Z`}
          fill={color} fillOpacity="0.25"
        />
        <path
          d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweep} ${end.x} ${end.y}`}
          fill="none" stroke={color} strokeWidth="2"
        />
        <text
          x={vertex.x + Math.cos(mid) * labelR}
          y={vertex.y + Math.sin(mid) * labelR}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fontWeight="600" fill={color}
        >
          {angleDegrees}°
        </text>
      </g>
    );
  };

  // Label position (midpoint offset away from triangle center)
  // Increase offset for longer labels (3+ characters)
  const getLabelPos = (p1, p2, center, labelText) => {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return { x: mx, y: my };
    
    // Base offset, increased for longer labels
    const labelLength = labelText ? String(labelText).length : 0;
    const baseOffset = 18;
    const extraOffset = labelLength >= 6 ? 10 : labelLength >= 4 ? 6 : 0;
    const offset = baseOffset + extraOffset;
    
    // Perpendicular
    let px = -dy / len;
    let py = dx / len;
    
    // Away from center
    const test = { x: mx + px * 10, y: my + py * 10 };
    const distTest = Math.hypot(test.x - center.x, test.y - center.y);
    const distOpp = Math.hypot(mx - px * 10 - center.x, my - py * 10 - center.y);
    const sign = distTest > distOpp ? 1 : -1;
    
    return { x: mx + sign * px * offset, y: my + sign * py * offset };
  };

  // Centers
  const center1 = { x: (t1A.x + t1B.x + t1C.x) / 3, y: (t1A.y + t1B.y + t1C.y) / 3 };
  const center2 = { x: (t2A.x + t2B.x + t2C.x) / 3, y: (t2A.y + t2B.y + t2C.y) / 3 };

  // Opacity for step highlighting
  const op1 = showStep === 0 ? 1 : showStep === 1 ? 1 : 0.3;
  const op2 = showStep === 0 ? 1 : showStep === 2 ? 1 : 0.3;

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        {/* Shared side highlight */}
        {sharedSide.highlight && sharedStart && sharedEnd && (
          <line
            x1={sharedStart.x} y1={sharedStart.y}
            x2={sharedEnd.x} y2={sharedEnd.y}
            stroke={sharedSide.color} strokeWidth="5" strokeLinecap="round"
          />
        )}

        {/* Triangle 1 */}
        <g opacity={op1}>
          <polygon
            points={`${t1A.x},${t1A.y} ${t1B.x},${t1B.y} ${t1C.x},${t1C.y}`}
            fill={t1.color} fillOpacity="0.15"
            stroke={t1.color} strokeWidth="2.5" strokeLinejoin="round"
          />
          {showRightAngles && renderRightAngle(t1A, t1B, t1C, t1.color)}
          {t1.showAngle && renderAngleArc(t1B, t1A, t1C, t1.angle, t1.color)}
          
          {/* T1 Labels */}
          {t1.labels?.base && (() => {
            const pos = getLabelPos(t1A, t1B, center1, t1.labels.base);
            return <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill="#1a1a1a">{t1.labels.base}</text>;
          })()}
          {t1.labels?.height && (() => {
            const pos = getLabelPos(t1A, t1C, center1, t1.labels.height);
            return <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill="#1a1a1a">{t1.labels.height}</text>;
          })()}
          {t1.labels?.hypotenuse && (() => {
            const pos = getLabelPos(t1B, t1C, center1, t1.labels.hypotenuse);
            return <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill="#1a1a1a">{t1.labels.hypotenuse}</text>;
          })()}
        </g>

        {/* Triangle 2 */}
        <g opacity={op2}>
          <polygon
            points={`${t2A.x},${t2A.y} ${t2B.x},${t2B.y} ${t2C.x},${t2C.y}`}
            fill={t2.color} fillOpacity="0.15"
            stroke={t2.color} strokeWidth="2.5" strokeLinejoin="round"
          />
          {showRightAngles && renderRightAngle(t2A, t2B, t2C, t2.color)}
          {t2.showAngle && renderAngleArc(t2B, t2A, t2C, t2.angle, t2.color)}
          
          {/* T2 Labels */}
          {t2.labels?.base && (() => {
            const pos = getLabelPos(t2A, t2B, center2, t2.labels.base);
            return <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill="#1a1a1a">{t2.labels.base}</text>;
          })()}
          {t2.labels?.height && (() => {
            const pos = getLabelPos(t2A, t2C, center2, t2.labels.height);
            return <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill="#1a1a1a">{t2.labels.height}</text>;
          })()}
          {t2.labels?.hypotenuse && (() => {
            const pos = getLabelPos(t2B, t2C, center2, t2.labels.hypotenuse);
            return <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill="#1a1a1a">{t2.labels.hypotenuse}</text>;
          })()}
        </g>

        {/* Shared side label */}
        {sharedSide.showLabel && sharedSide.label && sharedStart && sharedEnd && (
          <text
            x={(sharedStart.x + sharedEnd.x) / 2 - 5}
            y={(sharedStart.y + sharedEnd.y) / 2}
            textAnchor="end" dominantBaseline="middle"
            fontSize="12" fontWeight="600" fill={sharedSide.color}
          >
            {sharedSide.label}
          </text>
        )}
      </svg>
    </div>
  );
};

export default StackedTrianglesSVG;