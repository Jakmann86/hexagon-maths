// src/content/topics/algebra-i/linear-equations/ChallengeSection.jsx
// Linear Equations Challenge Section - V4.0 (Thin Wrapper)
// Uses ChallengeSectionBase with topic-specific generator

import React from 'react';
import ChallengeSectionBase from '../../../../components/sections/ChallengeSectionBase';
import { generateThreeStepEquation } from '../../../../generators/algebra/equationGenerators';

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  keyPoints: [
    'Always multiply both sides by the denominator first to clear the fraction',
    'The denominator multiplies the entire right-hand side — not just one term',
    'Only after clearing the fraction: collect x terms, then isolate x'
  ],
  discussionQuestions: [
    'Why do we clear the fraction before doing anything else?',
    'What goes wrong if you subtract before multiplying by the denominator?',
    'How can you check your answer once you have it?'
  ],
  commonMisconceptions: [
    'Multiplying only the numerator and forgetting to multiply the right-hand side',
    'Subtracting the constant before clearing the fraction',
    'Arithmetic errors when multiplying the right-hand side by the denominator'
  ],
  extensionIdeas: [
    'Substitute your answer back into the original equation to verify it',
    'What if there were x terms on both sides as well as a fraction?',
    'Write your own three-step equation that has a clean integer solution'
  ]
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  return (
    <ChallengeSectionBase
      generator={() => generateThreeStepEquation({ sectionType: 'examples', difficulty: 'hard' })}
      teachingNotes={TEACHING_NOTES}
      title="Challenge: Three-Step Fractional Equations"
      subtitle="Clear the fraction, collect terms, then isolate x"
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
    />
  );
};

export default ChallengeSection;
