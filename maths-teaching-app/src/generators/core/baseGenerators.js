// src/generators/core/baseGenerators.js
import _ from 'lodash';

// Base question generator class
export class BaseGenerator {
    constructor(config = {}) {
        this.config = {
            difficulty: 'medium',
            units: 'cm',
            ...config
        };
    }

    // Get difficulty multiplier for number ranges
    getDifficultyMultiplier() {
        const multipliers = {
            easy: 1,
            medium: 1.5,
            hard: 2
        };
        return multipliers[this.config.difficulty] || 1;
    }

    // Generate random number within difficulty-adjusted range
    getRandomNumber(min, max) {
        const multiplier = this.getDifficultyMultiplier();
        return _.random(min, Math.floor(max * multiplier));
    }

    // Base generate method - should be overridden
    generate() {
        throw new Error('Generate method must be implemented');
    }
}

// Diagnostic question generator base class
export class DiagnosticGenerator extends BaseGenerator {
    constructor(config = {}) {
        super(config);
        this.config.format = config.format || 'multiple-choice';
        this.config.numOptions = config.numOptions || 4;
    }

    // Generate incorrect but plausible answers
    generateDistractors(correctAnswer, count = 3) {
        const distractors = new Set();
        const variance = correctAnswer * 0.2; // 20% variance

        while (distractors.size < count) {
            let distractor;
            const method = _.random(1, 3);

            switch (method) {
                case 1: // Add/subtract small random amount
                    distractor = correctAnswer + _.random(-variance, variance);
                    break;
                case 2: // Multiply/divide by small factor
                    distractor = correctAnswer * _.random(0.8, 1.2);
                    break;
                case 3: // Common misconception (e.g., using diameter instead of radius)
                    distractor = correctAnswer * (_.random(0, 1) ? 0.5 : 2);
                    break;
            }

            // Round to reasonable precision
            distractor = Number(distractor.toFixed(1));
            
            // Ensure distractor is positive and different from correct answer
            if (distractor > 0 && distractor !== correctAnswer) {
                distractors.add(distractor);
            }
        }

        return Array.from(distractors);
    }

    generate() {
        const question = this.generateQuestion();
        const distractors = this.generateDistractors(question.correctAnswer);

        return {
            ...question,
            distractors,
            type: 'diagnostic',
            format: this.config.format
        };
    }
}

// Example question generator base class
export class ExampleGenerator extends BaseGenerator {
    constructor(config = {}) {
        super(config);
        this.config.showSteps = config.showSteps ?? true;
    }

    // Generate step-by-step solution
    generateSteps(question, answer) {
        return [
            {
                explanation: 'Start with the given information',
                math: question
            },
            {
                explanation: 'Final answer',
                math: answer
            }
        ];
    }

    generate() {
        const question = this.generateQuestion();
        const steps = this.config.showSteps ? 
            this.generateSteps(question.questionText, question.answer) : 
            [];

        return {
            ...question,
            type: 'example',
            workingOut: steps
        };
    }
}

// Challenge question generator base class
export class ChallengeGenerator extends BaseGenerator {
    constructor(config = {}) {
        super(config);
        this.config.realWorld = config.realWorld ?? true;
        this.config.multiStep = config.multiStep ?? true;
    }

    // Generate hints if needed
    generateHints() {
        return [];
    }

    generate() {
        const question = this.generateQuestion();
        const hints = this.generateHints();

        return {
            ...question,
            type: 'challenge',
            hints,
            isRealWorld: this.config.realWorld,
            isMultiStep: this.config.multiStep
        };
    }
}

// Starter question generator base class
export class StarterGenerator extends BaseGenerator {
    constructor(config = {}) {
        super(config);
        this.config.category = config.category || 'review'; // review, puzzle, realWorld
    }

    generate() {
        const question = this.generateQuestion();

        return {
            ...question,
            type: 'starter',
            category: this.config.category
        };
    }
}