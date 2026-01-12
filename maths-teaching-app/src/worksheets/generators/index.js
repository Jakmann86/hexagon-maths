// src/worksheets/generators/index.js
// Registry of worksheet generators by topic
//
// Keys match the 'worksheetKey' field in curriculum.js

export const worksheetGenerators = {
  
  // WORKED EXAMPLES
  workedExamples: {
    'pythagoras': () => import('./PythagorasWorkedExamplesPDF'),
    'sohcahtoa': () => import('./SohcahtoaWorkedExamplesPDF'),
  },

  // PRACTICE SHEETS
  practice: {
    'pythagoras': () => import('./PythagorasPracticePDF'),
    'sohcahtoa': () => import('./SohcahtoaPracticePDF'),
  }
};

export default worksheetGenerators;