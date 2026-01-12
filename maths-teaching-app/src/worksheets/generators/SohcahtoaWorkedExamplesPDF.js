// src/worksheets/generators/SohcahtoaWorkedExamplesPDF.js
// Generates SOHCAHTOA worked examples PDF with MathJax rendering
//
// Adapted from WorkedExamplesPDF.js for trigonometry content
// Features: Sin, Cos, Tan examples with angle arcs on diagrams

import { jsPDF } from 'jspdf';
import 'svg2pdf.js';
import { SOHCAHTOA_WORKED_EXAMPLES } from '../data/sohcahtoaWorkedExamples';

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
  triangleFill: [232, 244, 248],
  yellowBg: [254, 252, 232],
  yellowBorder: [253, 224, 71],
  labelColor: [30, 41, 59],
  purple: [139, 92, 246],
  purpleLight: [237, 233, 254],
};

// ============================================================
// MATHJAX INITIALIZATION (same as Pythagoras)
// ============================================================

let mathjaxReady = false;
let MathJaxInstance = null;

async function initMathJax() {
  if (mathjaxReady && MathJaxInstance) {
    return MathJaxInstance;
  }

  if (window.MathJax && window.MathJax.tex2svg) {
    MathJaxInstance = window.MathJax;
    mathjaxReady = true;
    return MathJaxInstance;
  }

  return new Promise((resolve, reject) => {
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
      },
      svg: {
        fontCache: 'local',
        scale: 1,
        mtextInheritFont: true,
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

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    script.async = true;
    script.onerror = () => reject(new Error('Failed to load MathJax'));
    document.head.appendChild(script);
  });
}

async function latexToSvg(latex, display = false) {
  try {
    const MJ = await initMathJax();
    const wrapper = MJ.tex2svg(latex, { display });
    const svg = wrapper.querySelector('svg');
    
    if (!svg) return null;

    const clonedSvg = svg.cloneNode(true);
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // Reduce stroke width for lighter appearance
    const paths = clonedSvg.querySelectorAll('path');
    paths.forEach(path => {
      const currentStroke = path.getAttribute('stroke-width');
      if (currentStroke) {
        path.setAttribute('stroke-width', String(parseFloat(currentStroke) * 0.7));
      }
    });
    
    return clonedSvg;
  } catch (e) {
    console.warn('MathJax conversion error:', e);
    return null;
  }
}

async function addMathToPdf(doc, latex, x, y, options = {}) {
  const { scale = 0.5, maxWidth = 50 } = options;

  const svg = await latexToSvg(latex, false);
  
  if (!svg) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(latex, x, y);
    return { width: 20, height: 4 };
  }

  let svgWidth = parseFloat(svg.getAttribute('width')) || 100;
  let svgHeight = parseFloat(svg.getAttribute('height')) || 20;
  
  const widthStr = svg.getAttribute('width') || '';
  const heightStr = svg.getAttribute('height') || '';
  
  if (widthStr.includes('ex')) svgWidth = parseFloat(widthStr) * 8;
  if (heightStr.includes('ex')) svgHeight = parseFloat(heightStr) * 8;

  const widthMm = Math.min(svgWidth * scale * 0.264583, maxWidth);
  const heightMm = svgHeight * scale * 0.264583;

  svg.style.position = 'absolute';
  svg.style.left = '-9999px';
  svg.style.top = '-9999px';
  document.body.appendChild(svg);

  try {
    await doc.svg(svg, {
      x: x,
      y: y - heightMm * 0.8,
      width: widthMm,
      height: heightMm,
    });
  } catch (e) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(latex, x, y);
  } finally {
    if (svg.parentNode) svg.parentNode.removeChild(svg);
  }

  return { width: widthMm, height: heightMm };
}

// ============================================================
// HEXAGON LOGO (same as Pythagoras)
// ============================================================

async function drawHexagonLogo(doc, x, y, size) {
  const logoSvg = `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M100,100 L100,8 L180,54 Z" fill="#ef4444"/>
      <path d="M100,100 L180,54 L180,146 Z" fill="#f97316"/>
      <path d="M100,100 L180,146 L100,192 Z" fill="#eab308"/>
      <path d="M100,100 L100,192 L20,146 Z" fill="#22c55e"/>
      <path d="M100,100 L20,146 L20,54 Z" fill="#3b82f6"/>
      <path d="M100,100 L20,54 L100,8 Z" fill="#8b5cf6"/>
      <polygon points="100,8 180,54 180,146 100,192 20,146 20,54" fill="none" stroke="#1e293b" stroke-width="2" opacity="0.2"/>
      <polygon points="100,26 164,64 164,136 100,174 36,136 36,64" fill="white"/>
      <path d="M100,100 L100,40 L152,70 Z" fill="#ef4444"/>
      <path d="M100,100 L152,70 L152,130 Z" fill="#f97316"/>
      <path d="M100,100 L152,130 L100,160 Z" fill="#eab308"/>
      <path d="M100,100 L100,160 L48,130 Z" fill="#22c55e"/>
      <path d="M100,100 L48,130 L48,70 Z" fill="#3b82f6"/>
      <path d="M100,100 L48,70 L100,40 Z" fill="#8b5cf6"/>
      <polygon points="100,58 136,79 136,121 100,142 64,121 64,79" fill="white"/>
      <polygon points="100,58 136,79 136,121 100,142 64,121 64,79" fill="none" stroke="#1e293b" stroke-width="1" opacity="0.1"/>
      <text x="100" y="96" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="15" fill="#1e293b">HEXAGON</text>
      <text x="100" y="114" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="15" fill="#1e293b">MATHS</text>
    </svg>
  `;
  
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(logoSvg.trim(), 'image/svg+xml');
  const svgElement = svgDoc.documentElement;
  
  svgElement.style.position = 'absolute';
  svgElement.style.left = '-9999px';
  svgElement.style.top = '-9999px';
  document.body.appendChild(svgElement);
  
  try {
    await doc.svg(svgElement, { x, y, width: size, height: size });
  } catch (e) {
    doc.setFillColor(...COLORS.blue);
    doc.circle(x + size/2, y + size/2, size/2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(size * 0.5);
    doc.setFont('helvetica', 'bold');
    doc.text('M', x + size/2, y + size/2 + size*0.15, { align: 'center' });
  } finally {
    if (svgElement.parentNode) svgElement.parentNode.removeChild(svgElement);
  }
}

// ============================================================
// MAIN EXPORT FUNCTION
// ============================================================

export async function generateSohcahtoaWorkedExamplesPDF(config = {}) {
  const { topic = 'sohcahtoa' } = config;
  
  await initMathJax();
  
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  // Page 1: Blank
  await drawPage(doc, SOHCAHTOA_WORKED_EXAMPLES, false);
  
  // Page 2: With answers
  doc.addPage();
  await drawPage(doc, SOHCAHTOA_WORKED_EXAMPLES, true);
  
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
  await drawHexagonLogo(doc, MARGIN_SIDE, y - 1, 14);
  
  doc.setTextColor(...COLORS.darkGrey);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Worked Examples', MARGIN_SIDE + 17, y + 5);
  
  doc.setTextColor(...COLORS.purple);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const subtitle = showAnswers ? 'ANSWERS' : 'SOHCAHTOA Trigonometry';
  doc.text(subtitle, MARGIN_SIDE + 17, y + 10);
  
  doc.setTextColor(...COLORS.darkGrey);
  doc.text('Name: _______________________', A4_WIDTH - MARGIN_SIDE - 55, y + 6);
  
  return y + 18;
}

// ============================================================
// FORMULA BOX - SOHCAHTOA
// ============================================================

async function drawFormulaBox(doc, y) {
  doc.setFillColor(...COLORS.purpleLight);
  doc.setDrawColor(...COLORS.purple);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN_SIDE, y, CONTENT_WIDTH, 16, 2, 2, 'FD');
  
  doc.setTextColor(...COLORS.darkGrey);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SOHCAHTOA:', MARGIN_SIDE + 4, y + 5);
  
  // Three formulas
  try {
    await addMathToPdf(doc, '\\sin(\\theta) = \\frac{\\text{opp}}{\\text{hyp}}', MARGIN_SIDE + 32, y + 5.5, { scale: 0.5 });
    await addMathToPdf(doc, '\\cos(\\theta) = \\frac{\\text{adj}}{\\text{hyp}}', MARGIN_SIDE + 80, y + 5.5, { scale: 0.5 });
    await addMathToPdf(doc, '\\tan(\\theta) = \\frac{\\text{opp}}{\\text{adj}}', MARGIN_SIDE + 128, y + 5.5, { scale: 0.5 });
  } catch (e) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('sin = opp/hyp', MARGIN_SIDE + 35, y + 5);
    doc.text('cos = adj/hyp', MARGIN_SIDE + 80, y + 5);
    doc.text('tan = opp/adj', MARGIN_SIDE + 125, y + 5);
  }
  
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.midGrey);
  doc.setFont('helvetica', 'italic');
  doc.text('opp = opposite (across from angle)   adj = adjacent (next to angle)   hyp = hypotenuse (longest side)', MARGIN_SIDE + 4, y + 13);
  
  return y + 20;
}

// ============================================================
// EXAMPLE BOX
// ============================================================

async function drawExample(doc, example, startY, showAnswers) {
  const boxHeight = 74;
  const diagramWidth = 62;
  const workingWidth = CONTENT_WIDTH - diagramWidth - 6;
  
  doc.setDrawColor(...COLORS.lightGrey);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_SIDE, startY, CONTENT_WIDTH, boxHeight, 2, 2, 'S');
  
  // Question number badge (purple for trig)
  doc.setFillColor(...COLORS.purple);
  doc.circle(MARGIN_SIDE + 6, startY + 6, 4, 'F');
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(String(example.number), MARGIN_SIDE + 6, startY + 7.5, { align: 'center' });
  
  // Question text
  doc.setTextColor(...COLORS.darkGrey);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(example.questionText, CONTENT_WIDTH - 18);
  doc.text(lines.slice(0, 2), MARGIN_SIDE + 14, startY + 6);
  
  const contentY = startY + 15;
  const contentHeight = boxHeight - 18;
  
  // LEFT: Diagram
  doc.setFillColor(...COLORS.diagramBg);
  doc.setDrawColor(...COLORS.lightGrey);
  doc.setLineWidth(0.2);
  doc.roundedRect(MARGIN_SIDE + 2, contentY, diagramWidth, contentHeight, 1, 1, 'FD');
  drawTrigDiagram(doc, example.visualization, MARGIN_SIDE + 2, contentY, diagramWidth, contentHeight);
  
  // RIGHT: Working
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
// TRIG DIAGRAM DRAWING - with angle arc
// ============================================================

function drawTrigDiagram(doc, viz, x, y, w, h) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const labels = viz.labels || {};
  
  // Triangle dimensions
  const triW = 34;
  const triH = 26;
  
  // Triangle points (right angle at bottom-left)
  const rightAngle = { x: cx - triW / 2, y: cy + triH / 2 - 2 };
  const baseEnd = { x: cx + triW / 2, y: cy + triH / 2 - 2 };
  const top = { x: cx - triW / 2, y: cy - triH / 2 - 2 };
  
  // Draw triangle fill
  doc.setFillColor(...COLORS.triangleFill);
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(1);
  doc.triangle(rightAngle.x, rightAngle.y, baseEnd.x, baseEnd.y, top.x, top.y, 'FD');
  
  // Right angle marker
  doc.setDrawColor(...COLORS.midGrey);
  doc.setLineWidth(0.5);
  doc.line(rightAngle.x + 4, rightAngle.y, rightAngle.x + 4, rightAngle.y - 4);
  doc.line(rightAngle.x + 4, rightAngle.y - 4, rightAngle.x, rightAngle.y - 4);
  
  // Angle arc at baseEnd (bottom-right corner)
  if (viz.showAngle && viz.angle) {
    const arcRadius = 8;
    const angleRad = viz.angle * Math.PI / 180;
    
    // Arc from base line going up toward hypotenuse
    // Start angle: pointing left (toward rightAngle) = 180 degrees = PI
    // End angle: pointing toward top
    const startAngle = Math.PI; // pointing left
    const endAngle = Math.PI + Math.atan2(top.y - baseEnd.y, top.x - baseEnd.x) - Math.PI;
    
    // Draw arc using bezier approximation
    doc.setFillColor(139, 92, 246); // purple
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(0.8);
    
    // Simple arc wedge
    const arcStartX = baseEnd.x + Math.cos(Math.PI) * arcRadius;
    const arcStartY = baseEnd.y + Math.sin(Math.PI) * arcRadius;
    
    // Calculate end point based on actual angle to hypotenuse
    const toTop = { x: top.x - baseEnd.x, y: top.y - baseEnd.y };
    const toTopLen = Math.sqrt(toTop.x * toTop.x + toTop.y * toTop.y);
    const toTopUnit = { x: toTop.x / toTopLen, y: toTop.y / toTopLen };
    
    const arcEndX = baseEnd.x + toTopUnit.x * arcRadius;
    const arcEndY = baseEnd.y + toTopUnit.y * arcRadius;
    
    // Draw filled arc sector
    doc.setFillColor(237, 233, 254);
    doc.triangle(baseEnd.x, baseEnd.y, arcStartX, arcStartY, arcEndX, arcEndY, 'F');
    
    // Draw arc line
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(1);
    doc.line(arcStartX, arcStartY, arcEndX, arcEndY);
    
    // Angle label
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    const labelAngle = (Math.PI + Math.atan2(toTopUnit.y, toTopUnit.x)) / 2;
    const labelX = baseEnd.x - 12;
    const labelY = baseEnd.y - 6;
    doc.text(`${viz.angle}°`, labelX, labelY, { align: 'center' });
  }
  
  // Labels
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.labelColor);
  
  // Base label (adjacent) - moved up
  if (labels.base) {
    doc.text(labels.base, (rightAngle.x + baseEnd.x) / 2, rightAngle.y + 6, { align: 'center' });
  }
  
  // Height label (opposite)
  if (labels.height) {
    doc.text(labels.height, rightAngle.x - 5, (rightAngle.y + top.y) / 2, { align: 'right' });
  }
  
  // Hypotenuse label
  if (labels.hypotenuse) {
    const hypX = (baseEnd.x + top.x) / 2 + 3;
    const hypY = (baseEnd.y + top.y) / 2 - 2;
    doc.text(labels.hypotenuse, hypX, hypY, { align: 'left' });
  }
}

// ============================================================
// WORKING AREA - FILLED
// ============================================================

async function drawFilledWorking(doc, example, x, y, w) {
  let cy = y + 5;
  const sx = x + 3;
  const formulaX = sx + 48;
  
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
    
    if (step.latex) {
      try {
        await addMathToPdf(doc, step.latex, formulaX, cy + 0.5, { scale: 0.45 });
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
    
    cy += 4.8;
  }
  
  cy += 1;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Calculator:', sx, cy);
  
  if (example.calculatorLatex) {
    try {
      await addMathToPdf(doc, example.calculatorLatex, sx + 18, cy + 0.5, { scale: 0.42 });
    } catch (e) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.darkGrey);
      doc.text(example.calculatorMethod, sx + 18, cy);
    }
  }
  
  cy += 4.5;
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Answer:', sx, cy);
  doc.setTextColor(...COLORS.green);
  doc.text(example.answer, sx + 14, cy);
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
    cy += 5.5;
  }
  
  cy += 1;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Calculator:', sx, cy);
  doc.line(sx + 20, cy, lineEnd, cy);
  
  cy += 5.5;
  
  doc.text('Answer:', sx, cy);
  doc.line(sx + 14, cy, lineEnd, cy);
}

// ============================================================
// EXPORT
// ============================================================

export default generateSohcahtoaWorkedExamplesPDF;