// src/worksheets/generators/PythagorasPracticePDF.js
// Generates Pythagoras practice worksheet with random questions
//
// Uses existing renderers and PDFGenerator from the worksheets system
// Page 1: Questions 1-6 (Basic)
// Page 2: Questions 7-12 (Application)
// Page 3: Answer sheet

import PDFGenerator from '../pdf/PDFGenerator';
import { renderVisualization } from '../WorksheetBuilder';
import { pythagorasWorksheetGenerators } from './pythagorasWorksheetGenerators';

// ============================================================
// MAIN EXPORT FUNCTION
// ============================================================

export async function generatePythagorasPracticePDF(config = {}) {
  const { topic = 'pythagoras' } = config;
  
  const pdf = new PDFGenerator();
  
  // Generate 12 questions using existing worksheet generators
  const questions = pythagorasWorksheetGenerators.generatePracticeWorksheet();
  
  // === PAGE 1: Questions 1-6 (Basic) ===
  pdf.addHeader("Pythagoras' Theorem", 'Practice Questions');
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
}

export default generatePythagorasPracticePDF;