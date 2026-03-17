// src/content/topics/algebra-i/indices/ChallengeSection.jsx
// Indices Challenge Section - V4.0 (Thin Wrapper)
// Uses ChallengeSectionBase with topic-specific generator

import React from 'react';
import ChallengeSectionBase from '../../../../components/sections/ChallengeSectionBase';
import { indicesGenerators } from '../../../../generators/algebra/indicesGenerator';

// ============================================================
// TEACHING NOTES
// ============================================================

const TEACHING_NOTES = {
  keyPoints: [
    'Three-step strategy: simplify inside → apply negative power (flip) → apply fractional power (root then raise)',
    'Negative power outside a fraction means flip the fraction first',
    'Fractional power p/q means: take the qth root, then raise to the power p'
  ],
  discussionQuestions: [
    'What do you do first — simplify inside the brackets or deal with the outside power?',
    'Why does a negative power flip the fraction?',
    'What is the difference between the numerator and denominator of a fractional index?'
  ],
  commonMisconceptions: [
    'Applying the outer power before simplifying inside the brackets',
    'Forgetting to flip the fraction when the outer power is negative',
    'Confusing which part of the fractional index gives the root vs the power'
  ],
  extensionIdeas: [
    'Substitute a value for x to check your answer numerically',
    'Can you write the answer using a single fractional index instead of a root?',
    'What happens if the outer power is positive — does the method change?'
  ]
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ChallengeSection = ({ currentTopic, currentLessonId }) => {
  return (
    <ChallengeSectionBase
      generator={indicesGenerators.generateComplexFraction}
      teachingNotes={TEACHING_NOTES}
      title="Challenge: Complex Fraction with Indices"
      subtitle="Combine multiple index laws to simplify in one problem"
      currentTopic={currentTopic}
      currentLessonId={currentLessonId}
    />
  );
};

export default ChallengeSection;
