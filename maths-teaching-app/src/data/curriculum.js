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
                title: "Find Missing Angles Using Trigonometry"
            },
            {
                id: 4,
                title: "Applications & Problem Solving"
            }
        ]
    }
};