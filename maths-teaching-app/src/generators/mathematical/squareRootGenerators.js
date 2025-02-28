// src/generators/mathematical/squareRootGenerators.js
import _ from 'lodash';

export const generateSquareRootQuestion = ({ units = 'cm' } = {}) => {
    const root = _.random(2, 10);
    const area = root * root;
    
    return {
        question: `A square has an area of ${area}${units}². What is its side length?`,
        answer: `\\sqrt{${area}} = ${root}${units}`
    };
};

export const generateInverseSquareRootQuestion = ({ units = 'cm' } = {}) => {
    const side = _.random(2, 10);
    const area = side * side;
    
    return {
        question: `A square has sides of length ${side}${units}. What is its area?`,
        answer: `${side}^2 = ${area}${units}^2`
    };
};

export const generateSquareRootWordProblem = ({ units = 'cm' } = {}) => {
    const farmSide = _.random(50, 200);
    const farmArea = farmSide * farmSide;
    
    return {
        question: `A farmer has a square farm with an area of ${farmArea}${units}². How long is each side of the farm?`,
        answer: `\\sqrt{${farmArea}} = ${farmSide}${units}`
    };
};