// src/generators/number/recurringDecimalGenerator.js
import _ from 'lodash';

/**
 * Helper function to create the recurring decimal notation
 */
const formatRecurringDecimal = (nonRecurring, recurring) => {
  // Format as 0.3̇4̇ using LaTeX \dot notation
  const recurringWithDots = recurring.split('').map((digit, index) => {
    if (index === 0) {
      return `\\dot{${digit}}`;
    } else if (index === recurring.length - 1) {
      return `\\dot{${digit}}`;
    } else {
      return digit;
    }
  }).join('');
  
  return `0.${nonRecurring}${recurringWithDots}`;
};

/**
 * Generate recurring decimal to fraction conversion questions
 * Types: single digit recurring, double digit recurring, with non-recurring part
 */
export const generateRecurringDecimalToFraction = (options = {}) => {
  const {
    difficulty = 'medium',
    sectionType = 'starter'
  } = options;

  let decimal, fraction, numerator, denominator;
  let nonRecurringPart = '';
  let recurringPart = '';

  if (difficulty === 'easy') {
    // Single digit recurring: 0.3̇ = 3/9 = 1/3
    const recurringDigit = _.random(1, 8);
    recurringPart = `${recurringDigit}`;
    
    // Simplify: d/9
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(recurringDigit, 9);
    numerator = recurringDigit / divisor;
    denominator = 9 / divisor;
    
    fraction = denominator === 1 ? `${numerator}` : `\\frac{${numerator}}{${denominator}}`;
    decimal = formatRecurringDecimal('', recurringPart);
    
  } else if (difficulty === 'medium') {
    // Double digit recurring: 0.1̇2̇ = 12/99 = 4/33
    const recurringDigit = _.random(10, 89);
    recurringPart = `${recurringDigit}`;
    
    // Simplify: dd/99
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(recurringDigit, 99);
    numerator = recurringDigit / divisor;
    denominator = 99 / divisor;
    
    fraction = `\\frac{${numerator}}{${denominator}}`;
    decimal = formatRecurringDecimal('', recurringPart);
    
  } else {
    // With non-recurring part: 0.2̇3̇ = 21/90 = 7/30
    const nonRecurringDigit = _.random(1, 8);
    const recurringDigit = _.random(1, 9);
    
    nonRecurringPart = `${nonRecurringDigit}`;
    recurringPart = `${recurringDigit}`;
    
    // Formula: (whole number - non-recurring part) / (9s for recurring × 10s for non-recurring)
    const wholeNumber = parseInt(`${nonRecurringDigit}${recurringDigit}`);
    const nonRecurringNumber = parseInt(nonRecurringDigit);
    
    numerator = wholeNumber - nonRecurringNumber;
    denominator = 90; // 9 × 10
    
    // Simplify
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(numerator, denominator);
    numerator = numerator / divisor;
    denominator = denominator / divisor;
    
    fraction = `\\frac{${numerator}}{${denominator}}`;
    decimal = formatRecurringDecimal(nonRecurringPart, recurringPart);
  }

  // SECTION-AWARE OUTPUT
  if (sectionType === 'starter') {
    return {
      question: `\\text{Convert } ${decimal} \\text{ to a fraction}`,
      answer: fraction,
      fontSize: 'large'
    };
  }

  else if (sectionType === 'diagnostic') {
    // Generate incorrect options
    const incorrectOptions = [
      `\\frac{${numerator + 1}}{${denominator}}`,
      `\\frac{${numerator}}{${denominator + 1}}`,
      `\\frac{${numerator * 2}}{${denominator * 2 + 1}}`
    ];

    return {
      questionDisplay: {
        text: 'Convert to a fraction:',
        math: decimal
      },
      correctAnswer: fraction,
      options: [fraction, ...incorrectOptions].sort(() => Math.random() - 0.5),
      explanation: `${decimal} = ${fraction}`
    };
  }

  else if (sectionType === 'examples') {
    const solution = [];
    
    if (difficulty === 'easy') {
      solution.push({
        explanation: "Let x equal the recurring decimal",
        formula: `x = ${decimal}`
      });
      solution.push({
        explanation: "Multiply by 10 to shift the decimal point",
        formula: `10x = ${recurringPart}.${recurringPart}${recurringPart}...`
      });
      solution.push({
        explanation: "Subtract the original equation from this",
        formula: `10x - x = ${recurringPart}`
      });
      solution.push({
        explanation: "Simplify",
        formula: `9x = ${recurringPart}`
      });
      solution.push({
        explanation: "Solve for x",
        formula: `x = \\frac{${recurringPart}}{9} = ${fraction}`
      });
    } else if (difficulty === 'medium') {
      solution.push({
        explanation: "Let x equal the recurring decimal",
        formula: `x = ${decimal}`
      });
      solution.push({
        explanation: "Multiply by 100 to shift the decimal point (2 recurring digits)",
        formula: `100x = ${recurringPart}.${recurringPart}...`
      });
      solution.push({
        explanation: "Subtract the original equation",
        formula: `100x - x = ${recurringPart}`
      });
      solution.push({
        explanation: "Simplify",
        formula: `99x = ${recurringPart}`
      });
      solution.push({
        explanation: "Solve for x and simplify",
        formula: `x = \\frac{${recurringPart}}{99} = ${fraction}`
      });
    } else {
      solution.push({
        explanation: "Let x equal the recurring decimal",
        formula: `x = ${decimal}`
      });
      solution.push({
        explanation: "Multiply by 10 to move past non-recurring part",
        formula: `10x = ${nonRecurringPart}.${recurringPart}${recurringPart}...`
      });
      solution.push({
        explanation: "Multiply by 100 to shift recurring part",
        formula: `100x = ${nonRecurringPart}${recurringPart}.${recurringPart}...`
      });
      solution.push({
        explanation: "Subtract: 100x - 10x",
        formula: `90x = ${numerator * (90 / (denominator / (numerator / numerator)))}`
      });
      solution.push({
        explanation: "Solve and simplify",
        formula: `x = ${fraction}`
      });
    }

    return {
      title: "Converting Recurring Decimals to Fractions",
      questionText: `Convert ${decimal} to a fraction`,
      solution
    };
  }

  // Fallback
  return {
    question: `Convert ${decimal} to a fraction`,
    answer: fraction,
    fontSize: 'large'
  };
};

export const recurringDecimalGenerators = {
  generateRecurringDecimalToFraction
};

export default recurringDecimalGenerators;