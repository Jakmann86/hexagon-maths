// src/content/topics/trigonometry-i/sohcahtoa1/ExamplesSection.jsx
import React, { useState, useEffect } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import MathDisplay from '../../../../components/common/MathDisplay';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import SohcahtoaGenerators from '../../../../generators/geometry/sohcahtoaGenerators';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for examples section
  const theme = useSectionTheme('examples');

  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [showAngle, setShowAngle] = useState(false);

  // Generate all examples when the component mounts
  useEffect(() => {
    generateExamples();
  }, []);

  // Regenerate all examples
  const generateExamples = () => {
    setExamples(SohcahtoaGenerators.generateExampleQuestions());
    setShowAngle(false);
  };

  // Handle toggling the angle display in the triangle
  const handleStepAction = (step) => {
    if (step && step.toggleAngle) {
      setShowAngle(true);
    }

    // Reset functionality
    if (step && step.reset) {
      setShowAngle(false);
    }
  };

  // Render function for example content
  const renderExampleContent = (example) => {
    if (!example) return null;

    // Convert visualization config to component
    return (
      <div className="flex flex-col-reverse md:flex-row gap-6 items-center pt-4">
        {/* Triangle visualization on the left */}
        <div className="md:w-2/5 flex justify-start pl-4 pt-8 mb-6 md:mb-0">
          <RightTriangle
            {...example.visualization}
            // Override properties based on component state
            showAngles={showAngle ? [true, false] : example.visualization.showAngles}
            style={{
              fillColor: '#FF9800',
              fillOpacity: 0.2,
              strokeColor: '#E65100'
            }}
          />
        </div>

        {/* Question with working area */}
        <div className="md:w-3/5">
          <div className={`p-5 bg-${theme.pastelBg} rounded-lg mb-6`}>
            <p className="text-gray-700 font-medium">{example.questionText}</p>
          </div>

          {/* Working area for teacher */}
          <div className="bg-gray-50 p-6 rounded-lg min-h-40 h-48 border border-dashed border-gray-300">
            {/* Empty space for teacher's working */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Themed container with orange accent */}
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