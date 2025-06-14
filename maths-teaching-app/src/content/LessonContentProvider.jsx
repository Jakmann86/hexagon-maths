// src/content/LessonContentProvider.jsx - Fixed SOHCAHTOA2 Examples routing
import React from 'react';
import { StarterSection as PythagorasStarter } from './topics/trigonometry-i/pythagoras';
import { DiagnosticSection as PythagorasDiagnostic } from './topics/trigonometry-i/pythagoras';
import { LearnSection as PythagorasLearn } from './topics/trigonometry-i/pythagoras';
import { ExamplesSection as PythagorasExamples } from './topics/trigonometry-i/pythagoras';
import { ChallengeSection as PythagorasChallenge } from './topics/trigonometry-i/pythagoras';
import { StarterSection as SohcahtoaStarter } from './topics/trigonometry-i/sohcahtoa1';
import { DiagnosticSection as SohcahtoaDiagnostic } from './topics/trigonometry-i/sohcahtoa1';
import { LearnSection as SohcahtoaLearn } from './topics/trigonometry-i/sohcahtoa1';
import { ExamplesSection as SohcahtoaExamples } from './topics/trigonometry-i/sohcahtoa1';
import { StarterSection as Sohcahtoa2Starter } from './topics/trigonometry-i/sohcahtoa2';
import { ExamplesSection as Sohcahtoa2Examples } from './topics/trigonometry-i/sohcahtoa2'; // ← This import exists
import { StarterSection as AlgebraExpandingStarter } from './topics/algebra-i/expanding-brackets';
import { DiagnosticSection as AlgebraExpandingDiagnostic } from './topics/algebra-i/expanding-brackets';
import { LearnSection as AlgebraExpandingLearn } from './topics/algebra-i/expanding-brackets';
import PlaceholderSection from '../components/sections/PlaceholderSection';

/**
 * Component that renders the appropriate lesson section based on topic, lesson ID, and section
 * Now includes properly hooked up SOHCAHTOA2 Examples section
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
        case 'examples':
          return <PythagorasExamples
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'starter':
          return <PythagorasStarter
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'diagnostic':
          return <PythagorasDiagnostic
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'learn':
          return <PythagorasLearn
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'challenge':
          return <PythagorasChallenge
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        default:
          return <PlaceholderSection sectionName="Unknown" message="Please select a valid section." />;
      }
    }
    // Lesson 2: SOHCAHTOA - Finding Missing Sides
    else if (currentLessonId === 2) {
      switch (currentSection) {
        case 'starter':
          return <SohcahtoaStarter
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'examples':
          return <SohcahtoaExamples
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'diagnostic':
          return <SohcahtoaDiagnostic
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'learn':
          return <SohcahtoaLearn
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'challenge':
          return <PlaceholderSection sectionName="Challenge" />;
        default:
          return <PlaceholderSection sectionName="Unknown" message="Please select a valid section." />;
      }
    }
    // Lesson 3: SOHCAHTOA - Finding Angles
    else if (currentLessonId === 3) {
      switch (currentSection) {
        case 'starter':
          return <Sohcahtoa2Starter
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'diagnostic':
          return <PlaceholderSection sectionName="Diagnostic" />;
        case 'learn':
          return <PlaceholderSection sectionName="Learn" />;
        case 'examples':
          return <Sohcahtoa2Examples // ← FIXED: Now uses the actual component instead of placeholder
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'challenge':
          return <PlaceholderSection sectionName="Challenge" />;
        default:
          return <PlaceholderSection sectionName="Unknown" message="Please select a valid section." />;
      }
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

  // Function to render Algebra I lessons
  const renderAlgebraI = () => {
    // Lesson 1: Expanding Double Brackets
    if (currentLessonId === 1) {
      switch (currentSection) {
        case 'starter':
          return <AlgebraExpandingStarter
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'diagnostic':
          return <AlgebraExpandingDiagnostic
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'learn':
          return <AlgebraExpandingLearn
            currentTopic={currentTopic}
            currentLessonId={currentLessonId}
          />;
        case 'examples':
          return <PlaceholderSection
            sectionName="Examples"
            message="Examples section for Expanding Double Brackets coming soon."
          />;
        case 'challenge':
          return <PlaceholderSection
            sectionName="Challenge"
            message="Challenge section for Expanding Double Brackets coming soon."
          />;
        default:
          return <PlaceholderSection sectionName="Unknown" message="Please select a valid section." />;
      }
    }
    // Lesson 2: Solving Equations with Unknown on Both Sides
    else if (currentLessonId === 2) {
      return <PlaceholderSection
        sectionName={`Solving Equations with Unknown on Both Sides - ${currentSection}`}
        message="This lesson is planned for future development."
      />;
    }
    // Lesson 3: Solving Simultaneous Equations
    else if (currentLessonId === 3) {
      return <PlaceholderSection
        sectionName={`Solving Simultaneous Equations - ${currentSection}`}
        message="This lesson is planned for future development."
      />;
    }
    // Lesson 4: Negative and Fractional Indices
    else if (currentLessonId === 4) {
      return <PlaceholderSection
        sectionName={`Negative and Fractional Indices - ${currentSection}`}
        message="This lesson is planned for future development."
      />;
    }
    // Other lessons not yet implemented
    else {
      return (
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Algebra I - Lesson {currentLessonId} - {currentSection}</h2>
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