// src/content/topics/trigonometry-i/sohcahtoa1/StarterSection.jsx
import React from 'react';
import _ from 'lodash';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import { triangleGenerators } from '../../../../generators/geometry/triangleGenerators';
import { numberPuzzleGenerators } from '../../../../generators/puzzles/numberPuzzles';

/**
 * StarterSection component for SOHCAHTOA lesson
 * Uses Pattern 2 architecture with unified generators:
 * 1. Generators produce configuration objects
 * 2. Section converts configurations to components
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Create generator functions for each section type
  const questionGenerators = [
    // Last Lesson: Find hypotenuse using Pythagoras
    () => {
      // Use unified Pythagoras generator with starter context
      const question = pythagorasGenerators.generateFindHypotenuse({
        sectionType: 'starter',
        difficulty: 'easy',
        units: 'cm'
      });

      // Convert visualization config to React component (Pattern 2)
      question.visualization = (
        <RightTriangle
          {...question.visualization}
          sectionType="starter"
          orientation="default"  // ← Force default for starters
        />
      );

      return question;
    },

    // Last Week: Find missing side using Pythagoras
    () => {
      // Use unified Pythagoras generator with starter context
      const question = pythagorasGenerators.generateFindMissingSide({
        sectionType: 'starter',
        difficulty: 'medium',
        units: 'cm'
      });

      // Convert visualization config to React component (Pattern 2)
      question.visualization = (
        <RightTriangle
          {...question.visualization}
          sectionType="starter"
          orientation="default"  // ← Force default for starters
        />
      );

      return question;
    },

    // Last Topic: Find side length from area (triangle area to side length)
    () => {
      // Use the triangleLengthFromArea generator for side length questions
      const question = triangleGenerators.triangleLengthFromArea({
        units: 'cm'
      });

      // Convert visualization config to React component (Pattern 2)
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