// maths-teaching-app/src/content/topics/trigonometry-i/pythagoras/StarterSection.jsx
import React, { useState, useEffect } from 'react';
import StarterSectionBase from '../../../../components/sections/StarterSectionBase';
import { pythagoras } from './generators';

/**
 * StarterSection component for Pythagoras lesson
 * With state lifted up like in ExamplesSection
 */
const StarterSection = ({ currentTopic, currentLessonId }) => {
  // Initialize questions with actual values right away
  const [questions, setQuestions] = useState(() => {
    // Generate initial questions immediately
    return pythagoras.generateStarterQuestions();
  });
  
  // Create stable generator functions that return our stored questions
  const questionGenerators = [
    () => questions.lastLesson,
    () => questions.lastTopic,
    () => questions.lastWeek,
    () => questions.lastYear
  ];
  
  // Handler for regenerating questions
  const handleRegenerateQuestions = () => {
    console.log('Regenerating questions...');
    // Generate new questions and update state
    const newQuestions = pythagoras.generateStarterQuestions();
    setQuestions(newQuestions);
  };

  return (
    <StarterSectionBase
      questionGenerators={questionGenerators}
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
      className="mb-8"
      onRegenerateAllQuestions={handleRegenerateQuestions}
    />
  );
};

export default StarterSection;