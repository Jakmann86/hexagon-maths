// src/worksheets/generators/WorkedExamplesPDF.js
// V3.0 - Uses MathJax SVG output + svg2pdf.js for proper math rendering
//
// REQUIRES: 
//   npm install mathjax-full svg2pdf.js
//
// MathJax outputs pure SVG (paths, not foreignObject) which svg2pdf can handle
//
// Place this file in: src/worksheets/generators/WorkedExamplesPDF.js

import { jsPDF } from 'jspdf';
import 'svg2pdf.js';
import { PYTHAGORAS_WORKED_EXAMPLES } from '../data/pythagorasWorkedExamples';

// ============================================================
// CONSTANTS
// ============================================================

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const MARGIN_TOP = 13.5;
const MARGIN_SIDE = 15;
const CONTENT_WIDTH = A4_WIDTH - 2 * MARGIN_SIDE;

const COLORS = {
  blue: [59, 130, 246],
  darkGrey: [55, 65, 81],
  midGrey: [107, 114, 128],
  lightGrey: [229, 231, 235],
  green: [34, 197, 94],
  white: [255, 255, 255],
  diagramBg: [248, 250, 252],
  triangleFill: [224, 242, 254],
  isoscelesFill: [254, 243, 199],
  yellowBg: [254, 252, 232],
  yellowBorder: [253, 224, 71],
  labelColor: [30, 41, 59],
};

// ============================================================
// MATHJAX INITIALIZATION
// ============================================================

let mathjaxReady = false;
let MathJaxInstance = null;

/**
 * Initialize MathJax for SVG output (browser version)
 */
async function initMathJax() {
  if (mathjaxReady && MathJaxInstance) {
    return MathJaxInstance;
  }

  // Check if MathJax is already loaded globally
  if (window.MathJax && window.MathJax.tex2svg) {
    MathJaxInstance = window.MathJax;
    mathjaxReady = true;
    return MathJaxInstance;
  }

  // Load MathJax from CDN if not present
  return new Promise((resolve, reject) => {
    // Configure MathJax before loading
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
      },
      svg: {
        fontCache: 'local',
        scale: 1,
        mtextInheritFont: true,  // Use document font for text
        merrorInheritFont: true,
        mathmlSpacing: false,
        skipAttributes: {},
        exFactor: 0.5,
        displayAlign: 'left',
        displayIndent: '0',
      },
      startup: {
        ready: () => {
          window.MathJax.startup.defaultReady();
          MathJaxInstance = window.MathJax;
          mathjaxReady = true;
          resolve(MathJaxInstance);
        }
      }
    };

    // Load the script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    script.async = true;
    script.onerror = () => reject(new Error('Failed to load MathJax'));
    document.head.appendChild(script);
  });
}

/**
 * Convert LaTeX to SVG element using MathJax
 * @param {string} latex - LaTeX string
 * @param {boolean} display - Display mode (block) vs inline
 * @returns {Promise<SVGElement|null>}
 */
async function latexToSvg(latex, display = false) {
  try {
    const MJ = await initMathJax();
    
    // Convert LaTeX to SVG
    const wrapper = MJ.tex2svg(latex, { display });
    const svg = wrapper.querySelector('svg');
    
    if (!svg) {
      console.warn('MathJax produced no SVG for:', latex);
      return null;
    }

    // Clone the SVG so we can manipulate it
    const clonedSvg = svg.cloneNode(true);
    
    // Ensure it has proper namespace
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // Reduce stroke width for lighter appearance
    const paths = clonedSvg.querySelectorAll('path');
    paths.forEach(path => {
      const currentStroke = path.getAttribute('stroke-width');
      if (currentStroke) {
        path.setAttribute('stroke-width', String(parseFloat(currentStroke) * 0.7));
      }
      // Also slightly reduce the path thickness by adjusting transform scale
      const transform = path.getAttribute('transform');
      if (!transform) {
        path.setAttribute('transform', 'scale(0.95, 1)');
      }
    });
    
    return clonedSvg;
  } catch (e) {
    console.warn('MathJax conversion error:', e);
    return null;
  }
}

/**
 * Add LaTeX formula to PDF at specified position
 * @param {jsPDF} doc - jsPDF document
 * @param {string} latex - LaTeX string
 * @param {number} x - X position in mm
 * @param {number} y - Y position in mm  
 * @param {Object} options - Options (scale, color, maxWidth)
 * @returns {Promise<{width: number, height: number}>}
 */
async function addMathToPdf(doc, latex, x, y, options = {}) {
  const {
    scale = 0.5,
    maxWidth = 50,
    color = '#374151',
  } = options;

  const svg = await latexToSvg(latex, false);
  
  if (!svg) {
    // Fallback to plain text
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(latex, x, y);
    return { width: 20, height: 4 };
  }

  // Get SVG dimensions
  const viewBox = svg.getAttribute('viewBox');
  let svgWidth = parseFloat(svg.getAttribute('width')) || 100;
  let svgHeight = parseFloat(svg.getAttribute('height')) || 20;
  
  // If dimensions are in ex units, convert approximately
  const widthStr = svg.getAttribute('width') || '';
  const heightStr = svg.getAttribute('height') || '';
  
  if (widthStr.includes('ex')) {
    svgWidth = parseFloat(widthStr) * 8; // ~8px per ex
  }
  if (heightStr.includes('ex')) {
    svgHeight = parseFloat(heightStr) * 8;
  }

  // Calculate scaled dimensions in mm
  const widthMm = Math.min(svgWidth * scale * 0.264583, maxWidth); // px to mm
  const heightMm = svgHeight * scale * 0.264583;

  // Add SVG to document body temporarily (svg2pdf needs it in DOM)
  svg.style.position = 'absolute';
  svg.style.left = '-9999px';
  svg.style.top = '-9999px';
  document.body.appendChild(svg);

  try {
    await doc.svg(svg, {
      x: x,
      y: y - heightMm * 0.8, // Adjust for baseline
      width: widthMm,
      height: heightMm,
    });
  } catch (e) {
    console.warn('svg2pdf error:', e);
    // Fallback
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(latex, x, y);
  } finally {
    // Clean up
    if (svg.parentNode) {
      svg.parentNode.removeChild(svg);
    }
  }

  return { width: widthMm, height: heightMm };
}

// ============================================================
// HEXAGON LOGO SVG
// ============================================================

/**
 * Draw the Hexagon Maths logo using SVG
 * @param {jsPDF} doc - jsPDF document
 * @param {number} x - X position in mm
 * @param {number} y - Y position in mm
 * @param {number} size - Size in mm
 */
async function drawHexagonLogo(doc, x, y, size) {
  const logoSvg = `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer hex segments -->
      <path d="M100,100 L100,8 L180,54 Z" fill="#ef4444"/>
      <path d="M100,100 L180,54 L180,146 Z" fill="#f97316"/>
      <path d="M100,100 L180,146 L100,192 Z" fill="#eab308"/>
      <path d="M100,100 L100,192 L20,146 Z" fill="#22c55e"/>
      <path d="M100,100 L20,146 L20,54 Z" fill="#3b82f6"/>
      <path d="M100,100 L20,54 L100,8 Z" fill="#8b5cf6"/>
      
      <!-- Outer hex outline -->
      <polygon points="100,8 180,54 180,146 100,192 20,146 20,54" fill="none" stroke="#1e293b" stroke-width="2" opacity="0.2"/>
      
      <!-- White hexagon ring -->
      <polygon points="100,26 164,64 164,136 100,174 36,136 36,64" fill="white"/>
      
      <!-- Inner hex segments -->
      <path d="M100,100 L100,40 L152,70 Z" fill="#ef4444"/>
      <path d="M100,100 L152,70 L152,130 Z" fill="#f97316"/>
      <path d="M100,100 L152,130 L100,160 Z" fill="#eab308"/>
      <path d="M100,100 L100,160 L48,130 Z" fill="#22c55e"/>
      <path d="M100,100 L48,130 L48,70 Z" fill="#3b82f6"/>
      <path d="M100,100 L48,70 L100,40 Z" fill="#8b5cf6"/>
      
      <!-- White center HEXAGON -->
      <polygon points="100,58 136,79 136,121 100,142 64,121 64,79" fill="white"/>
      
      <!-- Center hex outline -->
      <polygon points="100,58 136,79 136,121 100,142 64,121 64,79" fill="none" stroke="#1e293b" stroke-width="1" opacity="0.1"/>
      
      <!-- Text - HEXAGON -->
      <text x="100" y="96" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="15" fill="#1e293b">HEXAGON</text>
      <text x="100" y="114" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="15" fill="#1e293b">MATHS</text>
    </svg>
  `;
  
  // Parse SVG string to DOM element
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(logoSvg.trim(), 'image/svg+xml');
  const svgElement = svgDoc.documentElement;
  
  // Add to DOM temporarily
  svgElement.style.position = 'absolute';
  svgElement.style.left = '-9999px';
  svgElement.style.top = '-9999px';
  document.body.appendChild(svgElement);
  
  try {
    await doc.svg(svgElement, {
      x: x,
      y: y,
      width: size,
      height: size,
    });
  } catch (e) {
    console.warn('Logo SVG error, using fallback:', e);
    // Fallback: draw a simple colored circle with M
    doc.setFillColor(...COLORS.blue);
    doc.circle(x + size/2, y + size/2, size/2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(size * 0.5);
    doc.setFont('helvetica', 'bold');
    doc.text('M', x + size/2, y + size/2 + size*0.15, { align: 'center' });
  } finally {
    if (svgElement.parentNode) {
      svgElement.parentNode.removeChild(svgElement);
    }
  }
}

// ============================================================
// MAIN EXPORT FUNCTION
// ============================================================

export async function generateStaticWorkedExamplesPDF(config = {}) {
  const { topic = 'pythagoras' } = config;
  
  // Initialize MathJax first
  await initMathJax();
  
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  // === PAGE 1: BLANK ===
  await drawPage(doc, PYTHAGORAS_WORKED_EXAMPLES, false);
  
  // === PAGE 2: WITH ANSWERS ===
  doc.addPage();
  await drawPage(doc, PYTHAGORAS_WORKED_EXAMPLES, true);
  
  doc.save(`${topic}_worked_examples.pdf`);
}

// ============================================================
// PAGE DRAWING
// ============================================================

async function drawPage(doc, examples, showAnswers) {
  let y = MARGIN_TOP;
  
  y = await drawHeader(doc, y, showAnswers);
  y = await drawFormulaBox(doc, y);
  
  for (const example of examples) {
    y = await drawExample(doc, example, y, showAnswers);
  }
}

// ============================================================
// HEADER
// ============================================================

async function drawHeader(doc, y, showAnswers) {
  // Draw the hexagon logo using SVG
  await drawHexagonLogo(doc, MARGIN_SIDE, y - 1, 14);
  
  doc.setTextColor(...COLORS.darkGrey);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Worked Examples', MARGIN_SIDE + 17, y + 5);

doc.setTextColor(...COLORS.blue);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
const subtitle = showAnswers ? 'ANSWERS' : "Pythagoras' Theorem";
doc.text(subtitle, MARGIN_SIDE + 17, y + 10);
  
  doc.setTextColor(...COLORS.darkGrey);
  doc.text('Name: _______________________', A4_WIDTH - MARGIN_SIDE - 55, y + 6);
  
  return y + 18;
}

// ============================================================
// FORMULA BOX - With MathJax
// ============================================================

async function drawFormulaBox(doc, y) {
  doc.setFillColor(...COLORS.yellowBg);
  doc.setDrawColor(...COLORS.yellowBorder);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN_SIDE, y, CONTENT_WIDTH, 14, 2, 2, 'FD');
  
  doc.setTextColor(...COLORS.darkGrey);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Pythagoras' Theorem:", MARGIN_SIDE + 4, y + 5.5);
  
  // Main formula with MathJax - aligned to y + 5.5 baseline
  try {
    await addMathToPdf(doc, 'a^2 + b^2 = c^2', MARGIN_SIDE + 46, y + 5.5, { scale: 0.65 });
    await addMathToPdf(doc, 'a^2 = c^2 - b^2', MARGIN_SIDE + 93, y + 5.5, { scale: 0.65 });
    await addMathToPdf(doc, 'b^2 = c^2 - a^2', MARGIN_SIDE + 135, y + 5.5, { scale: 0.65 });
  } catch (e) {
    // Fallback
    doc.setFont('helvetica', 'bold');
    doc.text('a\u00B2 + b\u00B2 = c\u00B2', MARGIN_SIDE + 48, y + 5.5);
  }
  
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.midGrey);
  doc.setFont('helvetica', 'italic');
  doc.text('c = hypotenuse (longest side, opposite the right angle)', MARGIN_SIDE + 4, y + 11);
  
  return y + 18;
}

// ============================================================
// EXAMPLE BOX
// ============================================================

async function drawExample(doc, example, startY, showAnswers) {
  const boxHeight = 76;
  const diagramWidth = 62;
  const workingWidth = CONTENT_WIDTH - diagramWidth - 6;
  
  doc.setDrawColor(...COLORS.lightGrey);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_SIDE, startY, CONTENT_WIDTH, boxHeight, 2, 2, 'S');
  
  doc.setFillColor(...COLORS.blue);
  doc.circle(MARGIN_SIDE + 6, startY + 6, 4, 'F');
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(String(example.number), MARGIN_SIDE + 6, startY + 7.5, { align: 'center' });
  
  doc.setTextColor(...COLORS.darkGrey);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(example.questionText, CONTENT_WIDTH - 18);
  doc.text(lines.slice(0, 2), MARGIN_SIDE + 14, startY + 6);
  
  const contentY = startY + 15;
  const contentHeight = boxHeight - 18;
  
  doc.setFillColor(...COLORS.diagramBg);
  doc.setDrawColor(...COLORS.lightGrey);
  doc.setLineWidth(0.2);
  doc.roundedRect(MARGIN_SIDE + 2, contentY, diagramWidth, contentHeight, 1, 1, 'FD');
  drawDiagram(doc, example.visualization, MARGIN_SIDE + 2, contentY, diagramWidth, contentHeight);
  
  const workingX = MARGIN_SIDE + diagramWidth + 6;
  doc.setFillColor(...COLORS.white);
  doc.roundedRect(workingX, contentY, workingWidth, contentHeight, 1, 1, 'FD');
  
  if (showAnswers) {
    await drawFilledWorking(doc, example, workingX, contentY, workingWidth);
  } else {
    drawBlankWorking(doc, workingX, contentY, workingWidth, contentHeight);
  }
  
  return startY + boxHeight + 4;
}

// ============================================================
// DIAGRAM DRAWING
// ============================================================

function drawDiagram(doc, viz, x, y, w, h) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const labels = viz.labels || {};
  
  if (viz.type === 'isosceles') {
    const triW = 35;
    const triH = 32;
    
    doc.setFillColor(...COLORS.isoscelesFill);
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(1);
    
    const apex = [cx, cy - triH / 2 + 5];
    const left = [cx - triW / 2, cy + triH / 2];
    const right = [cx + triW / 2, cy + triH / 2];
    
    doc.triangle(apex[0], apex[1], left[0], left[1], right[0], right[1], 'FD');
    
    doc.setDrawColor(...COLORS.midGrey);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(cx, apex[1], cx, left[1]);
    doc.setLineDashPattern([], 0);
    
    doc.setLineWidth(0.5);
    doc.line(cx - 4, left[1], cx - 4, left[1] - 4);
    doc.line(cx - 4, left[1] - 4, cx, left[1] - 4);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.labelColor);
    doc.text(labels.base || '', cx, left[1] + 6, { align: 'center' });
    // Equal side label - moved further right (was -2, now +1)
    doc.text(labels.equalSide || '', left[0] + 4, cy, { align: 'right' });
    
  } else {
    const triW = 32;
    const triH = 28;
    
    doc.setFillColor(...COLORS.triangleFill);
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(1);
    
    const rightAngle = [cx - triW / 2, cy + triH / 2 - 5];
    const baseEnd = [cx + triW / 2, cy + triH / 2 - 5];
    const top = [cx - triW / 2, cy - triH / 2];
    
    doc.triangle(rightAngle[0], rightAngle[1], baseEnd[0], baseEnd[1], top[0], top[1], 'FD');
    
    doc.setDrawColor(...COLORS.midGrey);
    doc.setLineWidth(0.5);
    doc.line(rightAngle[0] + 5, rightAngle[1], rightAngle[0] + 5, rightAngle[1] - 5);
    doc.line(rightAngle[0] + 5, rightAngle[1] - 5, rightAngle[0], rightAngle[1] - 5);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.labelColor);
    doc.text(labels.base || '', (rightAngle[0] + baseEnd[0]) / 2, rightAngle[1] + 6, { align: 'center' });
    doc.text(labels.height || '', rightAngle[0] - 3, (rightAngle[1] + top[1]) / 2, { align: 'right' });
    
    const hypX = (baseEnd[0] + top[0]) / 2 + 2;
    const hypY = (baseEnd[1] + top[1]) / 2 - 2;
    doc.text(labels.hypotenuse || '', hypX, hypY, { align: 'left' });
  }
}

// ============================================================
// WORKING AREA - FILLED (with MathJax)
// ============================================================

async function drawFilledWorking(doc, example, x, y, w) {
  let cy = y + 5;
  const sx = x + 3;
  const formulaX = sx + 50;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Working:', sx, cy);
  cy += 4;
  
  for (let i = 0; i < example.working.length; i++) {
    const step = example.working[i];
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.midGrey);
    doc.text(`${step.step}. ${step.explanation}`, sx, cy);
    
    // Render formula with MathJax if latex available
    if (step.latex) {
      try {
        await addMathToPdf(doc, step.latex, formulaX, cy + 0.5, { scale: 0.5 });
      } catch (e) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.darkGrey);
        doc.text(step.formula, formulaX, cy);
      }
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.darkGrey);
      doc.text(step.formula, formulaX, cy);
    }
    
    cy += 5;
  }
  
  cy += 2;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Calculator:', sx, cy);
  
  if (example.calculatorLatex) {
    try {
      await addMathToPdf(doc, example.calculatorLatex, sx + 20, cy + 0.5, { scale: 0.48 });
    } catch (e) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.darkGrey);
      doc.text(example.calculatorMethod, sx + 20, cy);
    }
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.darkGrey);
    doc.text(example.calculatorMethod, sx + 20, cy);
  }
  
  cy += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Answer:', sx, cy);
  doc.setTextColor(...COLORS.green);
  doc.text(example.answer, sx + 16, cy);
}

// ============================================================
// WORKING AREA - BLANK
// ============================================================

function drawBlankWorking(doc, x, y, w, h) {
  let cy = y + 5;
  const sx = x + 3;
  const lineEnd = x + w - 5;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Working:', sx, cy);
  cy += 5;
  
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  for (let i = 0; i < 5; i++) {
    doc.line(sx, cy, lineEnd, cy);
    cy += 6;
  }
  
  cy += 2;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Calculator:', sx, cy);
  doc.line(sx + 22, cy, lineEnd, cy);
  
  cy += 6;
  
  doc.text('Answer:', sx, cy);
  doc.line(sx + 16, cy, lineEnd, cy);
}

// ============================================================
// EXPORT
// ============================================================

export default generateStaticWorkedExamplesPDF;