// src/content/topics/algebra-i/expanding-brackets/StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import SohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';
import PythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';
import { expressionsGenerators } from '../../../../generators/algebra/expressionsGenerator';
import { equationGenerators } from '../../../../generators/algebra/equationGenerators';
import _ from 'lodash';

/**
 * Generate a mixed SOHCAHTOA question for "Last Lesson"
 * Uses existing generators to create both side-finding and angle-finding questions
 */
const generateMixedSohcahtoaQuestion = () => {
  // Randomly choose between finding a side or finding an angle
  const findSide = Math.random() > 0.3; // 70% chance of finding a side (more common)
  
  if (findSide) {
    // Use existing tangent or mixed trig generators
    const useBasicTangent = Math.random() > 0.5;
    
    if (useBasicTangent) {
      const generatedQuestion = SohcahtoaGenerators.generateTangentExample({
        sectionType: 'starter'
      });
      
      // Adapt to starter format
      return {
        question: generatedQuestion.questionText,
        answer: generatedQuestion.solution[generatedQuestion.solution.length - 1].formula,
        visualization: (
          <RightTriangle 
            {...generatedQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        )
      };
    } else {
      const generatedQuestion = SohcahtoaGenerators.generateMixedTrigExample({
        sectionType: 'starter'
      });
      
      // Adapt to starter format
      return {
        question: generatedQuestion.questionText,
        answer: generatedQuestion.solution[generatedQuestion.solution.length - 1].formula,
        visualization: (
          <RightTriangle 
            {...generatedQuestion.visualization} 
            sectionType="starter"
            orientation="default"
          />
        )
      };
    }
  } else {
    // Generate an angle-finding question manually (since existing generators focus on sides)
    // Common angles with exact trig values
    const commonAngles = [30, 45, 60];
    const angle = _.sample(commonAngles);
    
    // Values for sine, cosine, and tangent at these angles
    const trigValues = {
      30: { sin: 0.5, cos: 0.866, tan: 0.577 },
      45: { sin: 0.707, cos: 0.707, tan: 1 },
      60: { sin: 0.866, cos: 0.5, tan: 1.732 }
    };
    
    const hypotenuse = _.random(5, 12);
    const opposite = _.random(3, hypotenuse - 1);
    
    // Calculate the sine of the angle
    const sinValue = opposite / hypotenuse;
    
    // Calculate the angle (approximately)
    const calculatedAngle = Math.round(Math.asin(sinValue) * 180 / Math.PI);
    
    return {
      question: `In a right-angled triangle, the hypotenuse is ${hypotenuse} cm and the opposite side is ${opposite} cm. Find the angle θ.`,
      answer: `\\text{Using } \\sin(\\theta) = \\frac{\\text{opposite}}{\\text{hypotenuse}}\\\\
               \\sin(\\theta) = \\frac{${opposite}}{${hypotenuse}} = ${(sinValue).toFixed(3)}\\\\
               \\theta = \\sin^{-1}(${(sinValue).toFixed(3)}) = ${calculatedAngle}°`,
      visualization: (
        <RightTriangle
          base={Math.sqrt(hypotenuse*hypotenuse - opposite*opposite)}
          height={opposite}
          showRightAngle={true}
          showAngles={[false, true]}
          angleLabels={['', 'θ']}
          labelStyle="custom"
          labels={['', `${opposite} cm`, `${hypotenuse} cm`]}
          orientation="default"
          sectionType="starter"
          style={{
            fillColor: '#3498db',
            fillOpacity: 0.2
          }}
        />
      )
    };
  }
};

/**
 * Generate a mixed Pythagoras question for "Last Week"
 * Uses existing generators to create both hypotenuse and side-finding questions
 */
const generateMixedPythagorasQuestion = () => {
  // Randomly decide whether to find the hypotenuse or a leg
  const findHypotenuse = Math.random() > 0.5;
  
  if (findHypotenuse) {
    const generatedQuestion = PythagorasGenerators.findHypotenuse({
      sectionType: 'starter',  // This prevents orientation from being added
      difficulty: 'easy'
    });
    
    // Adapt to starter format
    return {
      question: generatedQuestion.questionText,
      answer: generatedQuestion.solution[generatedQuestion.solution.length - 1].formula,
      visualization: (
        <RightTriangle 
          {...generatedQuestion.visualization} 
          sectionType="starter"
          orientation="default"
        />
      )
    };
  } else {
    const generatedQuestion = PythagorasGenerators.findMissingSide({
      sectionType: 'starter',  // This prevents orientation from being added
      difficulty: 'easy'
    });
    
    // Adapt to starter format
    return {
      question: generatedQuestion.questionText,
      answer: generatedQuestion.solution[generatedQuestion.solution.length - 1].formula,
      visualization: (
        <RightTriangle 
          {...generatedQuestion.visualization} 
          sectionType="starter"
          orientation="default"
        />
      )
    };
  }
};

/**
 * StarterSection component for Expanding Double Brackets lesson
 * Uses Pattern 2 architecture with proper generators
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Define the question generators for each section type
  const questionGenerators = [
    // Last Lesson: Mixed SOHCAHTOA questions (sides and angles)
    generateMixedSohcahtoaQuestion,
    
    // Last Week: Mixed Pythagoras questions (hypotenuse and sides)
    generateMixedPythagorasQuestion,
    
    // Last Topic: Expanding single brackets
    () => expressionsGenerators.generateExpandingSingleBrackets({
      sectionType: 'starter'
    }),
    
    // Last Year: Think of a number problems
    () => equationGenerators.generateThinkOfNumberQuestion({
      sectionType: 'starter'
    })
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
      className="mb-8"
    />
  );
};

export default StarterSection;