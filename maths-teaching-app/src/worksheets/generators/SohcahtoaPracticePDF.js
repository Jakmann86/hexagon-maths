// src/worksheets/generators/SohcahtoaPracticePDF.js
// Generates SOHCAHTOA practice worksheet with random questions
//
// Uses existing renderers and PDFGenerator from the worksheets system
// Page 1: Questions 1-6 (sin and cos basics)
// Page 2: Questions 7-12 (finding hypotenuse and tan)
// Page 3: Answer sheet

import PDFGenerator from '../pdf/PDFGenerator';
import { renderVisualization } from '../WorksheetBuilder';
import { sohcahtoaWorksheetGenerators } from './sohcahtoaWorksheetGenerators';

// ============================================================
// MAIN EXPORT FUNCTION
// ============================================================

export async function generateSohcahtoaPracticePDF(config = {}) {
  const { topic = 'sohcahtoa' } = config;
  
  const pdf = new PDFGenerator();
  
  // Generate 12 questions using SOHCAHTOA worksheet generators
  const questions = sohcahtoaWorksheetGenerators.generatePracticeWorksheet();
  
  // === PAGE 1: Questions 1-6 (Basic - sin, cos, tan find side) ===
  pdf.addHeader('SOHCAHTOA', 'Practice Questions');
  pdf.addTrigFormulaHeader(); // Add SOHCAHTOA formula box
  
  const page1Questions = questions.slice(0, 6);
  for (let i = 0; i < page1Questions.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    await pdf.addPracticeQuestion(i + 1, page1Questions[i], col, row, renderVisualization);
  }
  
  // === PAGE 2: Questions 7-12 (Finding hypotenuse, tan variations) ===
  pdf.addNewSection();
  pdf.addHeader('SOHCAHTOA', 'Finding the Hypotenuse & More');
  
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
}

export default generateSohcahtoaPracticePDF;