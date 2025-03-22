// src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx
import React, { useState, useEffect } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import { RefreshCw } from 'lucide-react';
import MathDisplay from '../../../../components/common/MathDisplay';
import RightTriangle from '../../../../components/math/shapes/RightTriangle';
import IsoscelesTriangle from '../../../../components/math/shapes/IsoscelesTriangle';
import _ from 'lodash';

// Pythagorean triples and non-integer examples
const PYTHAGOREAN_EXAMPLES = [
  // Integer examples (Pythagorean triples)
  { a: 3, b: 4, c: 5 },
  { a: 5, b: 12, c: 13 },
  { a: 6, b: 8, c: 10 },
  { a: 8, b: 15, c: 17 },
  { a: 9, b: 12, c: 15 },
  { a: 7, b: 24, c: 25 },
  // Non-integer examples
  { a: 5, b: 6, c: 7.81 },
  { a: 4, b: 7, c: 8.06 },
  { a: 6, b: 9, c: 10.82 },
  { a: 5, b: 8, c: 9.43 },
  { a: 3, b: 7, c: 7.62 }
];

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [showHeight, setShowHeight] = useState(false);
  
  // Generate all examples when the component mounts
  useEffect(() => {
    generateExamples();
  }, []);
  
  // Regenerate all examples
  const generateExamples = () => {
    setExamples([
      generateHypotenuseExample(),
      generateLegExample(),
      generateIsoscelesExample()
    ]);
    // Reset height toggle when generating new examples
    setShowHeight(false);
  };
  
  // Generate an example for finding the hypotenuse
  const generateHypotenuseExample = () => {
    // Include some examples with decimal answers
    const example = _.sample(PYTHAGOREAN_EXAMPLES);
    
    // Format calculator input
    const calculatorInput = `\\sqrt{${example.a}^2 + ${example.b}^2}`;
    
    return {
      title: "Find the Hypotenuse",
      question: `Find the length of the hypotenuse. The other sides are ${example.a} cm and ${example.b} cm.`,
      triple: example,
      missingValue: 'c',
      steps: [
        {
          explanation: "Use Pythagoras' theorem: a² + b² = c²",
          math: <MathDisplay math="a^2 + b^2 = c^2" />
        },
        {
          explanation: "Substitute the known values",
          math: <MathDisplay math={`${example.a}^2 + ${example.b}^2 = c^2`} />
        },
        {
          explanation: "Calculate the squares",
          math: <MathDisplay math={`${example.a * example.a} + ${example.b * example.b} = c^2`} />
        },
        {
          explanation: "Add the values",
          math: <MathDisplay math={`${example.a * example.a + example.b * example.b} = c^2`} />
        },
        {
          explanation: "Take the square root of both sides",
          math: <MathDisplay math={`c = \\sqrt{${example.a * example.a + example.b * example.b}} = ${example.c}`} />
        },
        {
          explanation: "Calculator input:",
          math: <MathDisplay math={calculatorInput} />
        },
        {
          explanation: "The hypotenuse is",
          math: <MathDisplay math={`c = ${example.c}\\text{ cm}`} />
        }
      ]
    };
  };
  
  // Generate an example for finding a leg (non-hypotenuse side)
  const generateLegExample = () => {
    // Include some examples with decimal answers
    const example = _.sample(PYTHAGOREAN_EXAMPLES);
    
    // Randomly decide whether to find side a or b
    const findSide = _.sample(['a', 'b']);
    const knownSide = findSide === 'a' ? 'b' : 'a';
    
    // Format calculator input
    const calculatorInput = `\\sqrt{${example.c}^2 - ${example[knownSide]}^2}`;
    
    return {
      title: "Find the Missing Side",
      question: `Find the missing side. The hypotenuse is ${example.c} cm and the other side is ${example[knownSide]} cm.`,
      triple: example,
      missingValue: findSide,
      knownSide: knownSide,
      steps: [
        {
          explanation: "Use Pythagoras' theorem: a² + b² = c²",
          math: <MathDisplay math="a^2 + b^2 = c^2" />
        },
        {
          explanation: "Rearrange to find the missing side",
          math: <MathDisplay math={`${findSide}^2 = c^2 - ${knownSide}^2`} />
        },
        {
          explanation: "Substitute the known values",
          math: <MathDisplay math={`${findSide}^2 = ${example.c}^2 - ${example[knownSide]}^2`} />
        },
        {
          explanation: "Calculate the squares",
          math: <MathDisplay math={`${findSide}^2 = ${example.c * example.c} - ${example[knownSide] * example[knownSide]}`} />
        },
        {
          explanation: "Subtract the values",
          math: <MathDisplay math={`${findSide}^2 = ${example.c * example.c - example[knownSide] * example[knownSide]}`} />
        },
        {
          explanation: "Take the square root of both sides",
          math: <MathDisplay math={`${findSide} = \\sqrt{${example.c * example.c - example[knownSide] * example[knownSide]}} = ${example[findSide]}`} />
        },
        {
          explanation: "Calculator input:",
          math: <MathDisplay math={calculatorInput} />
        },
        {
          explanation: "The missing side is",
          math: <MathDisplay math={`${findSide} = ${example[findSide]}\\text{ cm}`} />
        }
      ]
    };
  };
  
  // Generate an isosceles triangle example for finding area
  const generateIsoscelesExample = () => {
    // Create an isosceles triangle with a height that forms a right angle
    const base = _.random(6, 12, false); // Even number for easier splitting
    const height = _.random(4, 10);
    const halfBase = base / 2;
    
    // Calculate the equal sides using Pythagoras' theorem
    const equalSide = Math.sqrt(halfBase * halfBase + height * height);
    // Keep 2 decimal places for non-integer results
    const roundedEqualSide = Math.round(equalSide * 100) / 100;
    
    // Calculate area
    const area = (base * height) / 2;
    const roundedArea = Math.round(area * 100) / 100;
    
    return {
      title: "Find the Area",
      question: `Find the area of this isosceles triangle. The base is ${base} cm and the equal sides are ${roundedEqualSide} cm each.`,
      base: base,
      height: height,
      equalSide: roundedEqualSide,
      area: roundedArea,
      halfBase: halfBase,
      type: 'isosceles',
      steps: [
        {
          explanation: "To find the area, we need the height of the triangle",
          math: <MathDisplay math="\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}" />
        },
        {
          explanation: "Let's draw the height and split the triangle into two right triangles",
          math: <MathDisplay math="\\text{The height divides the base into two equal parts}" />,
          toggleHeight: true
        },
        {
          explanation: "The base is split into two equal parts",
          math: <MathDisplay math={`\\text{Half base} = \\frac{${base}}{2} = ${halfBase}\\text{ cm}`} />
        },
        {
          explanation: "Using Pythagoras' theorem in the right triangle, we can find the height",
          math: <MathDisplay math={`h^2 + (\\frac{b}{2})^2 = s^2`} />
        },
        {
          explanation: "Substitute the known values",
          math: <MathDisplay math={`h^2 + ${halfBase}^2 = ${roundedEqualSide}^2`} />
        },
        {
          explanation: "Rearrange to find h²",
          math: <MathDisplay math={`h^2 = ${roundedEqualSide}^2 - ${halfBase}^2`} />
        },
        {
          explanation: "Calculate",
          math: <MathDisplay math={`h^2 = ${roundedEqualSide * roundedEqualSide} - ${halfBase * halfBase}`} />
        },
        {
          explanation: "Solve for h",
          math: <MathDisplay math={`h = \\sqrt{${roundedEqualSide * roundedEqualSide - halfBase * halfBase}} = ${height}`} />
        },
        {
          explanation: "Now we can calculate the area",
          math: <MathDisplay math={`\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height} = ${roundedArea}\\text{ cm}^2`} />
        }
      ]
    };
  };
  
  // Handle toggling the height for isosceles triangle
  const handleStepAction = (step) => {
    if (step && step.toggleHeight) {
      setShowHeight(true);
    }
  };
  
  // Render function for example content
  const renderExampleContent = (example) => {
    if (!example) return null;
    
    // Render the appropriate triangle based on example type
    const triangleVisualization = example.type === 'isosceles' 
      ? renderIsoscelesTriangle(example)
      : renderRightTriangle(example);
    
    return (
      <div className="flex flex-col-reverse md:flex-row gap-6 items-start pt-2">
        {/* Triangle visualization on the left */}
        <div className="md:w-2/5 flex justify-center mb-6 md:mb-0">
          {triangleVisualization}
        </div>
        
        {/* Question with plenty of space for the teacher to write */}
        <div className="md:w-3/5">
          <div className="p-5 bg-indigo-50 rounded-lg mb-6">
            <p className="text-indigo-900 font-medium">{example.question}</p>
          </div>
          
          {/* Spacer div for teacher's working area - no text */}
          <div className="bg-gray-50 p-6 rounded-lg min-h-40 h-48 border border-dashed border-gray-300">
            {/* Empty space for teacher's working */}
          </div>
        </div>
      </div>
    );
  };
  
  // Render an isosceles triangle
  const renderIsoscelesTriangle = (example) => {
    return (
      <div style={{ height: "280px", width: "100%" }}>
        <IsoscelesTriangle 
          base={example.base}
          height={example.height}
          showHeight={showHeight}
          labelStyle="numeric"
          labels={{
            sides: [
              `${example.base} cm`, 
              `${example.equalSide} cm`, 
              `${example.equalSide} cm`
            ]
          }}
          units="cm"
          style={{
            fillColor: "#4CAF50", // Green
            fillOpacity: 0.2,
            heightColor: "#2196F3" // Blue
          }}
        />
      </div>
    );
  };
  
  // Render a right triangle
  const renderRightTriangle = (example) => {
    const triple = example.triple;
    const missingValue = example.missingValue;
    
    // Determine what to show as labels
    const aLabel = missingValue === 'a' ? '?' : `${triple.a} cm`;
    const bLabel = missingValue === 'b' ? '?' : `${triple.b} cm`;
    const cLabel = missingValue === 'c' ? '?' : `${triple.c} cm`;
    
    return (
      <div style={{ height: "280px", width: "100%" }}>
        <RightTriangle 
          base={triple.a}
          height={triple.b}
          showRightAngle={true}
          labelStyle="custom"
          labels={{
            sides: [aLabel, bLabel, cLabel]
          }}
          units="cm"
          style={{
            fillColor: "#3F51B5", // Indigo
            fillOpacity: 0.2
          }}
        />
      </div>
    );
  };
  
  // Fixed the navigation buttons to properly change example types
  const customHeader = (title, generateNewExamples) => {
    // Get the current example for the title
    const currentExample = examples[currentExampleIndex];
    
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800">{currentExample?.title || title}</h3>
        
        {/* New Question Button - Orange themed */}
        <button
          onClick={() => {
            generateNewExamples();
            setShowHeight(false); // Reset height toggle when generating new examples
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all"
        >
          <RefreshCw size={18} />
          <span>New Question</span>
        </button>
        
        {/* Navigation Buttons - Orange themed */}
        <div className="flex gap-2">
          {examples.map((_, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                index === currentExampleIndex
                  ? 'bg-orange-500 text-white'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
              onClick={() => {
                setCurrentExampleIndex(index);
                setShowHeight(false); // Reset height toggle when changing examples
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ExamplesSectionBase
      examples={examples}
      generateExamples={generateExamples}
      renderExampleContent={renderExampleContent}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
      currentExampleIndex={currentExampleIndex}
      setCurrentExampleIndex={setCurrentExampleIndex}
      customHeader={customHeader}
      useCustomHeaderOnly={true} // Only use custom header, no separate navigation
      hideTitle={true} // Hide the "Worked Examples" title
      onStepAction={handleStepAction} // Handle step actions like toggling the height
    />
  );
};

export default ExamplesSection;