// src/worksheets/pdf/styles.js
// Shared constants for PDF generation
// Matches the app's color scheme

export const A4 = {
  WIDTH_MM: 210,
  HEIGHT_MM: 297,
  WIDTH_PT: 595.28,
  HEIGHT_PT: 841.89,
};

export const MARGINS = {
  TOP: 12,
  BOTTOM: 15,
  LEFT: 12,
  RIGHT: 12,
};

export const COLORS = {
  // Brand colors (match Tailwind)
  primary: '#3b82f6',      // blue-500
  secondary: '#8b5cf6',    // purple-500
  orange: '#f97316',       // orange-500
  green: '#22c55e',        // green-500
  red: '#ef4444',          // red-500
  
  // Greys
  darkGrey: '#374151',     // gray-700 - main text
  midGrey: '#6b7280',      // gray-500 - secondary text
  lightGrey: '#f9fafb',    // gray-50 - backgrounds
  border: '#e5e7eb',       // gray-200 - borders
  
  // Semantic
  correct: '#22c55e',      // green-500
  incorrect: '#ef4444',    // red-500
  highlight: '#fef3c7',    // amber-100
};

export const FONTS = {
  title: { size: 16, weight: 'bold' },
  subtitle: { size: 11, weight: 'normal' },
  heading: { size: 12, weight: 'bold' },
  body: { size: 10, weight: 'normal' },
  small: { size: 8, weight: 'normal' },
  tiny: { size: 7, weight: 'normal' },
};

// Question box dimensions
export const QUESTION_BOX = {
  minHeight: 45,
  padding: 4,
  badgeSize: 8,
};

// Worked example layout
export const WORKED_EXAMPLE = {
  diagramWidth: 80,
  diagramHeight: 60,
  workingWidth: 100,
  stepHeight: 8,
};

// Practice sheet layout (6 questions per page)
export const PRACTICE_LAYOUT = {
  columns: 2,
  rows: 3,
  questionWidth: 90,
  questionHeight: 85,
  gutter: 6,
};

export default {
  A4,
  MARGINS,
  COLORS,
  FONTS,
  QUESTION_BOX,
  WORKED_EXAMPLE,
  PRACTICE_LAYOUT,
};