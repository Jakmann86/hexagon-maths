// src/generators/algebra/simultaneousEquationsGenerator.js - CLEANED VERSION

import _ from 'lodash';

/**
 * Helper function to format equation terms properly
 */
const formatEquation = (a, b, c) => {
    let equation = '';
    
    // Format x term
    if (a === 1) {
        equation += 'x';
    } else if (a === -1) {
        equation += '-x';
    } else {
        equation += `${a}x`;
    }
    
    // Format y term
    if (b > 0) {
        if (b === 1) {
            equation += ' + y';
        } else {
            equation += ` + ${b}y`;
        }
    } else if (b < 0) {
        if (b === -1) {
            equation += ' - y';
        } else {
            equation += ` - ${Math.abs(b)}y`;
        }
    }
    
    // Add equals and constant
    equation += ` = ${c}`;
    
    return equation;
};

/**
 * Generate elimination example where coefficients are already the same
 */
export const generateEliminationSameCoefficient = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'examples'
    } = options;

    // Work backwards from clean NON-ZERO solution
    let x, y;
    do {
        x = _.random(-4, 5);
        y = _.random(-4, 5);
    } while (x === 0 || y === 0); // Ensure both are non-zero

    // Create equations where one coefficient is the same
    const sameCoeff = _.random(2, 4);
    const useXSame = Math.random() > 0.5;
    
    let a1, b1, a2, b2;
    
    if (useXSame) {
        // Same x coefficients
        a1 = a2 = sameCoeff;
        b1 = _.random(1, 3);
        b2 = _.random(1, 3);
        while (b1 === b2) {
            b2 = _.random(1, 3);
        }
    } else {
        // Same y coefficients  
        b1 = b2 = sameCoeff;
        a1 = _.random(1, 3);
        a2 = _.random(1, 3);
        while (a1 === a2) {
            a2 = _.random(1, 3);
        }
    }

    // Calculate constants - ensure they're non-zero
    let c1 = a1 * x + b1 * y;
    let c2 = a2 * x + b2 * y;
    
    // If either constant is zero, adjust solution slightly
    if (c1 === 0 || c2 === 0) {
        x = x + 1;
        c1 = a1 * x + b1 * y;
        c2 = a2 * x + b2 * y;
    }

    // Format equations cleanly
    const equation1 = formatEquation(a1, b1, c1);
    const equation2 = formatEquation(a2, b2, c2);

    return {
        title: "Same Coefficients",
        equation1,
        equation2,
        answer: { x, y }
    };
};

/**
 * Generate elimination example requiring multiplication
 */
export const generateEliminationWithMultiplication = (options = {}) => {
    const {
        difficulty = 'medium', 
        sectionType = 'examples'
    } = options;

    // Work backwards from NON-ZERO solution
    let x, y;
    do {
        x = _.random(-4, 4);
        y = _.random(-4, 4);
    } while (x === 0 || y === 0); // Ensure both are non-zero

    // Create coefficients that need LCM - keep it simple
    let a1 = _.random(2, 3);
    let a2 = _.random(2, 3);
    while (a1 === a2) {
        a2 = _.random(2, 3);
    }
    
    const b1 = _.random(1, 3);
    const b2 = _.random(1, 3);

    // Calculate constants and ensure they're non-zero
    let c1 = a1 * x + b1 * y;
    let c2 = a2 * x + b2 * y;
    
    // If either constant is zero, adjust solution
    if (c1 === 0 || c2 === 0) {
        x = x + 1;
        c1 = a1 * x + b1 * y;
        c2 = a2 * x + b2 * y;
    }

    // Format equations
    const equation1 = formatEquation(a1, b1, c1);
    const equation2 = formatEquation(a2, b2, c2);

    return {
        title: "Multiplication Required",
        equation1,
        equation2,
        answer: { x, y }
    };
};

/**
 * Generate elimination examples with sign variations
 */
export const generateEliminationSignVariations = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'examples'
    } = options;

    // Work backwards from solution
    const x = _.random(-3, 4);
    const y = _.random(-3, 4);
    
    // Ensure at least one is non-zero
    if (x === 0 && y === 0) {
        return generateEliminationSignVariations(options);
    }

    // Define sign patterns - simplified
    const patterns = [
        { name: '(++)', signs: [1, 1, 1, 1] },    // +x +y, +x +y
        { name: '(+-)', signs: [1, 1, 1, -1] },   // +x +y, +x -y
        { name: '(-+)', signs: [-1, 1, 1, 1] },   // -x +y, +x +y  
        { name: '(--)', signs: [-1, -1, -1, -1] }  // -x -y, -x -y
    ];

    const pattern = _.sample(patterns);
    const [sign_a1, sign_b1, sign_a2, sign_b2] = pattern.signs;
    
    // Apply signs to simple coefficients
    const a1 = sign_a1 * _.random(2, 3);
    const b1 = sign_b1 * _.random(1, 2);
    const a2 = sign_a2 * _.random(1, 2);
    const b2 = sign_b2 * _.random(2, 3);

    // Calculate constants
    const c1 = a1 * x + b1 * y;
    const c2 = a2 * x + b2 * y;

    // Format equations
    const equation1 = formatEquation(a1, b1, c1);
    const equation2 = formatEquation(a2, b2, c2);

    return {
        title: `Sign Variations ${pattern.name}`,
        equation1,
        equation2,
        answer: { x, y }
    };
};

// Export all generators
export const simultaneousEquationsGenerators = {
    generateEliminationSameCoefficient,
    generateEliminationWithMultiplication,  
    generateEliminationSignVariations
};

export default simultaneousEquationsGenerators;