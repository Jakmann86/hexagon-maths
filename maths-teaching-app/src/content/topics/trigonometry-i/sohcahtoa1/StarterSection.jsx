// src/content/topics/trigonometry-i/sohcahtoa1/StarterSection.jsx
import React from 'react';
import _ from 'lodash';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import PythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';
import { triangleGenerators } from '../../../../generators/geometry/triangleGenerators';
import { numberPuzzleGenerators } from '../../../../generators/puzzles/numberPuzzles';

/**
 * StarterSection component for SOHCAHTOA lesson
 * Uses Pattern 2 architecture:
 * 1. Generators produce configuration objects
 * 2. Section converts configurations to components
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Create generator functions for each section type
  const questionGenerators = [
    // Last Lesson: Find hypotenuse
    () => {
      // Get configuration from generator with starter context
      const generatedQuestion = PythagorasGenerators.findHypotenuse({
        sectionType: 'starter',  // This prevents orientation from being added
        difficulty: 'easy'
      });

      // Adapt to the format expected by StarterSectionBase
      const question = {
        question: generatedQuestion.questionText,
        answer: generatedQuestion.solution[generatedQuestion.solution.length - 1].formula,
        // Force default orientation for starter consistency + clean positioning
        visualization: (
          <RightTriangle 
            {...generatedQuestion.visualization} 
            sectionType="starter"
            orientation="default"  // ← Force default for starters
          />
        )
      };

      return question;
    },

    // Last Week: Find missing side
    () => {
      // Get configuration from generator with starter context
      const generatedQuestion = PythagorasGenerators.findMissingSide({
        sectionType: 'starter',  // This prevents orientation from being added
        difficulty: 'medium'
      });

      // Adapt to the format expected by StarterSectionBase
      const question = {
        question: generatedQuestion.questionText,
        answer: generatedQuestion.solution[generatedQuestion.solution.length - 1].formula,
        // Force default orientation for starter consistency + clean positioning
        visualization: (
          <RightTriangle 
            {...generatedQuestion.visualization} 
            sectionType="starter"
            orientation="default"  // ← Force default for starters
          />
        )
      };

      return question;
    },

    // Last Topic: Find side length from area (NOT find area)
    () => {
      // Use the triangleLengthFromArea generator for side length questions
      const question = triangleGenerators.triangleLengthFromArea({
        units: 'cm'
      });

      // Force default orientation for starter consistency + clean positioning
      question.visualization = (
        <RightTriangle 
          {...question.visualization} 
          sectionType="starter"
          orientation="default"  // ← Force default for starters
        />
      );

      return question;
    },

    // Last Year: Number puzzle
    () => numberPuzzleGenerators.numberPuzzle1()
  ];

  // Custom rendering function for question visualizations
  const renderQuestionContent = (questionData, questionType) => {
    // If there's no visualization data, return null
    if (!questionData.visualization) return null;

    // If the visualization is already a React element
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