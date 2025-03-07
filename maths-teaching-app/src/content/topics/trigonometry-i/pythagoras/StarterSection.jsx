// src/content/topics/trigonometry-i/pythagoras/StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import {
    generateSquareQuestion,
    generateSquareRootQuestion,
    generateInverseSquareRootQuestion,
    generateSquarePerimeterQuestion
} from '../../../../generators/mathematical';

const StarterSection = ({ currentTopic, currentLessonId }) => {
    const questionGenerators = [
        () => generateSquareQuestion({ minSide: 3, maxSide: 8, units: 'cm' }),
        () => generateSquareRootQuestion({ minRoot: 2, maxRoot: 6, units: 'cm' }),
        () => generateInverseSquareRootQuestion({ minSide: 3, maxSide: 7, units: 'cm' }),
        () => generateSquarePerimeterQuestion({ minSide: 4, maxSide: 9, units: 'cm' })
    ];

    return (
        <StarterSectionBase
            questionGenerators={questionGenerators}
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
        />
    );
};

export default StarterSection;