// src/content/topics/algebra-i/expanding-brackets/StarterSection.jsx
import React from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import MathDisplay from '../../../../components/common/MathDisplay';
import RightTriangle from '../../../../components/math/shapes/RightTriangle';
import _ from 'lodash';

/**
 * Generate a SOHCAHTOA question for "Last Lesson"
 */
const generateSohcahtoaQuestion = () => {
  // Common angles with exact trig values
  const commonAngles = [30, 45, 60];
  const angle = _.sample(commonAngles);
  
  // Values for sine, cosine, and tangent at these angles
  const trigValues = {
    30: { sin: 0.5, cos: 0.866, tan: 0.577 },
    45: { sin: 0.707, cos: 0.707, tan: 1 },
    60: { sin: 0.866, cos: 0.5, tan: 1.732 }
  };
  
  // Randomly choose between finding a side and finding an angle
  const findSide = Math.random() > 0.5; // 50% chance of finding a side
  
  if (findSide) {
    // Choose which side to find
    const sides = ['opposite', 'adjacent', 'hypotenuse'];
    const sideToFind = _.sample(sides);
    
    // Choose which trig ratio to use based on the side to find
    let trigRatio, knownSide, knownValue;
    
    if (sideToFind === 'opposite') {
      // SOH or TOA
      const useSOH = Math.random() > 0.5;
      trigRatio = useSOH ? 'sin' : 'tan';
      knownSide = useSOH ? 'hypotenuse' : 'adjacent';
      knownValue = _.random(5, 10);
    } else if (sideToFind === 'adjacent') {
      // CAH or TOA
      const useCAH = Math.random() > 0.5;
      trigRatio = useCAH ? 'cos' : 'tan';
      knownSide = useCAH ? 'hypotenuse' : 'opposite';
      knownValue = _.random(5, 10);
    } else { // hypotenuse
      // SOH or CAH
      const useSOH = Math.random() > 0.5;
      trigRatio = useSOH ? 'sin' : 'cos';
      knownSide = useSOH ? 'opposite' : 'adjacent';
      knownValue = _.random(5, 10);
    }
    
    // Calculate the unknown side
    const ratio = trigValues[angle][trigRatio];
    let unknownValue;
    
    if (trigRatio === 'sin') { // SOH
      unknownValue = sideToFind === 'opposite' ? knownValue * ratio : knownValue / ratio;
    } else if (trigRatio === 'cos') { // CAH
      unknownValue = sideToFind === 'adjacent' ? knownValue * ratio : knownValue / ratio;
    } else { // TOA
      unknownValue = sideToFind === 'opposite' ? knownValue * ratio : knownValue / ratio;
    }
    
    // Round to 2 decimal places
    unknownValue = Math.round(unknownValue * 100) / 100;
    
    return {
      question: `In a right-angled triangle, the angle is ${angle}° and the ${knownSide} is ${knownValue} cm. Find the ${sideToFind}.`,
      answer: `\\text{Using ${trigRatio}(${angle}°) = ${ratio.toFixed(3)}}\\\\
               ${sideToFind === 'opposite' ? `\\text{opposite} = ${knownValue} \\times ${ratio.toFixed(3)} = ${unknownValue}\\text{ cm}` : 
                 sideToFind === 'adjacent' ? `\\text{adjacent} = ${knownValue} \\times ${ratio.toFixed(3)} = ${unknownValue}\\text{ cm}` :
                 `\\text{hypotenuse} = \\frac{${knownValue}}{${ratio.toFixed(3)}} = ${unknownValue}\\text{ cm}`}`,
      visualization: (
        <RightTriangle
          base={sideToFind === 'adjacent' ? 0 : (sideToFind === 'opposite' ? knownValue : (knownSide === 'adjacent' ? knownValue : 0))}
          height={sideToFind === 'opposite' ? 0 : (sideToFind === 'adjacent' ? knownValue : (knownSide === 'opposite' ? knownValue : 0))}
          showRightAngle={true}
          showAngles={[false, true]}
          angleLabels={['', `${angle}°`]}
          labelStyle="custom"
          labels={[`${sideToFind === 'adjacent' ? '?' : (knownSide === 'adjacent' ? knownValue + ' cm' : '')}`, 
                   `${sideToFind === 'opposite' ? '?' : (knownSide === 'opposite' ? knownValue + ' cm' : '')}`,
                   `${sideToFind === 'hypotenuse' ? '?' : (knownSide === 'hypotenuse' ? knownValue + ' cm' : '')}`]}
          orientation="default"
          style={{
            fillColor: '#3498db',
            fillOpacity: 0.2
          }}
        />
      )
    };
  } else {
    // Find an angle
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
 * Generate a Pythagoras question for "Last Week"
 */
const generatePythagorasQuestion = () => {
  // Use a Pythagorean triple for clean results
  const triples = [
    { a: 3, b: 4, c: 5 },
    { a: 5, b: 12, c: 13 },
    { a: 6, b: 8, c: 10 },
    { a: 8, b: 15, c: 17 }
  ];
  
  const triple = _.sample(triples);
  
  // Randomly decide whether to find the hypotenuse or a leg
  const findHypotenuse = Math.random() > 0.5;
  
  if (findHypotenuse) {
    return {
      question: `Find the length of the hypotenuse in this right-angled triangle.`,
      answer: `c = \\sqrt{${triple.a}^2 + ${triple.b}^2} = \\sqrt{${triple.a * triple.a} + ${triple.b * triple.b}} = \\sqrt{${triple.a * triple.a + triple.b * triple.b}} = ${triple.c}\\text{ cm}`,
      visualization: (
        <RightTriangle
          base={triple.a}
          height={triple.b}
          showRightAngle={true}
          labelStyle="custom"
          labels={[`${triple.a} cm`, `${triple.b} cm`, "?"]}
          orientation="default"
          style={{
            fillColor: '#3498db',
            fillOpacity: 0.2
          }}
        />
      )
    };
  } else {
    // Find a leg instead (randomly choose a or b)
    const findSideA = Math.random() > 0.5;
    const knownLeg = findSideA ? triple.b : triple.a;
    const missingLeg = findSideA ? triple.a : triple.b;
    
    return {
      question: `Find the missing side length in this right-angled triangle.`,
      answer: `\\text{Using Pythagoras' theorem: } c^2 = a^2 + b^2\\\\
               \\text{Rearranging: } ${findSideA ? "a" : "b"}^2 = c^2 - ${findSideA ? "b" : "a"}^2\\\\
               ${findSideA ? "a" : "b"}^2 = ${triple.c}^2 - ${knownLeg}^2 = ${triple.c * triple.c} - ${knownLeg * knownLeg} = ${missingLeg * missingLeg}\\\\
               ${findSideA ? "a" : "b"} = \\sqrt{${missingLeg * missingLeg}} = ${missingLeg}\\text{ cm}`,
      visualization: (
        <RightTriangle
          base={findSideA ? 0 : triple.a}
          height={findSideA ? triple.b : 0}
          showRightAngle={true}
          labelStyle="custom"
          labels={[
            findSideA ? "?" : `${triple.a} cm`, 
            findSideA ? `${triple.b} cm` : "?", 
            `${triple.c} cm`
          ]}
          orientation="default"
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
 * Generate a "think of a number" question for "Last Year"
 */
const generateThinkOfNumberQuestion = () => {
  // Generate a number between 2 and 20
  const originalNumber = _.random(2, 20);
  
  // Generate simple operations
  const operations = [
    { type: 'multiply', value: _.random(2, 5) },
    { type: 'add', value: _.random(5, 15) }
  ];
  
  // Calculate the final number
  let currentNumber = originalNumber;
  const steps = [];
  
  for (const operation of operations) {
    const oldNumber = currentNumber;
    if (operation.type === 'multiply') {
      currentNumber *= operation.value;
      steps.push(`${oldNumber} × ${operation.value} = ${currentNumber}`);
    } else if (operation.type === 'add') {
      currentNumber += operation.value;
      steps.push(`${oldNumber} + ${operation.value} = ${currentNumber}`);
    }
  }
  
  // Generate a real-world context
  const contexts = [
    `A delivery service charges £${operations[0].value} per mile, plus a fixed fee of £${operations[1].value}. If the total cost is £${currentNumber}, how many miles was the delivery?`,
    `A plumber charges £${operations[0].value} per hour, plus a call-out fee of £${operations[1].value}. If the total bill was £${currentNumber}, how many hours did the job take?`,
    `A recipe requires ${operations[0].value} eggs per person, plus ${operations[1].value} extra for the sauce. If the recipe calls for ${currentNumber} eggs total, how many people is it meant to serve?`
  ];
  
  const context = _.sample(contexts);
  
  return {
    question: context,
    answer: `\\text{Let's call the unknown value } x\\\\
             \\text{Then: } ${operations[0].value}x + ${operations[1].value} = ${currentNumber}\\\\
             \\text{Subtract ${operations[1].value} from both sides: } ${operations[0].value}x = ${currentNumber - operations[1].value}\\\\
             \\text{Divide both sides by ${operations[0].value}: } x = ${originalNumber}`,
    difficulty: 'text'  // Mark as text to avoid LaTeX formatting issues
  };
};

/**
 * Generate an expanding single brackets question for "Last Topic"
 */
const generateExpandingSingleBracketsQuestion = () => {
  // Generate a simple expression with single brackets
  const outsideFactor = _.random(2, 9);
  const firstTerm = _.random(1, 10);
  const secondTerm = _.random(1, 10);
  
  // Calculate the expanded form
  const expandedFirst = outsideFactor * firstTerm;
  const expandedSecond = outsideFactor * secondTerm;
  
  return {
    question: `Expand ${outsideFactor}(${firstTerm}x + ${secondTerm})`,
    answer: `${outsideFactor}(${firstTerm}x + ${secondTerm}) = ${outsideFactor} \\times ${firstTerm}x + ${outsideFactor} \\times ${secondTerm} = ${expandedFirst}x + ${expandedSecond}`
  };
};

/**
 * StarterSection component for Expanding Brackets lesson
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Define the question generators for each section type
  const questionGenerators = [
    generateSohcahtoaQuestion,              // Last Lesson (SOHCAHTOA mix)
    generatePythagorasQuestion,             // Last Week 
    generateExpandingSingleBracketsQuestion, // Last Topic (expanding brackets)
    generateThinkOfNumberQuestion,          // Last Year
  ];

  return (
    <StarterSectionBase
      questionGenerators={questionGenerators}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
      className="mb-8"
    />
  );
};

export default StarterSection;