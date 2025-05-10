// src/data/curriculum.js
export const curriculum = {
    'Trigonometry I': {
        title: 'Trigonometry I: Theory of Right-Angled Triangles',
        lessons: [
            {
                id: 1,
                title: "Find Missing Sides Using Pythagoras' Theorem",
                sections: {
                    starter: 'pythagoras/StarterSection',
                    diagnostic: 'pythagoras/DiagnosticSection',
                    learn: 'pythagoras/LearnSection',
                    examples: 'pythagoras/ExamplesSection',
                    challenge: 'pythagoras/ChallengeSection'
                }
            },
            {
                id: 2,
                title: "Find Missing Sides Using SOHCAHTOA",
                sections: {
                    starter: 'sohcahtoa1/StarterSection',
                    diagnostic: 'sohcahtoa1/DiagnosticSection',
                    learn: 'sohcahtoa1/LearnSection',
                    examples: 'sohcahtoa1/ExamplesSection',
                    challenge: 'sohcahtoa1/ChallengeSection'
                }
            },
            {
                id: 3,
                title: "Find Missing Angles Using Trigonometry",
                sections: {
                    starter: 'sohcahtoa2/StarterSection',
                    diagnostic: 'sohcahtoa2/DiagnosticSection',
                    learn: 'sohcahtoa2/LearnSection',
                    examples: 'sohcahtoa2/ExamplesSection',
                    challenge: 'sohcahtoa2/ChallengeSection'
                }
            },
            {
                id: 4,
                title: "3D Pythagoras & Applications",
                sections: {
                    starter: 'inverse/StarterSection',
                    diagnostic: 'inverse/DiagnosticSection',
                    learn: 'inverse/LearnSection',
                    examples: 'inverse/ExamplesSection',
                    challenge: 'inverse/ChallengeSection'
                }
            }
        ]
    },
    'Algebra I': {
        title: 'Algebra I: Working With Expressions',
        lessons: [
            {
                id: 1,
                title: "Expanding Double Brackets",
                sections: {
                    starter: 'expanding-brackets/StarterSection',
                    diagnostic: 'expanding-brackets/DiagnosticSection',
                    learn: 'expanding-brackets/LearnSection',
                    examples: 'expanding-brackets/ExamplesSection',
                    challenge: 'expanding-brackets/ChallengeSection'
                }
            },
            {
                id: 2,
                title: "Collecting Like Terms",
                sections: {
                    starter: 'collecting-terms/StarterSection',
                    diagnostic: 'collecting-terms/DiagnosticSection',
                    learn: 'collecting-terms/LearnSection',
                    examples: 'collecting-terms/ExamplesSection',
                    challenge: 'collecting-terms/ChallengeSection'
                }
            },
            {
                id: 3,
                title: "Substituting Values",
                sections: {
                    starter: 'substitution/StarterSection',
                    diagnostic: 'substitution/DiagnosticSection',
                    learn: 'substitution/LearnSection',
                    examples: 'substitution/ExamplesSection',
                    challenge: 'substitution/ChallengeSection'
                }
            }
        ]
    }
};