// src/generators/algebra/simultaneousEquationsGenerator.js - NEW DEDICATED FILE

import _ from 'lodash';

/**
 * Generate elimination example where coefficients are already the same
 * Example: 3x + 2y = 16 and 3x + 5y = 22
 * Teaching point: Direct subtraction when coefficients match
 */
export const generateEliminationSameCoefficient = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'examples'
    } = options;

    // Work backwards from solution - allow negative values
    const x = _.random(-5, 8);
    const y = _.random(-4, 7);
    
    // Ensure at least one is non-zero
    if (x === 0 && y === 0) {
        return generateEliminationSameCoefficient(options);
    }

    // Create equations where one coefficient is the same
    const sameCoeff = _.random(2, 5);  // Same coefficient for x or y
    const useXSame = Math.random() > 0.5;
    
    let a1, b1, c1, a2, b2, c2;
    
    if (useXSame) {
        // Same x coefficients
        a1 = a2 = sameCoeff;
        b1 = _.random(1, 4);
        b2 = _.random(1, 4);
        // Ensure different y coefficients
        while (b1 === b2) {
            b2 = _.random(1, 4);
        }
    } else {
        // Same y coefficients  
        b1 = b2 = sameCoeff;
        a1 = _.random(1, 4);
        a2 = _.random(1, 4);
        // Ensure different x coefficients
        while (a1 === a2) {
            a2 = _.random(1, 4);
        }
    }

    // Calculate constants
    c1 = a1 * x + b1 * y;
    c2 = a2 * x + b2 * y;

    // Format equations with proper LaTeX
    const equation1 = `${a1 === 1 ? '' : a1}x ${b1 >= 0 ? '+' : ''} ${b1 === 1 ? '' : b1 === -1 ? '-' : b1}y = ${c1}`;
    const equation2 = `${a2 === 1 ? '' : a2}x ${b2 >= 0 ? '+' : ''} ${b2 === 1 ? '' : b2 === -1 ? '-' : b2}y = ${c2}`;

    // Generate solution steps
    const variable = useXSame ? 'x' : 'y';
    const eliminatedCoeff = useXSame ? a1 : b1;
    const remainingCoeff = useXSame ? (b1 - b2) : (a1 - a2);
    const remainingConstant = c1 - c2;
    const remainingVariable = useXSame ? 'y' : 'x';
    const solvedValue = useXSame ? y : x;

    const solution = [
        {
            explanation: `Notice that both equations have the same coefficient for ${variable} (${eliminatedCoeff})`,
            formula: `\\begin{cases} ${equation1} \\quad (1) \\\\ ${equation2} \\quad (2) \\end{cases}`
        },
        {
            explanation: "Subtract equation (2) from equation (1) to eliminate the variable with the same coefficient",
            formula: `(1) - (2): (${a1}x ${b1 >= 0 ? '+' : ''} ${b1}y) - (${a2}x ${b2 >= 0 ? '+' : ''} ${b2}y) = ${c1} - ${c2}`
        },
        {
            explanation: "Simplify to solve for the remaining variable",
            formula: `${remainingCoeff}${remainingVariable} = ${remainingConstant}`
        },
        {
            explanation: `Solve for ${remainingVariable}`,
            formula: `${remainingVariable} = ${remainingConstant} \\div ${remainingCoeff} = ${solvedValue}`
        },
        {
            explanation: `Substitute back into equation (1) to find ${variable}`,
            formula: `${a1}(${useXSame ? x : solvedValue}) ${b1 >= 0 ? '+' : ''} ${b1}(${useXSame ? solvedValue : y}) = ${c1}`
        },
        {
            explanation: "Final solution",
            formula: `x = ${x}, \\quad y = ${y}`
        }
    ];

    return {
        title: "Same Coefficients",
        equation1,
        equation2,
        solution,
        answer: { x, y }
    };
};

/**
 * Generate elimination example requiring multiplication of one or both equations
 * Teaching point: Use LCM to create matching coefficients
 */
export const generateEliminationWithMultiplication = (options = {}) => {
    const {
        difficulty = 'medium', 
        sectionType = 'examples'
    } = options;

    // Work backwards from solution
    const x = _.random(-4, 6);
    const y = _.random(-5, 7);
    
    // Ensure at least one is non-zero
    if (x === 0 && y === 0) {
        return generateEliminationWithMultiplication(options);
    }

    // Create coefficients that need LCM
    const coeff1 = _.random(2, 4);
    const coeff2 = _.random(3, 5);
    // Ensure they're different and need real multiplication
    while (coeff1 === coeff2 || coeff1 % coeff2 === 0 || coeff2 % coeff1 === 0) {
        const newCoeff2 = _.random(3, 5);
        if (newCoeff2 !== coeff1) {
            break;
        }
    }

    // Decide which variable to eliminate
    const eliminateX = Math.random() > 0.5;
    
    let a1, b1, a2, b2, c1, c2;
    
    if (eliminateX) {
        a1 = coeff1;
        a2 = coeff2;
        b1 = _.random(1, 4);
        b2 = _.random(1, 4);
    } else {
        a1 = _.random(1, 4);
        a2 = _.random(1, 4);
        b1 = coeff1;
        b2 = coeff2;
    }

    // Calculate constants
    c1 = a1 * x + b1 * y;
    c2 = a2 * x + b2 * y;

    // Format equations
    const equation1 = `${a1 === 1 ? '' : a1}x ${b1 >= 0 ? '+' : ''} ${b1 === 1 ? '' : b1 === -1 ? '-' : b1}y = ${c1}`;
    const equation2 = `${a2 === 1 ? '' : a2}x ${b2 >= 0 ? '+' : ''} ${b2 === 1 ? '' : b2 === -1 ? '-' : b2}y = ${c2}`;

    // Calculate LCM and multipliers
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
    const targetCoeffs = eliminateX ? [a1, a2] : [b1, b2];
    const lcmValue = lcm(targetCoeffs[0], targetCoeffs[1]);
    const mult1 = lcmValue / targetCoeffs[0];
    const mult2 = lcmValue / targetCoeffs[1];

    const solution = [
        {
            explanation: `To eliminate ${eliminateX ? 'x' : 'y'}, we need matching coefficients`,
            formula: `\\begin{cases} ${equation1} \\quad (1) \\\\ ${equation2} \\quad (2) \\end{cases}`
        },
        {
            explanation: `LCM of ${targetCoeffs[0]} and ${targetCoeffs[1]} is ${lcmValue}. Multiply equation (1) by ${mult1} and equation (2) by ${mult2}`,
            formula: `${mult1} \\times (1): \\quad ${mult2} \\times (2):`
        },
        {
            explanation: "This gives us the new system",
            formula: `\\begin{cases} ${a1 * mult1}x ${(b1 * mult1) >= 0 ? '+' : ''} ${b1 * mult1}y = ${c1 * mult1} \\\\ ${a2 * mult2}x ${(b2 * mult2) >= 0 ? '+' : ''} ${b2 * mult2}y = ${c2 * mult2} \\end{cases}`
        },
        {
            explanation: `Subtract to eliminate ${eliminateX ? 'x' : 'y'}`,
            formula: `${eliminateX ? (b1 * mult1 - b2 * mult2) : (a1 * mult1 - a2 * mult2)}${eliminateX ? 'y' : 'x'} = ${c1 * mult1 - c2 * mult2}`
        },
        {
            explanation: `Solve for ${eliminateX ? 'y' : 'x'}`,
            formula: `${eliminateX ? 'y' : 'x'} = ${eliminateX ? y : x}`
        },
        {
            explanation: "Substitute back to find the other variable",
            formula: `x = ${x}, \\quad y = ${y}`
        }
    ];

    return {
        title: "Multiplication Required",
        equation1,
        equation2,
        solution,
        answer: { x, y }
    };
};

/**
 * Generate elimination examples with different sign combinations
 * Cycles through ++, +-, -+, -- patterns
 */
export const generateEliminationSignVariations = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'examples'
    } = options;

    // Work backwards from solution
    const x = _.random(-4, 6);
    const y = _.random(-5, 7);
    
    // Ensure at least one is non-zero
    if (x === 0 && y === 0) {
        return generateEliminationSignVariations(options);
    }

    // Define sign patterns for teaching
    const signPatterns = [
        { name: 'Both Positive (++)', a1: 1, b1: 1, a2: 1, b2: 1 },
        { name: 'Mixed Signs (+-)', a1: 1, b1: 1, a2: 1, b2: -1 },
        { name: 'Mixed Signs (-+)', a1: -1, b1: 1, a2: 1, b2: 1 },
        { name: 'Both Negative (--)', a1: -1, b1: -1, a2: -1, b2: -1 }
    ];

    const pattern = _.sample(signPatterns);
    
    // Apply coefficients with chosen signs
    const a1 = pattern.a1 * _.random(2, 4);
    const b1 = pattern.b1 * _.random(1, 3);
    const a2 = pattern.a2 * _.random(1, 3);
    const b2 = pattern.b2 * _.random(2, 4);

    // Calculate constants
    const c1 = a1 * x + b1 * y;
    const c2 = a2 * x + b2 * y;

    // Format equations
    const equation1 = `${a1 === 1 ? '' : a1 === -1 ? '-' : a1}x ${b1 >= 0 ? '+' : ''} ${b1 === 1 ? '' : b1 === -1 ? '-' : b1}y = ${c1}`;
    const equation2 = `${a2 === 1 ? '' : a2 === -1 ? '-' : a2}x ${b2 >= 0 ? '+' : ''} ${b2 === 1 ? '' : b2 === -1 ? '-' : b2}y = ${c2}`;

    // Determine operation based on signs
    const shouldAdd = (a1 > 0 && a2 < 0) || (a1 < 0 && a2 > 0);
    const operation = shouldAdd ? 'add' : 'subtract';
    
    const solution = [
        {
            explanation: `Example with ${pattern.name} sign pattern`,
            formula: `\\begin{cases} ${equation1} \\quad (1) \\\\ ${equation2} \\quad (2) \\end{cases}`
        },
        {
            explanation: `To eliminate x, we ${operation} the equations because of the sign pattern`,
            formula: `(1) ${shouldAdd ? '+' : '-'} (2):`
        },
        {
            explanation: "This eliminates the x terms",
            formula: `${shouldAdd ? (b1 + b2) : (b1 - b2)}y = ${shouldAdd ? (c1 + c2) : (c1 - c2)}`
        },
        {
            explanation: "Solve for y",
            formula: `y = ${y}`
        },
        {
            explanation: "Substitute back to find x",
            formula: `x = ${x}`
        },
        {
            explanation: "Final solution",
            formula: `x = ${x}, \\quad y = ${y}`
        }
    ];

    return {
        title: `Sign Variations (${pattern.name.slice(-3, -1)})`,
        equation1,
        equation2,
        solution,
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