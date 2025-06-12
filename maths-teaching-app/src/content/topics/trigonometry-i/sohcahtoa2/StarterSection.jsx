// src/content/topics/trigonometry-i/sohcahtoa2/StarterSection.jsx
import React from 'react';
import _ from 'lodash';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import IsoscelesTriangle from '../../../../components/math/shapes/triangles/IsoscelesTriangle';
import { sohcahtoaGenerators } from '../../../../generators/geometry/sohcahtoaGenerators';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import { symbolPuzzleGenerators } from '../../../../generators/puzzles/symbolPuzzleGenerators';
import SymbolPuzzleDisplay from '../../../../components/math/puzzles/SymbolPuzzleDisplay';

/**
 * Generate a mixed SOHCAHTOA find side question for "Last Lesson"
 * Uses existing unified generators to create side-finding questions
 */
const generateSohcahtoaSideQuestion = () => {
    const question = sohcahtoaGenerators.generateFindMissingSideTrig({
        sectionType: 'starter',
        difficulty: 'easy',
        units: 'cm'
    });

    return {
        question: question.questionText || question.question,
        answer: question.answer,
        visualization: (
            <RightTriangle
                {...question.visualization}
                sectionType="starter"
                orientation="default"
            />
        )
    };
};

/**
 * Generate a mixed Pythagoras question for "Last Week"
 * Uses existing unified generators to create both hypotenuse and side-finding questions
 */
const generateMixedPythagorasQuestion = () => {
    // Randomly decide whether to find the hypotenuse or a leg
    const findHypotenuse = Math.random() > 0.5;

    if (findHypotenuse) {
        const question = pythagorasGenerators.generateFindHypotenuse({
            sectionType: 'starter',
            difficulty: 'easy',
            units: 'cm'
        });

        return {
            question: question.questionText || question.question,
            answer: question.answer,
            visualization: (
                <RightTriangle
                    {...question.visualization}
                    sectionType="starter"
                    orientation="default"
                />
            )
        };
    } else {
        const question = pythagorasGenerators.generateFindMissingSide({
            sectionType: 'starter',
            difficulty: 'easy',
            units: 'cm'
        });

        return {
            question: question.questionText || question.question,
            answer: question.answer,
            visualization: (
                <RightTriangle
                    {...question.visualization}
                    sectionType="starter"
                    orientation="default"
                />
            )
        };
    }
};

/**
 * Generate an isosceles triangle area question for "Last Topic"
 * Uses the unified generator from pythagorasGenerators
 */
const generateIsoscelesAreaQuestion = () => {
    const question = pythagorasGenerators.generateIsoscelesArea({
        sectionType: 'starter',
        difficulty: 'easy',
        units: 'cm'
    });

    return {
        question: question.question,
        answer: question.answer,
        visualization: (
            <IsoscelesTriangle
                {...question.visualization}
                showHeight={false}  // ← Add this line to hide the height
                sectionType="starter"
                orientation="default"
            />
        )
    };
};

/**
 * Generate a Type 2 Chain Solving symbol puzzle for "Last Year"
 */
const generateSymbolChainPuzzle = () => {
    const puzzle = symbolPuzzleGenerators.generateChainSolvingPuzzle({
        sectionType: 'starter',
        difficulty: 'easy'
    });

    return {
        question: puzzle.question,
        answer: puzzle.answer,
        visualization: (
            <SymbolPuzzleDisplay
                puzzleDisplay={puzzle.puzzleDisplay}
                containerHeight="120px"
            />
        ),
        difficulty: 'puzzle'
    };
};

/**
 * StarterSection component for SOHCAHTOA 2 lesson (Finding Angles)
 * Uses Pattern 2 architecture with unified generators
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
    // Define the question generators for each section type
    const questionGenerators = [
        // Last Lesson: Find side using SOHCAHTOA
        generateSohcahtoaSideQuestion,

        // Last Week: Mixed Pythagoras questions (hypotenuse and sides)
        generateMixedPythagorasQuestion,

        // Last Topic: Find area of isosceles triangle using Pythagoras
        generateIsoscelesAreaQuestion,

        // Last Year: Symbol chain puzzle
        generateSymbolChainPuzzle
    ];

    // Custom rendering function for question visualizations
    const renderQuestionContent = (questionData, questionType) => {

        if (questionData.puzzleDisplay) {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <SymbolPuzzleDisplay puzzleDisplay={questionData.puzzleDisplay} />
                </div>
            );
        }
        // If there's no visualization data, return null
        if (!questionData.visualization) return null;

        // If the visualization is already a React element (Pattern 2 conversion)
        if (React.isValidElement(questionData.visualization)) {
            // Default rendering for components
            return (
                <div className="w-full h-full flex items-center justify-center">
                    {questionData.visualization}
                </div>
            );
        }

        return null;
    };

    return (
        <StarterSectionBase
            questionGenerators={questionGenerators}
            renderQuestionContent={renderQuestionContent}
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
        />
    );
};

export default StarterSection;