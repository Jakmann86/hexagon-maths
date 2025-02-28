// src/generators/mathematical/squareGenerators.js
import _ from 'lodash';

const generateSquareQuestion = ({ units = 'cm', minSide = 3, maxSide = 12 } = {}) => {
    const side = _.random(minSide, maxSide);
    
    return {
        question: `Describe a square with side length ${side}${units}`,
        answer: `A square with side length ${side}${units} has area ${side * side}${units}² and perimeter ${side * 4}${units}`
    };
};

const generateSquareAreaQuestion = ({ units = 'cm' } = {}) => {
    const side = _.random(3, 12);
    
    return {
        question: `Find the area of a square with side length ${side}${units}`,
        answer: `${side}^2 = ${side * side}${units}^2`
    };
};

const generateSquarePerimeterQuestion = ({ units = 'cm' } = {}) => {
    const side = _.random(3, 12);
    
    return {
        question: `Find the perimeter of a square with side length ${side}${units}`,
        answer: `4 \\times ${side} = ${side * 4}${units}`
    };
};

const generateSquareSideLengthQuestion = ({ units = 'cm' } = {}) => {
    const side = _.random(3, 10);
    const perimeter = side * 4;
    
    return {
        question: `Find the side length of a square with perimeter ${perimeter}${units}`,
        answer: `\\frac{${perimeter}}{4} = ${side}${units}`
    };
};

export {
    generateSquareQuestion,
    generateSquareAreaQuestion,
    generateSquarePerimeterQuestion,
    generateSquareSideLengthQuestion
};