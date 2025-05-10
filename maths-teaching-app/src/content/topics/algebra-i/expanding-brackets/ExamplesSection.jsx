// src/content/topics/algebra-i/expanding-brackets/ExamplesSection.jsx
import React, { useState, useEffect } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import MathDisplay from '../../../../components/common/MathDisplay';
import Rectangle from '../../../../components/math/shapes/Rectangle';
import _ from 'lodash';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for examples section
  const theme = useSectionTheme('examples');

  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);

  // Generate all examples when the component mounts
  useEffect(() => {
    generateExamples();
  }, []);

  // Regenerate all examples
  const generateExamples = () => {
    setExamples([
      {
        title: "Expanding Brackets - Example 1",
        question: "Expand the expression (x + 3)(x + 2)",
        steps: [
          {
            explanation: "We use the FOIL method to expand the expression",
            math: <MathDisplay math="(x + 3)(x + 2)" />
          },
          {
            explanation: "First: Multiply the first terms in each bracket",
            math: <MathDisplay math="\\text{First: } x \\times x = x^2" />
          },
          {
            explanation: "Outside: Multiply the outside terms",
            math: <MathDisplay math="\\text{Outside: } x \\times 2 = 2x" />
          },
          {
            explanation: "Inside: Multiply the inside terms",
            math: <MathDisplay math="\\text{Inside: } 3 \\times x = 3x" />
          },
          {
            explanation: "Last: Multiply the last terms in each bracket",
            math: <MathDisplay math="\\text{Last: } 3 \\times 2 = 6" />
          },
          {
            explanation: "Combine all terms",
            math: <MathDisplay math="x^2 + 2x + 3x + 6" />
          },
          {
            explanation: "Simplify by collecting like terms",
            math: <MathDisplay math="x^2 + 5x + 6" />
          }
        ]
      },
      {
        title: "Expanding Brackets - Example 2",
        question: "Expand the expression (2x - 1)(x + 4)",
        steps: [
          {
            explanation: "We use the FOIL method to expand the expression",
            math: <MathDisplay math="(2x - 1)(x + 4)" />
          },
          {
            explanation: "First: Multiply the first terms in each bracket",
            math: <MathDisplay math="\\text{First: } 2x \\times x = 2x^2" />
          },
          {
            explanation: "Outside: Multiply the outside terms",
            math: <MathDisplay math="\\text{Outside: } 2x \\times 4 = 8x" />
          },
          {
            explanation: "Inside: Multiply the inside terms",
            math: <MathDisplay math="\\text{Inside: } -1 \\times x = -x" />
          },
          {
            explanation: "Last: Multiply the last terms in each bracket",
            math: <MathDisplay math="\\text{Last: } -1 \\times 4 = -4" />
          },
          {
            explanation: "Combine all terms",
            math: <MathDisplay math="2x^2 + 8x - x - 4" />
          },
          {
            explanation: "Simplify by collecting like terms",
            math: <MathDisplay math="2x^2 + 7x - 4" />
          }
        ]
      },
      {
        title: "Placeholder Example",
        question: "This is a placeholder for more examples of expanding brackets",
        steps: [
          {
            explanation: "Full examples coming soon...",
            math: <MathDisplay math="(ax + b)(cx + d) = acx^2 + (ad + bc)x + bd" />
          }
        ]
      }
    ]);
  };

  // Render function for example content
  const renderExampleContent = (example) => {
    if (!example) return null;

    return (
      <div className="flex flex-col gap-6 items-center pt-4">
        <div className="w-full">
          <div className={`p-5 bg-${theme.pastelBg} rounded-lg mb-6`}>
            <p className="text-gray-700 font-medium">{example.question}</p>
          </div>

          {/* Spacer div for teacher's working area */}
          <div className="bg-gray-50 p-6 rounded-lg min-h-40 h-48 border border-dashed border-gray-300">
            {/* Empty space for teacher's working */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Add a themed container with thicker border */}
      <div className="border-2 border-t-4 border-orange-500 rounded-lg shadow-md bg-white overflow-hidden">
        <ExamplesSectionBase
          examples={examples}
          generateExamples={generateExamples}
          renderExampleContent={renderExampleContent}
          currentTopic={currentTopic}
          currentLessonId={currentLessonId}
          currentExampleIndex={currentExampleIndex}
          setCurrentExampleIndex={setCurrentExampleIndex}
          themeKey="examples"
        />
      </div>
    </div>
  );
};

export default ExamplesSection;