// src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  
  // Use a ref to track initialization status - prevents double initialization
  const initializedRef = useRef(false);
  
  // Add a ref for the regeneration counter to avoid state update issues
  const regenerateCountRef = useRef(0);
  
  // Use stable keys for visualizations - make it tab-specific
  const getVisualizationKey = useCallback((exampleIndex) => {
    return `viz-${regenerateCountRef.current}-tab-${exampleIndex}`;
  }, []);
  
  // Memoize the generateExamples function to avoid recreating it
  const generateExamples = useCallback(() => {
    console.log("Generating new examples");
    try {
      // Increment regeneration counter
      regenerateCountRef.current += 1;
      
      // Get the current tab before updating
      const currentTab = currentExampleIndex;
      
      // Generate new examples with current timestamp as seed
      const seed = Date.now();
      console.log(`Using seed: ${seed}`);
      
      // Generate separate examples for each tab to ensure they're all different
      const exampleTypes = ['findHypotenuse', 'findMissingSide', 'isoscelesArea'];
      
      // Generate example set with consistent ordering but different seeds
      const newExamples = exampleTypes.map((type, index) => {
        // Use different seeds for each example type
        const typeSeed = seed + (index * 1000);
        
        // Get the generator for this type
        const generator = PythagorasExamplesProvider.generateSpecificExample(
          type, 
          { seed: typeSeed }
        );
        
        return generator;
      });
      
      console.log(`Generated ${newExamples.length} examples`);
      
      // Update examples state
      setExamples(newExamples);
      
      // Important: Don't reset the tab selection
      // This ensures we stay on the current tab when clicking "New Question"
      
      // Reset interactive state
      setInteractiveState({
        showHeight: false,
        showAngles: false
      });
    } catch (error) {
      console.error("Error generating examples:", error);
      setExamples([{
        title: "Example Question",
        question: "This is a placeholder example. There was an error generating questions.",
        steps: [{ explanation: "Error: " + error.message }]
      }]);
    }
  }, [currentExampleIndex]);

  // Generate examples only on first mount
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
    
    // Let the provider handle the step action logic
    setInteractiveState(prevState => {
      const newState = PythagorasExamplesProvider.handleStepAction(step, prevState);
      return newState;
    });
  }, []);

  // Render example content
  const renderExampleContent = useCallback((example) => {
    if (!example) return null;

    // Get configuration from provider
    const config = PythagorasExamplesProvider.getExampleContentConfig(example);
    if (!config) return null;
    
    // Get unique key for current example
    const vizKey = getVisualizationKey(currentExampleIndex);

    return (
      <div className="flex flex-col-reverse md:flex-row gap-6 items-center pt-4">
        {/* Visualization on the left for medium+ screens */}
        <div className="md:w-2/5 flex justify-start pl-4 pt-8 mb-6 md:mb-0">
          {/* Add key to force remounting */}
          <div key={vizKey} className="w-full h-full border border-gray-100 rounded">
            {config.visualization}
          </div>
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
  }, [currentExampleIndex, getVisualizationKey]);

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