// src/generators/algebra/recurringDecimalsGenerator.js - Phase 3 New Generator
import _ from 'lodash';

/**
 * Generate recurring decimal to fraction conversion problems
 * Week 5 (Algebra V) - Recurring Decimals
 * Handles starter, diagnostic, and examples sections with section-aware output
 * Uses proper KaTeX notation for fractions and recurring decimals
 */
export const generateRecurringToFraction = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Define recurring decimals with their fractional equivalents
  const recurringDecimals = {
    easy: [
      { decimal: '0.\\overline{3}', fraction: '\\frac{1}{3}', working: '0.333...', denominator: 3 },
      { decimal: '0.\\overline{6}', fraction: '\\frac{2}{3}', working: '0.666...', denominator: 3 },
      { decimal: '0.\\overline{1}', fraction: '\\frac{1}{9}', working: '0.111...', denominator: 9 },
      { decimal: '0.\\overline{2}', fraction: '\\frac{2}{9}', working: '0.222...', denominator: 9 },
      { decimal: '0.\\overline{5}', fraction: '\\frac{5}{9}', working: '0.555...', denominator: 9 },
      { decimal: '0.\\overline{8}', fraction: '\\frac{8}{9}', working: '0.888...', denominator: 9 }
    ],
    medium: [
      { decimal: '0.\\overline{12}', fraction: '\\frac{4}{33}', working: '0.121212...', denominator: 33 },
      { decimal: '0.\\overline{27}', fraction: '\\frac{3}{11}', working: '0.272727...', denominator: 11 },
      { decimal: '0.\\overline{45}', fraction: '\\frac{5}{11}', working: '0.454545...', denominator: 11 },
      { decimal: '0.\\overline{18}', fraction: '\\frac{2}{11}', working: '0.181818...', denominator: 11 },
      { decimal: '0.\\overline{36}', fraction: '\\frac{4}{11}', working: '0.363636...', denominator: 11 }
    ],
    hard: [
      { decimal: '0.\\overline{142857}', fraction: '\\frac{1}{7}', working: '0.142857142857...', denominator: 7 },
      { decimal: '0.\\overline{285714}', fraction: '\\frac{2}{7}', working: '0.285714285714...', denominator: 7 },
      { decimal: '0.\\overline{571428}', fraction: '\\frac{4}{7}', working: '0.571428571428...', denominator: 7 },
      { decimal: '0.1\\overline{6}', fraction: '\\frac{1}{6}', working: '0.1666...', denominator: 6 },
      { decimal: '0.8\\overline{3}', fraction: '\\frac{5}{6}', working: '0.8333...', denominator: 6 }
    ]
  };

  const selectedSet = recurringDecimals[difficulty] || recurringDecimals.medium;
  const selected = _.sample(selectedSet);

  // SECTION-AWARE OUTPUT FORMATTING
  if (sectionType === 'starter') {
    return {
      question: `Convert the recurring decimal ${selected.decimal} to a fraction`,
      answer: `${selected.decimal} = ${selected.fraction}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate incorrect fraction options
    const incorrectOptions = [];
    
    // Common mistakes for recurring decimals
    if (difficulty === 'easy') {
      // For 0.333..., common mistakes include 3/10, 33/100, 1/3.3
      incorrectOptions.push('\\frac{3}{10}');  // Just first digit
      incorrectOptions.push('\\frac{33}{100}'); // Two digits as percentage-style
      incorrectOptions.push('\\frac{3}{9}');   // Wrong simplification
    } else {
      // For more complex ones, generate systematic errors
      incorrectOptions.push('\\frac{' + selected.working.replace(/[^0-9]/g, '').slice(0, 2) + '}{100}');
      incorrectOptions.push('\\frac{1}{' + (selected.denominator + 1) + '}');
      incorrectOptions.push('\\frac{' + (parseInt(selected.working.slice(2, 3)) || 1) + '}{10}');
    }

    // Ensure we have enough unique options
    while (incorrectOptions.length < 3) {
      const randomNum = _.random(1, 20);
      const randomDen = _.random(7, 50);
      const newOption = `\\frac{${randomNum}}{${randomDen}}`;
      if (!incorrectOptions.includes(newOption) && newOption !== selected.fraction) {
        incorrectOptions.push(newOption);
      }
    }

    return {
      questionDisplay: {
        text: 'Convert to a fraction in its simplest form:',
        math: selected.decimal
      },
      correctAnswer: selected.fraction,
      options: [selected.fraction, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
      explanation: `${selected.decimal} = ${selected.fraction} using the algebraic method for recurring decimals`
    };
  }

  else if (sectionType === 'examples') {
    // Generate detailed step-by-step solution using algebraic method
    const steps = generateRecurringToFractionSteps(selected);
    
    return {
      title: "Converting Recurring Decimals to Fractions",
      questionText: `Convert ${selected.decimal} to a fraction`,
      solution: steps
    };
  }

  return generateRecurringToFraction({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate fraction to recurring decimal conversion problems
 * Shows which fractions produce recurring decimals and which terminate
 */
export const generateFractionToRecurring = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  // Fractions that create recurring decimals vs terminating
  const fractionSets = {
    recurring: [
      { fraction: '\\frac{1}{3}', decimal: '0.\\overline{3}', longForm: '0.333...' },
      { fraction: '\\frac{2}{3}', decimal: '0.\\overline{6}', longForm: '0.666...' },
      { fraction: '\\frac{1}{6}', decimal: '0.1\\overline{6}', longForm: '0.1666...' },
      { fraction: '\\frac{1}{7}', decimal: '0.\\overline{142857}', longForm: '0.142857...' },
      { fraction: '\\frac{1}{9}', decimal: '0.\\overline{1}', longForm: '0.111...' },
      { fraction: '\\frac{2}{9}', decimal: '0.\\overline{2}', longForm: '0.222...' },
      { fraction: '\\frac{1}{11}', decimal: '0.\\overline{09}', longForm: '0.090909...' },
      { fraction: '\\frac{2}{11}', decimal: '0.\\overline{18}', longForm: '0.181818...' }
    ],
    terminating: [
      { fraction: '\\frac{1}{2}', decimal: '0.5', longForm: '0.5' },
      { fraction: '\\frac{1}{4}', decimal: '0.25', longForm: '0.25' },
      { fraction: '\\frac{3}{4}', decimal: '0.75', longForm: '0.75' },
      { fraction: '\\frac{1}{5}', decimal: '0.2', longForm: '0.2' },
      { fraction: '\\frac{1}{8}', decimal: '0.125', longForm: '0.125' },
      { fraction: '\\frac{3}{8}', decimal: '0.375', longForm: '0.375' },
      { fraction: '\\frac{1}{10}', decimal: '0.1', longForm: '0.1' },
      { fraction: '\\frac{1}{20}', decimal: '0.05', longForm: '0.05' }
    ]
  };

  // Choose based on difficulty and what we want to test
  const useRecurring = Math.random() > 0.3; // 70% chance of recurring decimal
  const selectedSet = useRecurring ? fractionSets.recurring : fractionSets.terminating;
  
  // Filter by difficulty
  let availableFractions;
  if (difficulty === 'easy') {
    availableFractions = selectedSet.filter(f => 
      ['\\frac{1}{3}', '\\frac{2}{3}', '\\frac{1}{2}', '\\frac{1}{4}'].includes(f.fraction)
    );
  } else {
    availableFractions = selectedSet;
  }

  const selected = _.sample(availableFractions);

  if (sectionType === 'starter') {
    return {
      question: `Convert the fraction ${selected.fraction} to a decimal`,
      answer: `${selected.fraction} = ${selected.decimal}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate plausible decimal options
    const incorrectOptions = [];
    
    if (useRecurring) {
      // For recurring fractions, offer terminating alternatives and wrong recurring
      incorrectOptions.push('0.33');  // Truncated version
      incorrectOptions.push('0.34');  // Rounded incorrectly
      incorrectOptions.push('0.\\overline{33}'); // Wrong recurring pattern
    } else {
      // For terminating fractions, offer recurring alternatives and wrong decimals
      incorrectOptions.push(selected.decimal.slice(0, -1) + '\\overline{' + selected.decimal.slice(-1) + '}');
      incorrectOptions.push((parseFloat(selected.decimal) + 0.1).toString());
      incorrectOptions.push((parseFloat(selected.decimal) - 0.1).toString());
    }

    // Add more generic wrong options
    while (incorrectOptions.length < 3) {
      const wrongDec = (Math.random() * 0.9 + 0.1).toFixed(3);
      if (!incorrectOptions.includes(wrongDec)) {
        incorrectOptions.push(wrongDec);
      }
    }

    return {
      questionDisplay: {
        text: 'Convert to a decimal:',
        math: selected.fraction
      },
      correctAnswer: selected.decimal,
      options: [selected.decimal, ...incorrectOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
      explanation: `${selected.fraction} = ${selected.decimal} by long division`
    };
  }

  else if (sectionType === 'examples') {
    const steps = [
      {
        explanation: "Convert the fraction to a decimal using long division",
        formula: selected.fraction
      },
      {
        explanation: useRecurring ? 
          "The division produces a repeating pattern" : 
          "The division terminates exactly",
        formula: `\\text{Long division gives: } ${selected.longForm}`
      },
      {
        explanation: useRecurring ? 
          "Write using recurring decimal notation" : 
          "The decimal terminates",
        formula: `${selected.fraction} = ${selected.decimal}`
      }
    ];

    return {
      title: "Converting Fractions to Decimals",
      questionText: `Convert ${selected.fraction} to a decimal`,
      solution: steps
    };
  }

  return generateFractionToRecurring({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate decimal classification problems
 * Students identify which decimals are recurring vs terminating
 */
export const generateDecimalClassification = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'diagnostic'
  } = options;

  const decimals = {
    recurring: [
      { display: '0.\\overline{3}', description: '0.333...' },
      { display: '0.\\overline{142857}', description: '0.142857142857...' },
      { display: '0.1\\overline{6}', description: '0.1666...' },
      { display: '0.\\overline{81}', description: '0.818181...' }
    ],
    terminating: [
      { display: '0.25', description: '0.25' },
      { display: '0.125', description: '0.125' },
      { display: '0.75', description: '0.75' },
      { display: '0.6', description: '0.6' }
    ]
  };

  const isRecurring = Math.random() > 0.5;
  const selectedSet = isRecurring ? decimals.recurring : decimals.terminating;
  const selected = _.sample(selectedSet);

  if (sectionType === 'starter') {
    return {
      question: `Is ${selected.display} a recurring or terminating decimal?`,
      answer: `${selected.display} is ${isRecurring ? 'recurring' : 'terminating'} because ${isRecurring ? 'it repeats forever' : 'it ends'}`,
      difficulty: 'algebra'
    };
  }

  else if (sectionType === 'diagnostic') {
    const options = ['Recurring', 'Terminating'];
    const correctAnswer = isRecurring ? 'Recurring' : 'Terminating';

    return {
      questionDisplay: {
        text: 'Classify this decimal:',
        math: selected.display
      },
      correctAnswer,
      options: options.sort(() => Math.random() - 0.5),
      explanation: `${selected.display} is ${correctAnswer.toLowerCase()} because ${isRecurring ? 'the digits repeat in a pattern' : 'the decimal expansion ends'}`
    };
  }

  return generateDecimalClassification({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate why fractions recur problems
 * Explains the mathematical reason why certain fractions produce recurring decimals
 */
export const generateWhyFractionsRecur = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'examples'
  } = options;

  const explanations = [
    {
      fraction: '\\frac{1}{3}',
      reason: 'When we divide 1 by 3, the remainder is always 1, so the process repeats',
      denomFactors: '3 = 3 (prime factor other than 2 or 5)'
    },
    {
      fraction: '\\frac{1}{6}',
      reason: '6 = 2 × 3, so while 2 gives terminating part, 3 causes recurring',
      denomFactors: '6 = 2 \\times 3 (contains factor other than 2 or 5)'
    },
    {
      fraction: '\\frac{1}{7}',
      reason: 'When we divide by 7, we cycle through remainders 1,3,2,6,4,5 then repeat',
      denomFactors: '7 = 7 (prime factor other than 2 or 5)'
    }
  ];

  const selected = _.sample(explanations);

  if (sectionType === 'examples') {
    const solution = [
      {
        explanation: "A fraction produces a recurring decimal if the denominator has prime factors other than 2 and 5",
        formula: "\\text{Rule: Only denominators of the form } 2^a \\times 5^b \\text{ give terminating decimals}"
      },
      {
        explanation: `For ${selected.fraction}, examine the denominator`,
        formula: selected.denomFactors
      },
      {
        explanation: "Since the denominator contains factors other than 2 and 5, the decimal must recur",
        formula: selected.reason
      },
      {
        explanation: "This is why we get a recurring decimal",
        formula: `${selected.fraction} \\text{ produces a recurring decimal}`
      }
    ];

    return {
      title: "Why Some Fractions Give Recurring Decimals",
      questionText: `Explain why ${selected.fraction} gives a recurring decimal`,
      solution
    };
  }

  return generateWhyFractionsRecur({ ...options, sectionType: 'examples' });
};

/**
 * Helper function to generate detailed algebraic steps for converting recurring decimals to fractions
 */
const generateRecurringToFractionSteps = (decimalData) => {
  // This creates the algebraic method: x = 0.333..., 10x = 3.333..., 9x = 3, x = 1/3
  
  const steps = [
    {
      explanation: "Let x equal the recurring decimal",
      formula: `x = ${decimalData.decimal}`
    }
  ];

  // Determine multiplication factor based on recurring part length
  const recurringPart = decimalData.working.replace(/[^0-9]/g, '').match(/(\d+)\1+/);
  const recurringLength = recurringPart ? recurringPart[1].length : 1;
  const multiplier = Math.pow(10, recurringLength);

  steps.push({
    explanation: `Multiply both sides by ${multiplier} to shift the decimal point`,
    formula: `${multiplier}x = ${multiplier} \\times ${decimalData.decimal}`
  });

  const shiftedDecimal = parseFloat(decimalData.working) * multiplier;
  steps.push({
    explanation: "The recurring parts now align",
    formula: `${multiplier}x = ${shiftedDecimal.toFixed(6)}...`
  });

  steps.push({
    explanation: "Subtract the original equation to eliminate the recurring part",
    formula: `${multiplier}x - x = ${shiftedDecimal.toFixed(0)} - ${parseFloat(decimalData.working).toFixed(6)}...`
  });

  const coefficient = multiplier - 1;
  const numerator = Math.round(shiftedDecimal - parseFloat(decimalData.working));
  
  steps.push({
    explanation: "Simplify the left side",
    formula: `${coefficient}x = ${numerator}`
  });

  steps.push({
    explanation: "Solve for x",
    formula: `x = \\frac{${numerator}}{${coefficient}}`
  });

  steps.push({
    explanation: "Simplify to lowest terms",
    formula: `x = ${decimalData.fraction}`
  });

  return steps;
};

// Export all recurring decimal generators
export const recurringDecimalsGenerators = {
  generateRecurringToFraction,
  generateFractionToRecurring,
  generateDecimalClassification,
  generateWhyFractionsRecur
};

export default recurringDecimalsGenerators;