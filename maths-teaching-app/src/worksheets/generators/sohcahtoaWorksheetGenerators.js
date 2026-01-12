// src/worksheets/generators/sohcahtoaWorksheetGenerators.js
// V1.0 - Worksheet-specific generators for SOHCAHTOA
// 
// Question types:
// - Find opposite using sin
// - Find adjacent using cos
// - Find opposite using tan
// - Find adjacent using tan
// - Find hypotenuse using sin
// - Find hypotenuse using cos
// 
// Labels: Only show angle, known side value, and 'x' for unknown
// NO "opp", "adj", "hyp" labels - students work that out themselves

import _ from 'lodash';

// ============================================================
// CONSTANTS - Clean angle/side combinations
// ============================================================

// Common angles that give reasonably clean calculator answers
const ANGLES = [25, 30, 35, 40, 45, 50, 55, 60, 65];

// Side lengths to use (will calculate the other sides)
const SIDE_LENGTHS = [8, 10, 12, 14, 15, 16, 18, 20];

// Pre-calculated clean combinations for each trig ratio
// { angle, knownSide, knownValue, unknownSide, answer }

const SIN_FIND_OPP = [
  { angle: 30, hyp: 12, opp: 6.0 },
  { angle: 30, hyp: 20, opp: 10.0 },
  { angle: 45, hyp: 10, opp: 7.1 },
  { angle: 35, hyp: 12, opp: 6.9 },
  { angle: 40, hyp: 15, opp: 9.6 },
  { angle: 50, hyp: 14, opp: 10.7 },
  { angle: 55, hyp: 16, opp: 13.1 },
  { angle: 60, hyp: 10, opp: 8.7 },
];

const SIN_FIND_HYP = [
  { angle: 30, opp: 5, hyp: 10.0 },
  { angle: 30, opp: 8, hyp: 16.0 },
  { angle: 45, opp: 7, hyp: 9.9 },
  { angle: 40, opp: 6, hyp: 9.3 },
  { angle: 50, opp: 10, hyp: 13.1 },
  { angle: 35, opp: 8, hyp: 13.9 },
  { angle: 60, opp: 12, hyp: 13.9 },
];

const COS_FIND_ADJ = [
  { angle: 30, hyp: 12, adj: 10.4 },
  { angle: 45, hyp: 10, adj: 7.1 },
  { angle: 40, hyp: 15, adj: 11.5 },
  { angle: 42, hyp: 15, adj: 11.1 },
  { angle: 50, hyp: 14, adj: 9.0 },
  { angle: 55, hyp: 16, adj: 9.2 },
  { angle: 60, hyp: 20, adj: 10.0 },
  { angle: 35, hyp: 18, adj: 14.7 },
];

const COS_FIND_HYP = [
  { angle: 30, adj: 9, hyp: 10.4 },
  { angle: 45, adj: 7, hyp: 9.9 },
  { angle: 40, adj: 10, hyp: 13.1 },
  { angle: 50, adj: 8, hyp: 12.4 },
  { angle: 60, adj: 6, hyp: 12.0 },
  { angle: 35, adj: 12, hyp: 14.6 },
];

const TAN_FIND_OPP = [
  { angle: 30, adj: 10, opp: 5.8 },
  { angle: 45, adj: 8, opp: 8.0 },
  { angle: 40, adj: 12, opp: 10.1 },
  { angle: 50, adj: 10, opp: 11.9 },
  { angle: 55, adj: 8, opp: 11.4 },
  { angle: 58, adj: 8, opp: 12.8 },
  { angle: 60, adj: 7, opp: 12.1 },
  { angle: 35, adj: 15, opp: 10.5 },
];

const TAN_FIND_ADJ = [
  { angle: 30, opp: 6, adj: 10.4 },
  { angle: 45, opp: 10, adj: 10.0 },
  { angle: 40, opp: 8, adj: 9.5 },
  { angle: 50, opp: 12, adj: 10.1 },
  { angle: 55, opp: 10, adj: 7.0 },
  { angle: 35, opp: 7, adj: 10.0 },
  { angle: 60, opp: 15, adj: 8.7 },
];

// ============================================================
// QUESTION GENERATORS
// ============================================================

/**
 * Generate "find opposite using sin" question
 * sin(θ) = opp/hyp → opp = hyp × sin(θ)
 */
export const generateSinFindOpp = (options = {}) => {
  const { usedConfigs = [] } = options;
  
  const available = SIN_FIND_OPP.filter(c => 
    !usedConfigs.some(used => used.angle === c.angle && used.hyp === c.hyp)
  );
  const config = available.length > 0 ? _.sample(available) : _.sample(SIN_FIND_OPP);
  
  return {
    questionText: 'Find x. Give your answer to 1 d.p.',
    answer: `x = ${config.opp} cm`,
    answerValue: config.opp,
    trigType: 'sin',
    findingSide: 'opposite',
    visualization: {
      type: 'right-triangle',
      showAngle: true,
      angle: config.angle,
      anglePosition: 'bottom-right',
      labels: {
        base: '',           // Adjacent - not labelled
        height: 'x',        // Opposite - unknown
        hypotenuse: `${config.hyp} cm`
      },
      showRightAngle: true,
    },
    config
  };
};

/**
 * Generate "find hypotenuse using sin" question
 * sin(θ) = opp/hyp → hyp = opp / sin(θ)
 */
export const generateSinFindHyp = (options = {}) => {
  const { usedConfigs = [] } = options;
  
  const available = SIN_FIND_HYP.filter(c => 
    !usedConfigs.some(used => used.angle === c.angle && used.opp === c.opp)
  );
  const config = available.length > 0 ? _.sample(available) : _.sample(SIN_FIND_HYP);
  
  return {
    questionText: 'Find x. Give your answer to 1 d.p.',
    answer: `x = ${config.hyp} cm`,
    answerValue: config.hyp,
    trigType: 'sin',
    findingSide: 'hypotenuse',
    visualization: {
      type: 'right-triangle',
      showAngle: true,
      angle: config.angle,
      anglePosition: 'bottom-right',
      labels: {
        base: '',           // Adjacent - not labelled
        height: `${config.opp} cm`,  // Opposite - known
        hypotenuse: 'x'
      },
      showRightAngle: true,
    },
    config
  };
};

/**
 * Generate "find adjacent using cos" question
 * cos(θ) = adj/hyp → adj = hyp × cos(θ)
 */
export const generateCosFindAdj = (options = {}) => {
  const { usedConfigs = [] } = options;
  
  const available = COS_FIND_ADJ.filter(c => 
    !usedConfigs.some(used => used.angle === c.angle && used.hyp === c.hyp)
  );
  const config = available.length > 0 ? _.sample(available) : _.sample(COS_FIND_ADJ);
  
  return {
    questionText: 'Find x. Give your answer to 1 d.p.',
    answer: `x = ${config.adj} cm`,
    answerValue: config.adj,
    trigType: 'cos',
    findingSide: 'adjacent',
    visualization: {
      type: 'right-triangle',
      showAngle: true,
      angle: config.angle,
      anglePosition: 'bottom-right',
      labels: {
        base: 'x',          // Adjacent - unknown
        height: '',         // Opposite - not labelled
        hypotenuse: `${config.hyp} cm`
      },
      showRightAngle: true,
    },
    config
  };
};

/**
 * Generate "find hypotenuse using cos" question
 * cos(θ) = adj/hyp → hyp = adj / cos(θ)
 */
export const generateCosFindHyp = (options = {}) => {
  const { usedConfigs = [] } = options;
  
  const available = COS_FIND_HYP.filter(c => 
    !usedConfigs.some(used => used.angle === c.angle && used.adj === c.adj)
  );
  const config = available.length > 0 ? _.sample(available) : _.sample(COS_FIND_HYP);
  
  return {
    questionText: 'Find x. Give your answer to 1 d.p.',
    answer: `x = ${config.hyp} cm`,
    answerValue: config.hyp,
    trigType: 'cos',
    findingSide: 'hypotenuse',
    visualization: {
      type: 'right-triangle',
      showAngle: true,
      angle: config.angle,
      anglePosition: 'bottom-right',
      labels: {
        base: `${config.adj} cm`,  // Adjacent - known
        height: '',                 // Opposite - not labelled
        hypotenuse: 'x'
      },
      showRightAngle: true,
    },
    config
  };
};

/**
 * Generate "find opposite using tan" question
 * tan(θ) = opp/adj → opp = adj × tan(θ)
 */
export const generateTanFindOpp = (options = {}) => {
  const { usedConfigs = [] } = options;
  
  const available = TAN_FIND_OPP.filter(c => 
    !usedConfigs.some(used => used.angle === c.angle && used.adj === c.adj)
  );
  const config = available.length > 0 ? _.sample(available) : _.sample(TAN_FIND_OPP);
  
  return {
    questionText: 'Find x. Give your answer to 1 d.p.',
    answer: `x = ${config.opp} cm`,
    answerValue: config.opp,
    trigType: 'tan',
    findingSide: 'opposite',
    visualization: {
      type: 'right-triangle',
      showAngle: true,
      angle: config.angle,
      anglePosition: 'bottom-right',
      labels: {
        base: `${config.adj} cm`,  // Adjacent - known
        height: 'x',                // Opposite - unknown
        hypotenuse: ''              // Not labelled
      },
      showRightAngle: true,
    },
    config
  };
};

/**
 * Generate "find adjacent using tan" question
 * tan(θ) = opp/adj → adj = opp / tan(θ)
 */
export const generateTanFindAdj = (options = {}) => {
  const { usedConfigs = [] } = options;
  
  const available = TAN_FIND_ADJ.filter(c => 
    !usedConfigs.some(used => used.angle === c.angle && used.opp === c.opp)
  );
  const config = available.length > 0 ? _.sample(available) : _.sample(TAN_FIND_ADJ);
  
  return {
    questionText: 'Find x. Give your answer to 1 d.p.',
    answer: `x = ${config.adj} cm`,
    answerValue: config.adj,
    trigType: 'tan',
    findingSide: 'adjacent',
    visualization: {
      type: 'right-triangle',
      showAngle: true,
      angle: config.angle,
      anglePosition: 'bottom-right',
      labels: {
        base: 'x',                  // Adjacent - unknown
        height: `${config.opp} cm`, // Opposite - known
        hypotenuse: ''              // Not labelled
      },
      showRightAngle: true,
    },
    config
  };
};

// ============================================================
// WORKSHEET GENERATOR - Creates full set of 12 questions
// ============================================================

/**
 * Generate a complete SOHCAHTOA practice worksheet question set
 * Returns 12 questions covering all trig ratios
 */
export const generatePracticeWorksheet = () => {
  const questions = [];
  const usedConfigs = [];
  
  // Q1-2: Find opposite using sin
  for (let i = 0; i < 2; i++) {
    const q = generateSinFindOpp({ usedConfigs });
    questions.push({ ...q, questionNumber: questions.length + 1, difficulty: 'basic' });
    if (q.config) usedConfigs.push(q.config);
  }
  
  // Q3-4: Find adjacent using cos
  for (let i = 0; i < 2; i++) {
    const q = generateCosFindAdj({ usedConfigs });
    questions.push({ ...q, questionNumber: questions.length + 1, difficulty: 'basic' });
    if (q.config) usedConfigs.push(q.config);
  }
  
  // Q5-6: Find opposite using tan
  for (let i = 0; i < 2; i++) {
    const q = generateTanFindOpp({ usedConfigs });
    questions.push({ ...q, questionNumber: questions.length + 1, difficulty: 'basic' });
    if (q.config) usedConfigs.push(q.config);
  }
  
  // Q7-8: Find hypotenuse using sin
  for (let i = 0; i < 2; i++) {
    const q = generateSinFindHyp({ usedConfigs });
    questions.push({ ...q, questionNumber: questions.length + 1, difficulty: 'intermediate' });
    if (q.config) usedConfigs.push(q.config);
  }
  
  // Q9-10: Find hypotenuse using cos
  for (let i = 0; i < 2; i++) {
    const q = generateCosFindHyp({ usedConfigs });
    questions.push({ ...q, questionNumber: questions.length + 1, difficulty: 'intermediate' });
    if (q.config) usedConfigs.push(q.config);
  }
  
  // Q11-12: Find adjacent using tan
  for (let i = 0; i < 2; i++) {
    const q = generateTanFindAdj({ usedConfigs });
    questions.push({ ...q, questionNumber: questions.length + 1, difficulty: 'intermediate' });
    if (q.config) usedConfigs.push(q.config);
  }
  
  return questions;
};

// ============================================================
// EXPORTS
// ============================================================

export const sohcahtoaWorksheetGenerators = {
  // Sin questions
  generateSinFindOpp,
  generateSinFindHyp,
  
  // Cos questions
  generateCosFindAdj,
  generateCosFindHyp,
  
  // Tan questions
  generateTanFindOpp,
  generateTanFindAdj,
  
  // Full worksheet
  generatePracticeWorksheet,
};

export default sohcahtoaWorksheetGenerators;