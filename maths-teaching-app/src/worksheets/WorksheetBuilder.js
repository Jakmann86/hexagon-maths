// src/worksheets/WorksheetBuilder.js
// V3.0 - Uses dedicated worksheet generators
// 
// Practice Sheet: 12 questions over 2 pages + answer sheet
// Worked Examples: 3 per page, blank then answers

import PDFGenerator from './pdf/PDFGenerator';
import { renderRightTriangle, renderIsoscelesTriangle } from './renderers/TriangleRenderer';
import { renderCoordinateGrid } from './renderers/CoordinateRenderer';
import { renderContextDiagram } from './renderers/ContextRenderer';
import { pythagorasWorksheetGenerators } from './generators/pythagorasWorksheetGenerators';

// ============================================================
// GENERATE TEST WORKSHEET (for testing pipeline)
// ============================================================

export const generateTestWorksheet = () => {
  const pdf = new PDFGenerator();
  pdf.addHeader("Pythagoras' Theorem", "Test Worksheet");
  pdf.addFormulaHeader();
  
  const testQuestions = [
    { text: 'Find the hypotenuse: a = 3 cm, b = 4 cm', answer: '5 cm' },
    { text: 'Find the hypotenuse: a = 5 cm, b = 12 cm', answer: '13 cm' },
  ];
  
  testQuestions.forEach((q, i) => {
    pdf.addQuestion(i + 1, q.text);
  });
  
  pdf.save('pythagoras_test.pdf');
  return true;
};

// ============================================================
// GENERATE WORKED EXAMPLES
// Page 1: 3 examples (blank)
// Page 2: 3 examples (with answers)
// ============================================================

export const generateWorkedExamples = async (config, examples) => {
  const { title = "Pythagoras' Theorem", topic = 'pythagoras' } = config;
  
  const pdf = new PDFGenerator();
  
  // === PAGE 1: BLANK ===
  pdf.addHeader(title, 'Worked Examples');
  pdf.addFormulaHeader();
  
  for (let i = 0; i < Math.min(examples.length, 3); i++) {
    const example = examples[i];
    if (example) {
      await addWorkedExampleToPdf(pdf, i + 1, example, false);
    }
  }
  
  // === PAGE 2: WITH ANSWERS ===
  pdf.addNewSection();
  pdf.addHeader(title, 'Worked Examples — ANSWERS');
  pdf.addFormulaHeader();
  
  for (let i = 0; i < Math.min(examples.length, 3); i++) {
    const example = examples[i];
    if (example) {
      await addWorkedExampleToPdf(pdf, i + 1, example, true);
    }
  }
  
  pdf.save(`${topic}_worked_examples.pdf`);
  return true;
};

// ============================================================
// GENERATE PRACTICE WORKSHEET
// Page 1: Questions 1-6 (2x3 grid) - Basic
// Page 2: Questions 7-12 (2x3 grid) - Application & Challenge
// Page 3: Answer sheet
// ============================================================

export const generatePracticeWorksheet = async (config) => {
  const { title = "Pythagoras' Theorem", topic = 'pythagoras' } = config;
  
  const pdf = new PDFGenerator();
  
  // Generate 12 questions using worksheet generators
  const questions = pythagorasWorksheetGenerators.generatePracticeWorksheet();
  
  // === PAGE 1: Questions 1-6 (Basic) ===
  pdf.addHeader(title, 'Practice Questions');
  pdf.addFormulaHeader();
  
  const page1Questions = questions.slice(0, 6);
  for (let i = 0; i < page1Questions.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    await pdf.addPracticeQuestion(i + 1, page1Questions[i], col, row, renderVisualization);
  }
  
  // === PAGE 2: Questions 7-12 (Application & Challenge) ===
  pdf.addNewSection();
  pdf.addHeader('Application & Challenge', 'Apply Pythagoras to real-world problems');
  
  const page2Questions = questions.slice(6, 12);
  for (let i = 0; i < page2Questions.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    await pdf.addPracticeQuestion(i + 7, page2Questions[i], col, row, renderVisualization);
  }
  
  // === PAGE 3: Answer Sheet ===
  pdf.addNewSection();
  pdf.addAnswerSheet(questions);
  
  pdf.save(`${topic}_practice.pdf`);
  return true;
};

// ============================================================
// HELPER: Add worked example to PDF
// ============================================================

const addWorkedExampleToPdf = async (pdf, number, example, showAnswer) => {
  const questionText = example.questionText || example.question || `Example ${number}`;
  const answer = showAnswer ? cleanLatex(example.answer) : null;
  const solution = showAnswer ? example.solution : null;
  
  await pdf.addWorkedExample(
    number,
    questionText,
    answer,
    example.visualization,
    solution,
    renderVisualization
  );
};

// ============================================================
// HELPER: Clean LaTeX for PDF display
// ============================================================

const cleanLatex = (latex) => {
  if (!latex) return '';
  
  return latex
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\\\/g, '')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')
    .replace(/\\times/g, '×');
};

// ============================================================
// RENDER VISUALIZATION TO SVG
// ============================================================

export const renderVisualization = (viz) => {
  if (!viz) return null;
  
  const type = viz.type || 'right-triangle';
  
  switch (type) {
    case 'right-triangle':
    case 'pythagorean':
      return renderRightTriangle({
        base: viz.base,
        height: viz.height,
        hypotenuse: viz.hypotenuse,
        unknownSide: viz.unknownSide,
        labels: viz.labels,
        orientation: viz.orientation || 'default',
        units: viz.units || 'cm',
      });
    
    case 'isosceles':
      return renderIsoscelesTriangle({
        base: viz.base,
        equalSide: viz.equalSide || viz.legLength,
        height: viz.height,
        showHeight: viz.showHeight !== false,
        labels: viz.labels,
        units: viz.units || 'cm',
      });
    
    case 'coordinate-grid':
    case 'coordinates':
      return renderCoordinateGrid({
        pointA: viz.pointA || viz.point1,
        pointB: viz.pointB || viz.point2,
        labelA: viz.labelA,
        labelB: viz.labelB,
      });
    
    case 'rectangle-diagonal':
      return renderContextDiagram({
        type: 'rectangle-diagonal',
        width: viz.width,
        height: viz.height,
        context: viz.context,
      });
    
    case 'ladder':
      return renderContextDiagram({
        type: 'ladder',
        ladderLength: viz.ladderLength,
        distanceFromWall: viz.distanceFromWall,
        wallHeight: viz.wallHeight,
      });
    
    case 'navigation':
      return renderContextDiagram({
        type: 'navigation',
        eastDistance: viz.eastDistance,
        northDistance: viz.northDistance,
      });
    
    default:
      console.warn(`Unknown visualization type: ${type}`);
      return renderRightTriangle({ base: 3, height: 4, unknownSide: 'hypotenuse' });
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  generateTestWorksheet,
  generateWorkedExamples,
  generatePracticeWorksheet,
  renderVisualization,
};