// src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import PythagorasGenerators from '../../../../generators/geometry/pythagorasGenerators';

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

  // Simple inline adapter function to prepare generator output for display
  const adaptForExamples = (generatedQuestion) => {
    return {
      title: generatedQuestion.title,
      question: generatedQuestion.questionText,
      visualization: generatedQuestion.visualization,
      steps: generatedQuestion.solution
    };
  };

  // Generate examples using generators directly
  const generateExamples = useCallback(() => {
    // Increment counter for key generation
    regenerateCountRef.current += 1;
    const seed = Date.now() + regenerateCountRef.current * 1000;
    
    try {
      // Call generators with the same seed for deterministic results
      const hypotenuse = PythagorasGenerators.findHypotenuse({ 
        seed, 
        sectionType: 'examples' 
      });
      
      const missingSide = PythagorasGenerators.findMissingSide({ 
        seed: seed + 1000, // Offset to ensure different questions 
        sectionType: 'examples'
      });
      
      const isoscelesArea = PythagorasGenerators.isoscelesArea({ 
        seed: seed + 2000, 
        sectionType: 'examples'
      });
      
      // Adapt and set examples
      setExamples([
        adaptForExamples(hypotenuse),
        adaptForExamples(missingSide),
        adaptForExamples(isoscelesArea)
      ]);
      
      // Reset interactive state
      setInteractiveState({
        showHeight: false,
        showAngles: false
      });
    } catch (error) {
      console.error("Error generating examples:", error);
      // Fallback to default examples if generators fail
      setExamples([{
        title: "Example Question",
        question: "There was an error generating examples.",
        steps: [{ explanation: "Error: " + error.message }]
      }]);
    }
  }, []);

  // Initialize examples on first mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      generateExamples();
    }
  }, [generateExamples]);

  // Handle step actions for interactive elements
  const handleStepAction = useCallback((step) => {
    if (!step) return;
    
    // Update interactive state based on step actions
    setInteractiveState(prevState => {
      const newState = { ...prevState };
      
      if (step.toggleHeight) {
        newState.showHeight = true;
      }
      
      if (step.toggleAngle) {
        newState.showAngles = true;
      }
      
      if (step.reset) {
        newState.showHeight = false;
        newState.showAngles = false;
      }
      
      return newState;
    });
  }, []);

  // Content configuration for rendering
  const getExampleContentConfig = useCallback((example) => {
    if (!example) return null;
    
    return {
      question: example.question,
      visualization: example.visualization
    };
  }, []);

  // Render example content
  const renderExampleContent = useCallback((example) => {
    if (!example) return null;
    
    const config = getExampleContentConfig(example);
    
    // Generate a key that changes whenever regeneration happens
    const visualizationKey = `triangle-${regenerateCountRef.current}-${currentExampleIndex}`;
    
    return (
      <div className="flex flex-col-reverse md:flex-row gap-6 items-center pt-4">
        {/* Visualization section */}
        <div className="md:w-2/5 flex justify-start pl-4 pt-8 mb-6 md:mb-0">
          <div key={visualizationKey} className="w-full">
            {config.visualization && <RightTriangle {...config.visualization} />}
          </div>
        </div>
        
        {/* Question section with working area */}
        <div className="md:w-3/5">
          <div className="p-5 bg-orange-50 rounded-lg mb-6">
            <p className="text-gray-700 font-medium">{config.question}</p>
          </div>

          {/* Working area for teacher */}
          <div className="bg-gray-50 p-6 rounded-lg min-h-40 h-48 border border-dashed border-gray-300">
            {/* Empty space for teacher's working */}
          </div>
        </div>
      </div>
    );
  }, [regenerateCountRef, currentExampleIndex, getExampleContentConfig]);

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