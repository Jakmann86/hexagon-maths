// src/data/curriculum.js - Updated with new Solving Equations lesson
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
                title: "Solving Equations with Unknown on Both Sides",
                sections: {
                    starter: 'linear-equations/StarterSection',
                    diagnostic: 'linear-equations/DiagnosticSection',
                    learn: 'linear-equations',
                    examples: 'linear-equations',
                    challenge: 'linear-equations'
                }
            },
            {
                id: 3,
                title: "Solving Simultaneous Equations",
                sections: {
                    starter: 'simultaneous-equations/StarterSection',
                    diagnostic: 'simultaneous-equations/DiagnosticSection',
                    learn: 'simultaneous-equations/LearnSection',
                    examples: 'simultaneous-equations/ExamplesSection',
                    challenge: 'simultaneous-equations/ChallengeSection'
                }
            },
            {
                id: 4,
                title: "Negative and Fractional Indices",
                sections: {
                    starter: 'indices/StarterSection',
                    diagnostic: 'indices/DiagnosticSection',
                    learn: 'indices/LearnSection',
                    examples: 'indices/ExamplesSection',
                    challenge: 'indices/ChallengeSection'
                }
            }
        ]
    }
};