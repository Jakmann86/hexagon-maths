// src/data/curriculum.js - Updated with worksheetKey for worksheet generation
export const curriculum = {
    'Trigonometry I': {
        title: 'Trigonometry I: Theory of Right-Angled Triangles',
        lessons: [
            {
                id: 1,
                title: "Find Missing Sides Using Pythagoras' Theorem",
                worksheetKey: 'pythagoras',
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
                worksheetKey: 'sohcahtoa',
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
                worksheetKey: 'sohcahtoa-angles',
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
                worksheetKey: '3d-pythagoras',
                sections: {
                    starter: '3d-trig/StarterSection',
                    diagnostic: '3d-trig/DiagnosticSection',
                    learn: '3d-trig/LearnSection',
                    examples: '3d-trig/ExamplesSection',
                    challenge: '3d-trig/ChallengeSection'
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
                worksheetKey: 'expanding-brackets',
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
                worksheetKey: 'linear-equations',
                sections: {
                    starter: 'linear-equations/StarterSection',
                    diagnostic: 'linear-equations/DiagnosticSection',
                    learn: 'linear-equations/LearnSection',
                    examples: 'linear-equations/ExamplesSection',
                    challenge: 'linear-equations/ChallengeSection'
                }
            },
            {
                id: 3,
                title: "Solving Simultaneous Equations",
                worksheetKey: 'simultaneous-equations',
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
                worksheetKey: 'indices',
                sections: {
                    starter: 'indices/StarterSection',
                    diagnostic: 'indices/DiagnosticSection',
                    learn: 'indices/LearnSection',
                    examples: 'indices/ExamplesSection',
                    challenge: 'indices/ChallengeSection'
                }
            }
        ]
    },
    'Algebra II': {
        title: 'Algebra II: Quadratics and Formulae',
        lessons: [
            {
                id: 1,
                title: "Converting Recurring Decimals to Fractions",
                worksheetKey: 'recurring-decimals',
                sections: {
                    starter: 'recurring-decimals/StarterSection',
                    diagnostic: 'recurring-decimals/DiagnosticSection',
                    learn: 'recurring-decimals/LearnSection',
                    examples: 'recurring-decimals/ExamplesSection',
                    challenge: 'recurring-decimals/ChallengeSection'
                }
            },
            {
                id: 2,
                title: "Factorising Quadratics",
                worksheetKey: 'factorising-quadratics',
                sections: {
                    starter: 'factorising-quadratics/StarterSection',
                    diagnostic: 'factorising-quadratics/DiagnosticSection',
                    learn: 'factorising-quadratics/LearnSection',
                    examples: 'factorising-quadratics/ExamplesSection',
                    challenge: 'factorising-quadratics/ChallengeSection'
                }
            },
            {
                id: 3,
                title: "Solving Quadratic Simultaneous Equations",
                worksheetKey: 'quadratic-simultaneous',
                sections: {
                    starter: 'quadratic-simultaneous/StarterSection',
                    diagnostic: 'quadratic-simultaneous/DiagnosticSection',
                    learn: 'quadratic-simultaneous/LearnSection',
                    examples: 'quadratic-simultaneous/ExamplesSection',
                    challenge: 'quadratic-simultaneous/ChallengeSection'
                }
            },
            {
                id: 4,
                title: "Re-arranging Formulae",
                worksheetKey: 'rearranging-formulae',
                sections: {
                    starter: 'rearranging-formula/StarterSection',
                    diagnostic: 'rearranging-formula/DiagnosticSection',
                    learn: 'rearranging-formula/LearnSection',
                    examples: 'rearranging-formula/ExamplesSection',
                    challenge: 'rearranging-formula/ChallengeSection'
                }
            }
        ]
    },
    'Geometry I': {
        title: 'Geometry I: Introduction to Geometrical Concepts',
        lessons: [
            {
                id: 1,
                title: "Triangles and Basic Angle Facts",
                worksheetKey: 'basic-angles',
                sections: {
                    starter: 'basic-angles/StarterSection',
                    diagnostic: 'basic-angles/DiagnosticSection',
                    learn: 'basic-angles/LearnSection',
                    examples: 'basic-angles/ExamplesSection',
                    challenge: 'basic-angles/ChallengeSection'
                }
            },
            {
                id: 2,
                title: "Angles in Parallel Lines",
                worksheetKey: 'parallel-lines',
                sections: {
                    starter: 'parallel-lines/StarterSection',
                    diagnostic: 'parallel-lines/DiagnosticSection',
                    learn: 'parallel-lines/LearnSection',
                    examples: 'parallel-lines/ExamplesSection',
                    challenge: 'parallel-lines/ChallengeSection'
                }
            },
            {
                id: 3,
                title: "Interior Angles of a Polygon",
                worksheetKey: 'interior-angles',
                sections: {
                    starter: 'interior-angles/StarterSection',
                    diagnostic: 'interior-angles/DiagnosticSection',
                    learn: 'interior-angles/LearnSection',
                    examples: 'interior-angles/ExamplesSection',
                    challenge: 'interior-angles/ChallengeSection'
                }
            },
            {
                id: 4,
                title: "Exterior Angles of a Polygon",
                worksheetKey: 'exterior-angles',
                sections: {
                    starter: 'exterior-angles/StarterSection',
                    diagnostic: 'exterior-angles/DiagnosticSection',
                    learn: 'exterior-angles/LearnSection',
                    examples: 'exterior-angles/ExamplesSection',
                    challenge: 'exterior-angles/ChallengeSection'
                }
            }
        ]
    },
    'Statistics I': {
        title: 'Statistics I: Averages and Grouped Data',
        lessons: [
            {
                id: 1,
                title: "Solving Problems with Mean Average",
                worksheetKey: 'mean-average',
                sections: {
                    starter: 'averages/StarterSection',
                    diagnostic: 'averages/DiagnosticSection',
                    learn: 'averages/LearnSection',
                    examples: 'averages/ExamplesSection',
                    challenge: 'averages/ChallengeSection'
                }
            },
            {
                id: 2,
                title: "Finding Medians and Modes",
                worksheetKey: 'median-mode',
                sections: {
                    starter: 'median-mode/StarterSection',
                    diagnostic: 'median-mode/DiagnosticSection',
                    learn: 'median-mode/LearnSection',
                    examples: 'median-mode/ExamplesSection',
                    challenge: 'median-mode/ChallengeSection'
                }
            },
            {
                id: 3,
                title: "Working with Grouped Data",
                worksheetKey: 'grouped-data',
                sections: {
                    starter: 'grouped-data/StarterSection',
                    diagnostic: 'grouped-data/DiagnosticSection',
                    learn: 'grouped-data/LearnSection',
                    examples: 'grouped-data/ExamplesSection',
                    challenge: 'grouped-data/ChallengeSection'
                }
            },
            {
                id: 4,
                title: "Estimated Mean from Frequency Tables",
                worksheetKey: 'frequency-tables',
                sections: {
                    starter: 'frequency-tables/StarterSection',
                    diagnostic: 'frequency-tables/DiagnosticSection',
                    learn: 'frequency-tables/LearnSection',
                    examples: 'frequency-tables/ExamplesSection',
                    challenge: 'frequency-tables/ChallengeSection'
                }
            }
        ]
    }
};