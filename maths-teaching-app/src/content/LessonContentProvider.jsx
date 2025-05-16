// src/content/LessonContentProvider.jsx

import React from 'react';

// Import only the components we need - Pythagoras Examples section
import { ExamplesSection as PythagorasExamples } from './topics/trigonometry-i/pythagoras';

/**
 * Placeholder component for sections that haven't been migrated yet
 */
const PlaceholderSection = ({ sectionName, message }) => (
  <div className="p-6 bg-white border-2 border-amber-500 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-4 text-amber-700">
      {sectionName} Section
    </h2>
    <p className="mb-4">
      {message || "This section is currently being migrated to the new architecture."}
    </p>
    <p className="font-medium">
      Try the "Examples" section which has been migrated.
    </p>
  </div>
);

/**
 * Component that renders the appropriate lesson section based on topic, lesson ID, and section
 * Simplified during architecture migration
 */
const LessonContentProvider = ({ 
  currentTopic, 
  currentLessonId, 
  currentSection 
}) => {
  // Function to render Trigonometry I lessons
  const renderTrigonometryI = () => {
    // Lesson 1: Pythagoras' Theorem
    if (currentLessonId === 1) {
      switch (currentSection) {
        // Only the Examples section is active during migration
        case 'examples':
          return <PythagorasExamples 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
          
        // Placeholders for other sections
        case 'starter':
          return <PlaceholderSection sectionName="Starter" />;
        case 'diagnostic': 
          return <PlaceholderSection sectionName="Diagnostic" />;
        case 'learn':
          return <PlaceholderSection sectionName="Learn" />;
        case 'challenge':
          return <PlaceholderSection sectionName="Challenge" />;
        default:
          return <PlaceholderSection sectionName="Unknown" message="Please select a valid section." />;
      }
    }
    // Lesson 2 & 3: SOHCAHTOA - Currently placeholder during migration
    else if (currentLessonId === 2 || currentLessonId === 3) {
      return <PlaceholderSection 
        sectionName={`SOHCAHTOA Lesson ${currentLessonId} - ${currentSection}`}
        message="This lesson will be migrated to the new architecture soon."
      />;
    }
    // Lesson 4: 3D Pythagoras & Applications
    else if (currentLessonId === 4) {
      return <PlaceholderSection 
        sectionName={`3D Pythagoras - ${currentSection}`}
        message="This lesson will be migrated to the new architecture soon."
      />;
    }
    // Other lessons not yet implemented
    else {
      return (
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Lesson {currentLessonId} - {currentSection}</h2>
          <p>Content for this lesson is still in development.</p>
        </div>
      );
    }
  };

  // Main renderer based on topic
  switch (currentTopic) {
    case 'Trigonometry I':
      return renderTrigonometryI();
    case 'Algebra I':
      return (
        <PlaceholderSection 
          sectionName="Algebra I"
          message="Algebra lessons will be migrated after Trigonometry I is complete."
        />
      );
    default:
      return (
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{currentTopic} - Lesson {currentLessonId} - {currentSection}</h2>
          <p>Content for this topic is still in development.</p>
        </div>
      );
  }
};

export default LessonContentProvider;