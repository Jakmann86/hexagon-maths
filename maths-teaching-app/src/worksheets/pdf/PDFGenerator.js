// src/worksheets/pdf/PDFGenerator.js
// V2.0 - Full PDF generation with diagrams and solutions
// Uses jsPDF for client-side PDF creation

import jsPDF from 'jspdf';
import { A4, MARGINS, COLORS, FONTS } from './styles';

class PDFGenerator {
  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    this.currentY = MARGINS.TOP;
    this.pageNumber = 1;
  }

  // Get usable width (A4 minus margins)
  get contentWidth() {
    return A4.WIDTH_MM - MARGINS.LEFT - MARGINS.RIGHT;
  }

  // Get remaining space on page
  get remainingHeight() {
    return A4.HEIGHT_MM - MARGINS.BOTTOM - this.currentY;
  }

  // Check if we need a new page
  checkNewPage(requiredHeight) {
    if (this.currentY + requiredHeight > A4.HEIGHT_MM - MARGINS.BOTTOM) {
      this.addPageNumber();
      this.doc.addPage();
      this.currentY = MARGINS.TOP;
      this.pageNumber++;
      return true;
    }
    return false;
  }

  // Add a new section (page break with optional divider)
  addNewSection() {
    this.addPageNumber();
    this.doc.addPage();
    this.currentY = MARGINS.TOP;
    this.pageNumber++;
  }

  // Draw hexagon logo (simplified as circle with M)
  drawLogo(x, y, size = 8) {
    // Draw hexagon approximation
    this.doc.setFillColor(59, 130, 246); // Blue-500
    this.doc.circle(x, y, size / 2, 'F');
    
    // Add "M" text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(size * 0.6);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('M', x, y + 1, { align: 'center' });
    
    // Reset
    this.doc.setTextColor(COLORS.darkGrey);
  }

  // Add title header
  addHeader(title, subtitle) {
    // Logo
    this.drawLogo(MARGINS.LEFT + 6, this.currentY + 4, 10);
    
    // Title
    this.doc.setTextColor(COLORS.darkGrey);
    this.doc.setFontSize(FONTS.title.size);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, MARGINS.LEFT + 18, this.currentY + 4);
    
    // Subtitle
    this.doc.setTextColor(COLORS.secondary);
    this.doc.setFontSize(FONTS.subtitle.size);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(subtitle, MARGINS.LEFT + 18, this.currentY + 10);
    
    // Name field on right
    this.doc.setTextColor(COLORS.darkGrey);
    this.doc.setFontSize(10);
    this.doc.text('Name: _______________________', A4.WIDTH_MM - MARGINS.RIGHT - 60, this.currentY + 6);
    
    this.currentY += 18;
  }

  // Add formula reference box
  addFormulaHeader(formulas = null) {
    const boxHeight = 14;
    
    // Background
    this.doc.setFillColor(239, 246, 255); // Light blue
    this.doc.roundedRect(
      MARGINS.LEFT, 
      this.currentY, 
      this.contentWidth, 
      boxHeight, 
      2, 2, 'F'
    );
    
    // Border
    this.doc.setDrawColor(59, 130, 246);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(
      MARGINS.LEFT, 
      this.currentY, 
      this.contentWidth, 
      boxHeight, 
      2, 2, 'S'
    );
    
    // Label
    this.doc.setTextColor(COLORS.darkGrey);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text("Pythagoras' Theorem:", MARGINS.LEFT + 4, this.currentY + 5);
    
    // Formulas (bold)
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('a² + b² = c²', MARGINS.LEFT + 50, this.currentY + 5);
    this.doc.text('a² = c² − b²', MARGINS.LEFT + 85, this.currentY + 5);
    this.doc.text('b² = c² − a²', MARGINS.LEFT + 120, this.currentY + 5);
    
    // Hint
    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.secondary);
    this.doc.text(
      'c = hypotenuse (longest side, opposite the right angle)',
      MARGINS.LEFT + 4,
      this.currentY + 11
    );
    
    this.currentY += boxHeight + 6;
  }

  // Add a question with space for diagram on right
  addQuestionWithDiagram(number, questionText, answer = null) {
    const boxHeight = 50;
    this.checkNewPage(boxHeight + 10);
    
    const startY = this.currentY;
    
    // Question box background (leaving space for diagram on right)
    const textWidth = this.contentWidth - 60; // Leave 60mm for diagram
    
    this.doc.setFillColor(250, 250, 250);
    this.doc.setDrawColor(COLORS.border);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(MARGINS.LEFT, this.currentY, this.contentWidth, boxHeight, 2, 2, 'FD');
    
    // Question number badge
    this.doc.setFillColor(COLORS.primary);
    this.doc.circle(MARGINS.LEFT + 6, this.currentY + 6, 4, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(String(number), MARGINS.LEFT + 6, this.currentY + 7.5, { align: 'center' });
    
    // Question text (with word wrap, limited width for diagram space)
    this.doc.setTextColor(COLORS.darkGrey);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const lines = this.doc.splitTextToSize(questionText, textWidth - 15);
    this.doc.text(lines, MARGINS.LEFT + 14, this.currentY + 7);
    
    // Answer line at bottom left
    const answerY = this.currentY + boxHeight - 8;
    this.doc.setFontSize(9);
    this.doc.text('Answer:', MARGINS.LEFT + 4, answerY);
    
    // Draw answer line
    this.doc.setDrawColor(COLORS.border);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGINS.LEFT + 20, answerY, MARGINS.LEFT + 70, answerY);
    
    // If answer provided
    if (answer) {
      this.doc.setTextColor(34, 197, 94); // Green
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(answer, MARGINS.LEFT + 22, answerY - 1);
    }
    
    this.currentY += boxHeight + 4;
    
    return startY; // Return start position for diagram alignment
  }

  // Add a question with optional answer
  addQuestion(number, questionText, answer = null) {
    const boxHeight = answer ? 50 : 45;
    this.checkNewPage(boxHeight + 5);
    
    // Question box background
    this.doc.setFillColor(250, 250, 250);
    this.doc.setDrawColor(COLORS.border);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(MARGINS.LEFT, this.currentY, this.contentWidth, boxHeight, 2, 2, 'FD');
    
    // Question number badge
    this.doc.setFillColor(COLORS.primary);
    this.doc.circle(MARGINS.LEFT + 6, this.currentY + 6, 4, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(String(number), MARGINS.LEFT + 6, this.currentY + 7.5, { align: 'center' });
    
    // Question text (with word wrap)
    this.doc.setTextColor(COLORS.darkGrey);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const maxWidth = this.contentWidth - 20;
    const lines = this.doc.splitTextToSize(questionText, maxWidth);
    this.doc.text(lines, MARGINS.LEFT + 14, this.currentY + 7);
    
    // Answer line
    const answerY = this.currentY + boxHeight - 8;
    this.doc.setFontSize(9);
    this.doc.text('Answer:', MARGINS.LEFT + 4, answerY);
    
    // Draw answer line
    this.doc.setDrawColor(COLORS.border);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGINS.LEFT + 20, answerY, MARGINS.LEFT + 80, answerY);
    
    // If answer provided (for answer key)
    if (answer) {
      this.doc.setTextColor(34, 197, 94); // Green
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(answer, MARGINS.LEFT + 22, answerY - 1);
    }
    
    this.currentY += boxHeight + 4;
  }

  // Add solution steps (for worked examples with answers)
  addSolutionSteps(steps) {
    if (!steps || steps.length === 0) return;
    
    const stepHeight = 8;
    const totalHeight = steps.length * stepHeight + 10;
    this.checkNewPage(totalHeight);
    
    // Solution header
    this.doc.setTextColor(COLORS.darkGrey);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Working:', MARGINS.LEFT + 4, this.currentY);
    this.currentY += 5;
    
    // Each step
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    
    steps.forEach((step, i) => {
      const stepY = this.currentY + (i * stepHeight);
      
      // Step explanation
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(`${i + 1}. ${step.explanation}:`, MARGINS.LEFT + 8, stepY);
      
      // Step formula (cleaned)
      if (step.formula) {
        this.doc.setTextColor(COLORS.darkGrey);
        this.doc.setFont('helvetica', 'bold');
        const cleanFormula = this.cleanLatex(step.formula);
        this.doc.text(cleanFormula, MARGINS.LEFT + 60, stepY);
        this.doc.setFont('helvetica', 'normal');
      }
    });
    
    this.currentY += totalHeight;
  }

  // Add answer page at end
  addAnswerPage(questions) {
    this.addPageNumber();
    this.doc.addPage();
    this.currentY = MARGINS.TOP;
    this.pageNumber++;
    
    // Header
    this.doc.setTextColor(COLORS.darkGrey);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Answer Sheet', A4.WIDTH_MM / 2, this.currentY, { align: 'center' });
    this.currentY += 12;
    
    // Two-column layout for answers
    const colWidth = (this.contentWidth - 10) / 2;
    const leftX = MARGINS.LEFT;
    const rightX = MARGINS.LEFT + colWidth + 10;
    
    this.doc.setFontSize(10);
    
    questions.forEach((q, i) => {
      const isRightColumn = i >= 6;
      const x = isRightColumn ? rightX : leftX;
      const row = isRightColumn ? i - 6 : i;
      const y = this.currentY + (row * 12);
      
      // Question number
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(COLORS.primary);
      this.doc.text(`Q${i + 1}:`, x, y);
      
      // Answer
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(34, 197, 94); // Green
      const answer = this.cleanLatex(q.answer || 'N/A');
      this.doc.text(answer, x + 12, y);
    });
  }

  // Add SVG to PDF by converting to image
  // This is async because we need to load the SVG into an image
  async addSVGImage(svgString, x, y, width, height) {
    return new Promise((resolve, reject) => {
      try {
        // Create a blob from the SVG string
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        // Create an image element
        const img = new Image();
        img.onload = () => {
          // Create a canvas to draw the image
          const canvas = document.createElement('canvas');
          const scale = 2; // Higher resolution
          canvas.width = width * scale * 3.78; // mm to pixels (approx)
          canvas.height = height * scale * 3.78;
          
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#f8fafc'; // Light background
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to data URL and add to PDF
          const imgData = canvas.toDataURL('image/png');
          this.doc.addImage(imgData, 'PNG', x, y, width, height);
          
          // Clean up
          URL.revokeObjectURL(url);
          resolve();
        };
        
        img.onerror = (err) => {
          console.error('Error loading SVG:', err);
          URL.revokeObjectURL(url);
          // Fallback to placeholder
          this.addDiagramPlaceholder(x, y, width, height);
          resolve();
        };
        
        img.src = url;
      } catch (err) {
        console.error('SVG conversion error:', err);
        this.addDiagramPlaceholder(x, y, width, height);
        resolve();
      }
    });
  }

  // Fallback placeholder when SVG fails
  addDiagramPlaceholder(x, y, width, height) {
    this.doc.setDrawColor(COLORS.border);
    this.doc.setFillColor(248, 250, 252);
    this.doc.roundedRect(x, y, width, height, 2, 2, 'FD');
    
    this.doc.setTextColor(180, 180, 180);
    this.doc.setFontSize(9);
    this.doc.text('[Diagram]', x + width/2, y + height/2, { align: 'center' });
  }

  // Add SVG to PDF (simplified - adds as text description for now)
  // Full SVG support would require svg2pdf.js plugin
  addSVG(svgString, x, y, width, height) {
    // Placeholder - full implementation would use svg2pdf.js
    this.doc.setDrawColor(COLORS.border);
    this.doc.setFillColor(248, 250, 252);
    this.doc.roundedRect(x, y, width, height, 2, 2, 'FD');
    
    this.doc.setTextColor(150, 150, 150);
    this.doc.setFontSize(8);
    this.doc.text('[Diagram]', x + width/2, y + height/2, { align: 'center' });
  }

  // Add page number at bottom
  addPageNumber() {
    this.doc.setTextColor(180, 180, 180);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(
      `Page ${this.pageNumber}`,
      A4.WIDTH_MM / 2,
      A4.HEIGHT_MM - 8,
      { align: 'center' }
    );
  }

  // Clean LaTeX for PDF display
  cleanLatex(latex) {
    if (!latex) return '';
    
    return latex
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\\\/g, '')
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\pm/g, '±')
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\neq/g, '≠');
  }

  // Save the PDF
  save(filename) {
    this.addPageNumber();
    this.doc.save(filename);
  }

  // Get as blob (for preview or upload)
  getBlob() {
    return this.doc.output('blob');
  }

  // Get as data URL (for embedding)
  getDataUrl() {
    return this.doc.output('dataurlstring');
  }
}

export default PDFGenerator;