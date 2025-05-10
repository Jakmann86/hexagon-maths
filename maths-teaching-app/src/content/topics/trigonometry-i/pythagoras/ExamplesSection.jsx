// Updated maths-teaching-app/src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx
import React, { useState, useEffect } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import MathDisplay from '../../../../components/common/MathDisplay';
import _ from 'lodash';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

// Import our new generators and triangle component
import { pythagoras } from './generators';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for examples section
  const theme = useSectionTheme('examples');

  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [showHeight, setShowHeight] = useState(false);

  // Generate all examples when the component mounts
  useEffect(() => {
    generateExamples();
  }, []);

  // Regenerate all examples using our new generator
  const generateExamples = () => {
    // Use our new generator function
    setExamples(pythagoras.generateExampleQuestions());
    // Reset height toggle when generating new examples
    setShowHeight(false);
  };

  // Handle toggling the height for example visualization
  const handleStepAction = (step) => {
    if (step && step.toggleHeight) {
      setShowHeight(true);
    }

    // Reset functionality 
    if (step && step.reset) {
      setShowHeight(false);
    }
  };

  // Render function for example content
  const renderExampleContent = (example) => {
    if (!example) return null;

    return (
      <div className="flex flex-col-reverse md:flex-row gap-6 items-center pt-4">
        {/* Triangle visualization on the left - moved down and left */}
        <div className="md:w-2/5 flex justify-start pl-4 pt-8 mb-6 md:mb-0">
          {/* Render the triangle visualization from our example data */}
          {example.visualization}
        </div>

        {/* Question with plenty of space for the teacher to write */}
        <div className="md:w-3/5">
          <div className={`p-5 bg-${theme.pastelBg} rounded-lg mb-6`}>
            <p className="text-gray-700 font-medium">{example.question}</p>
          </div>

          {/* Spacer div for teacher's working area - no text */}
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
          onStepAction={handleStepAction}
          themeKey="examples"
        />
      </div>
    </div>
  );
};

export default ExamplesSection;