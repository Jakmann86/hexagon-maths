// src/content/topics/index.js
export const topicSections = {
    'Trigonometry I': {
        1: {
            starter: () => import('./trigonometry-i/pythagoras/StarterSection'),
            learn: () => import('./trigonometry-i/pythagoras/LearnSection'),
            // Add other section types as needed
        },
        2: {
            starter: () => import('./trigonometry-i/trigonometry/StarterSection'),
            learn: () => import('./trigonometry-i/trigonometry/LearnSection'),
        },
        // Add more lessons
    },
    'Algebra I': {
        // Similar structure for Algebra topics
    }
};

export const getSectionComponent = (topic, lessonId, sectionType) => {
    return topicSections[topic]?.[lessonId]?.[sectionType];
};