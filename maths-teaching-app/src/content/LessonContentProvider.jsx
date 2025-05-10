import React from 'react';

// Import Trigonometry I components
import * as PythagorasComponents from './topics/trigonometry-i/pythagoras';
import * as SohcahtoaComponents from './topics/trigonometry-i/sohcahtoa1';
// We'll handle sohcahtoa2 with placeholder content for now

// Import Algebra I components
import * as ExpandingBracketsComponents from './topics/algebra-i/expanding-brackets';

/**
 * Component that renders the appropriate lesson section based on topic, lesson ID, and section
 * This centralizes all the lesson rendering logic outside of MainLayout
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
        case 'starter':
          return <PythagorasComponents.StarterSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId} 
          />;
        case 'diagnostic':
          return <PythagorasComponents.DiagnosticSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        case 'learn':
          return <PythagorasComponents.LearnSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        case 'examples':
          return <PythagorasComponents.ExamplesSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        case 'challenge':
          return <PythagorasComponents.ChallengeSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        default:
          return <div>Select a section</div>;
      }
    }
    // Lesson 2: SOHCAHTOA - Find Missing Sides
    else if (currentLessonId === 2) {
      switch (currentSection) {
        case 'starter':
          return <SohcahtoaComponents.StarterSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId} 
          />;
        case 'diagnostic':
          return <SohcahtoaComponents.DiagnosticSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        case 'learn':
          return <SohcahtoaComponents.LearnSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        case 'examples':
          return <SohcahtoaComponents.ExamplesSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        case 'challenge':
          return <SohcahtoaComponents.ChallengeSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        default:
          return <div>Select a section</div>;
      }
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

  // Function to render Algebra I lessons
  const renderAlgebraI = () => {
    // Lesson 1: Expanding Double Brackets
    if (currentLessonId === 1) {
      switch (currentSection) {
        case 'starter':
          return <ExpandingBracketsComponents.StarterSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId} 
          />;
        case 'diagnostic':
          return <ExpandingBracketsComponents.DiagnosticSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        case 'learn':
          return <ExpandingBracketsComponents.LearnSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        case 'examples':
          return <ExpandingBracketsComponents.ExamplesSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        case 'challenge':
          return <ExpandingBracketsComponents.ChallengeSection 
            currentTopic={currentTopic} 
            currentLessonId={currentLessonId}
          />;
        default:
          return <div>Select a section</div>;
      }
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
      return renderAlgebraI();
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