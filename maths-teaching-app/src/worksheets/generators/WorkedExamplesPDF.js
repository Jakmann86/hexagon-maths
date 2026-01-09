// src/worksheets/generators/WorkedExamplesPDF.js
// V1.2 - Label adjustments + KaTeX SVG rendering for formulas
//
// Output:
// - Page 1: All 3 examples BLANK (lines for students)
// - Page 2: All 3 examples WITH ANSWERS (filled solutions)
//
// Place this file in: src/worksheets/generators/WorkedExamplesPDF.js

import jsPDF from 'jspdf';
import katex from 'katex';
import { PYTHAGORAS_WORKED_EXAMPLES } from '../data/pythagorasWorkedExamples';

// ============================================================
// CONSTANTS
// ============================================================

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const MARGIN_TOP = 15;
const MARGIN_BOTTOM = 20;
const MARGIN_SIDE = 15;
const CONTENT_WIDTH = A4_WIDTH - 2 * MARGIN_SIDE;

// Colors as RGB arrays for jsPDF
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
// KATEX SVG RENDERING
// ============================================================

/**
 * Render LaTeX to SVG string using KaTeX
 * @param {string} latex - LaTeX string
 * @param {Object} options - KaTeX options
 * @returns {string} SVG string
 */
function latexToSvg(latex, options = {}) {
  try {
    const html = katex.renderToString(latex, {
      throwOnError: false,
      output: 'html',
      displayMode: options.displayMode || false,
      ...options,
    });
    return html;
  } catch (e) {
    console.warn('KaTeX render error:', e);
    return latex; // Fallback to plain text
  }
}

/**
 * Render KaTeX to SVG and convert to image data URL
 * This creates an off-screen element, renders KaTeX, then converts to canvas
 * @param {string} latex - LaTeX string
 * @param {number} fontSize - Font size in pixels
 * @returns {Promise<{dataUrl: string, width: number, height: number}>}
 */
async function latexToImage(latex, fontSize = 14) {
  return new Promise((resolve) => {
    // Create container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.fontSize = `${fontSize}px`;
    container.style.color = '#374151';
    container.style.backgroundColor = 'transparent';
    container.style.padding = '2px';
    document.body.appendChild(container);
    
    // Render KaTeX
    try {
      katex.render(latex, container, {
        throwOnError: false,
        output: 'html',
        displayMode: false,
      });
    } catch (e) {
      container.textContent = latex;
    }
    
    // Use html2canvas or manual SVG approach
    // For simplicity, we'll use a foreignObject SVG approach
    const rect = container.getBoundingClientRect();
    const width = Math.ceil(rect.width) + 4;
    const height = Math.ceil(rect.height) + 4;
    
    // Create SVG with foreignObject
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('xmlns', svgNS);
    
    const foreignObject = document.createElementNS(svgNS, 'foreignObject');
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    
    const div = document.createElement('div');
    div.innerHTML = container.innerHTML;
    div.style.fontSize = `${fontSize}px`;
    div.style.color = '#374151';
    div.style.fontFamily = 'KaTeX_Main, Times New Roman, serif';
    foreignObject.appendChild(div);
    svg.appendChild(foreignObject);
    
    // Convert to data URL
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * 2; // 2x for retina
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      document.body.removeChild(container);
      
      resolve({
        dataUrl: canvas.toDataURL('image/png'),
        width: width,
        height: height,
      });
    };
    img.onerror = () => {
      document.body.removeChild(container);
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Simple text fallback for environments without DOM (or when KaTeX fails)
 * Converts common LaTeX to Unicode
 */
function latexToUnicode(latex) {
  return latex
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\pm/g, '±')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\_/g, '_')
    .replace(/\\,/g, ' ')
    .replace(/−/g, '−'); // Ensure proper minus sign
}

// ============================================================
// MAIN EXPORT FUNCTION
// ============================================================

/**
 * Generate the complete worked examples PDF
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.topic - Topic name for filename (default: "pythagoras")
 * @returns {Promise<void>} - Downloads the PDF
 */
export async function generateStaticWorkedExamplesPDF(config = {}) {
  const { topic = 'pythagoras' } = config;
  
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  // === PAGE 1: BLANK ===
  await drawPage(doc, PYTHAGORAS_WORKED_EXAMPLES, false);
  
  // === PAGE 2: WITH ANSWERS ===
  doc.addPage();
  await drawPage(doc, PYTHAGORAS_WORKED_EXAMPLES, true);
  
  // Save
  doc.save(`${topic}_worked_examples.pdf`);
}

// ============================================================
// PAGE DRAWING
// ============================================================

async function drawPage(doc, examples, showAnswers) {
  let y = MARGIN_TOP;
  
  // Header
  y = drawHeader(doc, y, showAnswers);
  
  // Formula box
  y = await drawFormulaBox(doc, y);
  
  // Examples
  for (const example of examples) {
    y = await drawExample(doc, example, y, showAnswers);
  }
  
  // Page number - only on page 2 (answers)
  if (showAnswers) {
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Page 2', A4_WIDTH / 2, A4_HEIGHT - 10, { align: 'center' });
  }
}

// ============================================================
// HEADER
// ============================================================

function drawHeader(doc, y, showAnswers) {
  // Logo circle with M
  doc.setFillColor(...COLORS.blue);
  doc.circle(MARGIN_SIDE + 6, y + 5, 6, 'F');
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('M', MARGIN_SIDE + 6, y + 6.5, { align: 'center' });
  
  // Title
  doc.setTextColor(...COLORS.darkGrey);
  doc.setFontSize(18);
  doc.text('Worked Examples', MARGIN_SIDE + 16, y + 4);
  
  // Subtitle
  doc.setTextColor(...COLORS.blue);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const subtitle = showAnswers ? 'ANSWERS' : "Pythagoras' Theorem";
  doc.text(subtitle, MARGIN_SIDE + 16, y + 11);
  
  // Name field
  doc.setTextColor(...COLORS.darkGrey);
  doc.text('Name: _______________________', A4_WIDTH - MARGIN_SIDE - 55, y + 6);
  
  return y + 20;
}

// ============================================================
// FORMULA BOX - With KaTeX rendering
// ============================================================

async function drawFormulaBox(doc, y) {
  // Yellow box background
  doc.setFillColor(...COLORS.yellowBg);
  doc.setDrawColor(...COLORS.yellowBorder);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN_SIDE, y, CONTENT_WIDTH, 14, 2, 2, 'FD');
  
  // Main label
  doc.setTextColor(...COLORS.darkGrey);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Pythagoras' Theorem:", MARGIN_SIDE + 4, y + 5);
  
  // Try to render formulas with KaTeX, fallback to Unicode
  const useKatex = typeof document !== 'undefined';
  
  if (useKatex) {
    try {
      // Main formula: a² + b² = c²
      const mainFormula = await latexToImage('a^2 + b^2 = c^2', 12);
      if (mainFormula) {
        doc.addImage(mainFormula.dataUrl, 'PNG', MARGIN_SIDE + 46, y + 1, mainFormula.width * 0.25, mainFormula.height * 0.25);
      } else {
        throw new Error('KaTeX render failed');
      }
      
      // Rearranged: a² = c² − b²
      const formula2 = await latexToImage('a^2 = c^2 - b^2', 10);
      if (formula2) {
        doc.addImage(formula2.dataUrl, 'PNG', MARGIN_SIDE + 88, y + 1.5, formula2.width * 0.22, formula2.height * 0.22);
      }
      
      // Rearranged: b² = c² − a²
      const formula3 = await latexToImage('b^2 = c^2 - a^2', 10);
      if (formula3) {
        doc.addImage(formula3.dataUrl, 'PNG', MARGIN_SIDE + 128, y + 1.5, formula3.width * 0.22, formula3.height * 0.22);
      }
    } catch (e) {
      // Fallback to text
      doc.setFont('helvetica', 'bold');
      doc.text('a² + b² = c²', MARGIN_SIDE + 48, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('a² = c² − b²', MARGIN_SIDE + 90, y + 5);
      doc.text('b² = c² − a²', MARGIN_SIDE + 130, y + 5);
    }
  } else {
    // Fallback for non-browser environments
    doc.setFont('helvetica', 'bold');
    doc.text('a² + b² = c²', MARGIN_SIDE + 48, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('a² = c² − b²', MARGIN_SIDE + 90, y + 5);
    doc.text('b² = c² − a²', MARGIN_SIDE + 130, y + 5);
  }
  
  // Note about c
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.midGrey);
  doc.setFont('helvetica', 'italic');
  doc.text('c = hypotenuse (longest side, opposite the right angle)', MARGIN_SIDE + 4, y + 11);
  
  return y + 20;
}

// ============================================================
// EXAMPLE BOX
// ============================================================

async function drawExample(doc, example, startY, showAnswers) {
  const boxHeight = 76;
  const diagramWidth = 62;
  const workingWidth = CONTENT_WIDTH - diagramWidth - 6;
  
  // Outer border
  doc.setDrawColor(...COLORS.lightGrey);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_SIDE, startY, CONTENT_WIDTH, boxHeight, 2, 2, 'S');
  
  // Question number badge
  doc.setFillColor(...COLORS.blue);
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
  
  // LEFT: Diagram area (grey background)
  doc.setFillColor(...COLORS.diagramBg);
  doc.setDrawColor(...COLORS.lightGrey);
  doc.setLineWidth(0.2);
  doc.roundedRect(MARGIN_SIDE + 2, contentY, diagramWidth, contentHeight, 1, 1, 'FD');
  
  // Draw the diagram
  drawDiagram(doc, example.visualization, MARGIN_SIDE + 2, contentY, diagramWidth, contentHeight);
  
  // RIGHT: Working area (white background)
  const workingX = MARGIN_SIDE + diagramWidth + 6;
  doc.setFillColor(...COLORS.white);
  doc.roundedRect(workingX, contentY, workingWidth, contentHeight, 1, 1, 'FD');
  
  if (showAnswers) {
    await drawFilledWorking(doc, example, workingX, contentY, workingWidth);
  } else {
    drawBlankWorking(doc, workingX, contentY, workingWidth, contentHeight);
  }
  
  return startY + boxHeight + 5;
}

// ============================================================
// DIAGRAM DRAWING - Adjusted label positions
// ============================================================

function drawDiagram(doc, viz, x, y, w, h) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const labels = viz.labels || {};
  
  if (viz.type === 'isosceles') {
    // Isosceles triangle
    const triW = 35;
    const triH = 32;
    
    // Triangle fill and stroke
    doc.setFillColor(...COLORS.isoscelesFill);
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(1);
    
    // Triangle points
    const apex = [cx, cy - triH / 2 + 5];
    const left = [cx - triW / 2, cy + triH / 2];
    const right = [cx + triW / 2, cy + triH / 2];
    
    doc.triangle(apex[0], apex[1], left[0], left[1], right[0], right[1], 'FD');
    
    // Height line (dashed)
    doc.setDrawColor(...COLORS.midGrey);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(cx, apex[1], cx, left[1]);
    doc.setLineDashPattern([], 0);
    
    // Right angle marker at base
    doc.setLineWidth(0.5);
    doc.line(cx - 4, left[1], cx - 4, left[1] - 4);
    doc.line(cx - 4, left[1] - 4, cx, left[1] - 4);
    
    // Labels - BOLDER, slant side moved RIGHT
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.labelColor);
    doc.text(labels.base || '', cx, left[1] + 9, { align: 'center' });
    // Equal side label - moved right (was left[0] - 5, now left[0] - 2)
    doc.text(labels.equalSide || '', left[0] - 2, cy, { align: 'right' });
    
  } else {
    // Right triangle (default)
    const triW = 32;
    const triH = 28;
    
    // Triangle fill and stroke
    doc.setFillColor(...COLORS.triangleFill);
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(1);
    
    // Triangle points (right angle at bottom-left)
    const rightAngle = [cx - triW / 2, cy + triH / 2 - 5];
    const baseEnd = [cx + triW / 2, cy + triH / 2 - 5];
    const top = [cx - triW / 2, cy - triH / 2];
    
    doc.triangle(rightAngle[0], rightAngle[1], baseEnd[0], baseEnd[1], top[0], top[1], 'FD');
    
    // Right angle marker
    doc.setDrawColor(...COLORS.midGrey);
    doc.setLineWidth(0.5);
    doc.line(rightAngle[0] + 5, rightAngle[1], rightAngle[0] + 5, rightAngle[1] - 5);
    doc.line(rightAngle[0] + 5, rightAngle[1] - 5, rightAngle[0], rightAngle[1] - 5);
    
    // Labels - BOLDER, adjusted positions
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.labelColor);
    
    // Base label (bottom)
    doc.text(labels.base || '', (rightAngle[0] + baseEnd[0]) / 2, rightAngle[1] + 9, { align: 'center' });
    
    // Height/vertical label - moved slightly right (was -5, now -3)
    doc.text(labels.height || '', rightAngle[0] - 3, (rightAngle[1] + top[1]) / 2, { align: 'right' });
    
    // Hypotenuse label - moved up and left
    const hypX = (baseEnd[0] + top[0]) / 2 + 2;
    const hypY = (baseEnd[1] + top[1]) / 2 - 2;
    doc.text(labels.hypotenuse || '', hypX, hypY, { align: 'left' });
  }
}

// ============================================================
// WORKING AREA - FILLED (for answers page) - With KaTeX
// ============================================================

async function drawFilledWorking(doc, example, x, y, w) {
  let cy = y + 5;
  const sx = x + 3;
  const formulaX = sx + 52;
  
  const useKatex = typeof document !== 'undefined';
  
  // "Working:" header
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Working:', sx, cy);
  cy += 4;
  
  // Solution steps
  for (let i = 0; i < example.working.length; i++) {
    const step = example.working[i];
    
    // Step number and explanation
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.midGrey);
    doc.text(`${step.step}. ${step.explanation}`, sx, cy);
    
    // Formula - try KaTeX, fallback to Unicode
    if (useKatex && step.latex) {
      try {
        const formulaImg = await latexToImage(step.latex, 10);
        if (formulaImg) {
          doc.addImage(formulaImg.dataUrl, 'PNG', formulaX, cy - 2.5, formulaImg.width * 0.2, formulaImg.height * 0.2);
        } else {
          throw new Error('KaTeX failed');
        }
      } catch (e) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.darkGrey);
        doc.text(latexToUnicode(step.formula), formulaX, cy);
      }
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.darkGrey);
      doc.text(latexToUnicode(step.formula), formulaX, cy);
    }
    
    cy += 5;
  }
  
  cy += 2;
  
  // Calculator method
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Calculator:', sx, cy);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.darkGrey);
  doc.text(latexToUnicode(example.calculatorMethod), sx + 20, cy);
  
  cy += 5;
  
  // Answer (green)
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Answer:', sx, cy);
  doc.setTextColor(...COLORS.green);
  doc.text(example.answer, sx + 16, cy);
}

// ============================================================
// WORKING AREA - BLANK (for student page)
// ============================================================

function drawBlankWorking(doc, x, y, w, h) {
  let cy = y + 5;
  const sx = x + 3;
  const lineEnd = x + w - 5;
  
  // "Working:" header
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Working:', sx, cy);
  cy += 5;
  
  // 5 blank lines for working
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  for (let i = 0; i < 5; i++) {
    doc.line(sx, cy, lineEnd, cy);
    cy += 6;
  }
  
  cy += 2;
  
  // Calculator prompt with line
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.midGrey);
  doc.text('Calculator:', sx, cy);
  doc.line(sx + 22, cy, lineEnd, cy);
  
  cy += 6;
  
  // Answer prompt with line
  doc.text('Answer:', sx, cy);
  doc.line(sx + 16, cy, lineEnd, cy);
}

// ============================================================
// NAMED EXPORT FOR BACKWARDS COMPATIBILITY
// ============================================================

export default generateStaticWorkedExamplesPDF;