// src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import RightTriangle from '../../../../components/math/shapes/triangles/RightTriangle';
import IsoscelesTriangle from '../../../../components/math/shapes/triangles/IsoscelesTriangle';
import { pythagorasGenerators } from '../../../../generators/geometry/pythagorasGenerators';

/**
 * ExamplesSection for Pythagoras' Theorem lesson
 * Implements Pattern 2 architecture with unified generators:
 * - Generators create configuration objects
 * - Section converts configurations to React components
 */
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

  // Generate examples using Pattern 2 architecture with unified generators
  const generateExamples = useCallback(() => {
    // Increment counter for key generation
    regenerateCountRef.current += 1;
    const seed = Date.now() + regenerateCountRef.current * 1000;
    
    try {
      // Generate the three example configurations using unified generators
      const hypotenuseExample = pythagorasGenerators.generateFindHypotenuse({ 
        seed, 
        sectionType: 'examples',
        difficulty: 'medium',
        units: 'cm'
      });
      
      const missingSideExample = pythagorasGenerators.generateFindMissingSide({ 
        seed: seed + 1000, // Offset to ensure different questions 
        sectionType: 'examples',
        difficulty: 'medium',
        units: 'cm'
      });
      
      // *** FIXED: Use proper isosceles generator instead of hard-coded placeholder ***
      const isoscelesExample = pythagorasGenerators.generateIsoscelesArea({
        seed: seed + 2000, // Offset to ensure different questions
        sectionType: 'examples',
        difficulty: 'medium',
        units: 'cm'
      });
      
      // *** FORCE DEFAULT ORIENTATION for consistent display in examples ***
      if (isoscelesExample.visualization) {
        isoscelesExample.visualization.orientation = 'default';
      }
      
      // Create examples array with configuration objects (not components yet)
      const exampleItems = [
        {
          title: hypotenuseExample.title,
          question: hypotenuseExample.questionText,
          steps: hypotenuseExample.solution,
          // Store visualization config (Pattern 2)
          visualizationConfig: hypotenuseExample.visualization
        },
        {
          title: missingSideExample.title,
          question: missingSideExample.questionText,
          steps: missingSideExample.solution,
          visualizationConfig: missingSideExample.visualization
        },
        {
          // *** FIXED: Use generated example instead of hard-coded ***
          title: isoscelesExample.title,
          question: isoscelesExample.questionText,
          steps: isoscelesExample.solution,
          visualizationConfig: isoscelesExample.visualization
        }
      ];
      
      // Set the examples in state
      setExamples(exampleItems);
      
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

  // KEY PATTERN 2 FUNCTION: Convert configuration to component here
  const renderExampleContent = useCallback((example) => {
    if (!example) return null;
    
    // Generate a unique key for the visualization
    const visualizationKey = `triangle-${regenerateCountRef.current}-${currentExampleIndex}`;
    
    // Create the visualization component from configuration
    const renderVisualization = () => {
      if (!example.visualizationConfig) return null;
      
      // If it's already a React element, just return it
      if (React.isValidElement(example.visualizationConfig)) {
        return example.visualizationConfig;
      }
      
      // Check if this is an isosceles triangle configuration
      if (example.visualizationConfig.showEqualSides) {
        // Render IsoscelesTriangle with the configuration
        return (
          <IsoscelesTriangle 
            {...example.visualizationConfig} 
            key={visualizationKey}
            showHeight={interactiveState.showHeight} // Apply interactive state
            containerHeight={280} // Standard size for examples
          />
        );
      } 
      
      // Otherwise it's a right triangle
      return (
        <RightTriangle 
          {...example.visualizationConfig} 
          key={visualizationKey}
          showAngles={interactiveState.showAngles ? [true, false] : [false, false]} // Apply interactive state
          containerHeight={280} // Standard size for examples
        />
      );
    };
    
    return (
      <div className="flex flex-col-reverse md:flex-row gap-6 items-center pt-4">
        {/* Visualization section */}
        <div className="md:w-2/5 flex justify-start pl-4 pt-8 mb-6 md:mb-0">
          <div className="w-full">
            {renderVisualization()}
          </div>
        </div>
        
        {/* Question section with working area */}
        <div className="md:w-3/5">
          <div className="p-5 bg-orange-50 rounded-lg mb-6">
            <p className="text-gray-700 font-medium">{example.question}</p>
          </div>

          {/* Working area for teacher */}
          <div className="bg-gray-50 p-6 rounded-lg min-h-40 h-48 border border-dashed border-gray-300">
            {/* Empty space for teacher's working */}
          </div>
        </div>
      </div>
    );
  }, [currentExampleIndex, regenerateCountRef, interactiveState]);

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