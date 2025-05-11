// maths-teaching-app/src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx

import React, { useState, useEffect } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import PythagorasExamplesProvider from '../../../providers/geometry/PythagorasExamplesProvider';

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  // State for examples and UI interactions
  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [interactiveState, setInteractiveState] = useState({
    showHeight: false,
    showAngles: false
  });

  // Generate examples when the component mounts
  useEffect(() => {
    generateExamples();
  }, []);

  // Function to generate new examples
  const generateExamples = () => {
    // Get examples from the provider
    const newExamples = PythagorasExamplesProvider.generateExamples();
    setExamples(newExamples);
    
    // Reset interactive state
    setInteractiveState({
      showHeight: false,
      showAngles: false
    });
  };

  // Handle step actions for interactive elements
  const handleStepAction = (step) => {
    if (!step) return;
    
    // Let the provider handle the step action logic
    const newState = PythagorasExamplesProvider.handleStepAction(step, interactiveState);
    setInteractiveState(newState);
  };

  // Render example content - now defined in the component
  const renderExampleContent = (example) => {
    if (!example) return null;

    // Get configuration from provider
    const config = PythagorasExamplesProvider.getExampleContentConfig(example);
    if (!config) return null;

    return (
      <div className="flex flex-col-reverse md:flex-row gap-6 items-center pt-4">
        {/* Visualization on the left for medium+ screens */}
        <div className="md:w-2/5 flex justify-start pl-4 pt-8 mb-6 md:mb-0">
          {config.visualization}
        </div>

        {/* Question with workspace on the right */}
        <div className="md:w-3/5">
          <div className="p-5 bg-orange-50 rounded-lg mb-6">
            <p className="text-gray-700 font-medium">{config.question}</p>
          </div>

          {/* Workspace area for teacher */}
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