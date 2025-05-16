// src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import PythagorasExamplesProvider from '../../../providers/geometry/PythagorasExamplesProvider';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';

// Debug helper component
const DebugOutput = ({ data, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-2 border border-gray-300 rounded p-2 bg-gray-100">
      <div
        className="font-mono text-sm flex justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold">{title || 'Debug'}</span>
        <span>{isExpanded ? '▼' : '►'}</span>
      </div>
      {isExpanded && (
        <pre className="mt-2 text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  // State setup
  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [interactiveState, setInteractiveState] = useState({
    showHeight: false,
    showAngles: false
  });

  const initializedRef = useRef(false);
  const regenerateCountRef = useRef(0);

  // Visual key generation
  const getVisualizationKey = useCallback((exampleIndex) => {
    return `viz-${regenerateCountRef.current}-tab-${exampleIndex}`;
  }, []);

  // Generate examples function
  const generateExamples = useCallback(() => {
    console.log("Generating examples");

    try {
      // Increment regeneration counter
      regenerateCountRef.current += 1;

      // Generate examples with debugging
      console.log("Calling PythagorasExamplesProvider.generateExamples");
      const generatedExamples = PythagorasExamplesProvider.generateExamples({
        seed: Date.now() + regenerateCountRef.current * 1000
      });

      console.log("Generated examples:", generatedExamples);

      // Set examples if we got any
      if (generatedExamples && generatedExamples.length > 0) {
        setExamples(generatedExamples);
      } else {
        console.warn("No examples were generated");
        setExamples([{
          title: "Default Example",
          question: "This is a default example because no examples were generated.",
          steps: [{ explanation: "No steps were generated" }]
        }]);
      }

      // Reset interactive state
      setInteractiveState({
        showHeight: false,
        showAngles: false
      });
    } catch (error) {
      console.error("Error generating examples:", error);
      setExamples([{
        title: "Error Example",
        question: "There was an error generating examples.",
        steps: [{ explanation: "Error: " + error.message }]
      }]);
    }
  }, []);

  // Initialize examples on first mount
  useEffect(() => {
    if (!initializedRef.current) {
      console.log("Initial examples generation");
      initializedRef.current = true;
      generateExamples();
    }
  }, [generateExamples]);

  // Handle step actions for interactive elements
  const handleStepAction = useCallback((step) => {
    if (!step) return;

    console.log("Step action:", step);

    setInteractiveState(prevState => {
      return PythagorasExamplesProvider.handleStepAction(step, prevState);
    });
  }, []);

  // Render example content with debugging
  const renderExampleContent = useCallback((example) => {
    if (!example) {
      console.warn("No example provided to renderExampleContent");
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <p className="text-red-700">No example data available</p>
        </div>
      );
    }

    console.log("Rendering example:", example);

    // Get configuration with debugging
    console.log("Calling getExampleContentConfig");
    const config = PythagorasExamplesProvider.getExampleContentConfig(example);
    console.log("Example config:", config);

    if (!config) {
      console.warn("No config returned from getExampleContentConfig");
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <p className="text-red-700">No visualization configuration available</p>
        </div>
      );
    }

    // Get unique key for current example
    const vizKey = getVisualizationKey(currentExampleIndex);

    return (
      <div className="flex flex-col-reverse md:flex-row gap-6 items-center pt-4">
        {/* Visualization section */}
        <div className="md:w-2/5 flex justify-start pl-4 pt-8 mb-6 md:mb-0 flex-col">
          {/* Visualization container */}
          <div key={vizKey} className="w-full h-full border border-gray-100 rounded mb-4">
            {/* Add debugging for visualization */}
            {config.visualization ? (
              <DebugOutput
                data={config.visualization}
                title="Visualization Props"
              />
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <p className="text-amber-800">No visualization data available</p>
              </div>
            )}

            {/* Uncomment this when RightTriangle is working */}
            {config.visualization && <RightTriangle {...config.visualization} />}
          </div>
        </div>

        {/* Question side */}
        <div className="md:w-3/5">
          <div className="p-5 bg-orange-50 rounded-lg mb-6">
            <p className="text-gray-700 font-medium">{config.question}</p>
          </div>

          {/* Debug info area */}
          <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Debug Information:</h4>
            <DebugOutput data={example} title="Example Object" />
            <DebugOutput data={interactiveState} title="Interactive State" />
          </div>

          {/* Workspace area */}
          <div className="bg-gray-50 p-6 rounded-lg h-32 border border-dashed border-gray-300">
            <p className="text-gray-500 italic">Workspace area for teacher</p>
          </div>
        </div>
      </div>
    );
  }, [currentExampleIndex, getVisualizationKey, interactiveState]);

  return (
    <div className="space-y-6 mb-8">
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