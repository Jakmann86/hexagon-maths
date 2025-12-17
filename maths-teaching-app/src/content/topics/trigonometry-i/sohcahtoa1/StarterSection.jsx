// src/content/topics/trigonometry-i/sohcahtoa1/StarterSection.jsx
// SOHCAHTOA Starter Section - V2.0
// Uses StarterSectionBase with RightTriangleSVG (not JSXGraph)

import React from 'react';
import _ from 'lodash';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangleSVG from '../../../../components/math/visualizations/RightTriangleSVG';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';
import { triangleGenerators } from '../../../../generators/geometry/triangleGenerators';
import { numberPuzzleGenerators } from '../../../../generators/puzzles/numberPuzzles';

/**
 * StarterSection component for SOHCAHTOA lesson
 * Uses Pattern 2 architecture:
 * 1. Generators produce configuration objects
 * 2. Section converts configurations to SVG components
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  
  // Create generator functions for each section type
  const questionGenerators = [
    // Last Lesson: Find hypotenuse using Pythagoras
    () => {
      const question = pythagorasGenerators.generateFindHypotenuse({
        sectionType: 'starter',
        difficulty: 'easy',
        units: 'cm'
      });

      // Convert visualization config to RightTriangleSVG (Pattern 2)
      if (question.visualization) {
        const vizConfig = question.visualization;
        question.visualization = (
          <RightTriangleSVG
            config={{
              base: vizConfig.base,
              height: vizConfig.height,
              hypotenuse: vizConfig.hypotenuse,
              labels: {
                base: `${vizConfig.base} cm`,
                height: `${vizConfig.height} cm`,
                hypotenuse: '?' // Unknown - this is what we're finding
              },
              showRightAngle: true,
              orientation: 'default',
              units: 'cm'
            }}
            showAnswer={false}
          />
        );
      }

      return question;
    },

    // Last Week: Find missing side using Pythagoras
    () => {
      const question = pythagorasGenerators.generateFindMissingSide({
        sectionType: 'starter',
        difficulty: 'medium',
        units: 'cm'
      });

      // Convert visualization config to RightTriangleSVG (Pattern 2)
      if (question.visualization) {
        const vizConfig = question.visualization;
        const unknownSide = vizConfig.unknownSide;
        
        question.visualization = (
          <RightTriangleSVG
            config={{
              base: vizConfig.base,
              height: vizConfig.height,
              hypotenuse: vizConfig.hypotenuse,
              unknownSide: unknownSide,
              labels: {
                base: unknownSide === 'base' ? '?' : `${vizConfig.base} cm`,
                height: unknownSide === 'height' ? '?' : `${vizConfig.height} cm`,
                hypotenuse: unknownSide === 'hypotenuse' ? '?' : `${vizConfig.hypotenuse} cm`
              },
              showRightAngle: true,
              orientation: 'default',
              units: 'cm'
            }}
            showAnswer={false}
          />
        );
      }

      return question;
    },

    // Last Topic: Find side length from area
    () => {
      const question = triangleGenerators.triangleLengthFromArea({
        units: 'cm'
      });

      // Convert visualization config to RightTriangleSVG (Pattern 2)
      if (question.visualization) {
        const vizConfig = question.visualization;
        question.visualization = (
          <RightTriangleSVG
            config={{
              base: vizConfig.base,
              height: vizConfig.height,
              unknownSide: vizConfig.unknownSide,
              labels: vizConfig.labels,
              showRightAngle: true,
              orientation: 'default',
              units: 'cm'
            }}
            showAnswer={false}
          />
        );
      }

      return question;
    },

    // Last Year: Number puzzle (no visualization needed)
    () => numberPuzzleGenerators.numberPuzzle1()
  ];

  // Custom rendering function for question visualizations
  const renderQuestionContent = (questionData, questionType) => {
    if (!questionData.visualization) return null;

    // If the visualization is already a React element (Pattern 2 conversion)
    if (React.isValidElement(questionData.visualization)) {
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