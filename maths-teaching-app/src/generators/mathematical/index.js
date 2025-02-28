// src/generators/mathematical/index.js
export * from './squareGenerators';
export * from './squareRootGenerators';

// Explicitly export each generator
import {
    generateSquareQuestion,
    generateSquareAreaQuestion,
    generateSquarePerimeterQuestion,
    generateSquareSideLengthQuestion
} from './squareGenerators';

import {
    generateSquareRootQuestion,
    generateInverseSquareRootQuestion,
    generateSquareRootWordProblem
} from './squareRootGenerators';

// Export all generators
export {
    generateSquareQuestion,
    generateSquareAreaQuestion,
    generateSquarePerimeterQuestion,
    generateSquareSideLengthQuestion,
    generateSquareRootQuestion,
    generateInverseSquareRootQuestion,
    generateSquareRootWordProblem
};

// Helper function to generate starter questions
export const generateStarterQuestions = () => {
    return {
        lastLesson: generateSquareQuestion(),
        lastWeek: generateSquareRootQuestion(),
        lastTopic: generateSquareSideLengthQuestion(),
        lastYear: generateSquareRootWordProblem()
    };
};