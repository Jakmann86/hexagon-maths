// src/worksheets/WorksheetBuilder.js
// V2.0 - Connected to real generators
// Orchestrates worksheet generation using pythagorasGenerators

import PDFGenerator from './pdf/PDFGenerator';
import { renderRightTriangle, renderIsoscelesTriangle } from './renderers/TriangleRenderer';
import { renderCoordinateGrid } from './renderers/CoordinateRenderer';

/**
 * Generate a test worksheet to verify the pipeline works
 * Downloads a simple PDF with text questions
 */
export const generateTestWorksheet = () => {
  const pdf = new PDFGenerator();
  
  pdf.addHeader("Pythagoras' Theorem", "Test Worksheet");
  pdf.addFormulaHeader();
  
  const testQuestions = [
    { text: 'Find the hypotenuse: a = 3 cm, b = 4 cm', answer: '5 cm' },
    { text: 'Find the hypotenuse: a = 5 cm, b = 12 cm', answer: '13 cm' },
    { text: 'Find the missing side: c = 10 cm, a = 6 cm', answer: '8 cm' },
    { text: 'Find the missing side: c = 13 cm, b = 5 cm', answer: '12 cm' },
  ];
  
  testQuestions.forEach((q, i) => {
    pdf.addQuestion(i + 1, q.text);
  });
  
  pdf.save('pythagoras_test.pdf');
  return true;
};

/**
 * Generate worked examples worksheet from current examples
 * Creates ONE PDF with blank pages first, then answer pages
 * 
 * @param {Object} config - Worksheet configuration
 * @param {Array} examples - Array of example objects from generators
 */
export const generateWorkedExamples = async (config, examples) => {
  const { title = "Pythagoras' Theorem", topic = 'pythagoras' } = config;
  
  const pdf = new PDFGenerator();
  
  // === SECTION 1: BLANK WORKSHEETS ===
  pdf.addHeader(title, 'Worked Examples');
  pdf.addFormulaHeader();
  
  for (let i = 0; i < examples.length; i++) {
    const example = examples[i];
    if (example) {
      await addExampleToPdf(pdf, i + 1, example, false); // No answers
    }
  }
  
  // === SECTION 2: WITH ANSWERS ===
  pdf.addNewSection(); // Adds page break with section divider
  pdf.addHeader(title, 'Worked Examples — ANSWERS');
  pdf.addFormulaHeader();
  
  for (let i = 0; i < examples.length; i++) {
    const example = examples[i];
    if (example) {
      await addExampleToPdf(pdf, i + 1, example, true); // With answers
    }
  }
  
  pdf.save(`${topic}_worked_examples.pdf`);
  
  return true;
};

/**
 * Generate practice worksheet with 12 questions + answer page
 * Mix of question types: find hypotenuse, find shorter side, isosceles
 * 
 * @param {Object} config - Worksheet configuration  
 * @param {Object} generators - Generator object (e.g., pythagorasGenerators)
 */
export const generatePracticeWorksheet = async (config, generators) => {
  const { title = "Pythagoras' Theorem", topic = 'pythagoras' } = config;
  
  const pdf = new PDFGenerator();
  pdf.addHeader(title, 'Practice Questions');
  pdf.addFormulaHeader();
  
  // Generate 12 questions with variety
  const questions = [];
  
  // Question distribution:
  // Q1-4: Find hypotenuse (easy to medium)
  // Q5-8: Find shorter side (easy to medium)  
  // Q9-10: Isosceles (medium)
  // Q11-12: Mixed/harder
  
  const questionTypes = [
    { type: 'hypotenuse', difficulty: 'easy' },
    { type: 'hypotenuse', difficulty: 'easy' },
    { type: 'hypotenuse', difficulty: 'medium' },
    { type: 'hypotenuse', difficulty: 'medium' },
    { type: 'shorter', difficulty: 'easy' },
    { type: 'shorter', difficulty: 'easy' },
    { type: 'shorter', difficulty: 'medium' },
    { type: 'shorter', difficulty: 'medium' },
    { type: 'isosceles', difficulty: 'medium' },
    { type: 'isosceles', difficulty: 'medium' },
    { type: 'hypotenuse', difficulty: 'hard' },
    { type: 'shorter', difficulty: 'hard' },
  ];
  
  for (let i = 0; i < 12; i++) {
    try {
      const { type, difficulty } = questionTypes[i];
      let question;
      
      if (generators) {
        // Use real generators
        switch (type) {
          case 'hypotenuse':
            question = generators.generateFindHypotenuse({ difficulty, allowDecimals: difficulty !== 'easy' });
            break;
          case 'shorter':
            question = generators.generateFindMissingSide({ difficulty, allowDecimals: difficulty !== 'easy' });
            break;
          case 'isosceles':
            question = generators.generateIsoscelesArea({ difficulty });
            break;
          default:
            question = generators.generateFindHypotenuse({ difficulty });
        }
      } else {
        // Fallback: create simple question objects
        question = createFallbackQuestion(i, type, difficulty);
      }
      
      questions.push(question);
      
    } catch (err) {
      console.error(`Error generating question ${i + 1}:`, err);
      questions.push(createFallbackQuestion(i, 'hypotenuse', 'easy'));
    }
  }
  
  // Add questions to PDF (2 columns, 3 rows per page = 6 per page)
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    // New page after every 6 questions
    if (i > 0 && i % 6 === 0) {
      pdf.addNewSection();
      pdf.addHeader(title, 'Practice Questions (continued)');
    }
    
    // Add question with diagram
    await addPracticeQuestionToPdf(pdf, i + 1, question);
  }
  
  // Add answer page
  pdf.addNewSection();
  pdf.addAnswerPage(questions);
  
  pdf.save(`${topic}_practice.pdf`);
  
  return true;
};

/**
 * Helper: Create fallback question if generators fail
 */
const createFallbackQuestion = (index, type, difficulty) => {
  const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
  const [a, b, c] = triples[index % triples.length];
  
  if (type === 'hypotenuse') {
    return {
      questionText: `Find the hypotenuse of a right-angled triangle with sides ${a} cm and ${b} cm.`,
      answer: `${c} cm`,
      visualization: { type: 'right-triangle', base: a, height: b, unknownSide: 'hypotenuse', units: 'cm' }
    };
  } else {
    return {
      questionText: `Find the missing side of a right-angled triangle with hypotenuse ${c} cm and one side ${a} cm.`,
      answer: `${b} cm`,
      visualization: { type: 'right-triangle', base: a, height: b, hypotenuse: c, unknownSide: 'height', units: 'cm' }
    };
  }
};

/**
 * Helper: Add a practice question to PDF (compact layout)
 */
const addPracticeQuestionToPdf = async (pdf, number, question) => {
  const questionText = question.questionText || question.question || `Question ${number}`;
  
  // Compact question box
  pdf.addQuestionWithDiagram(number, questionText, null);
  
  // Add diagram if exists
  if (question.visualization) {
    const svgString = renderVisualization(question.visualization);
    if (svgString) {
      const diagramX = pdf.doc.internal.pageSize.getWidth() - 12 - 55;
      const diagramY = pdf.currentY - 45;
      await pdf.addSVGImage(svgString, diagramX, diagramY, 50, 40);
    }
  }
};

/**
 * Helper: Add a single example to PDF with diagram
 */
const addExampleToPdf = async (pdf, number, example, showAnswer) => {
  const questionText = example.questionText || example.question || `Example ${number}`;
  
  // Check if we need a new page (estimate height needed)
  const estimatedHeight = showAnswer ? 100 : 70;
  pdf.checkNewPage(estimatedHeight);
  
  // Add question number and text
  pdf.addQuestionWithDiagram(
    number, 
    questionText, 
    showAnswer ? cleanLatex(example.answer) : null
  );
  
  // Render and add diagram if visualization exists
  if (example.visualization) {
    const svgString = renderVisualization(example.visualization);
    if (svgString) {
      const diagramX = pdf.doc.internal.pageSize.getWidth() - 12 - 55; // Right side
      const diagramY = pdf.currentY - 45; // Align with question
      await pdf.addSVGImage(svgString, diagramX, diagramY, 50, 40);
    }
  }
  
  // If showing answers, add solution steps
  if (showAnswer && example.solution && example.solution.length > 0) {
    pdf.addSolutionSteps(example.solution);
  }
};

/**
 * Helper: Clean LaTeX for PDF display
 * Removes complex LaTeX that jsPDF can't render
 */
const cleanLatex = (latex) => {
  if (!latex) return '';
  
  return latex
    .replace(/\\text\{([^}]+)\}/g, '$1')  // \text{cm} → cm
    .replace(/\\\\/g, '')                   // Remove double backslashes
    .replace(/\^2/g, '²')                   // ^2 → ²
    .replace(/\^3/g, '³')                   // ^3 → ³
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)') // \sqrt{x} → √(x)
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)'); // \frac{a}{b} → (a/b)
};

/**
 * Render visualization to SVG string based on type
 */
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
        orientation: viz.orientation || 'default',
        units: viz.units || 'cm',
      });
    
    case 'isosceles':
      return renderIsoscelesTriangle({
        base: viz.base,
        equalSide: viz.legLength || viz.equalSide,
        height: viz.height,
        units: viz.units || 'cm',
      });
    
    case 'coordinate-grid':
    case 'coordinates':
      return renderCoordinateGrid({
        pointA: viz.point1 || viz.pointA,
        pointB: viz.point2 || viz.pointB,
      });
    
    default:
      console.warn(`Unknown visualization type: ${type}`);
      return null;
  }
};

export default {
  generateTestWorksheet,
  generateWorkedExamples,
  generatePracticeWorksheet,
  renderVisualization,
};